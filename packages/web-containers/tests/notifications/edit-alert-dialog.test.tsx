import type { ReactNode, MouseEvent, ComponentProps } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { EditAlertDialog } from '../../src/components/notifications/edit-alert-dialog';

const dataLayerMocks = vi.hoisted(() => ({
  useUpdateTemplateMutation: vi.fn(),
  useGetMentorsQuery: vi.fn(),
  useGetTemplateDetailsQuery: vi.fn(),
  useGetTemplatesQuery: vi.fn(),
  useLazyGetTemplateDetailsQuery: vi.fn(),
  useToggleTemplateMutation: vi.fn(),
  useLazyGetNotificationsQuery: vi.fn(),
  useMarkAllAsReadMutation: vi.fn(),
  usePlatformUsersQuery: vi.fn(),
  useCreateNotificationPreviewMutation: vi.fn(),
  useSendNotificationMutation: vi.fn(),
}));

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

let updateTemplateSpy: ReturnType<typeof vi.fn>;

vi.mock('@iblai/data-layer', () => dataLayerMocks);

vi.mock('@web-containers/utils', () => ({
  getUserName: vi.fn(() => 'test-user'),
}));

vi.mock('sonner', () => ({
  toast: toastMocks,
}));

vi.mock('lucide-react', () => ({
  Edit: () => null,
}));

vi.mock('../../src/components/rich-text-editor', () => ({
  RichTextEditor: ({
    value,
    onChange,
    placeholder,
    disabled,
  }: {
    value: string;
    onChange: (next: string) => void;
    placeholder?: string;
    disabled?: boolean;
  }) => (
    <textarea
      data-testid="rich-text-editor"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  ),
}));

vi.mock('../../src/components/searchable-multiselect', () => ({
  SearchableMultiSelect: ({
    selectedItems,
  }: {
    selectedItems: Array<{ label: string; value: string }>;
  }) => (
    <div data-testid="searchable-multiselect">
      {selectedItems.map((item) => (
        <span key={item.value}>{item.label}</span>
      ))}
    </div>
  ),
}));

vi.mock('../../src/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog-root">{children}</div> : null,
  DialogContent: ({ children, ...props }: any) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: { children: ReactNode }) => <header>{children}</header>,
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  DialogFooter: ({ children }: { children: ReactNode }) => <footer>{children}</footer>,
}));

vi.mock('../../src/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
  }: {
    children: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    variant?: string;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled} data-variant={variant}>
      {children}
    </button>
  ),
}));

vi.mock('../../src/components/ui/input', () => ({
  Input: ({ value, onChange, disabled, id, placeholder, type = 'text' }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      type={type}
    />
  ),
}));

vi.mock('../../src/components/ui/select', () => ({
  Select: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children, ...props }: { children: ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, onSelect }: { children: ReactNode; onSelect?: () => void }) => (
    <button type="button" onClick={onSelect}>
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
}));

vi.mock('../../src/components/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

vi.mock('../../src/components/ui/textarea', () => ({
  Textarea: ({ value, onChange, id, placeholder }: any) => (
    <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} />
  ),
}));

const proactiveTemplate = {
  id: 'template-123',
  type: 'PROACTIVE_LEARNER_NOTIFICATION',
  description: 'Proactive outreach template',
  message_title: 'Original Title',
  email_html_template: '<p>Original Body</p>',
  periodic_learner_scope: 'ALL_LEARNERS',
  periodic_frequency: 'DAILY',
  periodic_custom_interval_days: null,
  periodic_execution_time: '12:00',
  periodic_report_period_days: null,
  periodic_timezone: 'UTC',
};

const proactiveTemplateDetails = {
  message_title: 'Detail Title',
  email_html_template: '<p>Detail Body</p>',
  periodic_learner_scope: 'ACTIVE_LEARNERS',
  periodic_frequency: 'CUSTOM',
  periodic_custom_interval_days: 3,
  periodic_execution_time: '2024-01-01T15:30:00Z',
  periodic_timezone: 'America/New_York',
  periodic_report_period_days: 3,
  periodic_mentors: [
    {
      unique_id: 'mentor-1',
      name: 'Mentor One',
      prompt: 'Help learners stay on track',
    },
  ],
  periodic_config: {
    mentors: [
      {
        unique_id: 'mentor-2',
        name: 'Mentor Two',
        prompt: 'Fallback prompt',
      },
    ],
    learner_scope: 'ALL_LEARNERS',
    frequency: 'WEEKLY',
    report_period_days: 7,
    execution_time: '13:00',
    timezone: 'UTC',
  },
};

