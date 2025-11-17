import { STORAGE_KEYS, SERVICES } from '../constants';

export { SERVICES };
import Config from '../config';
import { IblDataLayer } from '../core';
import { OpenAPI } from '@iblai/iblai-api';
import {
  BaseQueryApi,
  fetchBaseQuery,
  retry,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
  type QueryReturnValue,
} from '@reduxjs/toolkit/query';

type HttpErrorHandlers = {
  [key: number]: () => void;
};

// Custom error structure
type CustomError = {
  status: number;
  error: string | object;
};

/**
 * Get the service URL based on the provided service type.
 */
export const getServiceUrl = (service: SERVICES): string => {
  switch (service) {
    case SERVICES.LMS:
      return Config.lmsUrl;
    case SERVICES.DM:
      return Config.dmUrl;
    default:
      return Config.dmUrl;
  }
};

/**
 * Get the headers required for API requests based on the provided service type.
 */
export const getHeaders = async (
  service: SERVICES,
): Promise<{ Authorization: string } | undefined> => {
  // Check if storage is initialized
  if (!IblDataLayer.storage) {
    throw new Error(
      'Storage not initialized. Please ensure the data layer is properly initialized before making API calls.',
    );
  }
  let token: string | null = null;
  switch (service) {
    case SERVICES.DM:
      token = await IblDataLayer.storage.getItem(STORAGE_KEYS.DM_TOKEN_KEY);
      break;
    case SERVICES.AXD:
      token = await IblDataLayer.storage.getItem(STORAGE_KEYS.AXD_TOKEN_KEY);
      break;
    default:
      token = await IblDataLayer.storage.getItem(STORAGE_KEYS.EDX_TOKEN_KEY);
  }

  if (!token || token.trim() === '') {
    return; // No Authorization header when no valid token
  }
  let prefix;
  if (service === SERVICES.LMS) {
    if (token.length > 30) {
      prefix = 'JWT';
    } else {
      prefix = 'Bearer';
    }
  } else {
    prefix = 'Token';
  }
  return token ? { Authorization: `${prefix} ${token}` } : undefined;
};

/**
 * Build a generic RTK Query endpoint from a service function.
 */
export const buildEndpointFromService = <Args extends Record<string, unknown>, Result>(
  service: SERVICES,
  serviceFn: (args: Args) => Promise<Result>,
): {
  queryFn: BaseQueryFn<Args, Result, FetchBaseQueryError | CustomError>;
} => {
  return {
    async queryFn(
      args: Args,
    ): Promise<QueryReturnValue<Result, FetchBaseQueryError | CustomError, object>> {
      try {
        OpenAPI.BASE = getServiceUrl(service);
        OpenAPI.HEADERS = await getHeaders(service);

        // API request initiated

        const data = await serviceFn(args);

        // API response received

        return { data };
      } catch (err: any) {
        if (Object.prototype.hasOwnProperty.call(Config.httpErrorHandlers, err?.status)) {
          (Config.httpErrorHandlers as HttpErrorHandlers)[err?.status]();
        }
        return {
          error: {
            status: err?.status || 500,
            data: err?.body || err?.message || 'Unknown error',
          } as FetchBaseQueryError,
        };
      }
    },
  };
};

/**
 * Shortcut for building an endpoint using the DM service.
 */
export const buildEndpointFromDmService = <Args extends Record<string, unknown>, Result>(
  serviceFn: (args: Args) => Promise<Result>,
): {
  queryFn: BaseQueryFn<Args, Result, FetchBaseQueryError | CustomError>;
} => buildEndpointFromService(SERVICES.DM, serviceFn);

/**
 * Shortcut for building an endpoint using the AXD service.
 */
export const buildEndpointFromAxdService = <Args extends Record<string, unknown>, Result>(
  serviceFn: (args: Args) => Promise<Result>,
): {
  queryFn: BaseQueryFn<Args, Result, FetchBaseQueryError | CustomError>;
} => buildEndpointFromService(SERVICES.AXD, serviceFn);

export interface CustomQueryArgs extends Omit<FetchArgs, 'url'> {
  url: string;
  service: SERVICES;
  isJson?: boolean;
  contentType?: string;
  skipAuth?: boolean;
}

export type ExtendedFetchBaseQueryError = FetchBaseQueryError & {
  data?: { detail?: string; message?: string; error?: string; error_description?: string } | string;
};

type ErrorObjectLike = {
  detail?: string;
  message?: string;
  error?: string;
  error_description?: string;
};

const isErrorObject = (data: unknown): data is ErrorObjectLike => {
  return (
    typeof data === 'object' &&
    data !== null &&
    ('detail' in data || 'message' in data || 'error' in data || 'error_description' in data)
  );
};

