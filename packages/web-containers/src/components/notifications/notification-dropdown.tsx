'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import {
  useGetNotificationsCountQuery,
  useLazyGetNotificationsQuery,
  useMarkAllAsReadMutation,
} from '@iblai/data-layer';
import { getTimeAgo } from '@iblai/web-utils';

export interface NotificationDropdownProps {
  org: string;
  userId: string;
  isAdmin?: boolean;
  className?: string;
  onViewNotifications?: (notificationId?: string) => void;
}

export function NotificationDropdown({
  org,
  userId,
  className,
  onViewNotifications,
}: NotificationDropdownProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showOnlyUnread] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<any[]>([]);

  const { data: notificationCount, isLoading: isNotificationCountLoading } =
    useGetNotificationsCountQuery({
      org,
      // @ts-expect-error userId is not part of the useGetNotificationsCountQuery Query definition
      userId,
      status: 'UNREAD',
    });

  const [getNotifications, { isLoading, isError }] = useLazyGetNotificationsQuery();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const handleFetchNotifications = async () => {
    try {
      const response = await getNotifications({
        org,
        // @ts-expect-error userId is not part of the useLazyGetNotificationsQuery Query definition
        userId,
      });
      if (isError) {
        throw new Error();
      }
      // @ts-ignore
      setNotifications(response?.data?.results || []);
      // @ts-ignore
      setFilteredNotifications(response?.data?.results || []);
    } catch (error) {
      setNotifications([]);
      setFilteredNotifications([]);
    }
  };

  const handleMarkAllAsRead = async (notificationId?: string) => {
    try {
      await markAllAsRead({
        platformKey: org,
        requestBody: {
          notification_ids: notificationId
            ? [notificationId]
            : notifications.map((notification) => notification.id),
        },
      });
      handleFetchNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    onViewNotifications?.(notificationId);
    setNotificationsOpen(false);
  };

  useEffect(() => {
    if (notificationsOpen) {
      handleFetchNotifications();
    }
  }, [notificationsOpen]);

  useEffect(() => {
    if (Array.isArray(notifications) && notifications.length > 0) {
      if (showOnlyUnread) {
        setFilteredNotifications(
          notifications.filter((notification) => notification.status === 'UNREAD'),
        );
      } else {
        setFilteredNotifications(notifications);
      }
    }
  }, [showOnlyUnread, notifications]);

  return (
    <>
      <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`relative ${className}`}
            // @ts-expect-error count is not part of the notifictionCount object
            aria-label={`${notificationCount?.count ?? 0} Notification${notificationCount?.count === 1 ? '' : 's'}`}
          >
            <Bell className="h-5 w-5" />
            {!isNotificationCountLoading &&
              // @ts-expect-error count is not part of the notifictionCount object
              Number(notificationCount?.count) > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {/* @ts-expect-error count is not part of the notifictionCount object */}
                  {notificationCount?.count}
                </span>
              )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[300px] p-2 z-[9999] border border-gray-100 max-h-[300px] overflow-y-auto"
        >
          <div className="px-4 py-3 text-sm font-semibold border-b border-gray-100 flex items-center justify-between">
            <span>Notifications</span>
            <Button
              variant="link"
              size="sm"
              className="text-sm text-blue-600 h-auto p-0"
              onClick={() => onViewNotifications?.()}
            >
              View all
            </Button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="px-3 py-2 text-sm text-gray-500">Loading notifications...</div>
          )}

          {/* Error or empty state */}
          {(!isLoading && isError) ||
          (!isLoading && !isError && filteredNotifications.length === 0) ? (
            <div className="px-3 py-2 text-sm text-gray-500">No new notifications.</div>
          ) : (
            <>
              {/* Notification items */}
              {!isLoading &&
                !isError &&
                filteredNotifications.length > 0 &&
                filteredNotifications.map((notification: any, index) => (
                  <DropdownMenuItem
                    key={`Notification ${index}`}
                    className="flex flex-col items-start px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => {
                      handleNotificationClick(notification.id);
                      if (notification.status === 'UNREAD') {
                        handleMarkAllAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex w-full">
                      <div className="flex-1">
                        <span className="font-medium">
                          {notification?.context?.template_data?.message_title ||
                            notification?.title}
                        </span>
                        <span className="text-xs text-gray-500 block mt-1">
                          {getTimeAgo(notification?.created_at)}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}

              {/* Mark all as read button */}
              {filteredNotifications.length > 0 &&
                filteredNotifications.some((notification) => notification.status === 'UNREAD') && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-3 py-2 text-center">
                      <Button
                        variant="link"
                        className="text-sm text-blue-600"
                        onClick={() => handleMarkAllAsRead()}
                      >
                        Mark all as read
                      </Button>
                    </div>
                  </>
                )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
