import { StripeCustomerPortalRequest } from "@iblai/iblai-api";

export interface UseExternalPricingProps {
  referenceId: string;
  customerEmail: string;
  publishableKey: string;
  pricingId?: string;
}

export interface PricingModalData {
  referenceId: string;
  customerEmail: string;
  publishableKey: string;
  pricingTableId: string;
}

export interface CreateStripeCustomerPortalRequest {
  org: string;
  userId: string;
  requestBody: StripeCustomerPortalRequest;
}