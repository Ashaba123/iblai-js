import { SERVICES } from '../../constants';
import {
  DetailedFinancialStatsArgs,
  FinancialStatsArgs,
  TranscriptsConversationHeadlineArgs,
  TranscriptsMessagesArgs,
  TranscriptsMessagesDetailsArgs,
} from './types';

export const ANALYTICS_ENDPOINTS = {
  // Overview endpoints
  GET_OVERVIEW_SUMMARY: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/overview-summary/`,
  },
  GET_CONVERSATION: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/conversation/`,
  },
  GET_MOST_DISCUSSED_TOPICS: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/most-discussed-topics/`,
  },
  GET_AVERAGE_MESSAGES_PER_SESSION: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/average-messages-per-session/`,
  },
  GET_REGISTERED_USERS_TREND: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/registered-users-trend/`,
  },

  // Users endpoints
  GET_USER_METRICS: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/user-metrics/`,
  },
  GET_USER_METRICS_PIE_CHART: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/user-metrics-pie-chart/`,
  },
  GET_USER_COHORTS_OVER_TIME: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/user-cohorts-over-time/`,
  },
  GET_TOP_STUDENTS_BY_CHAT_MESSAGES: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/top-students-by-chat-messages/`,
  },

  // Topics endpoints
  GET_TOPIC_OVERVIEW: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/topic-overview/`,
  },
  GET_TOPICS_SUMMARY: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/topics/summary/`,
  },
  GET_TOPIC_STATISTICS: {
    service: SERVICES.DM,
    path: (org: string, userId: string): string =>
      `/api/ai-analytics/orgs/${org}/users/${userId}/topic-statistics/`,
  },
};

export const NON_AI_ANALYTICS_ENDPOINTS = {
  GET_TOPICS_STATS: {
    service: SERVICES.DM,
    path: (date_filter: string, platform_key: string, mentor_unique_id?: string): string =>
      `/api/analytics/topics/?date_filter=${date_filter}&platform_key=${platform_key}${mentor_unique_id ? `&mentor_unique_id=${mentor_unique_id}` : ''}`,
  },
  GET_USERS_STATS: {
    service: SERVICES.DM,
    path: (
      date_filter: string,
      platform_key: string,
      mentor_unique_id?: string,
      metric?: string,
      start_date?: string,
      end_date?: string,
    ): string =>
      `/api/analytics/users/?${metric ? `metric=${metric}&` : ''}date_filter=${date_filter}&platform_key=${platform_key}${mentor_unique_id ? `&mentor_unique_id=${mentor_unique_id}` : ''}${start_date ? `&start_date=${start_date}` : ''}${end_date ? `&end_date=${end_date}` : ''}`,
  },
  GET_SESSION_STATS: {
    service: SERVICES.DM,
    path: (
      platform_key: string,
      mentor_unique_id?: string,
      date_filter?: string,
      start_date?: string,
      end_date?: string,
      metric?: string,
    ): string =>
      `/api/analytics/sessions/?${date_filter ? `date_filter=${date_filter}&` : ''}${platform_key ? `platform_key=${platform_key}&` : ''}${mentor_unique_id ? `mentor_unique_id=${mentor_unique_id}&` : ''}${start_date ? `start_date=${start_date}&` : ''}${end_date ? `end_date=${end_date}&` : ''}${metric ? `metric=${metric}` : ''}`,
  },
  GET_TOPICS_DETAILS_STATS: {
    service: SERVICES.DM,
    path: (
      date_filter: string,
      platform_key: string,
      mentor_unique_id?: string,
      start_date?: string,
      end_date?: string,
    ): string =>
      `/api/analytics/topics/details/?date_filter=${date_filter}&platform_key=${platform_key}${mentor_unique_id ? `&mentor_unique_id=${mentor_unique_id}` : ''}${start_date ? `&start_date=${start_date}` : ''}${end_date ? `&end_date=${end_date}` : ''}`,
  },
  GET_ACCESS_TIME_HEATMAP: {
    service: SERVICES.DM,
    path: (
      date_filter: string,
      platform_key: string,
      mentor_unique_id?: string,
      start_date?: string,
      end_date?: string,
    ): string =>
      `/api/analytics/time/?date_filter=${date_filter}&platform_key=${platform_key}${mentor_unique_id ? `&mentor_unique_id=${mentor_unique_id}` : ''}${start_date ? `&start_date=${start_date}` : ''}${end_date ? `&end_date=${end_date}` : ''}`,
  },
  GET_USER_DETAILS_STATS: {
    service: SERVICES.DM,
    path: (
      date_filter: string,
      platform_key: string,
      mentor_unique_id?: string,
      start_date?: string,
      end_date?: string,
      page: number = 1,
      limit: number = 5,
      search?: string,
    ): string =>
      `/api/analytics/users/details/?date_filter=${date_filter}&platform_key=${platform_key}${mentor_unique_id ? `&mentor_unique_id=${mentor_unique_id}` : ''}${start_date ? `&start_date=${start_date}` : ''}${end_date ? `&end_date=${end_date}` : ''}${page ? `&page=${page}` : ''}${limit ? `&limit=${limit}` : ''}${search ? `&search=${search}` : ''}`,
  },
  GET_AVERAGE_RATING: {
    service: SERVICES.DM,
    path: (
      platform_key: string,
      mentor_unique_id?: string,
      date_filter?: string,
      start_date?: string,
      end_date?: string,
    ): string =>
      `/api/analytics/ratings/?${date_filter ? `date_filter=${date_filter}&` : ''}platform_key=${platform_key}${mentor_unique_id ? `&mentor_unique_id=${mentor_unique_id}` : ''}${start_date ? `&start_date=${start_date}` : ''}${end_date ? `&end_date=${end_date}` : ''}`,
  },
  GET_FINANCIAL_STATS: {
    service: SERVICES.DM,
    path: (args: FinancialStatsArgs): string =>
      `/api/analytics/financial/?metric=${args.metric}&${args.all_time ? `all_time=${args.all_time}&` : ''}${args.date_filter ? `date_filter=${args.date_filter}&` : ''}platform_key=${args.platform_key}${args.mentor_unique_id ? `&mentor_unique_id=${args.mentor_unique_id}` : ''}${args.start_date ? `&start_date=${args.start_date}` : ''}${args.end_date ? `&end_date=${args.end_date}` : ''}`,
  },
  GET_DETAILED_FINANCIAL_STATS: {
    service: SERVICES.DM,
    path: (args: DetailedFinancialStatsArgs): string =>
      `/api/analytics/financial/details/?${args.metric ? `metric=${args.metric}&` : ''}${args.metrics ? `metrics=${args.metrics}&` : ''}group_by=${args.group_by}&date_filter=${args.date_filter}&platform_key=${args.platform_key}${args.mentor_unique_id ? `&mentor_unique_id=${args.mentor_unique_id}` : ''}${args.start_date ? `&start_date=${args.start_date}` : ''}${args.end_date ? `&end_date=${args.end_date}` : ''}${args.page ? `&page=${args.page}` : ''}${args.limit ? `&limit=${args.limit}` : ''}${args.search ? `&search=${args.search}` : ''}`,
  },
  GET_TRANSCRIPTS_MESSAGES: {
    service: SERVICES.DM,
    path: (args: TranscriptsMessagesArgs): string =>
      `/api/analytics/messages/?platform_key=${args.platform_key}${args.mentor_unique_id ? `&mentor_unique_id=${args.mentor_unique_id}` : ''}${args.search ? `&search=${args.search}` : ''}${args.topic ? `&topic=${args.topic}` : ''}${args.page ? `&page=${args.page}` : ''}${args.limit ? `&limit=${args.limit}` : ''}`,
  },
  GET_TRANSCRIPTS_MESSAGES_DETAILS: {
    service: SERVICES.DM,
    path: (args: TranscriptsMessagesDetailsArgs): string =>
      `/api/analytics/messages/details/?session_id=${args.session_id}&platform_key=${args.platform_key}${args.mentor_unique_id ? `&mentor_unique_id=${args.mentor_unique_id}` : ''}`,
  },
  TIME_UPDATE: {
    service: SERVICES.DM,
    path: (org: string): string => `/api/analytics/orgs/${org}/time/update/`,
  },
  GET_TRANSCRIPTS_CONVERSATION_HEADLINE: {
    service: SERVICES.DM,
    path: (args: TranscriptsConversationHeadlineArgs): string =>
      `/api/analytics/conversations?platform_key=${args.platform_key}${args.mentor_unique_id ? `&mentor_unique_id=${args.mentor_unique_id}` : ''}&metric=${args.metric}${args.date_filter ? `&date_filter=${args.date_filter}` : ''}${args.start_date ? `&start_date=${args.start_date}` : ''}${args.end_date ? `&end_date=${args.end_date}` : ''}`,
  },
};

export const ANALYTICS_QUERY_KEYS = {
  GET_OVERVIEW_SUMMARY: (): string[] => ['GET_OVERVIEW_SUMMARY'],
  GET_CONVERSATION: (): string[] => ['GET_CONVERSATION'],
  GET_MOST_DISCUSSED_TOPICS: (): string[] => ['GET_MOST_DISCUSSED_TOPICS'],
  GET_AVERAGE_MESSAGES_PER_SESSION: (): string[] => ['GET_AVERAGE_MESSAGES_PER_SESSION'],
  GET_REGISTERED_USERS_TREND: (): string[] => ['GET_REGISTERED_USERS_TREND'],
  GET_USER_METRICS: (): string[] => ['GET_USER_METRICS'],
  GET_USER_METRICS_PIE_CHART: (): string[] => ['GET_USER_METRICS_PIE_CHART'],
  GET_USER_COHORTS_OVER_TIME: (): string[] => ['GET_USER_COHORTS_OVER_TIME'],
  GET_TOP_STUDENTS_BY_CHAT_MESSAGES: (): string[] => ['GET_TOP_STUDENTS_BY_CHAT_MESSAGES'],
  GET_TOPIC_OVERVIEW: (): string[] => ['GET_TOPIC_OVERVIEW'],
  GET_TOPICS_SUMMARY: (): string[] => ['GET_TOPICS_SUMMARY'],
  GET_TOPIC_STATISTICS: (): string[] => ['GET_TOPIC_STATISTICS'],
};

export const ANALYTICS_REDUCER_PATH = 'analyticsApiSlice';
