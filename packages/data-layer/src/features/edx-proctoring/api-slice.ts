import { createApi } from '@reduxjs/toolkit/query/react';
import { iblFetchBaseQuery } from '@data-layer/features/utils';
import {
  ExamAttemptArgs,
  ExamAttemptResponse,
  ExamInfo,
  ExamInfoQueryParams,
  ExamStartResponse,
} from './types';
import { EDX_PROCTORING_ENDPOINTS } from './constants';

export const edxProctoringApiSlice = createApi({
  reducerPath: 'edxProctoringApiSlice',
  baseQuery: iblFetchBaseQuery,
  endpoints: (builder) => ({
    getExamInfo: builder.query<ExamInfo, ExamInfoQueryParams>({
      query: (args: ExamInfoQueryParams) => ({
        url: EDX_PROCTORING_ENDPOINTS.GET_EXAM_INFO.path(args.course_id),
        service: EDX_PROCTORING_ENDPOINTS.GET_EXAM_INFO.service,
        method: 'GET',
        params: {
          content_id: args.content_id,
          is_learning_mfe: args.is_learning_mfe,
        },
        isJson: true,
      }),
    }),
    updateExamAttempt: builder.mutation<ExamAttemptResponse, ExamAttemptArgs>({
      query: (args: ExamAttemptArgs) => ({
        url: EDX_PROCTORING_ENDPOINTS.UPDATE_EXAM_ATTEMPT.path(args.attemptID),
        service: EDX_PROCTORING_ENDPOINTS.UPDATE_EXAM_ATTEMPT.service,
        method: 'PUT',
        body: JSON.stringify({
          action: args.action,
        }),
        isJson: true,
      }),
    }),
    startExam: builder.mutation<ExamStartResponse, FormData>({
      query: (formData: FormData) => ({
        url: EDX_PROCTORING_ENDPOINTS.START_EXAM.path(),
        service: EDX_PROCTORING_ENDPOINTS.START_EXAM.service,
        method: 'POST',
        body: formData,
        isJson: false,
      }),
    }),
  }),
});

export const {
  useGetExamInfoQuery,
  useLazyGetExamInfoQuery,
  useUpdateExamAttemptMutation,
  useStartExamMutation,
} = edxProctoringApiSlice;
