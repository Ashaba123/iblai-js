import { SERVICES } from '@data-layer/constants';

export const STRIPE_ENDPOINTS = {
  GET_STRIPE_CONTEXT: {
    service: SERVICES.DM,
    path: (platform_key: string): string =>
      `/api/service/platforms/${platform_key}/stripe/context/`,
  },
  GET_STRIPE_PRICING_PAGE_SESSION: {
    service: SERVICES.DM,
    path: (platform_key: string): string =>
      `/api/service/platforms/${platform_key}/stripe/pricing-page-session/`,
  },
  CREATE_STRIPE_CHECKOUT_SESSION: {
    service: SERVICES.DM,
    path: (platform_key: string, username: string): string =>
      `/api/service/orgs/${platform_key}/users/${username}/stripe/checkout-session/`,
  },
};

export const STRIPE_QUERY_KEYS = {
  GET_STRIPE_CONTEXT: (): string[] => ['STRIPE_CONTEXT'],
};

export const STRIPE_REDUCER_PATH = 'stripeApiSlice';
