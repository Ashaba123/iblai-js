import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { AiMentorService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const toolsApiSlice = createApi({
  reducerPath: 'toolsApiSlice',
  baseQuery: iblFakeBaseQuery,
  endpoints: (builder) => ({
    getTools: builder.query({
      ...buildEndpointFromDmService(AiMentorService.aiMentorOrgsUsersMentorsAvailableToolsList),
    }),
  }),
});

export const { useGetToolsQuery, useLazyGetToolsQuery } = toolsApiSlice;
