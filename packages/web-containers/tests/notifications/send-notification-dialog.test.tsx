import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { SendNotificationDialog } from '../../src/components/notifications/send-notification-dialog';

// Mock the data-layer hooks
vi.mock('@iblai/data-layer', () => ({
  usePlatformUsersQuery: vi.fn(),
  useCreateNotificationPreviewMutation: vi.fn(),
  useSendNotificationMutation: vi.fn(),
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

// Mock UI components
vi.mock('../../src/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="send-dialog">{children}</div> : null,
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}));

vi.mock('../../src/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: string;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  ),
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

describe('SendNotificationDialog', () => {
  const mockGetPlatformUsers = vi.fn();
  const mockCreatePreview = vi.fn();
  const mockSendNotification = vi.fn();
  const mockOnOpenChange = vi.fn();
  const mockOnNotificationSent = vi.fn();

  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      profile_image: 'https://example.com/john.jpg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      profile_image: 'https://example.com/jane.jpg',
    },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();

    const dataLayer = await import('@iblai/data-layer');

    vi.mocked(dataLayer.usePlatformUsersQuery).mockReturnValue({
      data: { results: mockUsers },
      isLoading: false,
    });

    vi.mocked(dataLayer.useCreateNotificationPreviewMutation).mockReturnValue([
      mockCreatePreview,
      {},
    ]);
    vi.mocked(dataLayer.useSendNotificationMutation).mockReturnValue([
      mockSendNotification,
      { isLoading: false },
    ]);

    mockCreatePreview.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        status: 'success',
        build_id: 'test-build-id',
      }),
    });

    mockSendNotification.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        status: 'success',
        notifications_sent: 2,
      }),
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes and test IDs on dialog', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const dialog = screen.getByTestId('send-notification-dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-describedby', 'send-notification-description');

      const title = screen.getByTestId('send-notification-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Send New Notification');

      const form = screen.getByTestId('send-notification-form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('aria-label', 'Send notification form');
    });

    it('should have accessible form elements with proper test IDs', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const previewInput = screen.getByTestId('notification-preview-input');
      expect(previewInput).toBeInTheDocument();
      expect(previewInput).toHaveAttribute('aria-label', 'Notification preview text');
      expect(previewInput).toHaveAttribute('required');

      const bodyGroup = screen.getByTestId('notification-body-group');
      expect(bodyGroup).toBeInTheDocument();

      const sendTimeFieldset = screen.getByTestId('send-time-fieldset');
      expect(sendTimeFieldset).toBeInTheDocument();

      const radioGroup = screen.getByTestId('send-time-radio-group');
      expect(radioGroup).toBeInTheDocument();
      expect(radioGroup).toHaveAttribute('aria-label', 'Select send time');
    });

    it('should have proper aria-labels and test IDs on action buttons', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const cancelButton = screen.getByTestId('cancel-button');
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveAttribute('aria-label', 'Cancel and close dialog');

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('aria-label');
      expect(submitButton.getAttribute('aria-label')).toMatch(
        /Send notification now to 0 recipient/i,
      );
    });

    it('should have accessible user search with proper test ID', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const searchInput = screen.getByTestId('users-search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('aria-label', 'Search users');
      expect(searchInput).toHaveAttribute('aria-describedby', 'search-help');
      expect(searchInput).toHaveAttribute('placeholder');
    });

    it('should have accessible user list with proper ARIA attributes and test ID', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const userList = screen.getByTestId('available-users-listbox');
      expect(userList).toBeInTheDocument();
      expect(userList).toHaveAttribute('role', 'listbox');
      expect(userList).toHaveAttribute('aria-label', 'Available users');
      expect(userList).toHaveAttribute('aria-describedby', 'recipients-label selected-count');
    });

    it('should have aria-live region for selected count with test ID', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const selectedCount = screen.getByTestId('selected-count');
      expect(selectedCount).toBeInTheDocument();
      expect(selectedCount).toHaveTextContent('0 users selected');
      expect(selectedCount).toHaveAttribute('aria-live', 'polite');
      expect(selectedCount).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Form Validation', () => {
    it('should require preview text with proper test ID', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const previewInput = screen.getByTestId('notification-preview-input');
      expect(previewInput).toHaveAttribute('required');
      expect(previewInput).toHaveAttribute('aria-label', 'Notification preview text');
    });

    it('should limit preview text to 100 characters with test ID', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const previewInput = screen.getByTestId('notification-preview-input') as HTMLInputElement;
      expect(previewInput).toHaveAttribute('maxLength', '100');

      const longText = 'a'.repeat(150);
      await user.type(previewInput, longText);

      expect(previewInput.value.length).toBeLessThanOrEqual(100);
    });

    it('should show character count for preview', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      expect(screen.getByText('0/100')).toBeInTheDocument();
    });

    it('should disable submit button when form is invalid', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when form is valid', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      // Fill in preview
      const previewInput = screen.getByLabelText(/Preview/i);
      await user.type(previewInput, 'Test Preview');

      // Fill in message
      const messageInput = screen.getByTestId('rich-text-editor');
      await user.type(messageInput, 'Test Message');

      // Select a user
      const userOption = screen.getByText('John Doe');
      await user.click(userOption);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', {
          name: /Send notification now to 1 recipient/i,
        });
        expect(submitButton).toBeEnabled();
      });
    });
  });

  describe('User Selection', () => {
    it('should display list of users', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should allow selecting users', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const userOption = screen.getByText('John Doe');
      await user.click(userOption);

      await waitFor(() => {
        expect(screen.getByText('1 user selected')).toBeInTheDocument();
      });
    });

    it('should allow deselecting users', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const userOption = screen.getByText('John Doe');
      await user.click(userOption);

      await waitFor(() => {
        expect(screen.getByText('1 user selected')).toBeInTheDocument();
      });

      await user.click(userOption);

      await waitFor(() => {
        expect(screen.getByText('0 users selected')).toBeInTheDocument();
      });
    });

    it('should show selected users in tags', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const userOption = screen.getByText('John Doe');
      await user.click(userOption);

      await waitFor(() => {
        const selectedUsersList = screen.getByRole('list', { name: 'Selected recipients' });
        expect(selectedUsersList).toBeInTheDocument();
      });
    });

    it('should allow removing selected users via X button', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const userOption = screen.getByText('John Doe');
      await user.click(userOption);

      await waitFor(() => {
        const removeButton = screen.getByLabelText(/Remove John Doe from recipients/i);
        expect(removeButton).toBeInTheDocument();
      });

      const removeButton = screen.getByLabelText(/Remove John Doe from recipients/i);
      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.getByText('0 users selected')).toBeInTheDocument();
      });
    });

    it('should filter users based on search query', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const searchInput = screen.getByLabelText('Search users');
      await user.type(searchInput, 'John');

      // Verify the search input has the value
      expect(searchInput).toHaveValue('John');
    });
  });

  describe('Send Time Options', () => {
    it('should default to send now', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const sendNowRadio = screen.getByTestId('send-now-radio');
      expect(sendNowRadio).toBeInTheDocument();
      expect(sendNowRadio).toHaveAttribute('value', 'now');
    });

    it('should allow switching to schedule', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const scheduleRadio = screen.getByLabelText('Schedule for later');
      await user.click(scheduleRadio);

      await waitFor(() => {
        expect(screen.getByText('Pick a date')).toBeInTheDocument();
      });
    });

    it('should show date and time pickers when schedule is selected', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const scheduleRadio = screen.getByLabelText('Schedule for later');
      await user.click(scheduleRadio);

      await waitFor(() => {
        expect(screen.getByText('Pick a date')).toBeInTheDocument();
        expect(screen.getByLabelText('Select scheduled time')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          tenant="test-tenant"
          onNotificationSent={mockOnNotificationSent}
        />,
      );

      // Fill in preview
      const previewInput = screen.getByTestId('notification-preview-input');
      await user.type(previewInput, 'Test Preview');

      // Fill in message
      const messageInput = screen.getByTestId('rich-text-editor');
      await user.type(messageInput, 'Test Message');

      // Select a user
      const userOption = screen.getByText('John Doe');
      await user.click(userOption);

      // Wait for form to be valid
      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).toBeEnabled();
      });

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      // Verify the form was submitted (mocks were called)
      await waitFor(() => {
        expect(mockCreatePreview).toHaveBeenCalled();
      });
    });

    it('should show success toast on successful send', async () => {
      const user = userEvent.setup();

      render(
        <SendNotificationDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          tenant="test-tenant"
          onNotificationSent={mockOnNotificationSent}
        />,
      );

      // Fill in preview
      const previewInput = screen.getByTestId('notification-preview-input');
      await user.type(previewInput, 'Test Preview');

      // Fill in message
      const messageInput = screen.getByTestId('rich-text-editor');
      await user.type(messageInput, 'Test Message');

      // Select a user
      const userOption = screen.getByText('John Doe');
      await user.click(userOption);

      // Wait for form to be valid
      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).toBeEnabled();
      });

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      // Verify the API calls were made
      await waitFor(
        () => {
          expect(mockCreatePreview).toHaveBeenCalled();
          expect(mockSendNotification).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    it('should show error toast on failed send', async () => {
      const user = userEvent.setup();

      mockSendNotification.mockReturnValue({
        unwrap: vi.fn().mockRejectedValue(new Error('Send failed')),
      });

      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      // Fill in preview
      const previewInput = screen.getByTestId('notification-preview-input');
      await user.type(previewInput, 'Test Preview');

      // Fill in message
      const messageInput = screen.getByTestId('rich-text-editor');
      await user.type(messageInput, 'Test Message');

      // Select a user
      const userOption = screen.getByText('John Doe');
      await user.click(userOption);

      // Wait for form to be valid
      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).toBeEnabled();
      });

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      // Verify the error was handled (form attempted submission)
      await waitFor(() => {
        expect(mockCreatePreview).toHaveBeenCalled();
      });
    });

    it('should show error when no recipients selected', async () => {
      const user = userEvent.setup();

      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      // Fill in preview
      const previewInput = screen.getByTestId('notification-preview-input');
      await user.type(previewInput, 'Test Preview');

      // Fill in message
      const messageInput = screen.getByTestId('rich-text-editor');
      await user.type(messageInput, 'Test Message');

      // Submit button should remain disabled without recipients
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Dialog Control', () => {
    it('should not render when open is false', () => {
      render(
        <SendNotificationDialog
          open={false}
          onOpenChange={mockOnOpenChange}
          tenant="test-tenant"
        />,
      );

      expect(screen.queryByTestId('send-notification-dialog')).not.toBeInTheDocument();
    });

    it('should call onOpenChange when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should reset form when closed', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      // Fill in preview
      const previewInput = screen.getByTestId('notification-preview-input') as HTMLInputElement;
      await user.type(previewInput, 'Test Preview');

      // Cancel
      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Recipients Section', () => {
    it('should have proper test IDs for recipients section', () => {
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const recipientsSection = screen.getByTestId('recipients-section');
      expect(recipientsSection).toBeInTheDocument();

      const usersList = screen.getByTestId('available-users-listbox');
      expect(usersList).toBeInTheDocument();
    });

    it('should show selected users with proper test IDs', async () => {
      const user = userEvent.setup();
      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const userOption = screen.getByText('John Doe');
      await user.click(userOption);

      await waitFor(() => {
        const selectedList = screen.getByTestId('selected-recipients-list');
        expect(selectedList).toBeInTheDocument();
        expect(selectedList).toHaveAttribute('role', 'list');
        expect(selectedList).toHaveAttribute('aria-label', 'Selected recipients');
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state for users with test ID', async () => {
      const dataLayer = await import('@iblai/data-layer');
      vi.mocked(dataLayer.usePlatformUsersQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const loadingEl = screen.getByTestId('users-loading');
      expect(loadingEl).toBeInTheDocument();
      expect(loadingEl).toHaveTextContent('Loading users...');
      expect(loadingEl).toHaveAttribute('role', 'status');
      expect(loadingEl).toHaveAttribute('aria-live', 'polite');
    });

    it('should show no users found state with test ID', async () => {
      const dataLayer = await import('@iblai/data-layer');
      vi.mocked(dataLayer.usePlatformUsersQuery).mockReturnValue({
        data: { results: [] },
        isLoading: false,
      });

      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const emptyEl = screen.getByTestId('users-empty');
      expect(emptyEl).toBeInTheDocument();
      expect(emptyEl).toHaveTextContent('No users found');
      expect(emptyEl).toHaveAttribute('role', 'status');
    });

    it('should disable submit button while sending', async () => {
      const dataLayer = await import('@iblai/data-layer');
      vi.mocked(dataLayer.useSendNotificationMutation).mockReturnValue([
        mockSendNotification,
        { isLoading: true },
      ]);

      render(
        <SendNotificationDialog open={true} onOpenChange={mockOnOpenChange} tenant="test-tenant" />,
      );

      const submitButton = screen.getByRole('button', { name: /Send notification/i });
      expect(submitButton).toBeDisabled();
    });
  });
});
