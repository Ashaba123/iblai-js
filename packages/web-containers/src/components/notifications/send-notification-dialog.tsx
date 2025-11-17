'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from '@tanstack/react-form';
import { Search, Send, X, Calendar, Clock } from 'lucide-react';
import {
  usePlatformUsersQuery,
  useCreateNotificationPreviewMutation,
  useSendNotificationMutation,
  PlatformUserDetails,
} from '@iblai/data-layer';
import { NotificationSourceTypeEnum } from '@iblai/iblai-api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { RichTextEditor } from '../rich-text-editor';

interface SendNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: string;
  onNotificationSent?: () => void;
}

interface NotificationFormValues {
  preview: string;
  message: string;
}

export function SendNotificationDialog({
  open,
  onOpenChange,
  tenant,
  onNotificationSent,
}: SendNotificationDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<PlatformUserDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sendType, setSendType] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const minDate = useRef(new Date()); // Memoize to prevent re-renders

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // API queries
  const { data: usersData, isLoading: usersLoading } = usePlatformUsersQuery({
    platform_key: tenant,
    query: debouncedSearch || undefined,
    page: 1,
    page_size: 50,
  });

  const [createPreview] = useCreateNotificationPreviewMutation();
  const [sendNotification, { isLoading: isSending }] = useSendNotificationMutation();

  // Form setup
  const form = useForm({
    defaultValues: {
      preview: '',
      message: '',
    } as NotificationFormValues,
    onSubmit: async ({ value }) => {
      if (selectedUsers.length === 0 || !value.preview || !value.message) {
        toast.error('Error', {
          description: 'Please fill in all required fields and select at least one recipient',
        });
        return;
      }

      try {
        const scheduledDateTime =
          sendType === 'schedule' && scheduledDate
            ? new Date(`${format(scheduledDate, 'yyyy-MM-dd')}T${scheduledTime}`)
            : undefined;

        // Create preview
        const previewResponse = await createPreview({
          platformKey: tenant,
          requestBody: {
            template_data: {
              message_title: value.preview,
              message_body: value.message,
            },
            process_on: scheduledDateTime ? scheduledDateTime.toISOString() : undefined,
            sources: selectedUsers.map((user) => ({
              type: NotificationSourceTypeEnum.EMAIL,
              data: user.email,
            })),
            channels: [1], // Default to first channel (in-app notifications)
          },
        }).unwrap();

        if (previewResponse.status !== 'success') {
          throw new Error('Preview failed');
        }

        // Send notification
        const sendResponse = await sendNotification({
          platformKey: tenant,
          requestBody: {
            build_id: previewResponse.build_id,
          },
        }).unwrap();

        if (sendResponse.status !== 'success') {
          throw new Error('Send failed');
        }

        toast.success('Success', {
          description: `Notification ${sendType === 'schedule' ? 'scheduled' : 'sent'} successfully to ${sendResponse.notifications_sent} recipient${sendResponse.notifications_sent !== 1 ? 's' : ''}`,
        });

        // Reset form
        handleClose();
        onNotificationSent?.();
      } catch (error) {
        console.error('Notification error:', error);
        toast.error('Error', {
          description: 'Failed to send notification. Please try again.',
        });
      }
    },
  });

  const toggleUserSelection = (user: PlatformUserDetails) => {
    setSelectedUsers((prev: PlatformUserDetails[]) => {
      const isSelected = prev.some((u) => u.email === user.email);
      return isSelected ? prev.filter((u) => u.email !== user.email) : [...prev, user];
    });
  };

  const handleClose = () => {
    form.reset();
    setSelectedUsers([]);
    setSearchQuery('');
    setSendType('now');
    setScheduledDate(undefined);
    setScheduledTime('12:00');
    onOpenChange(false);
  };

  const users = (usersData?.results as PlatformUserDetails[]) || [];

  const isFormValid =
    form.state.values.preview.trim() !== '' &&
    form.state.values.message.trim() !== '' &&
    selectedUsers.length > 0 &&
    (sendType === 'now' || (sendType === 'schedule' && scheduledDate));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-3xl h-[85vh] flex flex-col"
        aria-describedby="send-notification-description"
        data-testid="send-notification-dialog"
      >
        <DialogTitle></DialogTitle>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle
            id="send-notification-title"
            className="text-xl font-semibold"
            data-testid="send-notification-title"
          >
            Send New Notification
          </DialogTitle>
          <p id="send-notification-description" className="sr-only">
            Create and send a notification to selected users. Fill in the notification details,
            select recipients, and choose to send immediately or schedule for later.
          </p>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex-1 min-h-0 flex flex-col"
          aria-label="Send notification form"
          data-testid="send-notification-form"
        >
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto px-1">
              <div className="space-y-6 pr-4">
                <div className="space-y-2 mt-3">
                  <Label
                    htmlFor="notification-preview"
                    className="text-sm font-medium"
                    aria-required="true"
                  >
                    Preview *
                  </Label>
                  {form.Field({
                    name: 'preview',
                    children: (field) => (
                      <>
                        <Input
                          id="notification-preview"
                          placeholder="Enter notification preview text"
                          value={field.state.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 100) {
                              field.handleChange(value);
                            }
                          }}
                          disabled={form.state.isSubmitting}
                          className="w-full"
                          maxLength={100}
                          aria-label="Notification preview text"
                          aria-describedby="preview-help preview-counter"
                          aria-invalid={
                            field.state.value.length === 0 && form.state.isSubmitted
                              ? 'true'
                              : 'false'
                          }
                          required
                          data-testid="notification-preview-input"
                        />
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span id="preview-help">Keep it concise for better engagement</span>
                          <span
                            id="preview-counter"
                            className={cn(
                              field.state.value.length > 80 && 'text-orange-500',
                              field.state.value.length >= 100 && 'text-red-500',
                            )}
                            aria-live="polite"
                          >
                            {field.state.value.length}/100
                          </span>
                        </div>
                      </>
                    ),
                  })}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="notification-body"
                    className="text-sm font-medium"
                    aria-required="true"
                  >
                    Content *
                  </Label>
                  {form.Field({
                    name: 'message',
                    children: (field) => (
                      <div
                        role="group"
                        aria-labelledby="notification-body"
                        data-testid="notification-body-group"
                      >
                        <RichTextEditor
                          value={field.state.value}
                          onChange={field.handleChange}
                          placeholder="Write your notification message here..."
                          minHeight="180px"
                          exportFormat="html"
                        />
                      </div>
                    ),
                  })}
                </div>

                <fieldset className="space-y-3" data-testid="send-time-fieldset">
                  <legend className="text-sm font-medium">Send Time</legend>
                  <RadioGroup
                    value={sendType}
                    onValueChange={(value: string) => setSendType(value as 'now' | 'schedule')}
                    aria-label="Select send time"
                    data-testid="send-time-radio-group"
                  >
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem
                        value="now"
                        id="send-now"
                        aria-label="Send immediately"
                        data-testid="send-now-radio"
                      />
                      <Label htmlFor="send-now" className="font-normal cursor-pointer">
                        Send immediately
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="schedule"
                        id="send-schedule"
                        aria-label="Schedule for later"
                        data-testid="send-schedule-radio"
                      />
                      <Label htmlFor="send-schedule" className="font-normal cursor-pointer">
                        Schedule for later
                      </Label>
                    </div>
                  </RadioGroup>

                  {sendType === 'schedule' && (
                    <div
                      className="flex gap-3 mt-4 pl-6"
                      role="group"
                      aria-label="Schedule settings"
                      data-testid="schedule-settings"
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'justify-start text-left font-normal min-w-[200px]',
                              !scheduledDate && 'text-muted-foreground',
                            )}
                            aria-label={
                              scheduledDate
                                ? `Selected date: ${format(scheduledDate, 'PPP')}`
                                : 'Pick a date'
                            }
                            aria-haspopup="dialog"
                            data-testid="schedule-date-picker-button"
                          >
                            <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                            {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={(date) => date < minDate.current}
                            initialFocus
                            aria-label="Select scheduled date"
                          />
                        </PopoverContent>
                      </Popover>

                      <div className="flex items-center gap-2 min-w-[140px]">
                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" aria-hidden="true" />
                        <Input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="flex-1"
                          aria-label="Select scheduled time"
                          data-testid="schedule-time-input"
                        />
                      </div>
                    </div>
                  )}
                </fieldset>

                <div className="space-y-2" data-testid="recipients-section">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium" id="recipients-label">
                      Select Recipients *
                    </Label>
                    <span
                      className="text-sm text-gray-500"
                      aria-live="polite"
                      aria-atomic="true"
                      id="selected-count"
                      data-testid="selected-count"
                    >
                      {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>

                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
                      aria-hidden="true"
                    />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      aria-label="Search users"
                      aria-describedby="search-help"
                      data-testid="users-search-input"
                    />
                    <span id="search-help" className="sr-only">
                      Type to search for users by name or email address
                    </span>
                  </div>

                  {selectedUsers.length > 0 && (
                    <div
                      className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100"
                      role="list"
                      aria-label="Selected recipients"
                      data-testid="selected-recipients-list"
                    >
                      {selectedUsers.map((user) => (
                        <div
                          key={user.email}
                          className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-blue-200"
                          role="listitem"
                          data-testid={`selected-user-${user.email}`}
                        >
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                              {(user.name || user.username || user.email)
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">
                            {user.name || user.username || user.email}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleUserSelection(user)}
                            className="hover:bg-gray-100 rounded-full p-0.5 transition-colors"
                            aria-label={`Remove ${user.name || user.username || user.email} from recipients`}
                            data-testid={`remove-user-${user.email}`}
                          >
                            <X className="h-3 w-3 text-gray-500" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className="max-h-[280px] overflow-y-auto space-y-2 border rounded-lg p-2"
                    role="listbox"
                    aria-label="Available users"
                    aria-describedby="recipients-label selected-count"
                    data-testid="available-users-listbox"
                  >
                    {usersLoading ? (
                      <div
                        className="text-center py-8 text-gray-500 text-sm"
                        role="status"
                        aria-live="polite"
                        data-testid="users-loading"
                      >
                        Loading users...
                      </div>
                    ) : users.length > 0 ? (
                      users.map((user: PlatformUserDetails) => {
                        const isSelected = selectedUsers.some((u) => u.email === user.email);
                        const userName = user.name || user.username || user.email;
                        return (
                          <div
                            key={user.email}
                            onClick={() => toggleUserSelection(user)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleUserSelection(user);
                              }
                            }}
                            data-testid={`user-option-${user.email}`}
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                {userName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900">{userName}</div>
                              <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            </div>
                            {isSelected && (
                              <div
                                className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"
                                aria-hidden="true"
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className="text-center py-8 text-gray-500 text-sm"
                        role="status"
                        data-testid="users-empty"
                      >
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t"
            data-testid="dialog-actions"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              aria-label="Cancel and close dialog"
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || form.state.isSubmitting || isSending}
              className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
              aria-label={`${sendType === 'now' ? 'Send notification now' : 'Schedule notification'} to ${selectedUsers.length} recipient${selectedUsers.length !== 1 ? 's' : ''}`}
              data-testid="submit-button"
            >
              <Send className="h-4 w-4 mr-2" aria-hidden="true" />
              {form.state.isSubmitting || isSending
                ? 'Sending...'
                : sendType === 'now'
                  ? 'Send Now'
                  : 'Schedule Notification'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
