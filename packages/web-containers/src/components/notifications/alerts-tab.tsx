'use client';

import { useState, useEffect, type KeyboardEvent } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import {
  useGetTemplatesQuery,
  useLazyGetTemplateDetailsQuery,
  useToggleTemplateMutation,
  type NotificationTemplate,
} from '@iblai/data-layer';
import { EditAlertDialog } from './edit-alert-dialog';
import { sanitizeHtml } from '../../lib/utils';

interface AlertsTabProps {
  platformKey: string;
}

export function AlertsTab({ platformKey }: AlertsTabProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateDetails, setTemplateDetails] = useState<Record<string, string>>({});
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);

  const alertsTabDescriptionId = 'alerts-tab-description';

  // API hooks
  const {
    data: templatesData,
    isLoading: templatesLoading,
    error: templatesError,
  } = useGetTemplatesQuery({ platformKey });
  const [getTemplateDetails] = useLazyGetTemplateDetailsQuery();
  const [toggleTemplate] = useToggleTemplateMutation();

  const stringifyTemplateType = (type: string) => {
    return String(type)
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Load templates from API
  useEffect(() => {
    if (templatesData) {
      setTemplates(templatesData);
    }
  }, [templatesData]);

  const handleTemplateClick = async (template: NotificationTemplate) => {
    // Toggle selection - if clicking the same card, collapse it
    if (selectedTemplateId === template.id) {
      setSelectedTemplateId(null);
      return;
    }

    setSelectedTemplateId(template.id);

    // Fetch details if we don't have them cached
    if (!templateDetails[template.id]) {
      setLoadingTemplateId(template.id);
      try {
        const response = await getTemplateDetails({
          platformKey,
          notificationType: template.type,
        });

        if (response.data && response.data.message_body) {
          setTemplateDetails((prev) => ({
            ...prev,
            [template.id]: response.data!.short_message_body,
          }));
        }
      } catch (error) {
        console.error('Error fetching template details:', error);
      } finally {
        setLoadingTemplateId(null);
      }
    }
  };

  const handleTemplateCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    template: NotificationTemplate,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void handleTemplateClick(template);
    }
  };

  const handleToggleTemplate = async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    try {
      await toggleTemplate({
        platformKey,
        notificationType: template.type,
        allow_notification: !template.is_enabled,
      }).unwrap();

      // Update local state
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, is_enabled: !t.is_enabled } : t)),
      );
    } catch (error) {
      console.error('Error toggling template:', error);
    }
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handleTemplateSaved = (updatedTemplate: NotificationTemplate) => {
    // Update the template in the local state
    setTemplates((prev) => prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)));
    setSelectedTemplate(updatedTemplate);
  };

  // Loading state
  if (templatesLoading) {
    return (
      <div className="h-full flex items-center justify-center w-full bg-white">
        <div className="text-gray-500">Loading templates...</div>
      </div>
    );
  }

  // Error state
  if (templatesError) {
    return (
      <div className="h-full flex items-center justify-center w-full bg-white">
        <div className="text-red-500">Error loading templates</div>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto bg-white"
      role="region"
      aria-labelledby="alerts-tab-heading"
      aria-describedby={alertsTabDescriptionId}
      data-testid="alerts-tab-root"
    >
      <h2 id="alerts-tab-heading" className="sr-only">
        Alerts management
      </h2>
      <p id={alertsTabDescriptionId} className="sr-only">
        Review available alert templates, toggle their active state, and open edit dialogs to update
        notification content.
      </p>

      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Alerts</h2>
            <p className="text-sm text-gray-600">
              Manage predetermined alerts. Toggle them on/off and edit their content.
            </p>
          </div>
          {/* <div className="flex items-center gap-3 h-10">
            <span className="text-sm font-medium text-gray-700">
              {notificationsEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={onToggleNotifications}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-blue-400"
            />
          </div> */}
        </div>

        <div
          className="space-y-3 pb-6"
          role="list"
          aria-label="Available notification templates"
          data-testid="alerts-templates-list"
        >
          {/* template card */}
          {templates.map((template) => {
            const templateTitle = template.name ?? stringifyTemplateType(template.type);
            const templateTitleId = `alerts-template-title-${template.id}`;
            const templateDescriptionId = `alerts-template-description-${template.id}`;
            const isTemplateSelected = selectedTemplateId === template.id;

            return (
              <div
                key={template.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                role="listitem"
                tabIndex={0}
                aria-labelledby={templateTitleId}
                aria-describedby={templateDescriptionId}
                aria-pressed={isTemplateSelected}
                aria-expanded={isTemplateSelected}
                onClick={() => handleTemplateClick(template)}
                onKeyDown={(event) => handleTemplateCardKeyDown(event, template)}
                data-template-type={template.type}
                data-testid={`alerts-template-card-${template.type}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-base font-semibold text-gray-900 mb-1"
                          id={templateTitleId}
                        >
                          {templateTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2" id={templateDescriptionId}>
                          {template.description}
                        </p>
                        {/* selected notification preview display */}
                        {isTemplateSelected && (
                          <>
                            {loadingTemplateId === template.id ? (
                              <div
                                className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-500 flex items-center justify-center"
                                role="status"
                                aria-live="polite"
                              >
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="animate-spin h-4 w-4 text-blue-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  <span>Loading message...</span>
                                </div>
                              </div>
                            ) : (
                              templateDetails[template.id] && (
                                <div
                                  className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700"
                                  role="region"
                                  aria-live="polite"
                                  aria-label={`${templateTitle} preview content`}
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(templateDetails[template.id]),
                                  }}
                                />
                              )
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {template.is_enabled ? 'Active' : 'Inactive'}
                          </span>
                          <Switch
                            checked={template.is_enabled}
                            onCheckedChange={() => handleToggleTemplate(template.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-blue-400"
                            aria-label={`Toggle ${templateTitle} ${template.is_enabled ? 'off' : 'on'}`}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTemplate(template);
                          }}
                          className="flex items-center gap-2"
                          aria-label={`Edit ${templateTitle}`}
                          data-testid={`alerts-template-edit-${template.type}`}
                        >
                          <Edit className="h-4 w-4" aria-hidden="true" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Alert Dialog */}
      <EditAlertDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        template={selectedTemplate}
        platformKey={platformKey}
        templateType={selectedTemplate?.type ?? null}
        onSave={handleTemplateSaved}
      />
    </div>
  );
}
