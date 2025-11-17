export interface StripeContextResponse {
  publishable_key: string;
  pricing_table_id: string;
  pricing_table_js: string;
  payment_link_id: string;
  payment_link_url: string;
  customer_email?: string;
  client_reference_id?: string;
}

export interface StripeCheckoutSessionArgs {
  org: string;
  username: string;
  mode: string;
  cancel_url: string;
  success_url: string;
  sku?: string;
  metric_type?: string;
  tenant: string;
}
