// If you prefer to avoid the TextEncoder/TextDecoder issue entirely,
// here's an alternative approach that doesn't require MSW

import { configureStore } from '@reduxjs/toolkit';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import {
  userApiSlice,
  useGetUserMetadataQuery,
  useLazyGetUserMetadataQuery,
} from '../../../src/features/user/api-slice';
import { USERS_ENDPOINTS, USERS_REDUCER_PATH } from '../../../src/features/user/constants';
import { UserProfile } from '../../../src/features/user/types';
import { SERVICES } from '../../../src/constants';

// Mock the iblFetchBaseQuery
vi.mock('../../../src/features/utils', () => ({
  iblFetchBaseQuery: vi.fn().mockImplementation(async ({ url, params, service }) => {
    // Check if the request matches what we expect
    if (
      url === USERS_ENDPOINTS.GET_USER_METADATA.path() &&
      service === USERS_ENDPOINTS.GET_USER_METADATA.service
    ) {
      if (params?.username === 'johndoe') {
        // Return mock data for successful request
        return {
          data: mockUserProfile,
        };
      } else if (params?.username === 'error-user') {
        // Return error for specific test case
        return {
          error: {
            status: 500,
            data: { message: 'Server error' },
          },
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
const mockUserProfile: UserProfile = {
  id: 123,
  name: 'John Doe',
  email: 'john.doe@example.com',
  username: 'johndoe',
  account_privacy: 'public',
  about: 'Software Developer',
  title: 'Senior Developer',
  public_metadata: {
    about: 'Software Developer',
    bio: 'Passionate about coding',
    language: 'English',
    name: 'John Doe',
    profile_image: {
      has_image: true,
      image_url_full: 'https://example.com/image_full.jpg',
      image_url_large: 'https://example.com/image_large.jpg',
      image_url_medium: 'https://example.com/image_medium.jpg',
      image_url_small: 'https://example.com/image_small.jpg',
    },
  },
  profile_image: {
    has_image: true,
    image_url_full: 'https://example.com/image_full.jpg',
    image_url_large: 'https://example.com/image_large.jpg',
    image_url_medium: 'https://example.com/image_medium.jpg',
    image_url_small: 'https://example.com/image_small.jpg',
  },
  bio: 'Test bio',
  enable_sidebar_ai_mentor_display: false,
  enable_skills_leaderboard_display: true,
  course_certificates: null,
  country: 'US',
  date_joined: '2023-01-01T00:00:00Z',
  language_proficiencies: ['English'],
  level_of_education: 'bachelor',
  social_links: [],
  time_zone: 'UTC',
  accomplishments_shared: false,
  verified_name: null,
  extended_profile: [],
  gender: null,
  state: null,
  goals: null,
  is_active: true,
  last_login: '2023-05-01T00:00:00Z',
  mailing_address: null,
  requires_parental_consent: false,
  secondary_email: null,
  secondary_email_enabled: null,
  year_of_birth: 1990,
  phone_number: null,
  activation_key: null,
  pending_name_change: null,
};

describe('User API Slice', () => {
  let store: ReturnType<typeof configureTestStore>;

  // Helper function to create a test store
  function configureTestStore() {
    return configureStore({
      reducer: {
        [USERS_REDUCER_PATH]: userApiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApiSlice.middleware),
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

  describe('getUserMetadata', () => {
    it('should return user metadata when successful', async () => {
      // Render the hook with the query
      const { result } = renderHook(
        () => useGetUserMetadataQuery({ params: { username: 'johndoe' } }),
        { wrapper },
      );

      // Initial state should be loading
      expect(result.current.isLoading).toBeTruthy();

      // Wait for the request to complete
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      // Check if data was received correctly
      expect(result.current.data).toEqual(mockUserProfile);
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.error).toBeUndefined();
    });

    it('should handle error responses', async () => {
      // Render the hook with a username that will trigger an error
      const { result } = renderHook(
        () => useGetUserMetadataQuery({ params: { username: 'error-user' } }),
        { wrapper },
      );

      // Wait for the request to complete
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      // Check if error was handled correctly
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
    });

    it('should pass the correct parameters to the query', async () => {
      // Get a reference to our mocked fetch function
      const { iblFetchBaseQuery } = await import('../../../src/features/utils');
      const mockedFetchBaseQuery = vi.mocked(iblFetchBaseQuery);

      // Render the hook with the query
      renderHook(() => useGetUserMetadataQuery({ params: { username: 'johndoe' } }), { wrapper });

      // Wait for the query to complete
      await waitFor(() => expect(mockedFetchBaseQuery).toHaveBeenCalled());

      // Check if the parameters were passed correctly
      // We need to check the first argument only, as RTK Query passes additional metadata
      expect(mockedFetchBaseQuery.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          url: USERS_ENDPOINTS.GET_USER_METADATA.path(),
          service: SERVICES.LMS,
          params: { username: 'johndoe' },
        }),
      );
    });
  });

  describe('API Slice Configuration', () => {
    it('should have the correct reducer path', () => {
      expect(userApiSlice.reducerPath).toBe(USERS_REDUCER_PATH);
    });

    it('should export the correct hooks', () => {
      // Check if hooks are exported and are functions
      expect(typeof useGetUserMetadataQuery).toBe('function');
      expect(typeof useLazyGetUserMetadataQuery).toBe('function');
    });
  });
});
