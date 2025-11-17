import { buildEndpointFromDmService } from '../utils';

import { createApi } from '@reduxjs/toolkit/query/react';
import { ReportsService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const reportsApiSlice = createApi({
  reducerPath: 'reportsApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['reports', 'reportDetail'],
  endpoints: (builder) => ({
    getReports: builder.query({
      ...buildEndpointFromDmService(ReportsService.reportsPlatformsRetrieve),
      providesTags: ['reports'],
    }),
    getReportDetail: builder.query({
      ...buildEndpointFromDmService(ReportsService.reportsPlatformsRetrieve2),
      providesTags: ['reportDetail'],
    }),
    createReport: builder.mutation({
      ...buildEndpointFromDmService(ReportsService.reportsPlatformsNewCreate),
      invalidatesTags: ['reports'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useLazyGetReportsQuery,
  useGetReportDetailQuery,
  useLazyGetReportDetailQuery,
  useCreateReportMutation,
} = reportsApiSlice;
