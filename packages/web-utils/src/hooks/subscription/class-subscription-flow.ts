import { FreeUsageCount } from "@iblai/iblai-api";

interface Tenant {
  key: string;
  is_admin: boolean;
  org: string;
}

export interface SubscriptionFlowConfig {
  platformName: string;
  currentTenantKey: string;
  username: string;
  currentTenantOrg: string;
  userTenants: Tenant[];
  isAdmin: boolean;
  mainTenantKey: string;
}

/**
 * SubscriptionFlow class manages all subscription-related flows and user interactions
 * Handles free trial, usage limits, and subscription management
 */
export abstract class SubscriptionFlow {
  protected platformName: string;
  protected currentTenantKey: string;
  protected username: string;
  protected currentTenantOrg: string;
  protected userTenants: Tenant[];
  protected isAdmin: boolean;
  protected mainTenantKey: string;

  constructor(config: SubscriptionFlowConfig) {
    this.platformName = config.platformName;
    this.currentTenantKey = config.currentTenantKey;
    this.username = config.username;
    this.currentTenantOrg = config.currentTenantOrg;
    this.userTenants = config.userTenants;
    this.isAdmin = config.isAdmin;
    this.mainTenantKey = config.mainTenantKey;
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

  /**
   * Handles the flow when user reaches their free usage limit
   * Updates banner with appropriate message based on remaining usage count
   */
  public abstract handleFreeUsageCountFlow(
    freeUsageCount: FreeUsageCount
  ): void;

  /**
   * Handles the flow when user's free trial period has ended
   * Updates banner and clears any existing trial interval
   */
  public abstract handleTrialEndedFlow(freeTrialIntervalID?: number): void;

  /**
   * Handles the flow for ongoing subscription period
   * Updates banner with remaining trial time and subscription options
   */
  public abstract handleSubscriptionOnGoingFlow(
    timeRemainingInString: string
  ): void;

  /**
   * Handles redirection to external URLs with optional toast notification
   */
  public abstract handleRedirectToURLFlow(
    redirectUrl: string,
    toastMessage?: string
  ): void;

  /**
   * Displays the pricing modal for subscription options
   */
  public handlePricingPageDisplayFlow(): void {}

  /**
   * Handles the pre-subscription state
   * Updates banner to show loading state
   */
  public handleBeforeSubscribeUserTriggerFlow(): void {}

  /**
   * Handles successful subscription completion
   * Shows success message and disables subscription banner
   */
  public abstract handleSuccessfullySubscribedFlow(message?: string): void;

  public getMainTenantKey(): string {
    return this.mainTenantKey;
  }
}
