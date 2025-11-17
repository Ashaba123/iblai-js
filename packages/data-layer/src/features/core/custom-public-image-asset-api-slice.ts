import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromService, SERVICES } from '@data-layer/features/utils';
import { CORE_CUSTOM_ENDPOINTS, CORE_FAKE_CUSTOM_REDUCER_PATH } from './constants';
import { OpenAPI } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const coreFakeCustomPublicImageAssetApiSlice = createApi({
  reducerPath: CORE_FAKE_CUSTOM_REDUCER_PATH,
  baseQuery: iblFakeBaseQuery,
  endpoints: (builder) => ({
    getPublicPlatformImageAssetFileUrl: builder.query({
      ...buildEndpointFromService(
        SERVICES.DM,
        async (args: { platform_key: string; asset_id: number }): Promise<string> => {
          const url = `${OpenAPI.BASE}${CORE_CUSTOM_ENDPOINTS.GET_PUBLIC_PLATFORM_IMAGE_ASSET_FILE_URL.path(
            args.platform_key,
            args.asset_id,
          )}`;
          return url;
        },
      ),
    }),
  }),
});

export const {
  useGetPublicPlatformImageAssetFileUrlQuery,
  useLazyGetPublicPlatformImageAssetFileUrlQuery,
} = coreFakeCustomPublicImageAssetApiSlice;
