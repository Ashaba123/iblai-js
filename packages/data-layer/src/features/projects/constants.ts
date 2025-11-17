import { SERVICES } from "@data-layer/constants";

export const PROJECTS_CUSTOM_REDUCER_PATH = "projectsCustomApiSlice";

export const PROJECTS_CUSTOM_ENDPOINTS = {
  // User routes
  GET_USER_PROJECTS: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/projects/`,
  },
  GET_USER_PROJECT_DETAILS: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string, id: number) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/projects/${id}/`,
  },
  CREATE_USER_PROJECT: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/projects/`,
  },
  UPDATE_USER_PROJECT: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string, id: number) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/projects/${id}/`,
  },
  DELETE_USER_PROJECT: {
    service: SERVICES.AXD,
    path: (tenantKey: string, username: string, id: number) =>
      `/api/ai-mentor/orgs/${tenantKey}/users/${username}/projects/${id}/`,
  },
  
  // Admin routes
  GET_ADMIN_PROJECTS: {
    service: SERVICES.AXD,
    path: (tenantKey: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/projects/`,
  },
  GET_ADMIN_PROJECT_DETAILS: {
    service: SERVICES.AXD,
    path: (tenantKey: string, id: number) =>
      `/api/ai-mentor/orgs/${tenantKey}/projects/${id}/`,
  },
  CREATE_ADMIN_PROJECT: {
    service: SERVICES.AXD,
    path: (tenantKey: string) =>
      `/api/ai-mentor/orgs/${tenantKey}/projects/`,
  },
  UPDATE_ADMIN_PROJECT: {
    service: SERVICES.AXD,
    path: (tenantKey: string, id: number) =>
      `/api/ai-mentor/orgs/${tenantKey}/projects/${id}/`,
  },
  DELETE_ADMIN_PROJECT: {
    service: SERVICES.AXD,
    path: (tenantKey: string, id: number) =>
      `/api/ai-mentor/orgs/${tenantKey}/projects/${id}/`,
  },
};

export const PROJECTS_QUERY_KEYS = {
  GET_PROJECTS: () => ["PROJECTS"],
  GET_PROJECT_DETAILS: () => ["PROJECT_DETAILS"],
  CREATE_PROJECT: () => ["CREATE_PROJECT"],
  UPDATE_PROJECT: () => ["UPDATE_PROJECT"],
  DELETE_PROJECT: () => ["DELETE_PROJECT"],
};