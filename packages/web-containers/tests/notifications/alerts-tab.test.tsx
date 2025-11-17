import type { ReactNode, MouseEvent } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { AlertsTab } from '../../src/components/notifications/alerts-tab';

const dataLayerMocks = vi.hoisted(() => ({
  useGetTemplatesQuery: vi.fn(),
  useLazyGetTemplateDetailsQuery: vi.fn(),
  useToggleTemplateMutation: vi.fn(),
  useUpdateTemplateMutation: vi.fn(),
  useLazyGetNotificationsQuery: vi.fn(),
  useMarkAllAsReadMutation: vi.fn(),
  usePlatformUsersQuery: vi.fn(),
  useCreateNotificationPreviewMutation: vi.fn(),
  useSendNotificationMutation: vi.fn(),
  useGetTemplateDetailsQuery: vi.fn(),
  useGetMentorsQuery: vi.fn(),
}));

const mockSanitizeHtml = vi.fn((value: string) => value);
const mockEditAlertDialog = vi.fn((props: any) =>
  props.open ? <div data-testid="edit-alert-dialog" /> : null,
);

let getTemplateDetailsSpy: ReturnType<typeof vi.fn>;
let toggleTemplateSpy: ReturnType<typeof vi.fn>;

vi.mock('@iblai/data-layer', () => dataLayerMocks);

vi.mock('../../src/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('../../src/components/ui/switch', () => ({
  Switch: ({
    checked,
    onCheckedChange,
    onClick,
    ...props
  }: {
    checked?: boolean;
    onCheckedChange?: (value: boolean) => void;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-testid="template-switch"
      onClick={(event) => {
        onClick?.(event);
        onCheckedChange?.(!checked);
      }}
      {...props}
    >
      {checked ? 'On' : 'Off'}
    </button>
  ),
}));

vi.mock('../../src/components/notifications/edit-alert-dialog', () => ({
  EditAlertDialog: (props: any) => mockEditAlertDialog(props),
}));

vi.mock('../../src/lib/utils', () => ({
  sanitizeHtml: (value: string) => mockSanitizeHtml(value),
}));

describe('AlertsTab', () => {
  const platformKey = 'test-platform';

  const proactiveTemplate = {
    id: 'template-1',
    type: 'PROACTIVE_LEARNER_NOTIFICATION',
    name: 'Proactive Template',
    description: 'Handles proactive learner messaging',
    is_enabled: true,
  };

  const reminderTemplate = {
    id: 'template-2',
    type: 'REMINDER_LEARNER_NOTIFICATION',
    name: 'Reminder Template',
    description: 'Handles reminder messaging',
    is_enabled: false,
  };

  beforeEach(() => {
    Object.values(dataLayerMocks).forEach((mockFn) => {
      mockFn.mockReset();
    });
    mockSanitizeHtml.mockReset();
    mockEditAlertDialog.mockReset();

    dataLayerMocks.useGetTemplatesQuery.mockReturnValue({
      data: [proactiveTemplate, reminderTemplate],
      isLoading: false,
      error: null,
    });

    getTemplateDetailsSpy = vi.fn().mockResolvedValue({
      data: {
        message_body: '<p>Proactive Message</p>',
        short_message_body: '<strong>Brief proactive summary</strong>',
      },
    });

    dataLayerMocks.useLazyGetTemplateDetailsQuery.mockReturnValue([getTemplateDetailsSpy]);

    const unwrapMock = vi.fn().mockResolvedValue({});
    toggleTemplateSpy = vi.fn().mockReturnValue({ unwrap: unwrapMock });
    dataLayerMocks.useToggleTemplateMutation.mockReturnValue([toggleTemplateSpy]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders templates returned by the API query', async () => {
    render(<AlertsTab platformKey={platformKey} />);

    expect(await screen.findByText('Proactive Template')).toBeInTheDocument();
    expect(screen.getByText('Handles proactive learner messaging')).toBeInTheDocument();
    expect(screen.getByText('Reminder Template')).toBeInTheDocument();
  });

  it('fetches template details when a template card is clicked and shows sanitized preview', async () => {
    render(<AlertsTab platformKey={platformKey} />);

    const proactiveDescription = await screen.findByText('Handles proactive learner messaging');
    fireEvent.click(proactiveDescription);

    await waitFor(() => {
      expect(getTemplateDetailsSpy).toHaveBeenCalledWith({
        platformKey,
        notificationType: proactiveTemplate.type,
      });
    });

    await waitFor(() => {
      expect(mockSanitizeHtml).toHaveBeenCalledWith('<strong>Brief proactive summary</strong>');
      expect(screen.getByText('Brief proactive summary')).toBeInTheDocument();
    });

    // Collapse the preview when the template is clicked again
    fireEvent.click(proactiveDescription);
    await waitFor(() => {
      expect(screen.queryByText('Brief proactive summary')).not.toBeInTheDocument();
    });
  });

  it('toggles template active state via mutation when switch is clicked', async () => {
    render(<AlertsTab platformKey={platformKey} />);

    const toggleSwitches = await screen.findAllByTestId('template-switch');
    fireEvent.click(toggleSwitches[0]);

    await waitFor(() => {
      expect(toggleTemplateSpy).toHaveBeenCalledWith({
        platformKey,
        notificationType: proactiveTemplate.type,
        allow_notification: false,
      });
    });
  });

  it('opens the edit alert dialog with the selected template', async () => {
    render(<AlertsTab platformKey={platformKey} />);

    const editButtons = await screen.findAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(mockEditAlertDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          open: true,
          template: proactiveTemplate,
          platformKey,
          templateType: proactiveTemplate.type,
        }),
      );
      expect(screen.getByTestId('edit-alert-dialog')).toBeInTheDocument();
    });
  });
});
