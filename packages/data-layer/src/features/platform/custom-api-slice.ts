import { createApi } from "@reduxjs/toolkit/query/react";
import { iblFetchBaseQuery } from "@data-layer/features/utils"; 
import { PLATFORM_CONFIGURATION_TAG, PLATFORM_CUSTOM_ENDPOINTS, PLATFORM_CUSTOM_REDUCER_PATH } from "./constants";
import { PlatformConfigurationListResponse, PlatformConfigurationSetArgs } from "./types";

export const platformCustomApiSlice = createApi({
  reducerPath: PLATFORM_CUSTOM_REDUCER_PATH,

  baseQuery: iblFetchBaseQuery,
  tagTypes: [PLATFORM_CONFIGURATION_TAG],

  endpoints: (builder) => ({
    getPlatformConfigurations: builder.query<PlatformConfigurationListResponse, {platform_key: string}>({
      query: ({platform_key}) => ({
        url: PLATFORM_CUSTOM_ENDPOINTS.GET_PLATFORM_CONFIGURATIONS.path,
        service: PLATFORM_CUSTOM_ENDPOINTS.GET_PLATFORM_CONFIGURATIONS.service,
        method: "GET",
        params: {
          platform_key,
        },
      }),
      providesTags: [PLATFORM_CONFIGURATION_TAG],
    }),
    setPlatformConfigurations: builder.mutation<PlatformConfigurationListResponse, PlatformConfigurationSetArgs>({
      query: ({platform_key, configurations}) => ({
        url: PLATFORM_CUSTOM_ENDPOINTS.SET_PLATFORM_CONFIGURATIONS.path,
        service: PLATFORM_CUSTOM_ENDPOINTS.SET_PLATFORM_CONFIGURATIONS.service,
        method: "POST",
        body: JSON.stringify({platform_key, configurations}),
      }),
      invalidatesTags: [PLATFORM_CONFIGURATION_TAG],
    }),
    deletePlatformConfiguration: builder.mutation<unknown, {platform_key: string, key: string}>({
      query: ({platform_key, key}) => ({
        url: PLATFORM_CUSTOM_ENDPOINTS.DELETE_PLATFORM_CONFIGURATION.path,
        service: PLATFORM_CUSTOM_ENDPOINTS.DELETE_PLATFORM_CONFIGURATION.service,
        method: "DELETE",
        body: JSON.stringify({platform_key, key}),
        params: {
          platform_key,
          key,
        },
      }),
      invalidatesTags: [PLATFORM_CONFIGURATION_TAG],
    }),
  }),
});

export const {
  useGetPlatformConfigurationsQuery,
  useSetPlatformConfigurationsMutation,
  useDeletePlatformConfigurationMutation,
} = platformCustomApiSlice;
        