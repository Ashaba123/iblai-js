import { createApi } from '@reduxjs/toolkit/query/react';
import { iblFetchBaseQuery, SERVICES } from '../utils';
import type { FileUploadURLRequest, FileUploadURLResponse } from './types';

export const chatFilesApiSlice = createApi({
  reducerPath: 'chatFilesApiSlice',
  baseQuery: iblFetchBaseQuery,
  endpoints: (builder) => ({
    /**
     * Get presigned S3 URL for file upload
     * POST /api/ai-mentor/orgs/{org}/users/{userId}/chat/files/upload-url/
     */
    getFileUploadUrl: builder.mutation<
      FileUploadURLResponse,
      {
        org: string;
        userId: string;
        requestBody: FileUploadURLRequest;
      }
    >({
      query: ({
        org,
        userId,
        requestBody,
      }: {
        org: string;
        userId: string;
        requestBody: FileUploadURLRequest;
      }) => ({
        url: `/api/ai-mentor/orgs/${org}/users/${userId}/chat/files/upload-url/`,
        method: 'POST',
        body: requestBody,
        service: SERVICES.DM,
      }),
    }),
  }),
});

export const { useGetFileUploadUrlMutation } = chatFilesApiSlice;
