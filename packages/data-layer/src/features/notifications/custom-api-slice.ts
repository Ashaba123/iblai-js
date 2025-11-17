import { createApi } from '@reduxjs/toolkit/query/react';
import { iblFetchBaseQuery } from '@data-layer/features/utils';
import {
  NOTIFICATIONS_CUSTOM_ENDPOINTS,
  NOTIFICATIONS_CUSTOM_REDUCER_PATH,
  NOTIFICATIONS_CUSTOM_TAGS,
} from './constants';
import { NotificationTemplateDetail, NotificationTemplate } from './types';

export const notificationsCustomApiSlice = createApi({
  reducerPath: NOTIFICATIONS_CUSTOM_REDUCER_PATH,

  tagTypes: [...Object.values(NOTIFICATIONS_CUSTOM_TAGS)],

  baseQuery: iblFetchBaseQuery,

  endpoints: (builder) => ({
    getTemplates: builder.query<NotificationTemplate[], { platformKey: string }>({
      query: (args) => {
        return {
          url: NOTIFICATIONS_CUSTOM_ENDPOINTS.GET_TEMPLATES.path(args.platformKey),
          service: NOTIFICATIONS_CUSTOM_ENDPOINTS.GET_TEMPLATES.service,
        };
      },
      providesTags: [NOTIFICATIONS_CUSTOM_TAGS.TEMPLATES],
    }),
    getTemplateDetails: builder.query<
      NotificationTemplateDetail,
      { platformKey: string; notificationType: string }
    >({
      query: (args) => {
        return {
          url: NOTIFICATIONS_CUSTOM_ENDPOINTS.GET_TEMPLATE_DETAILS.path(
            args.platformKey,
            args.notificationType,
          ),
          service: NOTIFICATIONS_CUSTOM_ENDPOINTS.GET_TEMPLATE_DETAILS.service,
        };
      },
      providesTags: [NOTIFICATIONS_CUSTOM_TAGS.TEMPLATE_DETAILS],
    }),
    updateTemplate: builder.mutation<
      Partial<NotificationTemplateDetail>,
      {
        platformKey: string;
        notificationType: string;
        template: Partial<NotificationTemplateDetail>;
      }
    >({
      query: (args) => {
        return {
          url: NOTIFICATIONS_CUSTOM_ENDPOINTS.UPDATE_TEMPLATE.path(
            args.platformKey,
            args.notificationType,
          ),
          service: NOTIFICATIONS_CUSTOM_ENDPOINTS.UPDATE_TEMPLATE.service,
          method: 'PATCH',
          body: args.template,
        };
      },
      invalidatesTags: [NOTIFICATIONS_CUSTOM_TAGS.TEMPLATE_DETAILS],
    }),
    toggleTemplate: builder.mutation<
      Partial<NotificationTemplateDetail>,
      {
        platformKey: string;
        notificationType: string;
        allow_notification: boolean;
      }
    >({
      query: (args) => {
        return {
          url: NOTIFICATIONS_CUSTOM_ENDPOINTS.TOGGLE_TEMPLATE.path(
            args.platformKey,
            args.notificationType,
          ),
          service: NOTIFICATIONS_CUSTOM_ENDPOINTS.TOGGLE_TEMPLATE.service,
          method: 'PATCH',
          body: {
            allow_notification: args.allow_notification,
          },
        };
      },
      invalidatesTags: [NOTIFICATIONS_CUSTOM_TAGS.TEMPLATES],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useLazyGetTemplatesQuery,
  useGetTemplateDetailsQuery,
  useLazyGetTemplateDetailsQuery,
  useUpdateTemplateMutation,
  useToggleTemplateMutation,
} = notificationsCustomApiSlice;
