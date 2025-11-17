import { SUBSCRIPTION_PACKAGES, SUBSCRIPTION_V2_TRIGGERS } from "./constants";
import {
  useCreateStripeCustomerPortalMutation,
  useLazyGetUserAppsQuery,
  useUpdateUserTrialStatusMutation,
} from "@iblai/data-layer";
import { SubscriptionFlowV2 } from "./class-subscription-flow";
import {
  useLazyGetStripeContextQuery,
  useLazyGetStripePricingPageSessionQuery,
} from "@iblai/data-layer";
import { CreateStripeCustomerPortalRequest } from "@web-utils/types/subscription";

/**
 * Hook to handle subscription logic
 * @param subscriptionFlow Instance of SubscriptionFlow that manages different subscription states and actions
 */
export const useSubscriptionHandlerV2 = (
  subscriptionFlow: SubscriptionFlowV2,
) => {
  // API mutations and queries
  const [getUserApps] = useLazyGetUserAppsQuery();
  const [getStripePricingPageSession] =
    useLazyGetStripePricingPageSessionQuery();
  const [getStripeContext, { isError: isStripeContextError }] =
    useLazyGetStripeContextQuery();
  const [updateUserTrialStatus, { isError: isTrialStatusError }] =
    useUpdateUserTrialStatusMutation();
  const [createStripeCustomerPortal, { isError: isStripeCustomerPortalError }] =
    useCreateStripeCustomerPortalMutation();
  const CREDIT_INTERVAL_CHECK_COUNTER = 60 * 60 * 1000; // 1 hour

  /**
   * Checks if user is currently on the main tenant
   * @returns {boolean} True if current tenant key matches main tenant key
   */
  const isUserOnMainTenantAndNotAdmin = () => {
    return (
      subscriptionFlow.getCurrentTenantKey() ===
        subscriptionFlow.getMainTenantKey() && !subscriptionFlow.isUserAdmin()
    ); // && subscriptionFlow.getUserTenants().length === 1;
  };

  /**
   * Checks if user is currently on an advertising tenant
   * @param currentTenant user current tenant object
   * @returns {boolean} True if current tenant is an advertising tenant
   */
  const isUserOnAdvertisingTenantAndNotAdmin = () => {
    const currentTenant = subscriptionFlow
      .getUserTenants()
      .find((tenant) => tenant.key === subscriptionFlow.getCurrentTenantKey());
    return (
      currentTenant &&
      currentTenant.is_advertising &&
      !subscriptionFlow.isUserAdmin()
    );
  };

  const isUserOnMainTenantAndAdmin = () => {
    return (
      subscriptionFlow.getCurrentTenantKey() ===
        subscriptionFlow.getMainTenantKey() && subscriptionFlow.isUserAdmin()
    );
  };

  const getUserSubscriptionPackage = async () => {
    const activeApp = await getUserActiveApp("", true);
    if (activeApp && Object.keys(activeApp).length > 0) {
      if (
        activeApp?.subscription?.product_sku?.includes(
          SUBSCRIPTION_PACKAGES.FREE_PACKAGE(
            subscriptionFlow.getPlatformName(),
          ),
        )
      ) {
        return SUBSCRIPTION_PACKAGES.FREE_PACKAGE(
          subscriptionFlow.getPlatformName(),
        );
      } else if (
        activeApp?.subscription?.product_sku?.includes(
          SUBSCRIPTION_PACKAGES.STARTER_PACKAGE(
            subscriptionFlow.getPlatformName(),
          ),
        )
      ) {
        return SUBSCRIPTION_PACKAGES.STARTER_PACKAGE(
          subscriptionFlow.getPlatformName(),
        );
      } else if (
        activeApp?.subscription?.product_sku?.includes(
          SUBSCRIPTION_PACKAGES.PRO_PACKAGE(subscriptionFlow.getPlatformName()),
        )
      ) {
        return SUBSCRIPTION_PACKAGES.PRO_PACKAGE(
          subscriptionFlow.getPlatformName(),
        );
      }
    }
    return null;
  };

  /**
   * Handles user on free package flow
   * Checks if user has credits and triggers appropriate flow if credits are exhausted
   */
  const handleUserOnFreePackageFlow = async () => {
    const app = await getUserActiveApp();
    const hasCredits = app?.subscription?.entitlements?.has_credits;
    if (!hasCredits) {
      subscriptionFlow.handleCreditExhaustedWithUserOnFreePackageFlow({
        subscriptionId: app?.subscription?.subscription_id,
        expiryDate: handleConvertDateToReadableFormat(
          app?.subscription?.subscription_ends,
        ),
      });
    }
  };

  /**
   * Handles student on paid package flow
   * Checks if user has credits and triggers appropriate flow if credits are exhausted
   */
  const handleUserAStudentOnPackageFlow = async () => {
    const app = await getUserActiveApp("", true);
    const hasCredits = app?.subscription?.entitlements?.has_credits;
    if (!hasCredits) {
      subscriptionFlow.handleStudentOnPaidPlanCreditExhaustedFlow();
    }
  };

  /**
   * Checks subscription status and triggers appropriate flow
   * Routes to free trial flow or active app subscription flow based on user's tenant
   */
  const handleSubscriptionCheck = async () => {
    if (isUserOnMainTenantAndAdmin()) {
      return;
    }
    if (
      isUserOnMainTenantAndNotAdmin() ||
      isUserOnAdvertisingTenantAndNotAdmin()
    ) {
      handleFreeTrialFlow();
    } else {
      handleActiveAppSubscriptionFlow();
    }
  };

  /**
   * Retrieves user's active application
   * @param {string} platformKey - Optional platform key to filter by specific platform
   * @returns {Promise<Object|null>} Active application or null if none found
   */
  const getUserActiveApp = async (platformKey?: string, useCache = false) => {
    try {
      const { data: userApps } = await getUserApps(
        { page: 1, pageSize: 50 },
        useCache,
      );
      return userApps?.results?.find(
        (item: any) =>
          //app name's corresponds to SPA platform name
          item?.app?.name
            ?.toLowerCase()
            ?.includes(subscriptionFlow.getPlatformName()) &&
          //see if platform key corresponds to current
          item?.platform?.key ===
            (platformKey || subscriptionFlow.getCurrentTenantKey()) &&
          // checking if product SKU corresponds to either free, starter or pro
          (subscriptionFlow.getCurrentTenantKey() ===
            subscriptionFlow.getMainTenantKey() ||
            item?.subscription?.product_sku?.includes(
              SUBSCRIPTION_PACKAGES.FREE_PACKAGE(
                subscriptionFlow.getPlatformName(),
              ),
            ) ||
            item?.subscription?.product_sku?.includes(
              SUBSCRIPTION_PACKAGES.STARTER_PACKAGE(
                subscriptionFlow.getPlatformName(),
              ),
            ) ||
            item?.subscription?.product_sku?.includes(
              SUBSCRIPTION_PACKAGES.PRO_PACKAGE(
                subscriptionFlow.getPlatformName(),
              ),
            )),
      );
    } catch (error) {
      return null;
    }
  };

  /**
   * Handles the free trial flow
   * Checks remaining usage count and updates UI accordingly
   * Creates trial status if user doesn't have an active app
   */
  const handleFreeTrialFlow = async () => {
    const app = await getUserActiveApp("", false);
    if (app && Object.keys(app).length > 0) {
      const hasCredits = app?.subscription?.entitlements?.has_credits;
      subscriptionFlow.handleFreeUsageCountFlow(hasCredits, true);
    } else {
      const onboardedUserApp = await handleTrialStatusUpdate();
      if (onboardedUserApp && Object.keys(onboardedUserApp).length > 0) {
        const hasCredits =
          onboardedUserApp?.subscription?.entitlements?.has_credits;
        subscriptionFlow.handleFreeUsageCountFlow(hasCredits, true);
      } else {
        subscriptionFlow.handleFreeUsageCountFlow(false, false);
      }
    }
  };

  /**
   * Updates user trial status and creates trial record
   * @param {string} platformKey - Optional platform key for trial status update
   * @returns {Promise<Object|null>} Updated user app or null if error occurs
   */
  const handleTrialStatusUpdate = async (platformKey?: string) => {
    try {
      await updateUserTrialStatus({
        requestBody: {
          app: subscriptionFlow.getMentorUrl(),
          free_trial_started: true,
          platform: platformKey || subscriptionFlow.getCurrentTenantKey(),
        },
      });
      if (isTrialStatusError) {
        throw new Error("Error updating trial status");
      }
      return await getUserActiveApp();
    } catch (error) {
      return null;
    }
  };

  /**
   * Handles subscription flow for active application
   * Manages different subscription scenarios and redirects to Stripe customer portal if needed
   */
  const handleActiveAppSubscriptionFlow = async () => {
    let app = await getUserActiveApp("", true);
    if (app && Object.keys(app).length > 0) {
      const mainApp = await getUserActiveApp(
        subscriptionFlow.getMainTenantKey(),
      );
      if (!mainApp) {
        await handleTrialStatusUpdate(subscriptionFlow.getMainTenantKey());
        app = await getUserActiveApp("", true);
      }
      const currentUserSubscriptionPackage = await getUserSubscriptionPackage();
      if (
        currentUserSubscriptionPackage ===
          SUBSCRIPTION_PACKAGES.FREE_PACKAGE(
            subscriptionFlow.getPlatformName(),
          ) &&
        subscriptionFlow.isUserAdmin()
      ) {
        await handleUserOnFreePackageFlow();
      } else if (
        currentUserSubscriptionPackage ===
          SUBSCRIPTION_PACKAGES.STARTER_PACKAGE(
            subscriptionFlow.getPlatformName(),
          ) &&
        subscriptionFlow.isUserAdmin()
      ) {
        await handleUserOnStarterPackageFlow();
      } else if (
        currentUserSubscriptionPackage ===
          SUBSCRIPTION_PACKAGES.PRO_PACKAGE(
            subscriptionFlow.getPlatformName(),
          ) &&
        subscriptionFlow.isUserAdmin()
      ) {
        await handleUserOnProPackageFlow();
      } else {
        await handleUserAStudentOnPackageFlow();
      }
    }
  };

  const handleUserOnStarterPackageFlow = async () => {
    const app = await getUserActiveApp("", true);
    const hasCredits = app?.subscription?.entitlements?.has_credits;
    if (!hasCredits) {
      subscriptionFlow.handleCreditExhaustedWithUserOnStarterPackageFlow({
        subscriptionId: app?.subscription?.subscription_id,
        expiryDate: handleConvertDateToReadableFormat(
          app?.subscription?.subscription_ends,
        ),
      });
    }
  };

  const handleUserOnProPackageFlow = async () => {
    const app = await getUserActiveApp("", true);
    const hasCredits = app?.subscription?.entitlements?.has_credits;
    if (!hasCredits) {
      subscriptionFlow.handleCreditExhaustedWithUserOnProPackageFlow({
        expiryDate: handleConvertDateToReadableFormat(
          app?.subscription?.subscription_ends,
        ),
      });
    }
  };

  /**
   * Gets the top-up URL for credit replenishment
   * @returns {Promise<string|null>} Top-up URL or null if error occurs
   */
  const getTopUpURL = async (obtainBillingPageURLIfNeeded = true) => {
    try {
      const currentUserSubscriptionPackage = await getUserSubscriptionPackage();
      if (
        currentUserSubscriptionPackage ===
          SUBSCRIPTION_PACKAGES.FREE_PACKAGE(
            subscriptionFlow.getPlatformName(),
          ) ||
        currentUserSubscriptionPackage ===
          SUBSCRIPTION_PACKAGES.STARTER_PACKAGE(
            subscriptionFlow.getPlatformName(),
          )
      ) {
        if (!obtainBillingPageURLIfNeeded) {
          return "";
        }
        return await getBillingURL({
          returnURL: window.location.href,
          includeSubscriptionIdIfNeeded: true,
        });
      }
      if (
        currentUserSubscriptionPackage !==
        SUBSCRIPTION_PACKAGES.PRO_PACKAGE(subscriptionFlow.getPlatformName())
      ) {
        return "";
      }
      const { data: stripeContext } = await getStripeContext({
        //platform_key: subscriptionFlow.getCurrentTenantKey(),
        platform_key: subscriptionFlow.getMainTenantKey(),
      });
      if (
        isStripeContextError ||
        !stripeContext ||
        Object.keys(stripeContext).length === 0
      ) {
        throw new Error("Error getting stripe context");
      }
      return stripeContext.payment_link_url;
    } catch (error) {
      return null;
    }
  };

  /**
   * Handles user subscription trigger for top-up credit
   * Manages subscription renewal and redirects to billing page
   */
  const handleTopUpCreditTrigger = async () => {
    subscriptionFlow.handleBeforeTopUpCreditTriggerFlow();
    const topUpURL = await getTopUpURL();
    if (topUpURL) {
      subscriptionFlow.handleRedirectToBillingPageFlow(topUpURL);
    } else {
      subscriptionFlow.handleFailureOnTopUpCreditTriggerFlow();
    }
  };

  /**
   * Handles billing page trigger
   * @param {string} returnURL - Optional return URL for after billing completion
   */
  const handleBillingPageTrigger = async (returnURL?: string) => {
    subscriptionFlow.handleBeforeBillingPageTriggerFlow();
    const billingURL = await getBillingURL({
      returnURL: returnURL || window.location.href,
      includeSubscriptionIdIfNeeded: true,
    });
    if (billingURL) {
      subscriptionFlow.handleRedirectToBillingPageFlow(billingURL);
    } else {
      subscriptionFlow.handleFailureOnBillingPageTriggerFlow();
    }
  };

  /**
   * Gets billing URL for Stripe customer portal
   * @param {Object} params - Parameters object
   * @param {string} params.returnURL - Return URL for after billing completion
   * @returns {Promise<string|null>} Billing URL or null if error occurs
   */
  const getBillingURL = async ({
    returnURL,
    includeSubscriptionIdIfNeeded = false,
  }: {
    returnURL: string;
    includeSubscriptionIdIfNeeded?: boolean;
  }) => {
    try {
      let requestBody;
      const currentUserSubscriptionPackage = await getUserSubscriptionPackage();
      if (
        currentUserSubscriptionPackage ===
          SUBSCRIPTION_PACKAGES.FREE_PACKAGE(
            subscriptionFlow.getPlatformName(),
          ) ||
        currentUserSubscriptionPackage ===
          SUBSCRIPTION_PACKAGES.STARTER_PACKAGE(
            subscriptionFlow.getPlatformName(),
          )
      ) {
        const app = await getUserActiveApp("", true);
        requestBody = {
          return_url: returnURL || window.location.href,
          ...(includeSubscriptionIdIfNeeded && {
            subscription_id: app?.subscription?.subscription_id,
          }),
        };
      } else {
        requestBody = {
          return_url: returnURL || window.location.href,
        };
      }
      const { data: stripeCustomerPortal } = await createStripeCustomerPortal({
        org: subscriptionFlow.getCurrentTenantKey(),
        userId: subscriptionFlow.getUsername(),
        requestBody,
      } as unknown as CreateStripeCustomerPortalRequest);
      if (isStripeCustomerPortalError) {
        throw new Error("Error getting stripe customer portal");
      }
      return stripeCustomerPortal?.url;
    } catch (error) {
      return null;
    }
  };

  /**
   * Handles banner button triggers
   * @param {string} trigger - Trigger type from SUBSCRIPTION_V2_TRIGGERS
   * @returns {Function} Appropriate handler function for the trigger
   */
  const bannerButtonTriggerCallback = (trigger: string) => {
    switch (trigger) {
      case SUBSCRIPTION_V2_TRIGGERS.PRICING_MODAL:
        return handlePricingPageDisplayFlow;
      //case SUBSCRIPTION_TRIGGERS.SUBSCRIBE_USER:
      case SUBSCRIPTION_V2_TRIGGERS.TOP_UP_CREDIT:
        return handleTopUpCreditTrigger;
      case SUBSCRIPTION_V2_TRIGGERS.CONTACT_ADMIN:
        return handleContactAdmin;
      case SUBSCRIPTION_V2_TRIGGERS.BILLING_PAGE:
        return handleBillingPageTrigger;
      default:
        return () => {};
    }
  };

  /**
   * Handles contact admin flow
   * Opens contact admin flow with subscription owner's email
   */
  const handleContactAdmin = async () => {
    const app = await getUserActiveApp("", true);
    if (app && Object.keys(app).length > 0) {
      subscriptionFlow.handleOpenContactAdminFlow(
        app?.subscription?.owner?.email,
      );
    }
  };

  /**
   * Handles pricing page display flow
   * Gets Stripe pricing page session and displays pricing modal
   */
  const handlePricingPageDisplayFlow = async () => {
    const activeApp = await getUserActiveApp("", false);
    const hasCredits = activeApp?.subscription?.entitlements?.has_credits;
    try {
      subscriptionFlow.handleBeforePricingPageDisplayFlow();
      const { data: stripeContext } = await getStripePricingPageSession(
        {
          platform_key: subscriptionFlow.getCurrentTenantKey(),
        },
        false,
      );
      if (
        isStripeContextError ||
        !stripeContext ||
        Object.keys(stripeContext).length === 0 /*  ||
        !stripeContext.payment_link_url */
      ) {
        throw new Error("Error getting stripe context");
      }
      subscriptionFlow.handlePricingPageDisplayFlow(
        {
          ...stripeContext,
        },
        !hasCredits,
      );
    } catch (error) {
      subscriptionFlow.handleFailureOnPaymentFlow();
    }
  };

  const handleConvertDateToReadableFormat = (date: string) => {
    if (!date) {
      return "";
    }
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    const day = dateObj.getDate();
    const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    const month = dateObj.toLocaleDateString("en-US", { month: "long" });
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dayOfWeek}, ${month} ${day} at ${time}`;
  };

  return {
    handleSubscriptionCheck,
    bannerButtonTriggerCallback,
    CREDIT_INTERVAL_CHECK_COUNTER,
    getBillingURL,
    getTopUpURL,
    getUserSubscriptionPackage,
    /* handleGetPricingStripeContext */
  };
};
