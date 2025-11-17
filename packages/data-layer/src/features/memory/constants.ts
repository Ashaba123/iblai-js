import { SERVICES } from '@data-layer/constants';

export const MEMORY_REDUCER_PATH = 'memoryApiSlice';

export const MEMORY_ENDPOINTS = {
  GET_MEMORIES: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/memories/`,
  },
  GET_MEMORY_CATEGORIES: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/memory-categories/`,
  },
  GET_MENTOR_USER_SETTINGS: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string, mentorId: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/mentors/${mentorId}/mentor-user-settings/`,
  },
  UPDATE_MENTOR_USER_SETTINGS: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string, mentorId: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/mentors/${mentorId}/mentor-user-settings/`,
  },
  DELETE_MEMORY: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string, memoryId: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/memory-entries/${memoryId}/`,
  },
  DELETE_MEMORY_BY_CATEGORY: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string, category: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/memory-entries/${category}/`,
  },
  UPDATE_MEMORY_ENTRY: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string, entryId: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/memory-entries/${entryId}/`,
  },
  CREATE_MEMORY: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/memories/`,
  },
  GET_MEMORY_FILTERS: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/memory-filter/`,
  },
  GET_FILTERED_MEMORIES: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/filtered-memories/`,
  },
};

export const MEMORY_QUERY_KEYS = {
  GET_MEMORIES: () => ['MEMORIES'],
  GET_MEMORY_CATEGORIES: () => ['MEMORY_CATEGORIES'],
  GET_MENTOR_USER_SETTINGS: () => ['MENTOR_USER_SETTINGS'],
  GET_FILTERED_MEMORIES: () => ['FILTERED_MEMORIES'],
};
