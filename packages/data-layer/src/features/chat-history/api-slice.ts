import { buildEndpointFromDmService } from '../utils';

import { createApi } from '@reduxjs/toolkit/query/react';
import { AiAnalyticsService, ReportsService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const chatHistoryApiSlice = createApi({
  reducerPath: 'chatHistoryApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['chatHistory', 'chatHistoryFilter', 'chatHistoryExportStatus'],
  endpoints: (builder) => ({
    getChatHistoryFilter: builder.query({
      ...buildEndpointFromDmService(
        AiAnalyticsService.aiAnalyticsOrgsUsersChatHistoryFilterRetrieve,
      ),
      providesTags: ['chatHistoryFilter'],
    }),
    getChatHistory: builder.query({
      ...buildEndpointFromDmService(AiAnalyticsService.aiAnalyticsOrgsUsersChatHistoryList),
      providesTags: ['chatHistory'],
    }),
    exportChatHistory: builder.mutation({
      ...buildEndpointFromDmService(ReportsService.reportsPlatformsNewCreate),
    }),
    getChatHistoryExportStatus: builder.query({
      ...buildEndpointFromDmService(ReportsService.reportsPlatformsRetrieve2),
      providesTags: ['chatHistoryExportStatus'],
    }),
  }),
});

export const {
  useGetChatHistoryFilterQuery,
  useLazyGetChatHistoryFilterQuery,
  useGetChatHistoryQuery,
  useLazyGetChatHistoryQuery,
  useExportChatHistoryMutation,
  useGetChatHistoryExportStatusQuery,
  useLazyGetChatHistoryExportStatusQuery,
} = chatHistoryApiSlice;
