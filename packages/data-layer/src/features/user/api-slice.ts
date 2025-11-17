import { createApi } from '@reduxjs/toolkit/query/react';

import { USERS_ENDPOINTS, USERS_QUERY_KEYS, USERS_REDUCER_PATH } from './constants';
import { iblFetchBaseQuery } from '../utils';
import type {
  UserProfile,
  GetUserMetadataArgs,
  UpdateUserRoleRequest,
  UpdateUserAccountRequest,
  UploadProfileImageResponse,
  RemoveProfileImageResponse,
} from './types';
import { featureTags } from '../constants';

export const userApiSlice = createApi({
  reducerPath: USERS_REDUCER_PATH,

  baseQuery: iblFetchBaseQuery,

  tagTypes: [
    ...USERS_QUERY_KEYS.GET_USER_METADATA(),
    ...USERS_QUERY_KEYS.GET_USER_METADATA_EDX(),
    featureTags.PLATFORM_USERS,
  ],

  endpoints: (builder) => ({
    getUserMetadata: builder.query<UserProfile, GetUserMetadataArgs>({
      query: (args) => ({
        url: USERS_ENDPOINTS.GET_USER_METADATA.path(),
        service: USERS_ENDPOINTS.GET_USER_METADATA.service,
        params: args.params,
      }),
      providesTags: USERS_QUERY_KEYS.GET_USER_METADATA(),
    }),
    updateUserMetadata: builder.mutation<unknown, UserProfile>({
      query: (args) => ({
        url: USERS_ENDPOINTS.GET_USER_METADATA.path(),
        service: USERS_ENDPOINTS.GET_USER_METADATA.service,
        body: args,
        method: 'POST',
        params: { username: args.username },
      }),
      invalidatesTags: USERS_QUERY_KEYS.GET_USER_METADATA(),
    }),
    updateUserAccount: builder.mutation<unknown, UpdateUserAccountRequest>({
      query: (args) => ({
        url: USERS_ENDPOINTS.GET_USER_METADATA.path(),
        service: USERS_ENDPOINTS.GET_USER_METADATA.service,
        body: args,
        method: 'POST',
        params: { username: args.username },
      }),
      invalidatesTags: USERS_QUERY_KEYS.GET_USER_METADATA(),
    }),
    resetPassword: builder.mutation<unknown, unknown>({
      query: (args) => ({
        url: USERS_ENDPOINTS.RESET_PASSWORD.path(),
        service: USERS_ENDPOINTS.RESET_PASSWORD.service,
        body: args,
        method: 'POST',
      }),
    }),
    updateUserRole: builder.mutation<unknown, UpdateUserRoleRequest>({
      query: (args) => ({
        url: USERS_ENDPOINTS.UPDATE_USER_ROLES.path(),
        service: USERS_ENDPOINTS.UPDATE_USER_ROLES.service,
        body: args,
        method: 'POST',
      }),
      invalidatesTags: [featureTags.PLATFORM_USERS],
    }),
    getUserMetadataEdx: builder.query<Partial<UserProfile>, GetUserMetadataArgs>({
      query: (args) => ({
        url: USERS_ENDPOINTS.EDX_GET_USER_METADATA.path(args.params.username),
        service: USERS_ENDPOINTS.EDX_GET_USER_METADATA.service,
      }),
      providesTags: USERS_QUERY_KEYS.GET_USER_METADATA_EDX(),
    }),
    uploadProfileImage: builder.mutation<
      UploadProfileImageResponse,
      { file: File | Blob; filename: string; username: string }
    >({
      query: ({ file, filename, username }) => {
        const formData = new FormData();

        // Handle both File and Blob objects
        if (file instanceof File) {
          formData.append('file', file);
        } else {
          // For React Native, append blob with filename
          formData.append('file', file, filename);
        }

        return {
          url: USERS_ENDPOINTS.UPLOAD_PROFILE_IMAGE.path(username),
          service: USERS_ENDPOINTS.UPLOAD_PROFILE_IMAGE.service,
          body: formData,
          method: 'POST',
          isJson: false,
        };
      },
      invalidatesTags: USERS_QUERY_KEYS.GET_USER_METADATA(),
    }),
    removeProfileImage: builder.mutation<RemoveProfileImageResponse, { username: string }>({
      query: ({ username }) => ({
        url: USERS_ENDPOINTS.REMOVE_PROFILE_IMAGE.path(username),
        service: USERS_ENDPOINTS.REMOVE_PROFILE_IMAGE.service,
        method: 'POST',
      }),
      invalidatesTags: USERS_QUERY_KEYS.GET_USER_METADATA(),
    }),
    updateUserMetadataEdx: builder.mutation<
      UploadProfileImageResponse,
      { username: string; body: string; method?: 'PATCH' | 'POST'; contentType?: string }
    >({
      query: ({ username, body, method = 'POST', contentType = '' }) => ({
        url: USERS_ENDPOINTS.EDX_UPDATE_USER_METADATA.path(username),
        service: USERS_ENDPOINTS.EDX_UPDATE_USER_METADATA.service,
        body,
        method,
        contentType: contentType || 'application/json',
      }),
      invalidatesTags: USERS_QUERY_KEYS.GET_USER_METADATA_EDX(),
    }),
  }),
});

export const {
  useGetUserMetadataQuery,
  useLazyGetUserMetadataQuery,
  useUpdateUserMetadataMutation,
  useUpdateUserAccountMutation,
  useResetPasswordMutation,
  useUpdateUserRoleMutation,
  useUploadProfileImageMutation,
  useRemoveProfileImageMutation,
  useGetUserMetadataEdxQuery,
  useLazyGetUserMetadataEdxQuery,
  useUpdateUserMetadataEdxMutation,
} = userApiSlice;
