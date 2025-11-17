import { SERVICES } from "@data-layer/constants";

export const TENANT_LOGO_REDUCER_PATH = "tenantLogoApiSlice";

export const TENANT_LOGO_QUERY_KEYS = {
  GET_LIGHT_LOGO: (): string[] => ["GET_LIGHT_LOGO"],
  GET_DARK_LOGO: (): string[] => ["GET_DARK_LOGO"],
};

export const TENANT_LOGO_ENDPOINTS = {
  GET_LIGHT_LOGO: {
    path: (platformKey: string) => `/api/core/orgs/${platformKey}/logo`,
    service: SERVICES.AXD
  },
  GET_DARK_LOGO: {
    path: (platformKey: string) => `/api/core/orgs/${platformKey}/dark-mode-logo`,
    service: SERVICES.AXD
  },
  UPLOAD_LIGHT_LOGO: {
    path: (platformKey: string) => `/api/core/orgs/${platformKey}/logo/create/`,
    service: SERVICES.AXD
  },
  UPLOAD_DARK_LOGO: {
    path: (platformKey: string) => `/api/core/orgs/${platformKey}/dark-mode-logo/create/`,
    service: SERVICES.AXD
  }
};