'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RichTextEditor } from '../rich-text-editor';
import {
  useUpdateTemplateMutation,
  useGetMentorsQuery,
  useGetTemplateDetailsQuery,
  type NotificationTemplate,
  type NotificationTemplateDetail,
  type NotificationTemplatePeriodicMentor,
} from '@iblai/data-layer';
import { Edit as EditIcon } from 'lucide-react';
import { SearchableMultiSelect } from '../searchable-multiselect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getUserName } from '@web-containers/utils';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';

const toTimeString = (value?: string) => {
  if (!value) {
    return '';
  }

  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(11, 16);
};

const DEFAULT_TIMEZONE = 'UTC';

const isValidTimeZone = (value?: string): value is string => {
  if (!value) {
    return false;
  }

  try {
    new Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
};

const resolveTimezone = (...candidates: Array<string | undefined>) => {
  for (const candidate of candidates) {
    if (isValidTimeZone(candidate)) {
      return candidate;
    }
  }

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (isValidTimeZone(localTimeZone)) {
    return localTimeZone;
  }

  return DEFAULT_TIMEZONE;
};

type MentorListItem = {
  unique_id: string;
  name: string;
  prompt?: string;
};

type MentorWithOptionalName = NotificationTemplatePeriodicMentor & { name?: string };

const formatMentorSelections = (mentors: MentorWithOptionalName[]) =>
  mentors.map((mentor) => ({
    value: mentor.unique_id,
    label: mentor.name ? `${mentor.name} (${mentor.unique_id})` : mentor.unique_id,
  }));

const createMentorPromptMap = (mentors: MentorWithOptionalName[]) =>
  mentors.reduce<Record<string, string>>((accumulator, mentor) => {
    if (mentor.unique_id) {
      accumulator[mentor.unique_id] = mentor.prompt ?? '';
    }
    return accumulator;
  }, {});

const pickFirstNonEmpty = (...candidates: Array<string | null | undefined>) => {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }
  return '';
};

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

interface EditAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: NotificationTemplate | null;
  platformKey: string;
  templateType: string | null;
  onSave?: (template: NotificationTemplate) => void;
}

