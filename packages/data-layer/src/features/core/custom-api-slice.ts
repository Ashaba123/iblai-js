import { createApi } from '@reduxjs/toolkit/query/react';
import { iblFetchBaseQuery } from '@data-layer/features/utils';
import {
  CORE_CUSTOM_ENDPOINTS,
  CORE_CUSTOM_REDUCER_PATH,
  PLATFORM_MEMBERSHIP_TAG,
} from './constants';
import {
  PlatformImageAsset,
  PlatformImageAssetPostRequest,
  PlatformImageAssetUpdateRequest,
  PlatformMembershipConfigPostRequest,
  PlatformMembershipConfigResponse,
} from './types';

export const coreCustomApiSlice = createApi({
  reducerPath: CORE_CUSTOM_REDUCER_PATH,

  baseQuery: iblFetchBaseQuery,
  tagTypes: [PLATFORM_MEMBERSHIP_TAG, 'PlatformImageAssetFileUrl'],

  endpoints: (builder) => ({
    getPlatformMembership: builder.query<
      PlatformMembershipConfigResponse,
      { platform_key: string }
    >({
      query: ({ platform_key }) => ({
        url: CORE_CUSTOM_ENDPOINTS.GET_PLATFORM_MEMBERSHIP.path,
        service: CORE_CUSTOM_ENDPOINTS.GET_PLATFORM_MEMBERSHIP.service,
        method: 'GET',
        params: {
          platform_key,
        },
      }),
      providesTags: [PLATFORM_MEMBERSHIP_TAG],
    }),
    updatePlatformMembership: builder.mutation<
      PlatformMembershipConfigResponse,
      PlatformMembershipConfigPostRequest
    >({
      query: (args) => ({
        url: CORE_CUSTOM_ENDPOINTS.UPDATE_PLATFORM_MEMBERSHIP.path,
        service: CORE_CUSTOM_ENDPOINTS.UPDATE_PLATFORM_MEMBERSHIP.service,
        method: 'POST',
        body: JSON.stringify(args),
      }),
      invalidatesTags: [PLATFORM_MEMBERSHIP_TAG],
    }),
    joinTenant: builder.mutation<unknown, { platform_key: string }>({
      query: (data) => ({
        url: CORE_CUSTOM_ENDPOINTS.JOIN_PLATFORM.path,
        service: CORE_CUSTOM_ENDPOINTS.JOIN_PLATFORM.service,
        method: 'POST',
        body: data,
      }),
    }),
    getPlatformImageAssetsList: builder.query<PlatformImageAsset[], { platform_key: string }>({
      query: ({ platform_key }) => ({
        url: CORE_CUSTOM_ENDPOINTS.GET_PLATFORM_IMAGE_ASSETS_LIST.path(platform_key),
        service: CORE_CUSTOM_ENDPOINTS.GET_PLATFORM_IMAGE_ASSETS_LIST.service,
        method: 'GET',
      }),
    }),
    createPlatformImageAsset: builder.mutation<PlatformImageAsset, PlatformImageAssetPostRequest>({
      query: (args) => ({
        url: CORE_CUSTOM_ENDPOINTS.CREATE_PLATFORM_IMAGE_ASSET.path(args.platform_key),
        service: CORE_CUSTOM_ENDPOINTS.CREATE_PLATFORM_IMAGE_ASSET.service,
        method: 'POST',
        body: args.request,
        isJson: false,
      }),
    }),
    getPlatformImageAssetDetails: builder.query<
      PlatformImageAsset,
      { platform_key: string; asset_id: number }
    >({
      query: ({ platform_key, asset_id }) => ({
        url: CORE_CUSTOM_ENDPOINTS.GET_PLATFORM_IMAGE_ASSET_DETAILS.path(platform_key, asset_id),
        service: CORE_CUSTOM_ENDPOINTS.GET_PLATFORM_IMAGE_ASSET_DETAILS.service,
        method: 'GET',
      }),
    }),
    updatePlatformImageAsset: builder.mutation<PlatformImageAsset, PlatformImageAssetUpdateRequest>(
      {
        query: (args) => ({
          url: CORE_CUSTOM_ENDPOINTS.UPDATE_PLATFORM_IMAGE_ASSET.path(
            args.platform_key,
            args.asset_id,
          ),
          service: CORE_CUSTOM_ENDPOINTS.UPDATE_PLATFORM_IMAGE_ASSET.service,
          method: 'PATCH',
          body: args.request,
          isJson: false,
        }),
      },
    ),
    deletePlatformImageAsset: builder.mutation<unknown, { platform_key: string; asset_id: number }>(
      {
        query: ({ platform_key, asset_id }) => ({
          url: CORE_CUSTOM_ENDPOINTS.DELETE_PLATFORM_IMAGE_ASSET.path(platform_key, asset_id),
          service: CORE_CUSTOM_ENDPOINTS.DELETE_PLATFORM_IMAGE_ASSET.service,
          method: 'DELETE',
        }),
      },
    ),
  }),
});

export const {
  useGetPlatformMembershipQuery,
  useUpdatePlatformMembershipMutation,
  useLazyGetPlatformMembershipQuery,
  useJoinTenantMutation,
  useGetPlatformImageAssetsListQuery,
  useCreatePlatformImageAssetMutation,
  useGetPlatformImageAssetDetailsQuery,
  useUpdatePlatformImageAssetMutation,
  useDeletePlatformImageAssetMutation,
} = coreCustomApiSlice;
