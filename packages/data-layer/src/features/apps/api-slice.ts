import { FeaturesService } from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';

export const appApiSlice = createApi({
  reducerPath: 'appApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['apps'],
  endpoints: (builder) => ({
    getUserApps: builder.query({
      ...buildEndpointFromDmService(FeaturesService.featuresAppsList),
      providesTags: ['apps'],
    }),
    updateUserOnboardingStatus: builder.mutation({
      ...buildEndpointFromDmService(FeaturesService.featuresAppsUpdateCreate),
      invalidatesTags: ['apps'],
    }),
    updateUserTrialStatus: builder.mutation({
      ...buildEndpointFromDmService(FeaturesService.featuresAppsUpdateTrialStatusCreate),
      invalidatesTags: ['apps'],
    }),
  }),
});

export const appApiReducer: typeof appApiSlice.reducer = appApiSlice.reducer;
export const {
  useGetUserAppsQuery,
  useLazyGetUserAppsQuery,
  useUpdateUserOnboardingStatusMutation,
  useUpdateUserTrialStatusMutation,
} = appApiSlice;
