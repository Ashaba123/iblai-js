import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { CommerceService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const billingApiSlice = createApi({
  reducerPath: 'billingApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['billing'],
  endpoints: (builder) => ({
    createStripeCustomerPortal: builder.mutation({
      ...buildEndpointFromDmService(CommerceService.serviceOrgsUsersStripeCustomerPortalCreate),
    }),
    renewSubscription: builder.mutation({
      ...buildEndpointFromDmService(
        CommerceService.serviceOrgsUsersStripeSubscriptionRenewalCreate,
      ),
    }),
  }),
});

export const { useCreateStripeCustomerPortalMutation, useRenewSubscriptionMutation } =
  billingApiSlice;
