import { describe, it, expect } from 'vitest';
import {
  USERS_ENDPOINTS,
  USERS_QUERY_KEYS,
  USERS_REDUCER_PATH,
} from '../../../src/features/user/constants';
import { SERVICES } from '../../../src/constants';

describe('User Constants', () => {
  describe('USERS_ENDPOINTS', () => {
    it('should have the correct GET_USER_METADATA endpoint configuration', () => {
      const endpoint = USERS_ENDPOINTS.GET_USER_METADATA;

      // Check service
      expect(endpoint.service).toBe(SERVICES.LMS);

      // Check path function
      expect(typeof endpoint.path).toBe('function');
      expect(endpoint.path()).toBe('/api/ibl/users/manage/metadata/');
    });

    it('should maintain the expected structure for endpoints', () => {
      // Ensure we're testing all endpoints
      const endpointKeys = Object.keys(USERS_ENDPOINTS);

      endpointKeys.forEach((key) => {
        const endpoint = USERS_ENDPOINTS[key as keyof typeof USERS_ENDPOINTS];

        // Each endpoint should have a service and path function
        expect(endpoint).toHaveProperty('service');
        expect(endpoint).toHaveProperty('path');
        expect(typeof endpoint.path).toBe('function');
        expect(typeof endpoint.path('username')).toBe('string');
      });
    });
  });

  describe('USERS_QUERY_KEYS', () => {
    it('should have the correct GET_USER_METADATA query key', () => {
      const queryKey = USERS_QUERY_KEYS.GET_USER_METADATA();

      expect(Array.isArray(queryKey)).toBe(true);
      expect(queryKey).toEqual(['USER_METADATA']);
    });

    it('should maintain the expected structure for query keys', () => {
      // Ensure we're testing all query keys
      const queryKeyFunctions = Object.keys(USERS_QUERY_KEYS);

      queryKeyFunctions.forEach((key) => {
        const queryKeyFn = USERS_QUERY_KEYS[key as keyof typeof USERS_QUERY_KEYS];

        // Each query key function should return an array of strings
        expect(typeof queryKeyFn).toBe('function');

        const result = queryKeyFn();
        expect(Array.isArray(result)).toBe(true);
        result.forEach((item: any) => {
          expect(typeof item).toBe('string');
        });
      });
    });
  });

  describe('USERS_REDUCER_PATH', () => {
    it('should have the correct reducer path', () => {
      expect(USERS_REDUCER_PATH).toBe('userApiSlice');
    });

    it('should be a string', () => {
      expect(typeof USERS_REDUCER_PATH).toBe('string');
    });
  });

  describe('Constants Relationships', () => {
    it('should have matching endpoint and query key definitions', () => {
      // For each endpoint, there should be a corresponding query key
      // This test helps ensure that when new endpoints are added, query keys are also added
      const endpointKeys = Object.keys(USERS_ENDPOINTS);
      const queryKeyFunctions = Object.keys(USERS_QUERY_KEYS);

      endpointKeys.forEach((key) => {
        expect(queryKeyFunctions).toContain(key);
      });
    });
  });
});
