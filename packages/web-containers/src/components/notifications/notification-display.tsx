'use client';

import { useState, useEffect } from 'react';
import { CheckCheck, Clock, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { cn, sanitizeHtml } from '../../lib/utils';
import { format } from 'date-fns';
import { useLazyGetNotificationsQuery, useMarkAllAsReadMutation } from '@iblai/data-layer';
import { SendNotificationDialog } from './send-notification-dialog';
import { AlertsTab } from './alerts-tab';

export interface Notification {
  id: string;
  title: string;
  preview: string;
  body: string;
  timestamp: Date;
  read: boolean;
  type: string;
  status?: 'scheduled' | 'sent' | 'opened' | 'failed';
  recipients?: string[];
}

export interface NotificationDisplayProps {
  org: string;
  userId: string;
  isAdmin?: boolean;
  selectedNotificationId?: string;
  className?: string;
}

export function NotificationDisplay({
  org,
  userId,
  isAdmin = false,
  selectedNotificationId,
  className,
}: NotificationDisplayProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const [getNotifications, { isLoading, isError }] = useLazyGetNotificationsQuery();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Helper function to strip HTML tags
  const stripHtml = (html: string): string => {
    if (typeof window === 'undefined') {
      // Server-side fallback: basic regex strip (not perfect but safe)
      return html.replace(/<[^>]*>/g, '');
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Transform API data to our Notification interface
  const transformNotifications = (notificationsData: any): Notification[] => {
    return (
      notificationsData?.results?.map((notification: any) => ({
        id: notification.id,
        title:
          notification?.context?.template_data?.message_title || notification?.title || 'Untitled',
        preview: stripHtml(
          notification?.context?.template_data?.message_body ||
            notification?.body ||
            'No preview available',
        ),
        body:
          notification?.context?.template_data?.message_body ||
          notification?.body ||
          'No content available',
        timestamp: new Date(notification?.created_at),
        read: notification?.status === 'READ',
        type: notification?.type || 'general',
        status: notification?.status?.toLowerCase(),
      })) || []
    );
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAllAsRead({
        platformKey: org,
        requestBody: {
          notification_ids: [id],
        },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications({
        org,
        // @ts-expect-error userId is not part of the useLazyGetNotificationsQuery Query definition
        userId,
      });
      if (response.data) {
        setNotifications(transformNotifications(response.data));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({
        platformKey: org,
        requestBody: {
          notification_ids: notifications.map((notification) => notification.id),
        },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org, userId]); // Remove getNotifications to prevent infinite loop

  // Set initial selected notification
  useEffect(() => {
    if (selectedNotificationId && notifications.length > 0) {
      const notification = notifications.find((n) => n.id === selectedNotificationId);
      if (notification) {
        setSelectedNotification(notification);
        if (!notification.read) {
          handleMarkAsRead(notification.id);
        }
      }
    } else if (notifications.length > 0 && !selectedNotification) {
      setSelectedNotification(notifications[0]);
    }
  }, [selectedNotificationId, notifications]);

  // Close mobile modal on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileModalOpen) {
        setIsMobileModalOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Check on mount
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileModalOpen]);

  return (
    <div
      className={cn('flex flex-col h-full bg-gray-50', className)}
      role="main"
      aria-label="Notifications"
      aria-describedby="notification-display-description"
      data-testid="notification-display-container"
    >
      <div id="notification-display-description" className="sr-only">
        View and manage your notifications. Browse through your inbox, mark notifications as read,
        and send new notifications if you're an administrator.
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 min-h-0 flex flex-col"
        aria-label="Notification sections"
        data-testid="notification-tabs"
      >
        {/* Header */}
        <div
          className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0"
          role="banner"
          data-testid="notification-display-header"
        >
          <div className="flex items-center justify-between">
            <TabsList data-testid="notification-tabs-list">
              <TabsTrigger
                value="inbox"
                className="text-sm font-medium"
                aria-label="Inbox tab"
                data-testid="notification-inbox-tab"
              >
                Inbox
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  value="alerts"
                  className="text-sm font-medium"
                  aria-label="Alerts tab"
                  data-testid="notification-alerts-tab"
                >
                  Alerts
                </TabsTrigger>
              )}
            </TabsList>

            <div
              className="flex items-center gap-3 mr-4"
              role="group"
              aria-label="Notification actions"
              data-testid="notification-actions"
            >
              {isAdmin && (
                <Button
                  onClick={() => setIsSendDialogOpen(true)}
                  className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
                  aria-label="Create new notification"
                  data-testid="new-notification-button"
                >
                  <Plus className="h-4 w-4 md:mr-2" aria-hidden="true" />
                  <span className="hidden md:inline">New Notification</span>
                </Button>
              )}
              {activeTab === 'inbox' && notifications.some((n) => !n.read) && (
                <Button
                  onClick={handleMarkAllAsRead}
                  className="text-blue-600 hover:text-blue-700 bg-transparent border border-gray-200 hover:bg-gray-50"
                  aria-label={`Mark all ${notifications.filter((n) => !n.read).length} unread notifications as read`}
                  data-testid="mark-all-read-button"
                >
                  <CheckCheck className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden md:inline">Mark all as read</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <TabsContent
          value="inbox"
          className="flex-1 min-h-0 flex m-0 data-[state=inactive]:hidden"
          style={{ flex: '1 1 auto' }}
          data-testid="inbox-tab-content"
        >
          <nav
            className="w-full md:w-96 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0"
            aria-label="Notifications list"
            data-testid="notifications-list-nav"
          >
            {/* Loading state */}
            {isLoading && (
              <div
                className="px-3 py-2 text-sm text-gray-500"
                role="status"
                aria-live="polite"
                data-testid="notifications-loading"
              >
                Loading notifications...
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div
                className="px-3 py-2 text-sm text-red-500"
                role="alert"
                aria-live="assertive"
                data-testid="notifications-error"
              >
                Error loading notifications
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && notifications.length === 0 && (
              <div
                className="px-3 py-2 text-sm text-gray-500"
                role="status"
                data-testid="notifications-empty"
              >
                No notifications found
              </div>
            )}

            {/* Notifications list */}
            {!isLoading && !isError && notifications.length > 0 && (
              <ul
                role="list"
                aria-label={`${notifications.length} notifications`}
                data-testid="notifications-list"
              >
                {notifications.map((notification) => (
                  <li key={notification.id} data-testid={`notification-item-${notification.id}`}>
                    <button
                      onClick={() => {
                        setSelectedNotification(notification);
                        if (!notification.read) {
                          handleMarkAsRead(notification.id);
                        }
                        // Open modal on mobile
                        setIsMobileModalOpen(true);
                      }}
                      className={cn(
                        'w-full p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors text-left',
                        selectedNotification?.id === notification.id &&
                          'bg-blue-50 hover:bg-blue-50',
                        !notification.read && 'bg-blue-50/30',
                      )}
                      aria-pressed={selectedNotification?.id === notification.id}
                      aria-label={`${notification.read ? '' : 'Unread: '}${notification.title}, ${formatTimestamp(notification.timestamp)}`}
                      data-testid={`notification-button-${notification.id}`}
                      data-read={notification.read}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                            !notification.read ? 'bg-blue-500' : 'bg-transparent',
                          )}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <h3
                            className={cn(
                              'text-sm font-medium text-gray-900 mb-1',
                              !notification.read && 'font-semibold',
                            )}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {notification.preview}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            <time dateTime={notification.timestamp.toISOString()}>
                              {formatTimestamp(notification.timestamp)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </nav>

          <article
            className="flex-1 min-h-0 overflow-y-auto bg-white p-6 hidden md:block"
            aria-label="Notification details"
            role="region"
            data-testid="notification-details-panel"
          >
            {selectedNotification ? (
              <div className="max-w-3xl mx-auto" data-testid="notification-details-content">
                <header className="mb-6">
                  <h2
                    className="text-2xl font-semibold text-gray-900 mb-2"
                    id="selected-notification-title"
                    data-testid="notification-details-title"
                  >
                    {selectedNotification.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <time
                      dateTime={selectedNotification.timestamp.toISOString()}
                      data-testid="notification-details-timestamp"
                    >
                      {format(selectedNotification.timestamp, "MMMM d, yyyy 'at' h:mm a")}
                    </time>
                  </div>
                </header>
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedNotification.body) }}
                  aria-labelledby="selected-notification-title"
                  data-testid="notification-details-body"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center h-full text-gray-500"
                role="status"
                data-testid="notification-details-empty"
              >
                Select a notification to view details
              </div>
            )}
          </article>
        </TabsContent>

        <TabsContent
          value="alerts"
          className="flex-1 min-h-0 flex m-0 bg-white justify-center items-center data-[state=inactive]:hidden"
          data-testid="alerts-tab-content"
        >
          <AlertsTab platformKey={org} />
        </TabsContent>
      </Tabs>

      {/* Send Notification Dialog */}
      <SendNotificationDialog
        open={isSendDialogOpen}
        onOpenChange={setIsSendDialogOpen}
        tenant={org}
        onNotificationSent={async () => {
          // Fetch updated notifications
          try {
            const response = await getNotifications({
              org,
              // @ts-expect-error userId is not part of the useLazyGetNotificationsQuery Query definition
              userId,
            });
            if (response.data) {
              setNotifications(transformNotifications(response.data));
            }
          } catch (error) {
            console.error('Error fetching notifications:', error);
          }
        }}
      />

      {/* Mobile Notification Content Modal */}
      <Dialog open={isMobileModalOpen} onOpenChange={setIsMobileModalOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto max-w-[95vw]">
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900 pr-6">
                  {selectedNotification.title}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={selectedNotification.timestamp.toISOString()}>
                    {format(selectedNotification.timestamp, "MMMM d, yyyy 'at' h:mm a")}
                  </time>
                </div>
              </DialogHeader>
              <div
                className="prose prose-sm max-w-none text-gray-700 mt-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedNotification.body) }}
                aria-labelledby="mobile-notification-title"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
