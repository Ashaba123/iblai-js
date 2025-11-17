import { createApi } from '@reduxjs/toolkit/query/react';
import { iblFetchBaseQuery } from '@data-layer/features/utils';
import {
  DISCLAIMERS_ENDPOINTS,
  DISCLAIMERS_REDUCER_PATH,
  DISCLAIMERS_QUERY_KEYS,
} from './constants';
import {
  DisclaimersFetchResponse,
  GetDisclaimersArgs,
  CreateDisclaimerArgs,
  UpdateDisclaimerArgs,
  DeleteDisclaimerArgs,
  AgreeToDisclaimerArgs,
  DisclaimerAgreement,
  Disclaimer,
} from './types';

export const disclaimersApiSlice = createApi({
  reducerPath: DISCLAIMERS_REDUCER_PATH,

  tagTypes: [...DISCLAIMERS_QUERY_KEYS.GET_DISCLAIMERS()],

  baseQuery: iblFetchBaseQuery,

  endpoints: (builder) => ({
    getDisclaimers: builder.query<DisclaimersFetchResponse, GetDisclaimersArgs>({
      query: (args) => {
        return {
          url: DISCLAIMERS_ENDPOINTS.GET_DISCLAIMERS.path(args.org, args.userId),
          params: args.params,
          service: DISCLAIMERS_ENDPOINTS.GET_DISCLAIMERS.service,
        };
      },
      providesTags: DISCLAIMERS_QUERY_KEYS.GET_DISCLAIMERS(),
    }),

    createDisclaimer: builder.mutation<Disclaimer, CreateDisclaimerArgs>({
      query: (args) => {
        return {
          url: DISCLAIMERS_ENDPOINTS.CREATE_DISCLAIMER.path(args.org, args.userId),
          method: 'POST',
          body: args.formData,
          service: DISCLAIMERS_ENDPOINTS.CREATE_DISCLAIMER.service,
        };
      },
      invalidatesTags: DISCLAIMERS_QUERY_KEYS.GET_DISCLAIMERS(),
    }),

    updateDisclaimer: builder.mutation<Disclaimer, UpdateDisclaimerArgs>({
      query: (args) => {
        return {
          url: DISCLAIMERS_ENDPOINTS.UPDATE_DISCLAIMER.path(args.org, args.userId, args.id),
          method: 'PATCH',
          body: args.formData,
          service: DISCLAIMERS_ENDPOINTS.UPDATE_DISCLAIMER.service,
        };
      },
      invalidatesTags: DISCLAIMERS_QUERY_KEYS.GET_DISCLAIMERS(),
    }),

    deleteDisclaimer: builder.mutation<void, DeleteDisclaimerArgs>({
      query: (args) => {
        return {
          url: DISCLAIMERS_ENDPOINTS.DELETE_DISCLAIMER.path(args.org, args.userId, args.id),
          method: 'DELETE',
          service: DISCLAIMERS_ENDPOINTS.DELETE_DISCLAIMER.service,
        };
      },
      invalidatesTags: DISCLAIMERS_QUERY_KEYS.GET_DISCLAIMERS(),
    }),

    agreeToDisclaimer: builder.mutation<DisclaimerAgreement, AgreeToDisclaimerArgs>({
      query: (args) => {
        return {
          url: DISCLAIMERS_ENDPOINTS.AGREE_TO_DISCLAIMER.path(args.org, args.userId),
          method: 'POST',
          body: args.formData,
          service: DISCLAIMERS_ENDPOINTS.AGREE_TO_DISCLAIMER.service,
        };
      },
      invalidatesTags: DISCLAIMERS_QUERY_KEYS.GET_DISCLAIMERS(),
    }),
  }),
});

export const {
  useGetDisclaimersQuery,
  useLazyGetDisclaimersQuery,
  useCreateDisclaimerMutation,
  useUpdateDisclaimerMutation,
  useDeleteDisclaimerMutation,
  useAgreeToDisclaimerMutation,
} = disclaimersApiSlice;
