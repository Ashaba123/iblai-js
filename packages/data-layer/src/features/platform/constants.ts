import { SERVICES } from "@data-layer/constants";

export const PLATFORM_CUSTOM_REDUCER_PATH = "platformCustomApiSlice";

export const PLATFORM_CONFIGURATION_TAG = "PlatformConfiguration";

export const PLATFORM_CUSTOM_ENDPOINTS = {
    GET_PLATFORM_CONFIGURATIONS: {
        path:`/api/core/platform/configurations/`,
        service: SERVICES.DM,
    },
    SET_PLATFORM_CONFIGURATIONS: {
        path:`/api/core/platform/configurations/`,
        service: SERVICES.DM,
    },
    DELETE_PLATFORM_CONFIGURATION: {
        path:`/api/core/platform/configurations/delete-config/`,
        service: SERVICES.DM,
    },
};