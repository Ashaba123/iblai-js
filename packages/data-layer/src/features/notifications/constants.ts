import { SERVICES } from '@data-layer/constants';

export const NOTIFICATIONS_CUSTOM_REDUCER_PATH = 'notificationsCustomApiSlice';

export const NOTIFICATIONS_CUSTOM_TAGS = {
  TEMPLATES: 'NOTIFICATIONS_CUSTOM_TEMPLATES',
  TEMPLATE_DETAILS: 'NOTIFICATIONS_CUSTOM_TEMPLATE_DETAILS',
  UPDATE_TEMPLATE: 'NOTIFICATIONS_CUSTOM_UPDATE_TEMPLATE',
  TOGGLE_TEMPLATE: 'NOTIFICATIONS_CUSTOM_TOGGLE_TEMPLATE',
};

export const NOTIFICATIONS_CUSTOM_ENDPOINTS = {
  GET_TEMPLATES: {
    service: SERVICES.DM,
    path: (platformKey: string) => `/api/notification/v1/platforms/${platformKey}/templates/`,
  },
  GET_TEMPLATE_DETAILS: {
    service: SERVICES.DM,
    path: (platformKey: string, notificationType: string) =>
      `/api/notification/v1/platforms/${platformKey}/templates/${notificationType}/`,
  },
  UPDATE_TEMPLATE: {
    service: SERVICES.DM,
    path: (platformKey: string, notificationType: string) =>
      `/api/notification/v1/platforms/${platformKey}/templates/${notificationType}/`,
  },
  TOGGLE_TEMPLATE: {
    service: SERVICES.DM,
    path: (platformKey: string, notificationType: string) =>
      `/api/notification/v1/platforms/${platformKey}/templates/${notificationType}/toggle/`,
  },
};
