import { SearchService } from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';

import { buildEndpointFromDmServiceLegacy } from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';

export const searchApiSlice = createApi({
  reducerPath: 'searchApiSlice',
  baseQuery: iblFakeBaseQuery,
  endpoints: (builder) => ({
    getPersonnalizedSearch: builder.query({
      ...buildEndpointFromDmServiceLegacy(SearchService.searchPersonalizedCatalogRetrieve),
    }),
    getCatalogSearch: builder.query({
      ...buildEndpointFromDmServiceLegacy(SearchService.searchCatalogRetrieve),
    }),
  }),
});

export const {
  useGetPersonnalizedSearchQuery,
  useLazyGetPersonnalizedSearchQuery,
  useGetCatalogSearchQuery,
  useLazyGetCatalogSearchQuery,
} = searchApiSlice;
