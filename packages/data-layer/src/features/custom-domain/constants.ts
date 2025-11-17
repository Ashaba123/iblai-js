import { SERVICES } from '@data-layer/constants';

export const CUSTOM_DOMAIN_REDUCER_PATH = 'customDomainApiSlice';

export const CUSTOM_DOMAIN_ENDPOINTS = {
  GET_CUSTOM_DOMAINS: {
    service: SERVICES.DM,
    path: () => `/api/custom-domains`,
  },
  CREATE_CUSTOM_DOMAIN: {
    service: SERVICES.DM,
    path: () => `/api/custom-domains/create/`,
  },
  DELETE_CUSTOM_DOMAIN: {
    service: SERVICES.DM,
    path: (domain_id: number) => `/api/custom-domains/${domain_id}/delete/`,
  },
  /* GET_MENTOR_USER_SETTINGS: {
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
  }, */
};

export const CUSTOM_DOMAIN_QUERY_KEYS = {
  GET_CUSTOM_DOMAINS: () => ['CUSTOM_DOMAINS'],
  CREATE_CUSTOM_DOMAIN: () => ['CREATE_CUSTOM_DOMAIN'],
};
