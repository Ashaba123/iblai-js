import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromAxdService } from '../utils';
import { AiMentorService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const llmsApiSlice = createApi({
  reducerPath: 'llmsApiSlice',
  baseQuery: iblFakeBaseQuery,
  endpoints: (builder) => ({
    getLlms: builder.query({
      ...buildEndpointFromAxdService(AiMentorService.aiMentorOrgsUsersMentorLlmsList),
    }),
  }),
});

export const { useGetLlmsQuery, useLazyGetLlmsQuery } = llmsApiSlice;
