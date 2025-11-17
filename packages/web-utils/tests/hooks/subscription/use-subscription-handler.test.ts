import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useSubscriptionHandler } from "@/hooks/subscription/use-subscription-handler";
import { SubscriptionFlow } from "@/hooks/subscription/class-subscription-flow";
import { SUBSCRIPTION_TRIGGERS } from "@/hooks/subscription/constants";
import { createWrapper } from "../../setupTests";

// Mock data layer hooks with simple implementations
vi.mock("@iblai/data-layer", () => ({
  useRenewSubscriptionMutation: () => [vi.fn(), { isLoading: false }],
  useLazyGetUserAppsQuery: () => [vi.fn(), { isLoading: false }],
  useCreateStripeCustomerPortalMutation: () => [vi.fn(), { isLoading: false }],
  useLazyGetFreeUsageCountQuery: () => [vi.fn(), { isLoading: false }],
}));

// Mock dayjs utilities used inside the hook
vi.mock("@/hooks/use-day-js", () => ({
  useDayJs: () => ({
    getTimeDifferenceBetweenTwoDates: () => 86400, // one day in seconds
    getDayJSDurationObjFromSeconds: () => ({
      asDays: () => 1,
      asHours: () => 24,
      asMinutes: () => 1440,
    }),
  }),
}));

describe("useSubscriptionHandler", () => {
  const baseConfig = {
    platformName: "mentor",
    currentTenantKey: "tenant1",
    username: "john",
    currentTenantOrg: "org1",
    userTenants: [{ key: "tenant1", is_admin: false, org: "org1" }],
    isAdmin: false,
    mainTenantKey: "tenant1",
  };

  const freeTrialConfig = {
    ...baseConfig,
    // Ensure user is on free trial: currentTenantKey === mainTenantKey && !isAdmin && userTenants.length === 1
    currentTenantKey: "tenant1",
    mainTenantKey: "tenant1",
    isAdmin: false,
    userTenants: [{ key: "tenant1", is_admin: false, org: "org1" }],
  };

  const activeAppConfig = {
    ...baseConfig,
    // Ensure user is NOT on free trial by having multiple tenants
    userTenants: [
      { key: "tenant1", is_admin: false, org: "org1" },
      { key: "tenant2", is_admin: false, org: "org2" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns correct callback for triggers", () => {
    const flow = new (class extends SubscriptionFlow {
      handleFreeUsageCountFlow(): void {}
      handleTrialEndedFlow(): void {}
      handleSubscriptionOnGoingFlow(): void {}
      handleRedirectToURLFlow(): void {}
      handleSuccessfullySubscribedFlow(): void {}
    })(baseConfig);
    const { result } = renderHook(() => useSubscriptionHandler(flow), {
      wrapper: createWrapper(),
    });

    const pricingCb = result.current.bannerButtonTriggerCallback(
      SUBSCRIPTION_TRIGGERS.PRICING_MODAL
    );
    expect(typeof pricingCb).toBe("function");

    const subscribeCb = result.current.bannerButtonTriggerCallback(
      SUBSCRIPTION_TRIGGERS.SUBSCRIBE_USER
    );
    expect(typeof subscribeCb).toBe("function");
  });

  it("returns handleSubscriptionCheck function", () => {
    const flow = new (class extends SubscriptionFlow {
      handleFreeUsageCountFlow(): void {}
      handleTrialEndedFlow(): void {}
      handleSubscriptionOnGoingFlow(): void {}
      handleRedirectToURLFlow(): void {}
      handleSuccessfullySubscribedFlow(): void {}
    })(baseConfig);
    const { result } = renderHook(() => useSubscriptionHandler(flow), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.handleSubscriptionCheck).toBe("function");
  });

  it("returns handleIntervalSubscriptionCheck function", () => {
    const flow = new (class extends SubscriptionFlow {
      handleFreeUsageCountFlow(): void {}
      handleTrialEndedFlow(): void {}
      handleSubscriptionOnGoingFlow(): void {}
      handleRedirectToURLFlow(): void {}
      handleSuccessfullySubscribedFlow(): void {}
    })(baseConfig);
    const { result } = renderHook(() => useSubscriptionHandler(flow), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.handleIntervalSubscriptionCheck).toBe(
      "function"
    );
  });

  it("initializes trialCounterStarted as false", () => {
    const flow = new (class extends SubscriptionFlow {
      handleFreeUsageCountFlow(): void {}
      handleTrialEndedFlow(): void {}
      handleSubscriptionOnGoingFlow(): void {}
      handleRedirectToURLFlow(): void {}
      handleSuccessfullySubscribedFlow(): void {}
    })(baseConfig);
    const { result } = renderHook(() => useSubscriptionHandler(flow), {
      wrapper: createWrapper(),
    });

    expect(result.current.trialCounterStarted).toBe(false);
  });

  it("returns different callbacks for different triggers", () => {
    const flow = new (class extends SubscriptionFlow {
      handleFreeUsageCountFlow(): void {}
      handleTrialEndedFlow(): void {}
      handleSubscriptionOnGoingFlow(): void {}
      handleRedirectToURLFlow(): void {}
      handleSuccessfullySubscribedFlow(): void {}
    })(baseConfig);
    const { result } = renderHook(() => useSubscriptionHandler(flow), {
      wrapper: createWrapper(),
    });

    const pricingCallback = result.current.bannerButtonTriggerCallback(
      SUBSCRIPTION_TRIGGERS.PRICING_MODAL
    );
    const subscribeCallback = result.current.bannerButtonTriggerCallback(
      SUBSCRIPTION_TRIGGERS.SUBSCRIBE_USER
    );
    const unknownCallback =
      result.current.bannerButtonTriggerCallback("unknown");

    expect(typeof pricingCallback).toBe("function");
    expect(typeof subscribeCallback).toBe("function");
    expect(typeof unknownCallback).toBe("function");
    expect(pricingCallback).not.toBe(subscribeCallback);
  });

  it("returns empty function for unknown trigger", () => {
    const flow = new (class extends SubscriptionFlow {
      handleFreeUsageCountFlow(): void {}
      handleTrialEndedFlow(): void {}
      handleSubscriptionOnGoingFlow(): void {}
      handleRedirectToURLFlow(): void {}
      handleSuccessfullySubscribedFlow(): void {}
    })(baseConfig);
    const { result } = renderHook(() => useSubscriptionHandler(flow), {
      wrapper: createWrapper(),
    });

    const callback = result.current.bannerButtonTriggerCallback("unknown");

    // Should not throw when called
    expect(() => callback()).not.toThrow();
  });
});
