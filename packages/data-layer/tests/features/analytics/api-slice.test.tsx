import { configureStore } from '@reduxjs/toolkit';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { analyticsApiSlice } from '../../../src/features/analytics/api-slice';
import {
  ANALYTICS_ENDPOINTS,
  ANALYTICS_REDUCER_PATH,
} from '../../../src/features/analytics/constants';
import { SERVICES } from '../../../src/constants';

// Mock the iblFetchBaseQuery
vi.mock('../../../src/features/utils', () => ({
  iblFetchBaseQuery: vi.fn().mockImplementation(async ({ url, service }) => {
    // Check if the request matches what we expect
    if (service === SERVICES.DM) {
      // Return mock data based on the endpoint
      if (url.includes('/overview-summary/')) {
        return {
          data: mockOverviewSummary,
        };
      } else if (url.includes('/conversation/')) {
        return {
          data: mockConversation,
        };
      } else if (url.includes('/most-discussed-topics/')) {
        return {
          data: mockMostDiscussedTopics,
        };
      } else if (url.includes('/average-messages-per-session/')) {
        return {
          data: mockAverageMessagesPerSession,
        };
      } else if (url.includes('/user-metrics/')) {
        return {
          data: mockUserMetrics,
        };
      } else if (url.includes('/user-metrics-pie-chart/')) {
        return {
          data: mockUserMetricsPieChart,
        };
      } else if (url.includes('/user-cohorts-over-time/')) {
        return {
          data: mockUserCohortsOverTime,
        };
      } else if (url.includes('/top-students-by-chat-messages/')) {
        return {
          data: mockTopStudents,
        };
      } else if (url.includes('/topic-overview/')) {
        return {
          data: mockTopicOverview,
        };
      } else if (url.includes('/topics/summary/')) {
        return {
          data: mockTopicsSummary,
        };
      } else if (url.includes('/topic-statistics/')) {
        return {
          data: mockTopicStatistics,
        };
      }
    }

    // Default error case
    return {
      error: {
        status: 404,
        data: { message: 'Not found' },
      },
    };
  }),
}));

// Mock sample data
const mockOverviewSummary = {
  conversation_volume: { total: 100, change: 10 },
  users: { total: 50, change: 5 },
  topics: { total: 20, change: 2 },
  user_rating: { total: 4.5, change: 0.5 },
};

const mockConversation = [
  { date: '2025-02-15 00:00:00', conversation_count: 5 },
  { date: '2025-02-16 00:00:00', conversation_count: 8 },
];

const mockMostDiscussedTopics = [
  { name: 'Topic 1', conversation_count: 10 },
  { name: 'Topic 2', conversation_count: 8 },
];

const mockAverageMessagesPerSession = [
  { time: '2025-02-15 00:00:00', avg_messages: 5, total_sessions: 10 },
  { time: '2025-02-16 00:00:00', avg_messages: 6, total_sessions: 12 },
];

const mockUserMetrics = {
  registered_users: { total: 1000, change_percentage: 10 },
  new_users: { total: 100, change_percentage: 5 },
  unique_users: { total: 800, change_percentage: 8 },
  veteran_users: { total: 200, change_percentage: 15 },
};

const mockUserMetricsPieChart = {
  new_users: { count: 100, percentage: 20 },
  returning_users: { count: 400, percentage: 80 },
};

const mockUserCohortsOverTime = {
  periods: ['2025-02-15 00:00:00', '2025-02-16 00:00:00'],
  new_users: [50, 60],
  veteran_users: [20, 25],
};

const mockTopStudents = [
  { username: 'user1', chat_message_count: 100 },
  { username: 'user2', chat_message_count: 80 },
];

const mockTopicOverview = {
  total_topics: 50,
  total_topics_change_percentage: 10,
  new_topics: 5,
  new_topics_change_percentage: 20,
};

const mockTopicsSummary = [
  { name: 'Topic 1', conversation_count: 15 },
  { name: 'Topic 2', conversation_count: 12 },
];

