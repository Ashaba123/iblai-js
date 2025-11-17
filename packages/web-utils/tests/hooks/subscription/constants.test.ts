import { SUBSCRIPTION_TRIGGERS } from "@/hooks/subscription/constants";

describe("SUBSCRIPTION_TRIGGERS", () => {
  it("should expose the correct trigger values", () => {
    expect(SUBSCRIPTION_TRIGGERS).toEqual({
      PRICING_MODAL: "TRIGGER_PRICING_MODAL",
      SUBSCRIBE_USER: "TRIGGER_SUBSCRIBE_USER",
    });
  });

  it("should contain both expected keys", () => {
    expect(Object.keys(SUBSCRIPTION_TRIGGERS)).toEqual([
      "PRICING_MODAL",
      "SUBSCRIBE_USER",
    ]);
  });
});
