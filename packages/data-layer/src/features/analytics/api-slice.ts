import { createApi } from '@reduxjs/toolkit/query/react';
import { iblFetchBaseQuery } from '../utils';
import {
  ANALYTICS_ENDPOINTS,
  ANALYTICS_REDUCER_PATH,
  NON_AI_ANALYTICS_ENDPOINTS,
} from './constants';
import type {
  AnalyticsDateParams,
  AnalyticsPaginationParams,
  OverviewSummaryResponse,
  ConversationSummaryResponse,
  TopicStatisticsResponse,
  TopicOverviewResponse,
  UserMetricsResponse,
  UserMetricsPieChartResponse,
  UserCohortsOverTimeResponse,
  TopStudentsResponse,
  TopicsSummaryResponse,
  AverageMessagesPerSessionResponse,
  TopicsStatsArgs,
  TopicsStatsResponse,
  UsersStatsResponse,
  UsersStatsArgs,
  SessionStatsArgs,
  SessionStatsResponse,
  TopicsDetailsStatsResponse,
  TopicsDetailsStatsArgs,
  AccessTimeHeatmapResponse,
  AccessTimeHeatmapArgs,
  UserDetailsStatsResponse,
  UserDetailsStatsArgs,
  FinancialStatsResponse,
  FinancialStatsArgs,
  DetailedFinancialStatsResponse,
  DetailedFinancialStatsArgs,
  TranscriptsMessagesArgs,
  TranscriptsMessagesResponse,
  TranscriptsMessagesDetailsArgs,
  TranscriptsMessagesDetailsResponse,
  TranscriptsConversationHeadlineArgs,
  TranscriptsConversationHeadlineResponse,
  TimeTrackingResponse,
  TimeTrackingRequest,
} from './types';

