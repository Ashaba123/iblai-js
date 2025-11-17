import { createApi } from '@reduxjs/toolkit/query/react';
import { StripeCheckoutSessionArgs, StripeContextResponse } from './types';
import { iblFetchBaseQuery } from '@data-layer/features/utils';
import { STRIPE_ENDPOINTS } from './constants';

export const stripeApiSlice = createApi({
  reducerPath: 'stripeApiSlice',
  baseQuery: iblFetchBaseQuery,
  tagTypes: ['stripe-context'],
  endpoints: (builder) => ({
    getStripeContext: builder.query<StripeContextResponse, { platform_key: string }>({
      query: ({ platform_key }) => ({
        url: STRIPE_ENDPOINTS.GET_STRIPE_CONTEXT.path(platform_key),
        service: STRIPE_ENDPOINTS.GET_STRIPE_CONTEXT.service,
        method: 'GET',
      }),
      providesTags: ['stripe-context'],
    }),
    getStripePricingPageSession: builder.query<StripeContextResponse, { platform_key: string }>({
      query: ({ platform_key }) => ({
        url: STRIPE_ENDPOINTS.GET_STRIPE_PRICING_PAGE_SESSION.path(platform_key),
        service: STRIPE_ENDPOINTS.GET_STRIPE_PRICING_PAGE_SESSION.service,
        method: 'GET',
      }),
      providesTags: ['stripe-context'],
    }),
    createStripeCheckoutSession: builder.mutation<Record<string, any>, StripeCheckoutSessionArgs>({
      query: (args) => ({
        url: STRIPE_ENDPOINTS.CREATE_STRIPE_CHECKOUT_SESSION.path(args.org, args.username),
        service: STRIPE_ENDPOINTS.CREATE_STRIPE_CHECKOUT_SESSION.service,
        method: 'POST',
        body: JSON.stringify(args),
      }),
    }),
  }),
});

export const {
  useGetStripeContextQuery,
  useLazyGetStripeContextQuery,
  useGetStripePricingPageSessionQuery,
  useLazyGetStripePricingPageSessionQuery,
  useCreateStripeCheckoutSessionMutation,
} = stripeApiSlice;
