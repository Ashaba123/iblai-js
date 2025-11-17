import { createApi } from "@reduxjs/toolkit/query/react";
import { iblFetchBaseQuery } from "@data-layer/features/utils";
import { CREDENTIALS_CUSTOM_ENDPOINTS, CREDENTIALS_CUSTOM_REDUCER_PATH } from "./constants";
import { CredentialsSchema, MaskLLM } from "./types";

export const credentialsCustomApiSlice = createApi({
  reducerPath: CREDENTIALS_CUSTOM_REDUCER_PATH,

  baseQuery: iblFetchBaseQuery,

  endpoints: (builder) => ({
    deleteIntegrationCredential: builder.mutation<unknown, {org: string, platform_key: string, name: string}>({
      query: ({org, platform_key, name}) => ({
        url: CREDENTIALS_CUSTOM_ENDPOINTS.DELETE_INTEGRATION_CREDENTIAL.path(org),
        service: CREDENTIALS_CUSTOM_ENDPOINTS.DELETE_INTEGRATION_CREDENTIAL.service,
        method: "DELETE",
        body: JSON.stringify({
          platform:platform_key,
          name,
        }),
      }),
    }),
    deleteCredential: builder.mutation<unknown, {org: string, name: string, platform_key: string}>({
      query: ({org, name, platform_key}) => ({
        url: CREDENTIALS_CUSTOM_ENDPOINTS.DELETE_CREDENTIAL.path(org),
        service: CREDENTIALS_CUSTOM_ENDPOINTS.DELETE_CREDENTIAL.service,
        method: "DELETE",
        body: JSON.stringify({name, platform: platform_key}),
      }),
    }),
    getIntegrationCredentialsSchema: builder.query<CredentialsSchema[], {org: string}>({
      query: ({org}) => ({
        url: CREDENTIALS_CUSTOM_ENDPOINTS.GET_INTEGRATION_CREDENTIALS_SCHEMA.path(org),
        service: CREDENTIALS_CUSTOM_ENDPOINTS.GET_INTEGRATION_CREDENTIALS_SCHEMA.service,
        method: "GET",
      }),
    }),
    getCredentialsSchema: builder.query<CredentialsSchema[], {org: string}>({
      query: ({org}) => ({
        url: CREDENTIALS_CUSTOM_ENDPOINTS.GET_CREDENTIALS_SCHEMA.path(org),
        service: CREDENTIALS_CUSTOM_ENDPOINTS.GET_CREDENTIALS_SCHEMA.service,
        method: "GET",
      }),
    }),
    getMaskedLLMCredentials: builder.query<MaskLLM[], {org: string}>({
      query: ({org}) => ({
        url: CREDENTIALS_CUSTOM_ENDPOINTS.GET_MASKED_LLM_CREDENTIALS.path(org),
        service: CREDENTIALS_CUSTOM_ENDPOINTS.GET_MASKED_LLM_CREDENTIALS.service,
        method: "GET",
      }),
    }),
    getMaskedIntegrationCredentials: builder.query<MaskLLM[], {org: string}>({
      query: ({org}) => ({
        url: CREDENTIALS_CUSTOM_ENDPOINTS.GET_MASKED_INTEGRATION_CREDENTIALS.path(org),
        service: CREDENTIALS_CUSTOM_ENDPOINTS.GET_MASKED_INTEGRATION_CREDENTIALS.service,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useDeleteIntegrationCredentialMutation,
  useDeleteCredentialMutation,
  useGetIntegrationCredentialsSchemaQuery,
  useLazyGetIntegrationCredentialsSchemaQuery,
  useGetCredentialsSchemaQuery,
  useLazyGetCredentialsSchemaQuery,
  useGetMaskedLLMCredentialsQuery,
  useGetMaskedIntegrationCredentialsQuery,
} = credentialsCustomApiSlice;
