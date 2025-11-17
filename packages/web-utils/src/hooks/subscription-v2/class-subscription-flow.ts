import { StripeContextResponse } from "@iblai/data-layer";

interface Tenant {
  key: string;
  is_admin: boolean;
  org: string;
  is_advertising?: boolean;
}

export interface SubscriptionFlowConfigV2 {
  platformName: string;
  currentTenantKey: string;
  username: string;
  currentTenantOrg: string;
  userTenants: Tenant[];
  isAdmin: boolean;
  mainTenantKey: string;
  userEmail: string;
  mentorUrl: string;
}

/**
 * SubscriptionFlow class manages all subscription-related flows and user interactions
 * Handles free trial, usage limits, and subscription management
 */
export abstract class SubscriptionFlowV2 {
  protected platformName: string;
  protected currentTenantKey: string;
  protected username: string;
  protected currentTenantOrg: string;
  protected userTenants: Tenant[];
  protected isAdmin: boolean;
  protected mainTenantKey: string;
  protected userEmail: string;
  protected mentorUrl: string;

  constructor(config: SubscriptionFlowConfigV2) {
    this.platformName = config.platformName;
    this.currentTenantKey = config.currentTenantKey;
    this.username = config.username;
    this.currentTenantOrg = config.currentTenantOrg;
    this.userTenants = config.userTenants;
    this.isAdmin = config.isAdmin;
    this.mainTenantKey = config.mainTenantKey;
    this.userEmail = config.userEmail;
    this.mentorUrl = config.mentorUrl;
  }

  // Getter methods for class properties
  public getPlatformName(): string {
    return this.platformName;
  }

  public getCurrentTenantKey(): string {
    return this.currentTenantKey;
  }

  public getUsername(): string {
    return this.username;
  }

  public getCurrentTenantOrg(): string {
    return this.currentTenantOrg;
  }

  public getUserTenants(): Tenant[] {
    return this.userTenants;
  }

  public isUserAdmin(): boolean {
    return this.isAdmin;
  }

  public getUserEmail(): string {
    return this.userEmail;
  }

  public getMainTenantKey(): string {
    return this.mainTenantKey;
  }

  public getMentorUrl(): string {
    return this.mentorUrl;
  }

  public abstract handleRedirectToBillingPageFlow(billingUrl: string): void;

  public handleBeforeTopUpCreditTriggerFlow(): void {}

  public handleBeforeBillingPageTriggerFlow(): void {}

  /**
   * Handles the flow when user reaches their free usage limit
   * Updates banner with appropriate message based on remaining usage count
   */
  public abstract handleFreeUsageCountFlow(
    hasCredits: boolean,
    appExists: boolean,
  ): void;

  /**
   * Displays the pricing modal for subscription options
   */
  public abstract handlePricingPageDisplayFlow(
    stripeContext: StripeContextResponse,
    creditExhausted: boolean,
  ): void;

  /**
   * Displays error notification when payment flow fails
   */
  public handleFailureOnPaymentFlow(): void {}

  public handleBeforePricingPageDisplayFlow(): void {}

  public handleFailureOnTopUpCreditTriggerFlow(): void {}

  public handlePaidPlanCreditExhaustedFlow(): void {}

  public handleProPlanCreditExhaustedFlow(): void {}

  public handleStudentOnPaidPlanCreditExhaustedFlow(): void {}

  public abstract handleOpenContactAdminFlow(adminEmail: string): void;

  public abstract handleCreditExhaustedWithUserOnFreePackageFlow({
    subscriptionId,
    expiryDate,
  }: {
    subscriptionId: string;
    expiryDate: string;
  }): void;

  public abstract handleCreditExhaustedWithUserOnStarterPackageFlow({
    subscriptionId,
    expiryDate,
  }: {
    subscriptionId: string;
    expiryDate: string;
  }): void;

  public abstract handleCreditExhaustedWithUserOnProPackageFlow({
    expiryDate,
  }: {
    expiryDate: string;
  }): void;

  public handleFailureOnBillingPageTriggerFlow(): void {}
}