describe('EditAlertDialog', () => {
  beforeEach(() => {
    Object.values(dataLayerMocks).forEach((mockFn) => {
      mockFn.mockReset();
    });
    toastMocks.success.mockReset();
    toastMocks.error.mockReset();

    const unwrapMock = vi.fn().mockResolvedValue({});
    updateTemplateSpy = vi.fn().mockReturnValue({ unwrap: unwrapMock });
    dataLayerMocks.useUpdateTemplateMutation.mockReturnValue([
      updateTemplateSpy,
      { isLoading: false },
    ]);

    dataLayerMocks.useGetMentorsQuery.mockReturnValue({
      data: {
        results: [
          { unique_id: 'mentor-1', name: 'Mentor One' },
          { unique_id: 'mentor-2', name: 'Mentor Two' },
        ],
      },
      isLoading: false,
    });

    dataLayerMocks.useGetTemplateDetailsQuery.mockReturnValue({
      data: proactiveTemplateDetails,
      isFetching: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderDialog = (overrides: Partial<ComponentProps<typeof EditAlertDialog>> = {}) =>
    render(
      <EditAlertDialog
        open
        onOpenChange={vi.fn()}
        template={proactiveTemplate as any}
        platformKey="test-platform"
        templateType="PROACTIVE_LEARNER_NOTIFICATION"
        onSave={vi.fn()}
        {...overrides}
      />,
    );

  it('prefills form fields using template details when available', async () => {
    renderDialog();

    expect(await screen.findByLabelText('Message Title')).toHaveValue('Detail Title');
    expect(screen.getByTestId('rich-text-editor')).toHaveValue('<p>Detail Body</p>');

    const mentorsContainer = screen.getByTestId('searchable-multiselect');
    expect(mentorsContainer).toHaveTextContent('Mentor One (mentor-1)');
  });

  it('saves proactive template updates and notifies parent', async () => {
    const onOpenChange = vi.fn();
    const onSave = vi.fn();

    renderDialog({
      onOpenChange,
      onSave,
    });

    const titleInput = await screen.findByLabelText('Message Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const bodyEditor = screen.getByTestId('rich-text-editor');
    fireEvent.change(bodyEditor, { target: { value: '<p>Updated Body</p>' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateTemplateSpy).toHaveBeenCalledWith({
        platformKey: 'test-platform',
        notificationType: 'PROACTIVE_LEARNER_NOTIFICATION',
        template: expect.objectContaining({
          message_title: 'Updated Title',
          email_html_template: '<p>Updated Body</p>',
          periodic_learner_scope: 'ACTIVE_LEARNERS',
          periodic_frequency: 'CUSTOM',
          periodic_custom_interval_days: 3,
          periodic_report_period_days: 3,
          periodic_timezone: 'America/New_York',
          periodic_execution_time: '15:30',
          periodic_mentors: [
            {
              unique_id: 'mentor-1',
              prompt: 'Help learners stay on track',
            },
          ],
        }),
      });
    });

    expect(toastMocks.success).toHaveBeenCalledWith('Success', {
      description: 'Notification template updated successfully',
    });

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'template-123',
          message_title: 'Updated Title',
          email_html_template: '<p>Updated Body</p>',
          periodic_learner_scope: 'ACTIVE_LEARNERS',
          periodic_frequency: 'CUSTOM',
          periodic_custom_interval_days: 3,
          periodic_execution_time: '15:30',
          periodic_report_period_days: 3,
          periodic_timezone: proactiveTemplateDetails.periodic_timezone,
          periodic_mentors: [
            {
              unique_id: 'mentor-1',
              prompt: 'Help learners stay on track',
            },
          ],
        }),
      );
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('disables save button when custom frequency is incomplete', async () => {
    dataLayerMocks.useGetTemplateDetailsQuery.mockReturnValue({
      data: {
        ...proactiveTemplateDetails,
        periodic_custom_interval_days: null,
        periodic_execution_time: '',
        periodic_config: {
          mentors: [],
          learner_scope: undefined,
          frequency: undefined,
          report_period_days: undefined,
          execution_time: undefined,
          timezone: undefined,
        },
      },
      isFetching: false,
    });

    renderDialog();

    const saveButton = await screen.findByRole('button', { name: /save changes/i });
    await waitFor(() => expect(saveButton).toBeDisabled());
  });
});
