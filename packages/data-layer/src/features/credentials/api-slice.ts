import {
  AiAccountService,
  AiMentorService,
  CredentialsService,
  OAuthStartResponse,
  OpenAPI,
} from '@iblai/iblai-api';
import { createApi } from '@reduxjs/toolkit/query/react';

import {
  buildEndpointFromAxdService,
  buildEndpointFromDmService,
  iblFetchBaseQuery,
  buildEndpointFromService,
  SERVICES,
} from '../utils';
import { iblFakeBaseQuery } from '@data-layer/core';

export const credentialsApiSlice = createApi({
  reducerPath: 'credentialsApiSlice',
  baseQuery: iblFakeBaseQuery,
  endpoints: (builder) => ({
    getCredentials: builder.query({
      ...buildEndpointFromService(
        SERVICES.DM,
        async (args: { org: string; name?: string; learner_id?: string }) => {
          // Manually call the API with custom query params including learner_id
          const queryParams = new URLSearchParams();
          if (args.name) queryParams.append('name', args.name);
          if (args.learner_id) queryParams.append('learner_id', args.learner_id);

          const queryString = queryParams.toString();
          const url = `${OpenAPI.BASE}/api/ai-account/orgs/${args.org}/integration-credential/${queryString ? `?${queryString}` : ''}`;

          const response = await fetch(url, {
            method: 'GET',
            headers: OpenAPI.HEADERS as Record<string, string>,
          });

          if (!response.ok) {
            const error: any = new Error('Failed to fetch credentials');
            error.status = response.status;
            error.body = await response.text();
            throw error;
          }

          return response.json();
        },
      ),
    }),
    getLLMCredentials: builder.query({
      ...buildEndpointFromDmService(AiAccountService.aiAccountOrgsCredentialRetrieve),
    }),
    getUserCredentials: builder.query({
      ...buildEndpointFromDmService(CredentialsService.credentialsOrgsUsersAssertionsRetrieve),
    }),
    createCallCredentials: builder.mutation({
      ...buildEndpointFromAxdService(
        AiMentorService.aiMentorOrgsUsersMentorsCreateCallCredentialsCreate,
      ),
    }),
    getIntegrationCredentials: builder.query({
      ...buildEndpointFromDmService(AiAccountService.aiAccountOrgsIntegrationCredentialRetrieve),
    }),
    createIntegrationCredential: builder.mutation({
      ...buildEndpointFromDmService(AiAccountService.aiAccountOrgsIntegrationCredentialCreate),
    }),
    createLLMCredential: builder.mutation({
      ...buildEndpointFromDmService(AiAccountService.aiAccountOrgsCredentialCreate),
    }),
    updateIntegrationCredential: builder.mutation({
      ...buildEndpointFromDmService(
        AiAccountService.aiAccountOrgsIntegrationCredentialPartialUpdate,
      ),
    }),
    getConnectedServiceAuthUrl: builder.query<
      OAuthStartResponse,
      { org: string; userId: string; provider: string; service: string }
    >({
      queryFn: async (queryParams, api, extraOptions) => {
        const url = `/api/ai-account/connected-services/orgs/${queryParams.org}/users/${queryParams.userId}/${queryParams.provider}/${queryParams.service}/`;

        return iblFetchBaseQuery(
          {
            url,
            service: SERVICES.DM,
          },
          api,
          extraOptions,
        ) as Promise<any>;
      },
    }),
    connectedServicesCallback: builder.query<any, Record<string, string>>({
      queryFn: async (queryParams, api, extraOptions) => {
        // Build query string from params
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `/api/ai-account/connected-services/callback/?${queryString}`;

        return iblFetchBaseQuery(
          {
            url,
            service: SERVICES.DM,
          },
          api,
          extraOptions,
        );
      },
    }),
  }),
});

export const {
  useGetCredentialsQuery,
  useLazyGetCredentialsQuery,
  useGetUserCredentialsQuery,
  useLazyGetUserCredentialsQuery,
  useCreateCallCredentialsMutation,
  useGetIntegrationCredentialsQuery,
  useLazyGetIntegrationCredentialsQuery,
  useCreateIntegrationCredentialMutation,
  useUpdateIntegrationCredentialMutation,
  useGetLLMCredentialsQuery,
  useLazyGetLLMCredentialsQuery,
  useCreateLLMCredentialMutation,
  useGetConnectedServiceAuthUrlQuery,
  useLazyGetConnectedServiceAuthUrlQuery,
  useConnectedServicesCallbackQuery,
  useLazyConnectedServicesCallbackQuery,
} = credentialsApiSlice;