const baseQuery = (
  service: SERVICES,
  jsonContentType = true,
  contentType?: string,
  skipAuth = false,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> =>
  fetchBaseQuery({
    baseUrl: getServiceUrl(service),
    timeout: 30000, // 30 second timeout

    prepareHeaders: async (headers) => {
      // Only add auth headers if skipAuth is false
      if (!skipAuth) {
        const authHeaders = await getHeaders(service);
        Object.entries(authHeaders ?? {}).forEach(([key, value]) => {
          if (value) {
            headers.set(key, value);
          }
        });
      }

      // Remove this in favor of the isForm flag in the future
      if (jsonContentType) {
        headers.set('Content-Type', 'application/json');
      }
      if (contentType) {
        headers.set('Content-Type', contentType);
      }

      // Add CSRF protection headers for LMS service
      if (service === SERVICES.LMS) {
        // Use mentorIframeUrl for both origin and referer
        // This matches the pattern used in loginCompleteApi.ts
        headers.set('Referer', Config.mentorIframeUrl);
        headers.set('Origin', Config.mentorIframeUrl);
      }

      return headers;
    },
  });

export const iblFetchBaseQuery: BaseQueryFn<
  CustomQueryArgs,
  unknown,
  ExtendedFetchBaseQueryError,
  Record<string, unknown>,
  FetchBaseQueryMeta
> = async <T>(
  args: CustomQueryArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>,
): Promise<{ data: T }> => {
  try {
    // Executing base query
    const result = await retry(
      baseQuery(args.service, args?.isJson ?? true, args?.contentType, args?.skipAuth),
      {
        maxRetries: 3,
      },
    )(args, api, extraOptions);
    // Query completed
    if (result.error) {
      // For profile image upload errors, preserve the original error structure
      if (args.url && args.url.includes('/profile_images/')) {
        throw result.error;
      }

      const errorData = result.error.data;
      const errorMessage =
        typeof errorData === 'string'
          ? errorData
          : isErrorObject(errorData)
            ? errorData.detail ||
              errorData.message ||
              errorData.error_description ||
              errorData.error ||
              'Unknown server error'
            : 'Unknown server error';
      // Ensure we throw a plain FetchBaseQueryError shape with enumerable fields
      throw {
        status: result.error.status,
        data: result.error.data ?? errorMessage,
      } as FetchBaseQueryError;
    }
    return { data: result?.data as T };
  } catch (e) {
    // Preserve original RTK error object for profile image uploads
    if (
      args.url &&
      args.url.includes('/profile_images/') &&
      typeof e === 'object' &&
      e !== null &&
      'data' in e
    ) {
      throw e as FetchBaseQueryError;
    }

    // If it's already an RTK FetchBaseQueryError shape, rethrow as-is
    if (typeof e === 'object' && e !== null && 'status' in e) {
      throw e as FetchBaseQueryError;
    }

    // Fallback: coerce unknown errors to RTK shape so unwrap() consumers get { status, data }
    const fallbackMessage = e instanceof Error ? e.message : String(e);
    const coerced: FetchBaseQueryError = {
      status: 500,
      data: fallbackMessage || 'Unknown server error',
    };
    throw coerced;
  }
};

/**
 * Build a generic RTK Query endpoint from a service function.
 */
export const buildEndpointFromServiceLegacy = <Args extends any[], Result>(
  service: SERVICES,
  serviceFn: (...args: Args) => Promise<Result>,
): {
  queryFn: BaseQueryFn<Args, Result, FetchBaseQueryError | CustomError>;
} => {
  return {
    async queryFn(
      args: Args,
    ): Promise<QueryReturnValue<Result, FetchBaseQueryError | CustomError, object>> {
      try {
        OpenAPI.BASE = getServiceUrl(service);
        OpenAPI.HEADERS = await getHeaders(service);

        const data = await serviceFn(...args);
        return { data };
      } catch (err: any) {
        if (Object.prototype.hasOwnProperty.call(Config.httpErrorHandlers, err?.status)) {
          (Config.httpErrorHandlers as HttpErrorHandlers)[err?.status]();
        }
        return {
          error: {
            status: err?.status || 500,
            data: err?.body || err?.message || 'Unknown error',
          } as FetchBaseQueryError,
        };
      }
    },
  };
};

/**
 * Shortcut for building an endpoint using the DM service.
 */
export const buildEndpointFromDmServiceLegacy = <Args extends any[], Result>(
  serviceFn: (...args: Args) => Promise<Result>,
): {
  queryFn: BaseQueryFn<Args, Result, FetchBaseQueryError | CustomError>;
} => buildEndpointFromServiceLegacy(SERVICES.DM, serviceFn);

/**
 * Shortcut for building an endpoint using the AXD service.
 */
export const buildEndpointFromAxdServiceLegacy = <Args extends any[], Result>(
  serviceFn: (...args: Args) => Promise<Result>,
): {
  queryFn: BaseQueryFn<Args, Result, FetchBaseQueryError | CustomError>;
} => buildEndpointFromServiceLegacy(SERVICES.AXD, serviceFn);
