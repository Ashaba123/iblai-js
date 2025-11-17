"use client";

import { useState } from "react";
import { SUBSCRIPTION_TRIGGERS } from "./constants";
import { StripeSubscriptionRenewalResponse } from "@iblai/iblai-api";
import {
  useCreateStripeCustomerPortalMutation,
  useLazyGetUserAppsQuery,
  useRenewSubscriptionMutation,
  useLazyGetFreeUsageCountQuery,
} from "@iblai/data-layer";
import dayjs from "dayjs";
import { useDayJs } from "../use-day-js";
import { SubscriptionFlow } from "./class-subscription-flow";

/**
 * Hook to handle subscription logic
 * @param subscriptionFlow Instance of SubscriptionFlow that manages different subscription states and actions
 */
export const useSubscriptionHandler = (subscriptionFlow: SubscriptionFlow) => {
  // API mutations and queries
  const [renewSubscription] = useRenewSubscriptionMutation();
  const [getUserApps] = useLazyGetUserAppsQuery();

  // Trial period state management
  const [createStripeCustomerPortal] = useCreateStripeCustomerPortalMutation();
  const [freeTrialIntervalCheckCounter, setFreeTrialIntervalCheckCounter] =
    useState(24 * 60 * 60000); // Default check every 24 hours
  const [trialCounterStarted, setTrialCounterStarted] = useState(false);
  const [freeTrialIntervalID, setFreeTrialIntervalID] = useState<number | 0>(0);

  // Utility queries and hooks
  const [getFreeUsageCount] = useLazyGetFreeUsageCountQuery();
  const { getTimeDifferenceBetweenTwoDates, getDayJSDurationObjFromSeconds } =
    useDayJs();

  const userOnFreeTrial = () => {
    return (
      subscriptionFlow.getCurrentTenantKey() ===
        subscriptionFlow.getMainTenantKey() && //USER IS ON MAIN TENANT
      !subscriptionFlow.isUserAdmin() && //USER IS NOT ADMIN
      subscriptionFlow.getUserTenants().length === 1
    ); //USER IS ON ONLY ONE TENANT
  };

  /**
   * Handles the free trial flow
   * Checks remaining usage count and updates UI accordingly
   */
  const handleFreeTrialFlow = async () => {
    const { data: freeUsageCount } = await getFreeUsageCount({
      org: subscriptionFlow.getCurrentTenantOrg() || "",
      // @ts-ignore
      userId: subscriptionFlow.getUsername(),
    });
    if (!freeUsageCount) return;
    subscriptionFlow.handleFreeUsageCountFlow(freeUsageCount);
  };

  /**
   * Handles subscription flow for active application
   * Redirects to Stripe customer portal if needed
   */
  const handleActiveAppSubscriptionFlow = async () => {
    const { data: customerPortal } = await createStripeCustomerPortal({
      org: subscriptionFlow.getCurrentTenantOrg() || "",
      // @ts-ignore
      userId: subscriptionFlow.getUsername(),
      requestBody: {
        return_url: window.location.href,
      },
    });
    if (customerPortal?.url) {
      const currentApp = await getUserActiveApp();
      if (currentApp?.subscription?.status !== "active") {
        setTrialCounterStarted(true);
        handleFreeTrialSubscriptionExpiryFlow();
      }
    }
  };

  /**
   * Triggers trial period end
   * Shows error message and updates UI
   */
  const handleTriggerFreeTrialExpiry = () => {
    subscriptionFlow.handleTrialEndedFlow(freeTrialIntervalID as number);
  };

  /**
   * Handles trial subscription expiry flow
   * Calculates remaining time and updates UI accordingly
   */
  const handleFreeTrialSubscriptionExpiryFlow = async () => {
    const currentDate = new Date();
    const app = await getUserActiveApp();
    if (
      !app?.subscription?.status ||
      ["paused", "canceled"].includes(app?.subscription?.status) ||
      currentDate > new Date(app?.subscription?.trial_ends)
    ) {
      handleTriggerFreeTrialExpiry();
    } else {
      // Calculate remaining trial time
      const timeRemaining = getTimeDifferenceBetweenTwoDates(
        app?.subscription?.trial_ends,
        dayjs().toISOString(),
      );
      const durationObj = getDayJSDurationObjFromSeconds(timeRemaining);
      let timeRemainingInString = "";
      let durationNumber;
      if (timeRemaining >= 3600 * 24) {
        durationNumber = Math.round(durationObj.asDays());
        timeRemainingInString = `${durationNumber} day${
          durationNumber > 1 ? "s" : ""
        }`;
      } else if (timeRemaining > 3600) {
        clearInterval(freeTrialIntervalID);
        setFreeTrialIntervalCheckCounter(10 * 60000); // Check every 10 minutes
        durationNumber = Math.round(durationObj.asHours());
        timeRemainingInString = `${durationNumber} hour${
          durationNumber > 1 ? "s" : ""
        }`;
      } else {
        clearInterval(freeTrialIntervalID);
        setFreeTrialIntervalCheckCounter(60000); // Check every minute
        durationNumber = Math.round(durationObj.asMinutes());
        timeRemainingInString = `${durationNumber} minute${
          durationNumber > 1 ? "s" : ""
        }`;
      }
      subscriptionFlow.handleSubscriptionOnGoingFlow(timeRemainingInString);
    }
  };

  /**
   * Checks subscription status and triggers appropriate flow
   */
  const handleSubscriptionCheck = async () => {
    if (userOnFreeTrial()) {
      handleFreeTrialFlow();
    } else if (await getUserActiveApp()) {
      handleActiveAppSubscriptionFlow();
    }
  };

  /**
   * Retrieves user's active application
   * @returns Active application or undefined if none found
   */
  const getUserActiveApp = async () => {
    const { data: userApps } = await getUserApps({
      page: 1,
      pageSize: 50,
    });
    return userApps?.results?.find(
      (item: any) =>
        item?.app?.name
          ?.toLowerCase()
          ?.includes(subscriptionFlow.getPlatformName()) &&
        item?.platform?.key === subscriptionFlow.getCurrentTenantKey(),
    );
  };

  /**
   * Handles user subscription trigger
   * Manages subscription renewal and redirects
   */
  const handleSubscribeUserTrigger = async () => {
    subscriptionFlow.handleBeforeSubscribeUserTriggerFlow();
    const app = await getUserActiveApp();
    const { data } = await renewSubscription({
      org: subscriptionFlow.getCurrentTenantOrg() || "",
      // @ts-ignore
      userId: subscriptionFlow.getUsername(),
      requestBody: {
        checkout_session_uuid: app?.subscription?.identifier,
        return_url: window.location.href,
      },
    });
    const updatedData = data as StripeSubscriptionRenewalResponse & {
      success: boolean;
      redirect_url: string;
      message: string;
    };
    if (updatedData?.success && !updatedData?.redirect_url) {
      // Successfully renewed subscription
      subscriptionFlow.handleSuccessfullySubscribedFlow(updatedData?.message);
      return;
    }
    if (updatedData?.redirect_url) {
      // Redirect to Stripe
      subscriptionFlow.handleRedirectToURLFlow(
        updatedData?.redirect_url,
        "You are being redirected to the billing page.",
      );
      return;
    }
    const { data: customerPortal } = await createStripeCustomerPortal({
      org: subscriptionFlow.getCurrentTenantOrg() || "",
      // @ts-ignore
      userId: subscriptionFlow.getUsername(),
      requestBody: {
        return_url: window.location.href,
      },
    });
    if (customerPortal?.url) {
      subscriptionFlow.handleRedirectToURLFlow(
        customerPortal?.url,
        "You are being redirected to the billing page.",
      );
    }
  };

  /**
   * Handles banner button triggers
   * @param trigger Trigger type
   * @returns Appropriate handler function
   */
  const bannerButtonTriggerCallback = (trigger: string) => {
    switch (trigger) {
      case SUBSCRIPTION_TRIGGERS.PRICING_MODAL:
        return handlePricingPageDisplayFlow;
      case SUBSCRIPTION_TRIGGERS.SUBSCRIBE_USER:
        return handleSubscribeUserTrigger;
      default:
        return () => {}; // Retourne une fonction vide par défaut
    }
  };

  const handlePricingPageDisplayFlow = () => {
    subscriptionFlow.handlePricingPageDisplayFlow();
  };

  /**
   * Sets up periodic subscription check
   * @returns Cleanup function for interval
   */
  const handleIntervalSubscriptionCheck = () => {
    if (trialCounterStarted) {
      const intervalID = setInterval(
        handleFreeTrialSubscriptionExpiryFlow,
        freeTrialIntervalCheckCounter,
      );
      setFreeTrialIntervalID(intervalID as unknown as number);
      return () => clearInterval(intervalID);
    }
  };

  return {
    handleSubscriptionCheck,
    handleIntervalSubscriptionCheck,
    trialCounterStarted,
    bannerButtonTriggerCallback,
  };
};
