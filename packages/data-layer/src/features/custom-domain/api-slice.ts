import { createApi } from '@reduxjs/toolkit/query/react';
import { iblFetchBaseQuery } from '../utils';
import type {
  CreateCustomDomainRequest,
  CustomDomainListResponse,
  GetCustomDomainsArgs,
} from './types';
import {
  CUSTOM_DOMAIN_ENDPOINTS,
  CUSTOM_DOMAIN_QUERY_KEYS,
  CUSTOM_DOMAIN_REDUCER_PATH,
} from './constants';

export const customDomainApiSlice = createApi({
  reducerPath: CUSTOM_DOMAIN_REDUCER_PATH,
  baseQuery: iblFetchBaseQuery,
  tagTypes: [...CUSTOM_DOMAIN_QUERY_KEYS.GET_CUSTOM_DOMAINS()],
  endpoints: (builder) => ({
    getCustomDomains: builder.query<CustomDomainListResponse, GetCustomDomainsArgs>({
      query: (args) => {
        return {
          url: CUSTOM_DOMAIN_ENDPOINTS.GET_CUSTOM_DOMAINS.path(),
          params: args.params,
          service: CUSTOM_DOMAIN_ENDPOINTS.GET_CUSTOM_DOMAINS.service,
        };
      },
      providesTags: CUSTOM_DOMAIN_QUERY_KEYS.GET_CUSTOM_DOMAINS(),
    }),
    createCustomDomain: builder.mutation<CustomDomainListResponse, CreateCustomDomainRequest>({
      query: (args) => {
        return {
          url: CUSTOM_DOMAIN_ENDPOINTS.CREATE_CUSTOM_DOMAIN.path(),
          body: args.requestBody,
          service: CUSTOM_DOMAIN_ENDPOINTS.CREATE_CUSTOM_DOMAIN.service,
          method: 'POST',
        };
      },
      invalidatesTags: CUSTOM_DOMAIN_QUERY_KEYS.GET_CUSTOM_DOMAINS(),
    }),
    deleteCustomDomain: builder.mutation<unknown, { domain_id: number; platform_key: string }>({
      query: (args) => {
        return {
          url: CUSTOM_DOMAIN_ENDPOINTS.DELETE_CUSTOM_DOMAIN.path(args.domain_id),
          service: CUSTOM_DOMAIN_ENDPOINTS.DELETE_CUSTOM_DOMAIN.service,
          method: 'DELETE',
          body: JSON.stringify({ platform_key: args.platform_key }),
        };
      },
      invalidatesTags: CUSTOM_DOMAIN_QUERY_KEYS.GET_CUSTOM_DOMAINS(),
    }),
  }),
});

export const {
  useGetCustomDomainsQuery,
  useLazyGetCustomDomainsQuery,
  useCreateCustomDomainMutation,
  useDeleteCustomDomainMutation,
} = customDomainApiSlice;