export const analyticsApiSlice = createApi({
  reducerPath: ANALYTICS_REDUCER_PATH,
  baseQuery: iblFetchBaseQuery,
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getOverviewSummary: builder.query<OverviewSummaryResponse, AnalyticsDateParams>({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_OVERVIEW_SUMMARY.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_OVERVIEW_SUMMARY.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'OVERVIEW_SUMMARY' }],
    }),

    getConversation: builder.query<ConversationSummaryResponse[], AnalyticsDateParams>({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_CONVERSATION.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_CONVERSATION.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'CONVERSATION' }],
    }),

    getMostDiscussedTopics: builder.query<TopicsSummaryResponse[], AnalyticsDateParams>({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_MOST_DISCUSSED_TOPICS.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_MOST_DISCUSSED_TOPICS.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'MOST_DISCUSSED_TOPICS' }],
    }),

    getAverageMessagesPerSession: builder.query<
      AverageMessagesPerSessionResponse[],
      AnalyticsDateParams
    >({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_AVERAGE_MESSAGES_PER_SESSION.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_AVERAGE_MESSAGES_PER_SESSION.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'AVERAGE_MESSAGES_PER_SESSION' }],
    }),

    getRegisteredUsersTrend: builder.query<ConversationSummaryResponse[], AnalyticsDateParams>({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_REGISTERED_USERS_TREND.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_REGISTERED_USERS_TREND.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'REGISTERED_USERS_TREND' }],
    }),

    getUserMetrics: builder.query<UserMetricsResponse, AnalyticsDateParams>({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_USER_METRICS.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_USER_METRICS.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'USER_METRICS' }],
    }),

    getUserMetricsPieChart: builder.query<UserMetricsPieChartResponse, AnalyticsDateParams>({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_USER_METRICS_PIE_CHART.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_USER_METRICS_PIE_CHART.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'USER_METRICS_PIE_CHART' }],
    }),

    getUserCohortsOverTime: builder.query<UserCohortsOverTimeResponse, AnalyticsDateParams>({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_USER_COHORTS_OVER_TIME.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_USER_COHORTS_OVER_TIME.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'USER_COHORTS_OVER_TIME' }],
    }),

    getTopStudentsByChatMessages: builder.query<TopStudentsResponse[], AnalyticsDateParams>({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_TOP_STUDENTS_BY_CHAT_MESSAGES.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_TOP_STUDENTS_BY_CHAT_MESSAGES.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'TOP_STUDENTS_BY_CHAT_MESSAGES' }],
    }),

    getTopicOverview: builder.query<TopicOverviewResponse, AnalyticsDateParams>({
      query: (args: AnalyticsDateParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_TOPIC_OVERVIEW.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_TOPIC_OVERVIEW.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'TOPIC_OVERVIEW' }],
    }),

    getTopicsSummary: builder.query<TopicsSummaryResponse[], AnalyticsPaginationParams>({
      query: (args: AnalyticsPaginationParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_TOPICS_SUMMARY.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_TOPICS_SUMMARY.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
          page: args.page,
          page_size: args.pageSize,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'TOPICS_SUMMARY' }],
    }),

    getTopicStatistics: builder.query<TopicStatisticsResponse, AnalyticsPaginationParams>({
      query: (args: AnalyticsPaginationParams) => ({
        url: ANALYTICS_ENDPOINTS.GET_TOPIC_STATISTICS.path(args.org, args.userId),
        service: ANALYTICS_ENDPOINTS.GET_TOPIC_STATISTICS.service,
        params: {
          org: args.org,
          userId: args.userId,
          mentor_id: args.mentorId,
          startDate: args.startDate,
          endDate: args.endDate,
          aggregation: args.aggregation,
          page: args.page,
          page_size: args.pageSize,
        },
      }),
      providesTags: () => [{ type: 'Analytics' as const, id: 'TOPIC_STATISTICS' }],
    }),
    getTopicsStats: builder.query<TopicsStatsResponse, TopicsStatsArgs>({
      query: (args: TopicsStatsArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_TOPICS_STATS.path(
          args.date_filter,
          args.platform_key,
          args.mentor_unique_id,
        ),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_TOPICS_STATS.service,
      }),
    }),
    getUsersStats: builder.query<UsersStatsResponse, UsersStatsArgs>({
      query: (args: UsersStatsArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_USERS_STATS.path(
          args.date_filter,
          args.platform_key,
          args.mentor_unique_id,
          args.metric,
          args.start_date,
          args.end_date,
        ),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_USERS_STATS.service,
      }),
    }),
    getSessionStats: builder.query<SessionStatsResponse, SessionStatsArgs>({
      query: (args: SessionStatsArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_SESSION_STATS.path(
          args.platform_key,
          args.mentor_unique_id,
          args.date_filter,
          args.start_date,
          args.end_date,
          args.metric,
        ),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_SESSION_STATS.service,
      }),
    }),
    getTopicsDetailsStats: builder.query<TopicsDetailsStatsResponse, TopicsDetailsStatsArgs>({
      query: (args: TopicsDetailsStatsArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_TOPICS_DETAILS_STATS.path(
          args.date_filter,
          args.platform_key,
          args.mentor_unique_id,
          args.start_date ?? '',
          args.end_date ?? '',
        ),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_TOPICS_DETAILS_STATS.service,
      }),
    }),
    getAccessTimeHeatmap: builder.query<AccessTimeHeatmapResponse, AccessTimeHeatmapArgs>({
      query: (args: AccessTimeHeatmapArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_ACCESS_TIME_HEATMAP.path(
          args.date_filter,
          args.platform_key,
          args.mentor_unique_id,
          args.start_date ?? '',
          args.end_date ?? '',
        ),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_ACCESS_TIME_HEATMAP.service,
      }),
    }),
    getUserDetailsStats: builder.query<UserDetailsStatsResponse, UserDetailsStatsArgs>({
      query: (args: UserDetailsStatsArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_USER_DETAILS_STATS.path(
          args.date_filter,
          args.platform_key,
          args.mentor_unique_id,
          args.start_date ?? '',
          args.end_date ?? '',
          args.page,
          args.limit,
          args.search,
        ),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_USER_DETAILS_STATS.service,
      }),
    }),
    getAverageRating: builder.query<SessionStatsResponse, SessionStatsArgs>({
      query: (args: SessionStatsArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_AVERAGE_RATING.path(
          args.platform_key,
          args.mentor_unique_id,
          args.date_filter ?? '',
          args.start_date ?? '',
          args.end_date ?? '',
        ),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_AVERAGE_RATING.service,
      }),
    }),
    getFinancialStats: builder.query<FinancialStatsResponse, FinancialStatsArgs>({
      query: (args: FinancialStatsArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_FINANCIAL_STATS.path(args),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_FINANCIAL_STATS.service,
      }),
    }),
    getDetailedFinancialStats: builder.query<
      DetailedFinancialStatsResponse,
      DetailedFinancialStatsArgs
    >({
      query: (args: DetailedFinancialStatsArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_DETAILED_FINANCIAL_STATS.path(args),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_DETAILED_FINANCIAL_STATS.service,
      }),
    }),
    getTranscriptsMessages: builder.query<TranscriptsMessagesResponse, TranscriptsMessagesArgs>({
      query: (args: TranscriptsMessagesArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_TRANSCRIPTS_MESSAGES.path(args),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_TRANSCRIPTS_MESSAGES.service,
      }),
    }),
    getTranscriptsMessagesDetails: builder.query<
      TranscriptsMessagesDetailsResponse,
      TranscriptsMessagesDetailsArgs
    >({
      query: (args: TranscriptsMessagesDetailsArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_TRANSCRIPTS_MESSAGES_DETAILS.path(args),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_TRANSCRIPTS_MESSAGES_DETAILS.service,
      }),
    }),
    timeTracking: builder.mutation<TimeTrackingResponse, TimeTrackingRequest>({
      query: (args: TimeTrackingRequest) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.TIME_UPDATE.path(args.org),
        method: 'POST',
        service: NON_AI_ANALYTICS_ENDPOINTS.TIME_UPDATE.service,
        body: args,
      }),
    }),
