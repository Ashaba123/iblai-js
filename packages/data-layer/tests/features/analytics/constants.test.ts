import { describe, it, expect } from 'vitest';
import {
  ANALYTICS_ENDPOINTS,
  ANALYTICS_QUERY_KEYS,
  ANALYTICS_REDUCER_PATH,
} from '../../../src/features/analytics/constants';
import { SERVICES } from '../../../src/constants';

describe('Analytics Constants', () => {
  describe('ANALYTICS_ENDPOINTS', () => {
    it('should have all required endpoints defined', () => {
      const requiredEndpoints = [
        'GET_OVERVIEW_SUMMARY',
        'GET_CONVERSATION',
        'GET_MOST_DISCUSSED_TOPICS',
        'GET_AVERAGE_MESSAGES_PER_SESSION',
        'GET_REGISTERED_USERS_TREND',
        'GET_USER_METRICS',
        'GET_USER_METRICS_PIE_CHART',
        'GET_USER_COHORTS_OVER_TIME',
        'GET_TOP_STUDENTS_BY_CHAT_MESSAGES',
        'GET_TOPIC_OVERVIEW',
        'GET_TOPICS_SUMMARY',
        'GET_TOPIC_STATISTICS',
      ];

      requiredEndpoints.forEach((endpoint) => {
        expect(ANALYTICS_ENDPOINTS).toHaveProperty(endpoint);
      });
    });

    it('should maintain the expected structure for endpoints', () => {
      const endpointKeys = Object.keys(ANALYTICS_ENDPOINTS);

      endpointKeys.forEach((key) => {
        const endpoint = ANALYTICS_ENDPOINTS[key as keyof typeof ANALYTICS_ENDPOINTS];

        // Each endpoint should have a service and path function
        expect(endpoint).toHaveProperty('service');
        expect(endpoint).toHaveProperty('path');
        expect(typeof endpoint.path).toBe('function');
        expect(typeof endpoint.path('test-org', 'test-user')).toBe('string');
        expect(endpoint.service).toBe(SERVICES.DM);
      });
    });

    it('should correctly format paths with parameters', () => {
      const testCases = [
        {
          endpoint: ANALYTICS_ENDPOINTS.GET_OVERVIEW_SUMMARY,
          expected: '/api/ai-analytics/orgs/test-org/users/test-user/overview-summary/',
        },
        {
          endpoint: ANALYTICS_ENDPOINTS.GET_CONVERSATION,
          expected: '/api/ai-analytics/orgs/test-org/users/test-user/conversation/',
        },
      ];

      testCases.forEach(({ endpoint, expected }) => {
        expect(endpoint.path('test-org', 'test-user')).toBe(expected);
      });
    });
  });

  describe('ANALYTICS_QUERY_KEYS', () => {
    it('should have the correct query key for each endpoint', () => {
      const expectedQueryKeys = {
        GET_OVERVIEW_SUMMARY: ['GET_OVERVIEW_SUMMARY'],
        GET_CONVERSATION: ['GET_CONVERSATION'],
        GET_MOST_DISCUSSED_TOPICS: ['GET_MOST_DISCUSSED_TOPICS'],
        GET_AVERAGE_MESSAGES_PER_SESSION: ['GET_AVERAGE_MESSAGES_PER_SESSION'],
        GET_REGISTERED_USERS_TREND: ['GET_REGISTERED_USERS_TREND'],
        GET_USER_METRICS: ['GET_USER_METRICS'],
        GET_USER_METRICS_PIE_CHART: ['GET_USER_METRICS_PIE_CHART'],
        GET_USER_COHORTS_OVER_TIME: ['GET_USER_COHORTS_OVER_TIME'],
        GET_TOP_STUDENTS_BY_CHAT_MESSAGES: ['GET_TOP_STUDENTS_BY_CHAT_MESSAGES'],
        GET_TOPIC_OVERVIEW: ['GET_TOPIC_OVERVIEW'],
        GET_TOPICS_SUMMARY: ['GET_TOPICS_SUMMARY'],
        GET_TOPIC_STATISTICS: ['GET_TOPIC_STATISTICS'],
      };

      Object.entries(expectedQueryKeys).forEach(([key, expected]) => {
        const queryKey = ANALYTICS_QUERY_KEYS[key as keyof typeof ANALYTICS_QUERY_KEYS]();
        expect(queryKey).toEqual(expected);
      });
    });

    it('should maintain the expected structure for query keys', () => {
      const queryKeyFunctions = Object.keys(ANALYTICS_QUERY_KEYS);

      queryKeyFunctions.forEach((key) => {
        const queryKeyFn = ANALYTICS_QUERY_KEYS[key as keyof typeof ANALYTICS_QUERY_KEYS];

        // Each query key function should return an array of strings
        expect(typeof queryKeyFn).toBe('function');

        const result = queryKeyFn();
        expect(Array.isArray(result)).toBe(true);
        result.forEach((item: string) => {
          expect(typeof item).toBe('string');
        });
      });
    });
  });

  describe('ANALYTICS_REDUCER_PATH', () => {
    it('should have the correct reducer path', () => {
      expect(ANALYTICS_REDUCER_PATH).toBe('analyticsApiSlice');
    });

    it('should be a string', () => {
      expect(typeof ANALYTICS_REDUCER_PATH).toBe('string');
    });
  });

  describe('Constants Relationships', () => {
    it('should have matching endpoint and query key definitions', () => {
      const endpointKeys = Object.keys(ANALYTICS_ENDPOINTS);
      const queryKeyFunctions = Object.keys(ANALYTICS_QUERY_KEYS);

      endpointKeys.forEach((key) => {
        expect(queryKeyFunctions).toContain(key);
      });
    });
  });
});
