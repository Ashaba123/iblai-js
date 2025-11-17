import { SERVICES } from "@data-layer/constants";

export const TENANTS_ENDPOINTS = {
  GET_USER_TENANTS: {
    service: SERVICES.LMS,
    path: (): string => `/api/ibl/users/manage/platform/`,
  },
};

export const TENANTS_QUERY_KEYS = {
  GET_USER_TENANTS: (): string[] => ["USER_TENANTS"],
};

export const TENANTS_REDUCER_KEY = "tenantsApiSlice";