getTranscriptsConversationHeadline: builder.query<
      TranscriptsConversationHeadlineResponse,
      TranscriptsConversationHeadlineArgs
    >({
      query: (args: TranscriptsConversationHeadlineArgs) => ({
        url: NON_AI_ANALYTICS_ENDPOINTS.GET_TRANSCRIPTS_CONVERSATION_HEADLINE.path(args),
        service: NON_AI_ANALYTICS_ENDPOINTS.GET_TRANSCRIPTS_CONVERSATION_HEADLINE.service,
      }),
    }),
  }),
});

export const {
  useGetOverviewSummaryQuery,
  useGetConversationQuery,
  useGetMostDiscussedTopicsQuery,
  useGetAverageMessagesPerSessionQuery,
  useGetRegisteredUsersTrendQuery,
  useGetUserMetricsQuery,
  useGetUserMetricsPieChartQuery,
  useGetUserCohortsOverTimeQuery,
  useGetTopStudentsByChatMessagesQuery,
  useGetTopicOverviewQuery,
  useGetTopicsSummaryQuery,
  useGetTopicStatisticsQuery,
  useGetTopicsStatsQuery,
  useGetUsersStatsQuery,
  useGetSessionStatsQuery,
  useGetTopicsDetailsStatsQuery,
  useGetAccessTimeHeatmapQuery,
  useGetUserDetailsStatsQuery,
  useGetAverageRatingQuery,
  useGetFinancialStatsQuery,
  useGetDetailedFinancialStatsQuery,
  useGetTranscriptsMessagesQuery,
  useGetTranscriptsMessagesDetailsQuery,
  useTimeTrackingMutation,
  useGetTranscriptsConversationHeadlineQuery,
} = analyticsApiSlice;
