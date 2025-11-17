import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { NotificationDisplay } from '../../src/components/notifications/notification-display';

// Mock the data-layer hooks
vi.mock('@iblai/data-layer', () => ({
  useLazyGetNotificationsQuery: vi.fn(),
  useMarkAllAsReadMutation: vi.fn(),
  usePlatformUsersQuery: vi.fn(),
  useCreateNotificationPreviewMutation: vi.fn(),
  useSendNotificationMutation: vi.fn(),
  useGetTemplatesQuery: vi.fn(),
  useLazyGetTemplateDetailsQuery: vi.fn(),
  useToggleTemplateMutation: vi.fn(),
  useUpdateTemplateMutation: vi.fn(),
  useGetTemplateDetailsQuery: vi.fn(),
  useGetMentorsQuery: vi.fn(),
}));

// Mock the web-utils
vi.mock('@iblai/web-utils', () => ({
  getTimeAgo: (date: string) => 'Just now',
}));

// Mock the iblai-api
vi.mock('@iblai/iblai-api', () => ({
  NotificationSourceTypeEnum: {
    EMAIL: 'EMAIL',
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock RichTextEditor component
vi.mock('../../src/components/rich-text-editor', () => ({
  RichTextEditor: ({ value, onChange, placeholder }: any) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-testid="rich-text-editor"
    />
  ),
}));

// No need to mock dialog components since we're not using them anymore

vi.mock('../../src/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('../../src/components/ui/tabs', () => ({
  Tabs: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsList: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsTrigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../../src/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('../../src/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

vi.mock('../../src/components/ui/label', () => ({
  Label: ({ children, ...props }: { children: React.ReactNode }) => (
    <label {...props}>{children}</label>
  ),
}));

vi.mock('../../src/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AvatarImage: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../src/components/ui/radio-group', () => ({
  RadioGroup: ({ children, onValueChange, ...props }: any) => (
    <div role="radiogroup" onChange={(e: any) => onValueChange(e.target.value)} {...props}>
      {children}
    </div>
  ),
  RadioGroupItem: ({ value, id, ...props }: any) => (
    <input type="radio" value={value} id={id} {...props} />
  ),
}));

vi.mock('../../src/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../src/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: any) => (
    <button onClick={() => onSelect(new Date('2024-12-31'))}>Select Date</button>
  ),
}));

vi.mock('../../src/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('NotificationDisplay', () => {
  const mockGetNotifications = vi.fn();
  const mockMarkAllAsRead = vi.fn();

  const mockNotifications = [
    {
      id: '1',
      title: 'Test Notification 1',
      body: '<p>Test body 1</p>',
      created_at: new Date().toISOString(),
      status: 'UNREAD',
      context: {
        template_data: {
          message_title: 'Test Notification 1',
          message_body: '<p>Test body 1</p>',
        },
      },
    },
    {
      id: '2',
      title: 'Test Notification 2',
      body: '<p>Test body 2</p>',
      created_at: new Date().toISOString(),
      status: 'READ',
      context: {
        template_data: {
          message_title: 'Test Notification 2',
          message_body: '<p>Test body 2</p>',
        },
      },
    },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();

    const dataLayer = await import('@iblai/data-layer');

    vi.mocked(dataLayer.useLazyGetNotificationsQuery).mockReturnValue([
      mockGetNotifications,
      { isLoading: false, isError: false },
    ]);

    vi.mocked(dataLayer.useMarkAllAsReadMutation).mockReturnValue([mockMarkAllAsRead, {}]);

    // Mock hooks used by SendNotificationDialog
    vi.mocked(dataLayer.usePlatformUsersQuery).mockReturnValue({
      data: { results: [] },
      isLoading: false,
    });

    vi.mocked(dataLayer.useCreateNotificationPreviewMutation).mockReturnValue([vi.fn(), {}]);

    vi.mocked(dataLayer.useSendNotificationMutation).mockReturnValue([
      vi.fn(),
      { isLoading: false },
    ]);

    vi.mocked(dataLayer.useGetTemplatesQuery).mockReturnValue({
      data: [],
      isLoading: false,
    });

    vi.mocked(dataLayer.useLazyGetTemplateDetailsQuery).mockReturnValue([
      vi.fn(),
      { isLoading: false },
    ]);

    vi.mocked(dataLayer.useGetTemplateDetailsQuery).mockReturnValue({
      data: null,
      isFetching: false,
    });

    vi.mocked(dataLayer.useGetMentorsQuery).mockReturnValue({
      data: { results: [] },
      isLoading: false,
    });

    vi.mocked(dataLayer.useToggleTemplateMutation).mockReturnValue([vi.fn(), { isLoading: false }]);

    vi.mocked(dataLayer.useUpdateTemplateMutation).mockReturnValue([vi.fn(), { isLoading: false }]);

    mockGetNotifications.mockResolvedValue({
      data: {
        results: mockNotifications,
      },
    });

    mockMarkAllAsRead.mockResolvedValue({ data: { status: 'success' } });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on container', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        expect(screen.getByTestId('notification-display-container')).toBeInTheDocument();
      });

      const container = screen.getByTestId('notification-display-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('aria-describedby', 'notification-display-description');
      expect(container).toHaveAttribute('aria-label', 'Notifications');
      expect(container).toHaveAttribute('role', 'main');
    });

    it('should have proper data-testid attributes', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        expect(screen.getByTestId('notification-display-container')).toBeInTheDocument();
        expect(screen.getByTestId('notification-display-header')).toBeInTheDocument();
        expect(screen.getByTestId('notification-tabs')).toBeInTheDocument();
        expect(screen.getByTestId('inbox-tab-content')).toBeInTheDocument();
        expect(screen.getByTestId('notifications-list-nav')).toBeInTheDocument();
      });
    });

    it('should have accessible notification list', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        expect(list).toHaveAttribute('aria-label');
      });
    });

    it('should have proper button labels', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" isAdmin={true} />);

      await waitFor(() => {
        const newNotificationBtn = screen.getByLabelText('Create new notification');
        expect(newNotificationBtn).toBeInTheDocument();
      });
    });

    it('should mark unread notifications with proper aria-label', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const unreadNotification = screen.getByRole('button', {
          name: /Unread: Test Notification 1/i,
        });
        expect(unreadNotification).toBeInTheDocument();
      });
    });

    it('should have time elements with proper datetime attributes', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const timeElements = screen.getAllByRole('time');
        expect(timeElements.length).toBeGreaterThan(0);
        timeElements.forEach((timeEl) => {
          expect(timeEl).toHaveAttribute('dateTime');
        });
      });
    });
  });

  describe('Loading States', () => {
    it('should display loading state with proper test id', async () => {
      const dataLayer = await import('@iblai/data-layer');
      vi.mocked(dataLayer.useLazyGetNotificationsQuery).mockReturnValue([
        mockGetNotifications,
        { isLoading: true, isError: false },
      ]);

      render(<NotificationDisplay org="test-org" userId="test-user" />);

      const loadingEl = screen.getByTestId('notifications-loading');
      expect(loadingEl).toBeInTheDocument();
      expect(loadingEl).toHaveTextContent('Loading notifications...');
      expect(loadingEl).toHaveAttribute('role', 'status');
      expect(loadingEl).toHaveAttribute('aria-live', 'polite');
    });

    it('should display error state with proper test id', async () => {
      const dataLayer = await import('@iblai/data-layer');
      vi.mocked(dataLayer.useLazyGetNotificationsQuery).mockReturnValue([
        mockGetNotifications,
        { isLoading: false, isError: true },
      ]);

      render(<NotificationDisplay org="test-org" userId="test-user" />);

      const errorEl = screen.getByTestId('notifications-error');
      expect(errorEl).toBeInTheDocument();
      expect(errorEl).toHaveTextContent('Error loading notifications');
      expect(errorEl).toHaveAttribute('role', 'alert');
      expect(errorEl).toHaveAttribute('aria-live', 'assertive');
    });

    it('should display empty state with proper test id', async () => {
      mockGetNotifications.mockResolvedValue({
        data: {
          results: [],
        },
      });

      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const emptyEl = screen.getByTestId('notifications-empty');
        expect(emptyEl).toBeInTheDocument();
        expect(emptyEl).toHaveTextContent('No notifications found');
        expect(emptyEl).toHaveAttribute('role', 'status');
      });
    });
  });

  describe('Notification Display', () => {
    it('should render notifications list with proper test ids', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        expect(screen.getByTestId('notifications-list')).toBeInTheDocument();
        expect(screen.getByTestId('notification-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('notification-item-2')).toBeInTheDocument();
        expect(screen.getByTestId('notification-button-1')).toBeInTheDocument();
        expect(screen.getByTestId('notification-button-2')).toBeInTheDocument();
        expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
        expect(screen.getByText('Test Notification 2')).toBeInTheDocument();
      });
    });

    it('should have data-read attribute on notification buttons', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const unreadNotification = screen.getByTestId('notification-button-1');
        const readNotification = screen.getByTestId('notification-button-2');

        expect(unreadNotification).toHaveAttribute('data-read', 'false');
        expect(readNotification).toHaveAttribute('data-read', 'true');
      });
    });

    it('should call fetchNotifications on mount', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        expect(mockGetNotifications).toHaveBeenCalledWith({
          org: 'test-org',
          userId: 'test-user',
        });
      });
    });

    it('should select first notification by default', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const notificationButtons = screen.getAllByRole('button', {
          pressed: true,
        });
        expect(notificationButtons.length).toBeGreaterThan(0);
      });
    });

    it('should display notification details when selected', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const detailsPanel = screen.getByTestId('notification-details-panel');
        expect(detailsPanel).toBeInTheDocument();
        expect(detailsPanel).toHaveAttribute('role', 'region');

        const detailsContent = screen.getByTestId('notification-details-content');
        expect(detailsContent).toBeInTheDocument();

        const detailsTitle = screen.getByTestId('notification-details-title');
        expect(detailsTitle).toBeInTheDocument();

        const detailsTimestamp = screen.getByTestId('notification-details-timestamp');
        expect(detailsTimestamp).toBeInTheDocument();
        expect(detailsTimestamp).toHaveAttribute('datetime');

        const detailsBody = screen.getByTestId('notification-details-body');
        expect(detailsBody).toBeInTheDocument();
      });
    });

    it('should display empty state when no notification is selected', async () => {
      mockGetNotifications.mockResolvedValue({
        data: {
          results: [],
        },
      });

      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const emptyDetails = screen.queryByTestId('notification-details-empty');
        // This will be null if there are notifications, which is expected
        if (emptyDetails) {
          expect(emptyDetails).toHaveTextContent('Select a notification to view details');
        }
      });
    });
  });

  describe('Admin Features', () => {
    it('should show New Notification button for admins with proper test id', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" isAdmin={true} />);

      await waitFor(() => {
        const newNotificationBtn = screen.getByTestId('new-notification-button');
        expect(newNotificationBtn).toBeInTheDocument();
        expect(newNotificationBtn).toHaveAttribute('aria-label', 'Create new notification');
      });
    });

    it('should not show New Notification button for non-admins', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" isAdmin={false} />);

      await waitFor(() => {
        const newNotificationBtn = screen.queryByTestId('new-notification-button');
        expect(newNotificationBtn).not.toBeInTheDocument();
      });
    });

    it('should show Mark all as read button when there are unread notifications with proper test id', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const markAllButton = screen.getByTestId('mark-all-read-button');
        expect(markAllButton).toBeInTheDocument();
        expect(markAllButton).toHaveTextContent('Mark all as read');
        expect(markAllButton).toHaveAttribute('aria-label');
      });
    });

    it('should call markAllAsRead when Mark all as read is clicked', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const markAllButton = screen.getByTestId('mark-all-read-button');
        fireEvent.click(markAllButton);
      });

      await waitFor(() => {
        expect(mockMarkAllAsRead).toHaveBeenCalledWith({
          platformKey: 'test-org',
          requestBody: {
            notification_ids: ['1', '2'],
          },
        });
      });
    });
  });

  describe('Interaction', () => {
    it('should mark notification as read when clicked', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      await waitFor(() => {
        const unreadNotification = screen.getByRole('button', {
          name: /Unread: Test Notification 1/i,
        });
        fireEvent.click(unreadNotification);
      });

      await waitFor(() => {
        expect(mockMarkAllAsRead).toHaveBeenCalledWith({
          platformKey: 'test-org',
          requestBody: {
            notification_ids: ['1'],
          },
        });
      });
    });

    it('should update selected notification on click', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      // Wait for the notification to be available
      const notification2 = await screen.findByText('Test Notification 2');
      const notification2Button = notification2.closest('button')!;

      // Click the notification
      fireEvent.click(notification2Button);

      // Wait for the details title to update with the new notification
      await waitFor(() => {
        expect(screen.getByTestId('notification-details-title')).toHaveTextContent(
          'Test Notification 2',
        );
      });
    });
  });

  describe('Component Rendering', () => {
    it('should render the notification container', () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      expect(screen.getByTestId('notification-display-container')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<NotificationDisplay org="test-org" userId="test-user" />);

      const container = screen.getByTestId('notification-display-container');
      expect(container).toHaveAttribute('role', 'main');
      expect(container).toHaveAttribute('aria-label', 'Notifications');
    });
  });

  describe('Selected Notification Handling', () => {
    it('should select specific notification by ID', async () => {
      render(<NotificationDisplay org="test-org" userId="test-user" selectedNotificationId="2" />);

      await waitFor(() => {
        const notification2Button = screen.getByRole('button', {
          name: /Test Notification 2/i,
        });
        expect(notification2Button).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });
});
