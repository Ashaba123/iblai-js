import { CoreService } from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';

import { buildEndpointFromDmServiceLegacy, getHeaders } from '../utils';
import { Tenant } from './types';
import { TENANTS_ENDPOINTS, TENANTS_QUERY_KEYS } from './constants';
import Config from '@data-layer/config';
import { SERVICES } from '@data-layer/constants';
import { iblFakeBaseQuery } from '@data-layer/core';

export const tenantApiSlice = createApi({
  reducerPath: 'tenantApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: [...TENANTS_QUERY_KEYS.GET_USER_TENANTS(), 'TenantMetadata'],
  endpoints: (builder) => ({
    getTenantMetadata: builder.query({
      ...buildEndpointFromDmServiceLegacy(CoreService.coreOrgsMetadataRetrieve),
      providesTags: ['TenantMetadata'],
    }),
    updateTenantMetadata: builder.mutation({
      ...buildEndpointFromDmServiceLegacy(CoreService.coreOrgsMetadataUpdate),
      invalidatesTags: ['TenantMetadata'],
    }),
    getUserTenants: builder.query<Tenant[], void>({
      queryFn: async () => {
        try {
          const authHeaders = await getHeaders(SERVICES.LMS);
          const response = await fetch(
            `${Config.lmsUrl}${TENANTS_ENDPOINTS.GET_USER_TENANTS.path()}`,
            {
              credentials: 'include',
              headers: {
                ...authHeaders,
              },
            },
          );
          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: 'Failed to fetch user tenants',
              },
            };
          }
          const data = await response.json();
          return { data };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error instanceof Error ? error.message : 'Failed to fetch user tenants',
            },
          };
        }
      },
      providesTags: TENANTS_QUERY_KEYS.GET_USER_TENANTS(),
    }),
  }),
});

export const tenantApiReducer: typeof tenantApiSlice.reducer = tenantApiSlice.reducer;
export const {
  useGetTenantMetadataQuery,
  useLazyGetTenantMetadataQuery,
  useGetUserTenantsQuery,
  useLazyGetUserTenantsQuery,
  useUpdateTenantMetadataMutation,
} = tenantApiSlice;