const mockTopicStatistics = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      name: 'Topic 1',
      conversations: 10,
      messages: 100,
      avg_rating: 'positive',
    },
    { name: 'Topic 2', conversations: 8, messages: 80, avg_rating: 'neutral' },
  ],
};

describe('Analytics API Slice', () => {
  let store: ReturnType<typeof configureTestStore>;

  // Helper function to create a test store
  function configureTestStore() {
    return configureStore({
      reducer: {
        [ANALYTICS_REDUCER_PATH]: analyticsApiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(analyticsApiSlice.middleware),
    });
  }

  // Wrapper component for testing hooks
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  beforeEach(() => {
    store = configureTestStore();
    vi.clearAllMocks(); // Clear mock calls between tests
  });

  describe('getOverviewSummary', () => {
    it('should return overview summary data when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetOverviewSummaryQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockOverviewSummary);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });

    it('should pass the correct parameters to the query', async () => {
      const { iblFetchBaseQuery } = await import('../../../src/features/utils');
      const mockedFetchBaseQuery = vi.mocked(iblFetchBaseQuery);

      renderHook(
        () =>
          analyticsApiSlice.useGetOverviewSummaryQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      await waitFor(() => expect(mockedFetchBaseQuery).toHaveBeenCalled());

      expect(mockedFetchBaseQuery.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          url: ANALYTICS_ENDPOINTS.GET_OVERVIEW_SUMMARY.path('test-org', 'test-user'),
          service: SERVICES.DM,
          params: {
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentor_id: 'test-mentor',
          },
        }),
      );
    });
  });

  describe('getConversation', () => {
    it('should return conversation data when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetConversationQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockConversation);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('getMostDiscussedTopics', () => {
    it('should return most discussed topics when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetMostDiscussedTopicsQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockMostDiscussedTopics);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('getAverageMessagesPerSession', () => {
    it('should return average messages per session when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetAverageMessagesPerSessionQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockAverageMessagesPerSession);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('getUserMetrics', () => {
    it('should return user metrics when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetUserMetricsQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockUserMetrics);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('getUserMetricsPieChart', () => {
    it('should return user metrics pie chart data when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetUserMetricsPieChartQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockUserMetricsPieChart);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('getUserCohortsOverTime', () => {
    it('should return user cohorts over time when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetUserCohortsOverTimeQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockUserCohortsOverTime);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('getTopStudentsByChatMessages', () => {
    it('should return top students by chat messages when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetTopStudentsByChatMessagesQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockTopStudents);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('getTopicOverview', () => {
    it('should return topic overview when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetTopicOverviewQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockTopicOverview);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('getTopicsSummary', () => {
    it('should return topics summary with pagination when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetTopicsSummaryQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            page: 1,
            pageSize: 10,
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockTopicsSummary);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('getTopicStatistics', () => {
    it('should return topic statistics with pagination when successful', async () => {
      const { result } = renderHook(
        () =>
          analyticsApiSlice.useGetTopicStatisticsQuery({
            org: 'test-org',
            userId: 'test-user',
            startDate: '2025-02-15',
            endDate: '2025-02-16',
            page: 1,
            pageSize: 10,
            aggregation: 'daily',
            mentorId: 'test-mentor',
          }),
        { wrapper },
      );

      expect(result.current.isLoading).toBeTruthy();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.data).toEqual(mockTopicStatistics);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('API Slice Configuration', () => {
    it('should have the correct reducer path', () => {
      expect(analyticsApiSlice.reducerPath).toBe(ANALYTICS_REDUCER_PATH);
    });

    it('should export the correct hooks', () => {
      expect(typeof analyticsApiSlice.useGetOverviewSummaryQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetConversationQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetMostDiscussedTopicsQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetAverageMessagesPerSessionQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetUserMetricsQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetUserMetricsPieChartQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetUserCohortsOverTimeQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetTopStudentsByChatMessagesQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetTopicOverviewQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetTopicsSummaryQuery).toBe('function');
      expect(typeof analyticsApiSlice.useGetTopicStatisticsQuery).toBe('function');
    });
  });
});
