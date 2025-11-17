import { SERVICES } from '@data-layer/constants';

export const AUTH_ENDPOINTS = {
  GET_MFE_CONTEXT: {
    service: SERVICES.LMS,
    path: (): string => `/api/mfe_context`,
  },
  APPLE_EXCHANGE_TOKEN: {
    service: SERVICES.LMS,
    path: (): string => `/oauth2/exchange_access_token/apple-id/`,
  },
  GET_APP_TOKENS: {
    service: SERVICES.LMS,
    path: (): string => '/api/ibl/manager/consolidated-token/proxy/',
  },
  REFRESH_JWT_TOKEN: {
    service: SERVICES.LMS,
    path: (): string => '/ibl-auth/request-jwt/',
  },
};

export const AUTH_REDUCER_PATH = 'authApiSlice';
