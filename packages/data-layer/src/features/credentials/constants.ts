import { SERVICES } from "@data-layer/constants";

export const CREDENTIALS_CUSTOM_REDUCER_PATH = "credentialsCustomApiSlice";

export const CREDENTIALS_CUSTOM_ENDPOINTS = {
  DELETE_INTEGRATION_CREDENTIAL: {
    path: (org: string) => `/api/ai-account/orgs/${org}/integration-credential/`,
    service: SERVICES.DM,
  },
  DELETE_CREDENTIAL: {
    path: (org: string) => `/api/ai-account/orgs/${org}/credential/`,
    service: SERVICES.DM,
  },
  GET_INTEGRATION_CREDENTIALS_SCHEMA: {
    path: (org: string) => `/api/ai-account/orgs/${org}/integration-credential/schema/`,
    service: SERVICES.DM,
  },
  GET_CREDENTIALS_SCHEMA: {
    path: (org: string) => `/api/ai-account/orgs/${org}/credential/schema/`,
    service: SERVICES.DM,
  },
  GET_MASKED_LLM_CREDENTIALS: {
    path: (org: string) => `/api/ai-account/orgs/${org}/masked-llm-credential/`,
    service: SERVICES.DM,
  },
  GET_MASKED_INTEGRATION_CREDENTIALS: {
    path: (org: string) => `/api/ai-account/orgs/${org}/masked-integration-credential/`,
    service: SERVICES.DM,
  },
};