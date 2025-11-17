import { SERVICES } from '../../constants';

export const USERS_ENDPOINTS = {
  GET_USER_METADATA: {
    service: SERVICES.LMS,
    path: (): string => `/api/ibl/users/manage/metadata/`,
  },
  RESET_PASSWORD: {
    service: SERVICES.LMS,
    path: (): string => `/account/password`,
  },
  UPDATE_USER_ROLES: {
    service: SERVICES.LMS,
    path: (): string => `/api/ibl/users/manage/roles/`,
  },
  UPLOAD_PROFILE_IMAGE: {
    service: SERVICES.LMS,
    path: (username: string): string => `/api/user/v1/accounts/${username}/image`,
  },
  EDX_UPDATE_USER_METADATA: {
    service: SERVICES.LMS,
    path: (username: string): string => `/api/user/v1/accounts/${username}`,
  },
  EDX_GET_USER_METADATA: {
    service: SERVICES.LMS,
    path: (username: string): string => `/api/user/v1/accounts/${username}`,
  },
  REMOVE_PROFILE_IMAGE: {
    service: SERVICES.LMS,
    path: (username: string): string => `/api/profile_images/v1/${username}/remove`,
  },
};

export const USERS_QUERY_KEYS = {
  GET_USER_METADATA: (): string[] => ['USER_METADATA'],
  GET_USER_METADATA_EDX: (): string[] => ['USER_METADATA_EDX'],
  RESET_PASSWORD: (): string[] => ['RESET_PASSWORD'],
  UPDATE_USER_ROLES: (): string[] => ['UPDATE_USER_ROLES'],
  UPLOAD_PROFILE_IMAGE: (): string[] => ['UPLOAD_PROFILE_IMAGE'],
  EDX_UPDATE_USER_METADATA: (): string[] => ['EDX_UPDATE_USER_METADATA'],
  EDX_GET_USER_METADATA: (): string[] => ['EDX_GET_USER_METADATA'],
  REMOVE_PROFILE_IMAGE: (): string[] => ['REMOVE_PROFILE_IMAGE'],
};

export const USERS_REDUCER_PATH = 'userApiSlice';
