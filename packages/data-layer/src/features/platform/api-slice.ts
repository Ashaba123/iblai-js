import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService, buildEndpointFromService, SERVICES } from '../utils';
import { CatalogService, AiAnalyticsService, OpenAPI } from '@iblai/iblai-api';
import { featureTags } from '../constants';
import { iblFakeBaseQuery } from '@data-layer/core';
import { PlatformUserPolicyUpdateRequest, PlatformUsersListResponse } from './types';

export interface InviteUserRequest {
  email: string;
  platform_key: string;
  redirect_to: string;
  source: string;
}

export interface InviteUserResponse {
  active: boolean;
  email: string;
  id: number;
  metadata: any;
  platform_key: string;
  redirect_to: string;
  source: string;
  username: string;
}

export interface InvitedUserRequest {
  platform_key: string;
  page: number;
}

export interface InvitedUserResponse {
  count: number;
  next_page?: number;
  previous_page?: number;
  results: {
    active: boolean;
    email: string;
    id: number;
    metadata: unknown;
    platform_key: string;
    redirect_to: string;
    source: string;
    username: string;
  }[];
}

export const platformApiSlice = createApi({
  reducerPath: 'platform-api',
  baseQuery: iblFakeBaseQuery,
  tagTypes: [featureTags.PLATFORM_USERS, 'platform_invitations'],
  endpoints: (builder) => ({
    usersGradesPassed: builder.query({
      ...buildEndpointFromDmService(
        AiAnalyticsService.platformOrgsCoursesUsersGradesPassedRetrieve,
      ),
    }),
    platformUsers: builder.query({
      ...buildEndpointFromService(
        SERVICES.DM,
        async (args: {
          platform_key: string;
          page?: number;
          platform_org?: string;
          page_size?: number;
          query?: string;
          return_policies?: string;
          sort?: string;
        }) => {
          // Convert all args to strings for URLSearchParams
          const stringArgs: Record<string, string> = {};
          for (const [key, value] of Object.entries(args)) {
            if (value !== undefined && value !== null) {
              stringArgs[key] = String(value);
            }
          }
          const queryParams = new URLSearchParams(stringArgs);
          const queryString = queryParams.toString();
          const url = `${OpenAPI.BASE}/api/core/platform/users/${queryString ? `?${queryString}` : ''}`;

          const response = await fetch(url, {
            method: 'GET',
            headers: OpenAPI.HEADERS as Record<string, string>,
          });

          if (!response.ok) {
            const error: any = new Error('Failed to fetch platform users');
            error.status = response.status;
            error.body = await response.text();
            throw error;
          }

          return response.json() as unknown as PlatformUsersListResponse;
        },
      ),
      providesTags: [featureTags.PLATFORM_USERS],
    }),
    updatePlatformUserRoleWithPolicies: builder.mutation({
      ...buildEndpointFromService(
        SERVICES.DM,
        async (args: { requestBody: PlatformUserPolicyUpdateRequest[] }) => {
          const url = `${OpenAPI.BASE}/api/core/platform/users/policies/`;

          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              ...(OpenAPI.HEADERS as Record<string, string>),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(args.requestBody),
          });

          if (!response.ok) {
            const error: any = new Error('Failed to update platform user role with policies');
            error.status = response.status;
            error.body = await response.text();
            throw error;
          }

          return response.json() as unknown as PlatformUsersListResponse;
        },
      ),
      invalidatesTags: [featureTags.PLATFORM_USERS],
    }),
    platformInvitations: builder.query({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsPlatformRetrieve),
      providesTags: ['platform_invitations'],
    }),
    inviteUser: builder.mutation({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsPlatformCreate),
      invalidatesTags: ['platform_invitations'],
    }),
  }),
});

export const platformApiReducer: typeof platformApiSlice.reducer = platformApiSlice.reducer;
export const {
  useUsersGradesPassedQuery,
  useLazyPlatformUsersQuery,
  usePlatformInvitationsQuery,
  usePlatformUsersQuery,
  useInviteUserMutation,
  useUpdatePlatformUserRoleWithPoliciesMutation,
} = platformApiSlice;
