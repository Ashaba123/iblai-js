import { CoreService } from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';

export const apiKeysApiSlice = createApi({
  reducerPath: 'apiKeysApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['apiKeys'],
  endpoints: (builder) => ({
    getApiKeys: builder.query({
      ...buildEndpointFromDmService(CoreService.corePlatformApiTokensList),
      providesTags: ['apiKeys'],
    }),
    createApiKey: builder.mutation({
      ...buildEndpointFromDmService(CoreService.corePlatformApiTokensCreate),
      invalidatesTags: ['apiKeys'],
    }),
    deleteApiKey: builder.mutation({
      ...buildEndpointFromDmService(CoreService.corePlatformApiTokensDestroy),
      invalidatesTags: ['apiKeys'],
    }),
  }),
});

export const apiKeysApiReducer: typeof apiKeysApiSlice.reducer = apiKeysApiSlice.reducer;
export const {
  useGetApiKeysQuery,
  useLazyGetApiKeysQuery,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
} = apiKeysApiSlice;
