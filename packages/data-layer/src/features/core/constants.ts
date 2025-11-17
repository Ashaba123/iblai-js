import { getServiceUrl } from '../utils';
import { SERVICES } from '@data-layer/constants';

export const LOGO_ENDPOINTS = {
  light_logo: (platformKey: string) =>
    getServiceUrl(SERVICES.AXD) + `/api/core/orgs/${platformKey}/logo`,
  dark_logo: (platformKey: string) =>
    getServiceUrl(SERVICES.AXD) + `/api/core/orgs/${platformKey}/dark-mode-logo`,
};

export const CORE_CUSTOM_REDUCER_PATH = 'coreCustomApiSlice';
export const CORE_FAKE_CUSTOM_REDUCER_PATH = 'coreFakeCustomApiSlice';
export const PLATFORM_MEMBERSHIP_TAG = 'PlatformMembership';

export const CORE_CUSTOM_ENDPOINTS = {
  GET_PLATFORM_MEMBERSHIP: {
    path: `/api/core/users/platforms/config/`,
    service: SERVICES.DM,
  },
  UPDATE_PLATFORM_MEMBERSHIP: {
    path: `/api/core/users/platforms/config/`,
    service: SERVICES.DM,
  },
  JOIN_PLATFORM: {
    path: '/api/core/users/platforms/self-link/',
    service: SERVICES.DM,
  },
  GET_PLATFORM_IMAGE_ASSETS_LIST: {
    path: (platform_key: string) => `/api/core/platforms/${platform_key}/public-image-assets/`,
    service: SERVICES.DM,
  },
  CREATE_PLATFORM_IMAGE_ASSET: {
    path: (platform_key: string) => `/api/core/platforms/${platform_key}/public-image-assets/`,
    service: SERVICES.DM,
  },
  GET_PLATFORM_IMAGE_ASSET_DETAILS: {
    path: (platform_key: string, asset_id: number) =>
      `/api/core/platforms/${platform_key}/public-image-assets/${asset_id}/`,
    service: SERVICES.DM,
  },
  UPDATE_PLATFORM_IMAGE_ASSET: {
    path: (platform_key: string, asset_id: number) =>
      `/api/core/platforms/${platform_key}/public-image-assets/${asset_id}/`,
    service: SERVICES.DM,
  },
  DELETE_PLATFORM_IMAGE_ASSET: {
    path: (platform_key: string, asset_id: number) =>
      `/api/core/platforms/${platform_key}/public-image-assets/${asset_id}/`,
    service: SERVICES.DM,
  },
  GET_PUBLIC_PLATFORM_IMAGE_ASSET_FILE_URL: {
    path: (platform_key: string, asset_id: number) =>
      `/api/core/platforms/${platform_key}/public-image-assets/${asset_id}/file/`,
    baseUrl: getServiceUrl(SERVICES.DM),
    service: SERVICES.DM,
  },
};
