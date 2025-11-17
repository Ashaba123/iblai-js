import { AiAnalyticsService } from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';

import { buildEndpointFromDmServiceLegacy } from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';

export const perLearnerApiSlice = createApi({
  // TODO: replace to catalogSlice
  reducerPath: 'perLearnerApiSlice',

  baseQuery: iblFakeBaseQuery,

  tagTypes: ['perLearner'],

  endpoints: (builder) => ({
    getPerLearnerActivity: builder.query({
      ...buildEndpointFromDmServiceLegacy(AiAnalyticsService.perlearnerOrgsUsersActivityRetrieve),
    }),
    getPerLearnerInfo: builder.query({
      ...buildEndpointFromDmServiceLegacy(AiAnalyticsService.perlearnerOrgsUsersInfoRetrieve),
    }),
    getOverTimeActivity: builder.query({
      ...buildEndpointFromDmServiceLegacy(
        AiAnalyticsService.perlearnerOrgsUsersOverviewTimeOverTimeRetrieve,
      ),
    }),
  }),
});

export const {
  useGetPerLearnerActivityQuery,
  useLazyGetPerLearnerActivityQuery,
  useGetPerLearnerInfoQuery,
  useLazyGetPerLearnerInfoQuery,
  useGetOverTimeActivityQuery,
  useLazyGetOverTimeActivityQuery,
} = perLearnerApiSlice;
