export const STORAGE_KEYS = {
  CURRENT_TENANT: "current_tenant",
  TENANT: "tenant",
  TENANTS: "tenants",
  REDIRECT_TO: "redirect-to",
  TOKEN_EXPIRY: "dm_token_expires",
  EDX_TOKEN_KEY: "edx_jwt_token",
  DM_TOKEN_KEY: "dm_token",
  AXD_TOKEN_KEY: "axd_token",
  USER_DATA: "userData",
};

// URL patterns
export const URL_PATTERNS = {
  PLATFORM_KEY: /\/platform\/([^/]+)\//,
};

// App identifiers
export const APP_IDENTIFIERS = {
  APP_NAME: "mentor",
};

// Query parameters
export const QUERY_PARAMS = {
  APP: "app",
  REDIRECT_TO: "redirect-to",
  TENANT: "tenant",
};

// Tenant identifiers
export const TENANT_IDENTIFIERS = {
  MAIN: "main",
};

export enum SERVICES {
  LMS = "LMS",
  DM = "DM",
  AXD = "AXD",
}
