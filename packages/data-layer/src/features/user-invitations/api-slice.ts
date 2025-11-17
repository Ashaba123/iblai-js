import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { CatalogService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const userInvitationsApiSlice = createApi({
  reducerPath: 'userInvitationsApiSlice',
  baseQuery: iblFakeBaseQuery,
  endpoints: (builder) => ({
    getUserInvitations: builder.query({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsPlatformRetrieve),
    }),
    createUserInvitation: builder.mutation({
      ...buildEndpointFromDmService(CatalogService.catalogInvitationsPlatformCreate),
    }),
  }),
});

export const {
  useGetUserInvitationsQuery,
  useLazyGetUserInvitationsQuery,
  useCreateUserInvitationMutation,
} = userInvitationsApiSlice;
