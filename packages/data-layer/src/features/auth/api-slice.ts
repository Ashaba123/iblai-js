import { createApi } from '@reduxjs/toolkit/query/react';

import { AUTH_ENDPOINTS, AUTH_REDUCER_PATH } from '@data-layer/features/auth/constants';
import { iblFetchBaseQuery } from '@data-layer/features/utils';
import { AppleTokenRequest, MfeContextResponse, TokenResponse, JwtTokenResponse } from './types';

export const authApiSlice = createApi({
  reducerPath: AUTH_REDUCER_PATH,

  baseQuery: iblFetchBaseQuery,

  endpoints: (builder) => ({
    exchangeAppleToken: builder.mutation<{ access_token: string }, AppleTokenRequest>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.APPLE_EXCHANGE_TOKEN.path(),
        service: AUTH_ENDPOINTS.APPLE_EXCHANGE_TOKEN.service,
        method: 'POST',
        body: new URLSearchParams(body as any).toString(),
        skipAuth: true,
        isJson: false,
        contentType: 'application/x-www-form-urlencoded',
      }),
    }),
    getMfeContext: builder.query<MfeContextResponse, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.GET_MFE_CONTEXT.path(),
        service: AUTH_ENDPOINTS.GET_MFE_CONTEXT.service,
      }),
    }),
    getAppTokens: builder.mutation<{ data: TokenResponse }, FormData>({
      query: (formData) => ({
        url: AUTH_ENDPOINTS.GET_APP_TOKENS.path(),
        service: AUTH_ENDPOINTS.GET_APP_TOKENS.service,
        isJson: false,
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
    }),
    refreshJwtToken: builder.query<JwtTokenResponse, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.REFRESH_JWT_TOKEN.path(),
        service: AUTH_ENDPOINTS.REFRESH_JWT_TOKEN.service,
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useGetMfeContextQuery,
  useExchangeAppleTokenMutation,
  useGetAppTokensMutation,
  useLazyRefreshJwtTokenQuery,
} = authApiSlice;
