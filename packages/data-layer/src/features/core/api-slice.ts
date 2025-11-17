import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService, buildEndpointFromService, SERVICES } from '../utils';
import { CoreService, OpenAPI } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';
import {
  CustomRbacGroupDetailsResponse,
  CustomRbacPolicyDetailsResponse,
  CustomRbacRoleDetailsResponse,
} from './types';

export const coreApiSlice = createApi({
  reducerPath: 'coreApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['PlatformInfo', 'PlatformUsers', 'RbacGroups', 'RbacPolicies', 'RbacRoles'],
  endpoints: (builder) => ({
    createRedirectToken: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreOrgsRedirectTokensCreate),
    }),
    getPlatformInfo: builder.query({
      ...buildEndpointFromDmService(CoreService.corePlatformRetrieve),
      providesTags: ['PlatformInfo'],
    }),
    updatePlatformInfo: builder.mutation({
      ...buildEndpointFromDmService(CoreService.corePlatformCreate),
      invalidatesTags: ['PlatformInfo'],
    }),
    updateUserStatus: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreUsersPlatformsCreate),
    }),
    getRbacPermissions: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacPermissionsCheckCreate),
    }),
    getStudentMentorCreationStatus: builder.query({
      ...buildEndpointFromDmService(CoreService.coreRbacStudentMentorCreationStatusRetrieve),
    }),
    setStudentMentorCreationStatus: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacStudentMentorCreationSetCreate),
    }),

    //RBAC GROUPS
    getRbacGroups: builder.query({
      ...buildEndpointFromDmService(CoreService.coreRbacGroupsList),
      providesTags: ['RbacGroups'],
    }),
    createRbacGroup: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacGroupsCreate),
      invalidatesTags: ['RbacGroups'],
    }),
    updateRbacGroup: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacGroupsUpdate),
      invalidatesTags: ['RbacGroups'],
    }),
    deleteRbacGroup: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacGroupsDestroy),
      invalidatesTags: ['RbacGroups'],
    }),
    getRbacGroupDetails: builder.query({
      ...buildEndpointFromService(
        SERVICES.DM,
        async (args: { id: number }): Promise<CustomRbacGroupDetailsResponse> => {
          const url = `${OpenAPI.BASE}/api/core/rbac/groups/${args.id}/`;

          const response = await fetch(url, {
            method: 'GET',
            headers: OpenAPI.HEADERS as Record<string, string>,
          });

          if (!response.ok) {
            const error: any = new Error('Failed to fetch RBAC group details');
            error.status = response.status;
            error.body = await response.text();
            throw error;
          }

          return response.json();
        },
      ),
      providesTags: ['RbacGroups'],
    }),

    //RBAC POLICIES
    getRbacPolicies: builder.query({
      ...buildEndpointFromDmService(CoreService.coreRbacPoliciesList),
      providesTags: ['RbacPolicies'],
    }),
    createRbacPolicy: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacPoliciesCreate),
      invalidatesTags: ['RbacPolicies'],
    }),
    updateRbacPolicy: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacPoliciesUpdate),
      invalidatesTags: ['RbacPolicies'],
    }),
    deleteRbacPolicy: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacPoliciesDestroy),
      invalidatesTags: ['RbacPolicies'],
    }),
    getRbacPolicyDetails: builder.query({
      ...buildEndpointFromService(
        SERVICES.DM,
        async (args: {
          platform_key: string;
          id: number;
        }): Promise<CustomRbacPolicyDetailsResponse> => {
          const queryParams = new URLSearchParams({ platform_key: args.platform_key });
          const queryString = queryParams.toString();
          const url = `${OpenAPI.BASE}/api/core/rbac/policies/${args.id}/?${queryString}`;

          const response = await fetch(url, {
            method: 'GET',
            headers: OpenAPI.HEADERS as Record<string, string>,
          });

          if (!response.ok) {
            const error: any = new Error('Failed to fetch RBAC policy details');
            error.status = response.status;
            error.body = await response.text();
            throw error;
          }

          return response.json();
        },
      ),
      providesTags: ['RbacPolicies'],
    }),
    //RBAC ROLES
    getRbacRoles: builder.query({
      ...buildEndpointFromDmService(CoreService.coreRbacRolesList),
      providesTags: ['RbacRoles'],
    }),
    createRbacRole: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacRolesCreate),
      invalidatesTags: ['RbacRoles'],
    }),
    updateRbacRole: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacRolesUpdate),
      invalidatesTags: ['RbacRoles'],
    }),
    partialUpdateRbacRole: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacRolesPartialUpdate),
      invalidatesTags: ['RbacRoles'],
    }),
    deleteRbacRole: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacRolesDestroy),
      invalidatesTags: ['RbacRoles'],
    }),
    getRbacRoleDetails: builder.query({
      ...buildEndpointFromService(
        SERVICES.DM,
        async (args: {
          platform_key: string;
          id: number;
        }): Promise<CustomRbacRoleDetailsResponse> => {
          const queryParams = new URLSearchParams({ platform_key: args.platform_key });
          const queryString = queryParams.toString();
          const url = `${OpenAPI.BASE}/api/core/rbac/roles/${args.id}/?${queryString}`;

          const response = await fetch(url, {
            method: 'GET',
            headers: OpenAPI.HEADERS as Record<string, string>,
          });

          if (!response.ok) {
            const error: any = new Error('Failed to fetch RBAC role details');
            error.status = response.status;
            error.body = await response.text();
            throw error;
          }

          return response.json();
        },
      ),
      providesTags: ['RbacRoles'],
    }),
    getRbacMentorAccessList: builder.query({
      ...buildEndpointFromDmService(CoreService.coreRbacMentorAccessList),
    }),
    updateRbacMentorAccess: builder.mutation({
      ...buildEndpointFromDmService(CoreService.coreRbacMentorAccessCreate),
    }),
  }),
});

export const {
  useCreateRedirectTokenMutation,
  useGetPlatformInfoQuery,
  useGetRbacPermissionsMutation,
  useLazyGetPlatformInfoQuery,
  useUpdatePlatformInfoMutation,
  useUpdateUserStatusMutation,
  useGetStudentMentorCreationStatusQuery,
  useSetStudentMentorCreationStatusMutation,
  useGetRbacGroupsQuery,
  useCreateRbacGroupMutation,
  useUpdateRbacGroupMutation,
  useDeleteRbacGroupMutation,
  useGetRbacGroupDetailsQuery,
  useGetRbacPoliciesQuery,
  useCreateRbacPolicyMutation,
  useUpdateRbacPolicyMutation,
  useDeleteRbacPolicyMutation,
  useGetRbacPolicyDetailsQuery,
  useGetRbacRolesQuery,
  useCreateRbacRoleMutation,
  useUpdateRbacRoleMutation,
  usePartialUpdateRbacRoleMutation,
  useDeleteRbacRoleMutation,
  useGetRbacRoleDetailsQuery,
  useGetRbacMentorAccessListQuery,
  useUpdateRbacMentorAccessMutation,
} = coreApiSlice;
