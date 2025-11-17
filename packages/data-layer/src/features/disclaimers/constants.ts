import { SERVICES } from '@data-layer/constants';

export const DISCLAIMERS_REDUCER_PATH = 'disclaimersApiSlice';

export const DISCLAIMERS_ENDPOINTS = {
  GET_DISCLAIMERS: {
    service: SERVICES.AXD,
    path: (org: string, userId: string) =>
      `/api/ai-mentor/orgs/${org}/users/${userId}/disclaimers/`,
  },
  CREATE_DISCLAIMER: {
    service: SERVICES.AXD,
    path: (org: string, userId: string) =>
      `/api/ai-mentor/orgs/${org}/users/${userId}/disclaimers/`,
  },
  UPDATE_DISCLAIMER: {
    service: SERVICES.AXD,
    path: (org: string, userId: string, id: string) =>
      `/api/ai-mentor/orgs/${org}/users/${userId}/disclaimers/${id}/`,
  },
  DELETE_DISCLAIMER: {
    service: SERVICES.AXD,
    path: (org: string, userId: string, id: string) =>
      `/api/ai-mentor/orgs/${org}/users/${userId}/disclaimers/${id}/`,
  },
  AGREE_TO_DISCLAIMER: {
    service: SERVICES.AXD,
    path: (org: string, userId: string) =>
      `/api/ai-mentor/orgs/${org}/users/${userId}/disclaimer-agreements/`,
  },
};

export const DISCLAIMERS_QUERY_KEYS = {
  GET_DISCLAIMERS: () => ['DISCLAIMERS'],
};