export function EditAlertDialog({
  open,
  onOpenChange,
  template,
  platformKey,
  templateType,
  onSave,
}: EditAlertDialogProps) {
  const [messageTitle, setMessageTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [periodicLearnerScope, setPeriodicLearnerScope] = useState<
    'ALL_LEARNERS' | 'ACTIVE_LEARNERS'
  >('ALL_LEARNERS');
  const [periodicFrequency, setPeriodicFrequency] = useState<
    'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'
  >('DAILY');
  const [periodicCustomIntervalDays, setPeriodicCustomIntervalDays] = useState<string>('');
  const [periodicExecutionTime, setPeriodicExecutionTime] = useState('');
  const [selectedMentors, setSelectedMentors] = useState<Array<{ label: string; value: string }>>(
    [],
  );
  const [periodicTimezone, setPeriodicTimezone] = useState(() => resolveTimezone());
  const [mentorSearch, setMentorSearch] = useState('');
  const [username, setUsername] = useState('');
  const [mentorPrompts, setMentorPrompts] = useState<Record<string, string>>({});
  const [activePromptMentor, setActivePromptMentor] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [promptDraft, setPromptDraft] = useState('');

  const dialogDescriptionId = 'edit-alert-dialog-description';
  const messageTitleHelperId = 'edit-alert-message-title-helper';
  const messageBodyLabelId = 'edit-alert-message-body-label';
  const messageBodyHelperId = 'edit-alert-message-body-helper';
  const customIntervalErrorId = 'edit-alert-custom-interval-error';
  const executionTimeErrorId = 'edit-alert-execution-time-error';

  const notificationType = templateType ?? template?.type ?? null;
  const isProactive = notificationType === 'PROACTIVE_LEARNER_NOTIFICATION';
  const debouncedMentorSearch = useDebouncedValue(mentorSearch, 300);
  const [updateTemplate, { isLoading: isSaving }] = useUpdateTemplateMutation();
  const shouldFetchTemplateDetails = Boolean(open && platformKey && notificationType);
  const userLocalTimezone = useMemo(
    () => resolveTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone),
    [],
  );
  const showUseLocalTimezone = periodicTimezone !== userLocalTimezone;

  const { data: templateDetailsResponse, isFetching: isTemplateDetailsLoading } =
    useGetTemplateDetailsQuery(
      {
        platformKey,
        notificationType: notificationType ?? '',
      },
      {
        skip: !shouldFetchTemplateDetails,
      },
    );

  const currentTemplateDetail = useMemo<Partial<NotificationTemplateDetail>>(() => {
    if (templateDetailsResponse) {
      return templateDetailsResponse;
    }

    if (template) {
      return template as unknown as Partial<NotificationTemplateDetail>;
    }

    return {};
  }, [templateDetailsResponse, template]);

  const periodicSettings = useMemo(() => {
    if (!isProactive || !template) {
      return {
        mentors: [] as MentorWithOptionalName[],
        learnerScope: 'ALL_LEARNERS' as const,
        frequency: 'DAILY' as const,
        customInterval: '',
        executionTime: '',
        timezone: resolveTimezone(),
      };
    }

    const periodicConfig = currentTemplateDetail.periodic_config;
    const mentorsSource = (currentTemplateDetail.periodic_mentors ??
      periodicConfig?.mentors ??
      template.periodic_mentors ??
      []) as MentorWithOptionalName[];

    const learnerScope =
      currentTemplateDetail.periodic_learner_scope ??
      periodicConfig?.learner_scope ??
      template.periodic_learner_scope ??
      'ALL_LEARNERS';

    const frequency =
      currentTemplateDetail.periodic_frequency ??
      periodicConfig?.frequency ??
      template.periodic_frequency ??
      'DAILY';

    const customIntervalNumber =
      currentTemplateDetail.periodic_custom_interval_days ??
      periodicConfig?.report_period_days ??
      template.periodic_custom_interval_days;

    const executionTimeSource =
      currentTemplateDetail.periodic_execution_time ??
      periodicConfig?.execution_time ??
      template.periodic_execution_time;

    const timezoneSource = resolveTimezone(
      currentTemplateDetail.periodic_timezone,
      periodicConfig?.timezone,
      template.periodic_timezone,
    );

    return {
      mentors: mentorsSource,
      learnerScope,
      frequency,
      customInterval: customIntervalNumber ? String(customIntervalNumber) : '',
      executionTime: toTimeString(executionTimeSource),
      timezone: timezoneSource,
    };
  }, [currentTemplateDetail, isProactive, template]);

  useEffect(() => {
    try {
      const storedUserName = getUserName();
      if (storedUserName) {
        setUsername(storedUserName);
      }
    } catch (error) {
      console.error('Unable to retrieve username for mentor selection:', error);
      setUsername('');
    }
  }, []);

  useEffect(() => {
    if (!template) {
      setMessageTitle('');
      setMessageBody('');
      setSelectedMentors([]);
      setMentorPrompts({});
      setPeriodicLearnerScope('ALL_LEARNERS');
      setPeriodicFrequency('DAILY');
      setPeriodicCustomIntervalDays('');
      setPeriodicExecutionTime('');
      setPeriodicTimezone(userLocalTimezone);
      setMentorSearch('');
      return;
    }

    setMessageTitle(
      pickFirstNonEmpty(
        currentTemplateDetail.email_subject,
        currentTemplateDetail.message_title,
        template.email_subject,
        template.message_title,
      ),
    );
    setMessageBody(
      pickFirstNonEmpty(
        currentTemplateDetail.email_html_template,
        currentTemplateDetail.message_body,
        template.email_html_template,
      ),
    );

    if (isProactive) {
      setSelectedMentors(formatMentorSelections(periodicSettings.mentors));
      setMentorPrompts(createMentorPromptMap(periodicSettings.mentors));
      setPeriodicLearnerScope(periodicSettings.learnerScope);
      setPeriodicFrequency(periodicSettings.frequency);
      setPeriodicCustomIntervalDays(periodicSettings.customInterval);
      setPeriodicExecutionTime(periodicSettings.executionTime);
      setPeriodicTimezone(periodicSettings.timezone);
    } else {
      setSelectedMentors([]);
      setMentorPrompts({});
      setPeriodicLearnerScope('ALL_LEARNERS');
      setPeriodicFrequency('DAILY');
      setPeriodicCustomIntervalDays('');
      setPeriodicExecutionTime('');
      setPeriodicTimezone(userLocalTimezone);
    }
    setMentorSearch('');
  }, [template, currentTemplateDetail, isProactive, periodicSettings, userLocalTimezone]);

  const shouldFetchMentors = isProactive && open && Boolean(platformKey) && Boolean(username);

  const { data: mentorsResponse, isLoading: isMentorsLoading } = useGetMentorsQuery(
    {
      org: platformKey,
      username,
      limit: 50,
      ...(debouncedMentorSearch ? { query: debouncedMentorSearch } : {}),
    },
    {
      skip: !shouldFetchMentors,
    },
  );

  const mentorOptions = (mentorsResponse?.results ?? []) as MentorListItem[];

  const mentorNameById = useMemo(
    () =>
      new Map<string, string>(
        mentorOptions
          .filter((mentor) => Boolean(mentor?.unique_id) && Boolean(mentor?.name))
          .map((mentor) => [mentor.unique_id, mentor.name]),
      ),
    [mentorOptions],
  );

  useEffect(() => {
    if (!mentorNameById.size || !selectedMentors.length) {
      return;
    }

    setSelectedMentors((previous) => {
      let hasChanges = false;
      const updated = previous.map((mentor) => {
        const nextLabel = mentorNameById.get(mentor.value);
        if (nextLabel) {
          const formattedLabel = `${nextLabel} (${mentor.value})`;
          if (formattedLabel !== mentor.label) {
            hasChanges = true;
            return { ...mentor, label: formattedLabel };
          }
        } else if (mentor.label !== mentor.value) {
          hasChanges = true;
          return { ...mentor, label: mentor.value };
        }
        return mentor;
      });

      return hasChanges ? updated : previous;
    });
  }, [mentorNameById, selectedMentors.length]);

  const handleMentorSelectionChange = (items: { label: string; value: string }[]) => {
    setSelectedMentors(items);
    setMentorPrompts((previous) => {
      const next: Record<string, string> = {};
      items.forEach((item) => {
        next[item.value] = previous[item.value] ?? '';
      });
      return next;
    });
  };

  const handleEditMentorPrompt = (mentor: { label: string; value: string }) => {
    const mentorName = mentorNameById.get(mentor.value) ?? mentor.label;
    setActivePromptMentor({
      id: mentor.value,
      name: mentorName,
    });
    setPromptDraft(mentorPrompts[mentor.value] ?? '');
    setIsPromptDialogOpen(true);
  };

  const closePromptDialog = () => {
    setIsPromptDialogOpen(false);
    setActivePromptMentor(null);
    setPromptDraft('');
  };

  const handlePromptSave = () => {
    if (!activePromptMentor) {
      return;
    }

    setMentorPrompts((previous) => ({
      ...previous,
      [activePromptMentor.id]: promptDraft.trim(),
    }));
    closePromptDialog();
  };

  const handlePromptDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closePromptDialog();
    } else {
      setIsPromptDialogOpen(true);
    }
  };

  const handleUseLocalTimezone = () => {
    setPeriodicTimezone(userLocalTimezone);
  };

  const renderTimezoneNotice = (intro: string) => (
    <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
      <span>
        {intro} Notifications use the {periodicTimezone} timezone.
      </span>
      {showUseLocalTimezone && (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="px-0"
          onClick={handleUseLocalTimezone}
        >
          Use local timezone ({userLocalTimezone})
        </Button>
      )}
    </div>
  );

  const handleSave = async () => {
    if (!template || !notificationType) return;

    try {
      const templateDetail = currentTemplateDetail;
      const periodicConfig = templateDetail.periodic_config;

      const timezoneToSave = resolveTimezone(
        periodicTimezone,
        templateDetail.periodic_timezone,
        periodicConfig?.timezone,
      );

      const mentorsPayload =
        selectedMentors.map((mentor) => {
          const promptValue = mentorPrompts[mentor.value]?.trim() ?? '';
          return {
            unique_id: mentor.value,
            prompt: promptValue,
          };
        }) ?? [];

      const executionTimeValue = toTimeString(periodicExecutionTime);

      const payload: Partial<NotificationTemplateDetail> = {
        message_title: messageTitle,
        email_html_template: messageBody,
      };

      if (isProactive) {
        payload.periodic_learner_scope = periodicLearnerScope;
        payload.periodic_frequency = periodicFrequency;
        payload.periodic_mentors = mentorsPayload;
        if (executionTimeValue) {
          payload.periodic_execution_time = executionTimeValue;
        }
        if (timezoneToSave) {
          payload.periodic_timezone = timezoneToSave;
        }

        if (periodicFrequency === 'CUSTOM') {
          const customIntervalValue = periodicCustomIntervalDays
            ? Number(periodicCustomIntervalDays)
            : undefined;
          if (typeof customIntervalValue === 'number' && !Number.isNaN(customIntervalValue)) {
            payload.periodic_custom_interval_days = customIntervalValue;
            payload.periodic_report_period_days = customIntervalValue;
          }
        } else {
          const existingReportPeriod =
            templateDetail.periodic_report_period_days ?? periodicConfig?.report_period_days;
          if (typeof existingReportPeriod === 'number') {
            payload.periodic_report_period_days = existingReportPeriod;
          }
        }
      }

      await updateTemplate({
        platformKey,
        notificationType,
        template: payload,
      }).unwrap();

      toast.success('Success', {
        description: 'Notification template updated successfully',
      });

      // Call onSave callback with updated template if provided
      if (onSave) {
        const executionTimeForTemplate = toTimeString(
          executionTimeValue ||
            template.periodic_execution_time ||
            templateDetail.periodic_execution_time ||
            periodicConfig?.execution_time,
        );
        const customIntervalNumber =
          periodicFrequency === 'CUSTOM' && periodicCustomIntervalDays
            ? Number(periodicCustomIntervalDays)
            : (template.periodic_custom_interval_days ??
              templateDetail.periodic_custom_interval_days);

        onSave({
          ...template,
          message_title: messageTitle,
          email_html_template: messageBody,
          ...(isProactive && {
            periodic_learner_scope: periodicLearnerScope,
            periodic_frequency: periodicFrequency,
            periodic_custom_interval_days: customIntervalNumber,
            periodic_execution_time: executionTimeForTemplate,
            periodic_report_period_days:
              periodicFrequency === 'CUSTOM' && periodicCustomIntervalDays
                ? Number(periodicCustomIntervalDays)
                : (template.periodic_report_period_days ??
                  templateDetail.periodic_report_period_days ??
                  periodicConfig?.report_period_days),
            periodic_timezone:
              timezoneToSave ||
              template.periodic_timezone ||
              templateDetail.periodic_timezone ||
              periodicConfig?.timezone ||
              resolveTimezone(),
            periodic_mentors: mentorsPayload,
          }),
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Error', {
        description: 'Failed to update template. Please try again.',
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    closePromptDialog();
  };

  const isProactiveInvalid =
    isProactive &&
    periodicFrequency === 'CUSTOM' &&
    (!periodicCustomIntervalDays || !periodicExecutionTime.trim());

  const isCustomIntervalMissing =
    isProactive && periodicFrequency === 'CUSTOM' && !periodicCustomIntervalDays;
  const isExecutionTimeMissing =
    isProactive && periodicFrequency === 'CUSTOM' && !periodicExecutionTime.trim();

  const isSaveDisabled =
    isSaving ||
    isTemplateDetailsLoading ||
    !messageTitle.trim() ||
    !messageBody.trim() ||
    isProactiveInvalid;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="max-w-3xl h-[85vh] flex flex-col p-0"
          aria-describedby={dialogDescriptionId}
        >
          <DialogHeader className="px-6 py-4 border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold">Edit Notification Template</DialogTitle>
            <DialogDescription id={dialogDescriptionId}>
              Update the notification content and cadence. Required fields are indicated in the
              form.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="template-name" className="text-sm font-medium text-gray-700">
                    Template Name
                  </Label>
                  <Input
                    id="template-name"
                    value={template?.description || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message-title" className="text-sm font-medium text-gray-700">
                    Message Title
                  </Label>
                  <p id={messageTitleHelperId} className="text-xs text-gray-500">
                    Required. This appears in the notification header.
                  </p>
                  <Input
                    id="message-title"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    placeholder="Enter notification message title..."
                    className="w-full"
                    disabled={isSaving}
                    required
                    aria-required="true"
                    aria-describedby={messageTitleHelperId}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message-body"
                    id={messageBodyLabelId}
                    className="text-sm font-medium text-gray-700"
                  >
                    Message Body
                  </Label>
                  <p id={messageBodyHelperId} className="text-xs text-gray-500">
                    Required. Provide the full content that will be delivered to learners.
                  </p>
                  <RichTextEditor
                    value={messageBody}
                    onChange={setMessageBody}
                    placeholder="Enter notification message body..."
                    exportFormat="html"
                    disabled={isSaving}
                    id="message-body"
                    ariaLabelledBy={messageBodyLabelId}
                    ariaDescribedBy={messageBodyHelperId}
                    ariaRequired
                  />
                </div>

                {isProactive && (
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Periodic Delivery Settings
                      </h3>
                      <p className="text-xs text-gray-500">
                        Configure mentor outreach cadence for proactive learner notifications.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="periodic-learner-scope"
                          className="text-sm font-medium text-gray-700"
                        >
                          Learner Scope
                        </Label>
                        <Select
                          value={periodicLearnerScope}
                          onValueChange={(value) =>
                            setPeriodicLearnerScope(value as 'ALL_LEARNERS' | 'ACTIVE_LEARNERS')
                          }
                          disabled={isSaving}
                        >
                          <SelectTrigger
                            id="periodic-learner-scope"
                            aria-label="Select learner scope"
                          >
                            <SelectValue placeholder="Select learner scope" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL_LEARNERS">All Learners</SelectItem>
                            <SelectItem value="ACTIVE_LEARNERS">Active Learners</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="periodic-frequency"
                          className="text-sm font-medium text-gray-700"
                        >
                          Frequency
                        </Label>
                        <Select
                          value={periodicFrequency}
                          onValueChange={(value) =>
                            setPeriodicFrequency(value as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM')
                          }
                          disabled={isSaving}
                        >
                          <SelectTrigger id="periodic-frequency" aria-label="Select frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="CUSTOM">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {periodicFrequency === 'CUSTOM' && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="periodic-custom-interval"
                            className="text-sm font-medium text-gray-700"
                          >
                            Custom Interval (days)
                          </Label>
                          <Select
                            value={periodicCustomIntervalDays}
                            onValueChange={setPeriodicCustomIntervalDays}
                            disabled={isSaving}
                          >
                            <SelectTrigger
                              id="periodic-custom-interval"
                              aria-label="Select custom interval in days"
                              aria-invalid={isCustomIntervalMissing}
                              aria-describedby={
                                isCustomIntervalMissing ? customIntervalErrorId : undefined
                              }
                            >
                              <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 30 }, (_, index) => {
                                const value = String(index + 1);
                                return (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="periodic-execution-time"
                            className="text-sm font-medium text-gray-700"
                          >
                            Execution Time
                          </Label>
                          <Input
                            id="periodic-execution-time"
                            type="time"
                            value={periodicExecutionTime}
                            onChange={(event) => setPeriodicExecutionTime(event.target.value)}
                            disabled={isSaving}
                            aria-invalid={isExecutionTimeMissing}
                            aria-describedby={
                              isExecutionTimeMissing ? executionTimeErrorId : undefined
                            }
                          />
                          {renderTimezoneNotice('Choose when the notification should be sent.')}
                        </div>
                      </div>
                    )}

                    {periodicFrequency !== 'CUSTOM' && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="periodic-execution-time"
                          className="text-sm font-medium text-gray-700"
                        >
                          Execution Time
                        </Label>
                        <Input
                          id="periodic-execution-time"
                          type="time"
                          value={periodicExecutionTime}
                          onChange={(event) => setPeriodicExecutionTime(event.target.value)}
                          disabled={isSaving}
                        />
                        {renderTimezoneNotice(
                          'Optional. Choose when the notification should be sent.',
                        )}
                      </div>
                    )}

                    {isProactiveInvalid && (
                      <div className="space-y-1" aria-live="polite">
                        {isCustomIntervalMissing && (
                          <p
                            id={customIntervalErrorId}
                            className="text-sm text-red-600"
                            role="alert"
                          >
                            Select a custom interval in days when using the custom frequency.
                          </p>
                        )}
                        {isExecutionTimeMissing && (
                          <p
                            id={executionTimeErrorId}
                            className="text-sm text-red-600"
                            role="alert"
                          >
                            Specify the execution time for custom frequency notifications.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label
                        className="text-sm font-medium text-gray-700"
                        htmlFor="periodic-mentors"
                      >
                        Periodic Mentors
                      </Label>
                      <SearchableMultiSelect<MentorListItem>
                        items={mentorOptions}
                        selectedItems={selectedMentors}
                        onSelectionChange={handleMentorSelectionChange}
                        searchQuery={mentorSearch}
                        onSearchChange={setMentorSearch}
                        isLoading={isMentorsLoading}
                        placeholder="Search mentors by name..."
                        getItemValue={(mentor) => mentor.unique_id}
                        getItemLabel={(mentor) =>
                          mentor.name ? `${mentor.name} (${mentor.unique_id})` : mentor.unique_id
                        }
                        onSelectedItemAction={handleEditMentorPrompt}
                        selectedItemActionIcon={<EditIcon className="h-3 w-3" aria-hidden="true" />}
                        selectedItemActionAriaLabel="Edit mentor prompt"
                        inputId="periodic-mentors"
                        ariaDescribedBy="periodic-mentors-help"
                        className="max-w-full"
                      />
                      <p id="periodic-mentors-help" className="text-xs text-gray-500">
                        Optional. Select mentors to include in the proactive outreach rotation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPromptDialogOpen} onOpenChange={handlePromptDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Mentor Prompt</DialogTitle>
            <DialogDescription>
              Provide an optional prompt that will be associated with this mentor for proactive
              outreach.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label
                htmlFor="mentor-prompt-mentor-name"
                className="text-sm font-medium text-gray-700"
              >
                Mentor
              </Label>
              <Input
                id="mentor-prompt-mentor-name"
                value={activePromptMentor?.name ?? ''}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentor-prompt" className="text-sm font-medium text-gray-700">
                Prompt
              </Label>
              <Textarea
                id="mentor-prompt"
                value={promptDraft}
                onChange={(event) => setPromptDraft(event.target.value)}
                placeholder="Enter a mentor prompt..."
                rows={5}
              />
              <p className="text-xs text-gray-500">This prompt is saved with the mentor</p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={closePromptDialog}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
              onClick={handlePromptSave}
              disabled={!activePromptMentor}
            >
              Save Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
