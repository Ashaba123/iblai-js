import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { AiIndexService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const trainingDocumentsApiSlice = createApi({
  reducerPath: 'trainingDocumentsApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['trainingDocuments', 'retrainSchedule'],
  endpoints: (builder) => ({
    getTrainingDocuments: builder.query({
      ...buildEndpointFromDmService(AiIndexService.aiIndexOrgsUsersDocumentsPathwaysList),
      providesTags: ['trainingDocuments'],
    }),
    addTrainingDocument: builder.mutation({
      ...buildEndpointFromDmService(AiIndexService.aiIndexOrgsUsersDocumentsTrainCreate),
      invalidatesTags: ['trainingDocuments'],
    }),
    editTrainingDocument: builder.mutation({
      ...buildEndpointFromDmService(AiIndexService.aiIndexOrgsUsersDocumentsUpdate),
      invalidatesTags: ['trainingDocuments'],
    }),
    deleteTrainingDocument: builder.mutation({
      ...buildEndpointFromDmService(AiIndexService.aiIndexOrgsUsersDocumentsDestroy),
      invalidatesTags: ['trainingDocuments'],
    }),
    getTrainingDocumentRetrainSchedule: builder.query({
      ...buildEndpointFromDmService(AiIndexService.aiIndexOrgsUsersDocumentsSettingsRetrieve),
      providesTags: ['retrainSchedule'],
    }),
    createTrainingDocumentRetrainSchedule: builder.mutation({
      ...buildEndpointFromDmService(AiIndexService.aiIndexOrgsUsersDocumentsSettingsCreate),
      invalidatesTags: ['retrainSchedule'],
    }),
  }),
});

export const {
  useGetTrainingDocumentsQuery,
  useLazyGetTrainingDocumentsQuery,
  useAddTrainingDocumentMutation,
  useEditTrainingDocumentMutation,
  useDeleteTrainingDocumentMutation,
  useGetTrainingDocumentRetrainScheduleQuery,
  useLazyGetTrainingDocumentRetrainScheduleQuery,
  useCreateTrainingDocumentRetrainScheduleMutation,
} = trainingDocumentsApiSlice;
