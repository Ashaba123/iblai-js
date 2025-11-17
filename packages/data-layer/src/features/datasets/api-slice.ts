import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { AiIndexService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const datasetsApiSlice = createApi({
  reducerPath: 'datasetsApiSlice',
  baseQuery: iblFakeBaseQuery,
  endpoints: (builder) => ({
    getDatasets: builder.query({
      ...buildEndpointFromDmService(AiIndexService.aiIndexOrgsUsersDocumentsPathwaysList),
    }),
    uploadDatasetInSession: builder.mutation({
      ...buildEndpointFromDmService(AiIndexService.aiIndexOrgsUsersDocumentsTrainSessionsCreate),
    }),
  }),
});

export const { useGetDatasetsQuery, useLazyGetDatasetsQuery, useUploadDatasetInSessionMutation } =
  datasetsApiSlice;
