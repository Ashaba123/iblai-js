import { SubscriptionFlow } from "@/hooks/subscription/class-subscription-flow";

describe("SubscriptionFlow", () => {
  const config = {
    platformName: "mentor",
    currentTenantKey: "tenant1",
    username: "john",
    currentTenantOrg: "org1",
    userTenants: [{ key: "tenant1", is_admin: false, org: "org1" }],
    isAdmin: false,
    mainTenantKey: "tenant1",
  };

  it("initializes values and getters work", () => {
    const flow = new (class extends SubscriptionFlow {
      handleFreeUsageCountFlow(): void {}
      handleTrialEndedFlow(): void {}
      handleSubscriptionOnGoingFlow(): void {}
      handleRedirectToURLFlow(): void {}
      handleSuccessfullySubscribedFlow(): void {}
    })(config);
    expect(flow.getPlatformName()).toBe(config.platformName);
    expect(flow.getCurrentTenantKey()).toBe(config.currentTenantKey);
    expect(flow.getUsername()).toBe(config.username);
    expect(flow.getCurrentTenantOrg()).toBe(config.currentTenantOrg);
    expect(flow.getUserTenants()).toEqual(config.userTenants);
    expect(flow.isUserAdmin()).toBe(config.isAdmin);
    expect(flow.getMainTenantKey()).toBe(config.mainTenantKey);
  });

  it("exposes handler methods", () => {
    const flow = new (class extends SubscriptionFlow {
      handleFreeUsageCountFlow(): void {}
      handleTrialEndedFlow(): void {}
      handleSubscriptionOnGoingFlow(): void {}
      handleRedirectToURLFlow(): void {}
      handleSuccessfullySubscribedFlow(): void {}
    })(config);
    const methods = [
      "handleFreeUsageCountFlow",
      "handleTrialEndedFlow",
      "handleSubscriptionOnGoingFlow",
      "handleRedirectToURLFlow",
      "handlePricingPageDisplayFlow",
      "handleBeforeSubscribeUserTriggerFlow",
      "handleSuccessfullySubscribedFlow",
    ];

    methods.forEach((method) => {
      expect(typeof (flow as any)[method]).toBe("function");
    });
  });
});
