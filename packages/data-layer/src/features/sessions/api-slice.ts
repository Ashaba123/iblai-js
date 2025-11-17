import { createApi } from '@reduxjs/toolkit/query/react';

import { AiMentorService } from '@iblai/iblai-api';
import { buildEndpointFromDmService } from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';

export const sessionApiSlice = createApi({
  reducerPath: 'sessionApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['sessionId'],

  endpoints: (builder) => ({
    createSessionId: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersSessionsCreate),
      invalidatesTags: ['sessionId'],
    }),
    getSessionId: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersSessionsRetrieve),
      providesTags: ['sessionId'],
    }),
    editSession: builder.mutation({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersSessionsUpdate),
      invalidatesTags: ['sessionId'],
    }),
  }),
});

export const {
  useCreateSessionIdMutation,
  useGetSessionIdQuery,
  useLazyGetSessionIdQuery,
  useEditSessionMutation,
} = sessionApiSlice;
