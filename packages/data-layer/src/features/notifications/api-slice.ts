import { createApi } from '@reduxjs/toolkit/query/react';
import { buildEndpointFromDmService } from '../utils';
import { NotificationsService } from '@iblai/iblai-api';
import { iblFakeBaseQuery } from '@data-layer/core';

export const notificationsApiSlice = createApi({
  reducerPath: 'notificationsApiSlice',
  baseQuery: iblFakeBaseQuery,
  tagTypes: ['Notifications', 'NotificationBuilder'],
  endpoints: (builder) => ({
    getNotificationsCount: builder.query({
      ...buildEndpointFromDmService(
        NotificationsService.notificationV1OrgsUsersNotificationsCountRetrieve,
      ),
      providesTags: ['Notifications'],
    }),
    getNotifications: builder.query({
      ...buildEndpointFromDmService(
        NotificationsService.notificationV1OrgsUsersNotificationsRetrieve,
      ),
      providesTags: ['Notifications'],
    }),
    markAllAsRead: builder.mutation({
      ...buildEndpointFromDmService(NotificationsService.notificationV1OrgsMarkAllAsReadCreate),
      invalidatesTags: ['Notifications'],
    }),
    getNotificationContext: builder.query({
      ...buildEndpointFromDmService(
        NotificationsService.notificationV1OrgsNotificationBuilderContextRetrieve,
      ),
      providesTags: ['NotificationBuilder'],
    }),
    createNotificationPreview: builder.mutation({
      ...buildEndpointFromDmService(
        NotificationsService.notificationV1OrgsNotificationBuilderPreviewCreate,
      ),
      invalidatesTags: ['NotificationBuilder'],
    }),
    sendNotification: builder.mutation({
      ...buildEndpointFromDmService(
        NotificationsService.notificationV1OrgsNotificationBuilderSendCreate,
      ),
      invalidatesTags: ['NotificationBuilder'],
    }),
  }),
});

export const {
  useGetNotificationsCountQuery,
  useLazyGetNotificationsCountQuery,
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useGetNotificationContextQuery,
  useLazyGetNotificationContextQuery,
  useCreateNotificationPreviewMutation,
  useSendNotificationMutation,
} = notificationsApiSlice;
