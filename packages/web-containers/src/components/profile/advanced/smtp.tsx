'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@web-containers/components/ui/switch';
import { Input } from '@web-containers/components/ui/input';
import { Info, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useGetPlatformConfigurationsQuery,
  useSetPlatformConfigurationsMutation,
} from '@iblai/data-layer';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';

interface SmtpContentProps {
  platformKey: string;
}

export const SmtpContent = ({ platformKey }: SmtpContentProps) => {
  const [setPlatformConfigurations, { isLoading: isUpdatingConfigurations }] =
    useSetPlatformConfigurationsMutation();

  const {
    data: platformConfigData,
    isLoading: isLoadingConfigurations,
    isSuccess: configsLoaded,
  } = useGetPlatformConfigurationsQuery({
    platform_key: platformKey,
  });

  // Local state for form values
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [autosaveTimer, setAutosaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSavedValues, setLastSavedValues] = useState<Record<string, any>>({});
  const [showSavedLabel, setShowSavedLabel] = useState(false);
  const [savedLabelTimer, setSavedLabelTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize form values when platform configurations load
  useEffect(() => {
    if (configsLoaded && platformConfigData) {
      const initialValues: Record<string, any> = {};
      smtpFields.forEach((field) => {
        initialValues[field.slug] =
          platformConfigData.configurations[field.slug] ?? field.defaultValue;
      });
      setFormValues(initialValues);
      setLastSavedValues(initialValues);
      setHasChanges(false);
    }
  }, [configsLoaded, platformConfigData]);

  // SMTP configuration fields
  const smtpFields = [
    {
      slug: 'PLATFORM_EMAIL_HOST',
      label: 'Email Host',
      description: 'SMTP server hostname (e.g., smtp.gmail.com)',
      type: 'text',
      defaultValue: '',
      placeholder: 'smtp.gmail.com',
      required: true,
    },
    {
      slug: 'PLATFORM_EMAIL_HOST_USER',
      label: 'Email Host User',
      description: 'Username for SMTP authentication',
      type: 'text',
      defaultValue: '',
      placeholder: 'your-email@example.com',
      required: true,
    },
    {
      slug: 'PLATFORM_EMAIL_HOST_PASSWORD',
      label: 'Email Host Password',
      description: 'Password or app-specific password for SMTP authentication',
      type: 'password',
      defaultValue: '',
      placeholder: '••••••••',
      required: true,
    },
    {
      slug: 'PLATFORM_EMAIL_PORT',
      label: 'Email Port',
      description:
        'SMTP server port number (usually 587 for TLS, 465 for SSL, 25 for non-encrypted)',
      type: 'number',
      defaultValue: '',
      placeholder: '587',
      required: true,
    },
    {
      slug: 'PLATFORM_EMAIL_USE_TLS',
      label: 'Use TLS',
      description: 'Enable Transport Layer Security for secure email transmission',
      type: 'boolean',
      defaultValue: false,
      required: false,
    },
    {
      slug: 'PLATFORM_EMAIL_USE_SSL',
      label: 'Use SSL',
      description: 'Enable Secure Sockets Layer for secure email transmission',
      type: 'boolean',
      defaultValue: false,
      required: false,
    },
  ];

  // Validation function
  const validateField = (field: any, value: any): string => {
    if (field.required && field.type !== 'boolean') {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${field.label} is required`;
      }
    }

    if (field.type === 'number' && value && isNaN(Number(value))) {
      return `${field.label} must be a valid number`;
    }

    return '';
  };

  const handleValueChange = (slug: string, value: any) => {
    setFormValues((prev) => {
      const newValues = { ...prev, [slug]: value };

      // Validate the changed field
      const field = smtpFields.find((f) => f.slug === slug);
      if (field) {
        const error = validateField(field, value);
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [slug]: error,
        }));
      }

      // Check if there are changes compared to last saved values
      const hasChanged = smtpFields.some((field) => {
        const savedValue = lastSavedValues[field.slug] ?? field.defaultValue;
        const currentValue = newValues[field.slug];
        return savedValue !== currentValue;
      });

      setHasChanges(hasChanged);

      // Trigger autosave if there are changes and form is valid
      if (hasChanged) {
        // Hide saved label when new changes are made
        setShowSavedLabel(false);

        // Clear existing timers
        if (autosaveTimer) {
          clearTimeout(autosaveTimer);
        }
        if (savedLabelTimer) {
          clearTimeout(savedLabelTimer);
        }

        // Set new autosave timer
        const timer = setTimeout(() => {
          performAutosave(newValues);
        }, 2000); // 2 second delay

        setAutosaveTimer(timer);
      }

      return newValues;
    });
  };

  const performAutosave = async (valuesToSave: Record<string, any>) => {
    // Validate all fields before saving
    const errors: Record<string, string> = {};
    smtpFields.forEach((field) => {
      const value = valuesToSave[field.slug];
      const error = validateField(field, value);
      if (error) {
        errors[field.slug] = error;
      }
    });

    // Don't autosave if there are validation errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const configurations = smtpFields.map((field) => ({
        key: field.slug,
        value: valuesToSave[field.slug],
        description: field.description,
      }));

      await setPlatformConfigurations({
        platform_key: platformKey,
        configurations,
      }).unwrap();

      setLastSavedValues(valuesToSave);
      setHasChanges(false);
      setValidationErrors({});

      // Show saved label and set timer to hide it after 5 seconds
      setShowSavedLabel(true);

      // Clear existing saved label timer
      if (savedLabelTimer) {
        clearTimeout(savedLabelTimer);
      }

      // Set new timer to hide saved label
      const timer = setTimeout(() => {
        setShowSavedLabel(false);
      }, 5000); // 5 seconds

      setSavedLabelTimer(timer);
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error('Failed to autosave SMTP settings');
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimer) {
        clearTimeout(autosaveTimer);
      }
      if (savedLabelTimer) {
        clearTimeout(savedLabelTimer);
      }
    };
  }, [autosaveTimer, savedLabelTimer]);

  if (isLoadingConfigurations && !isCollapsed) {
    return (
      <div className="rounded-lg border" style={{ borderColor: 'oklch(.922 0 0)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-[#646464]">SMTP Configuration</span>
          <ChevronUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="p-6 animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg px-6 py-5 border border-gray-200 dark:border-gray-700"
      style={{ borderColor: 'oklch(.922 0 0)' }}
    >
      {/* Header with collapse button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#646464]">SMTP Configuration</span>
          {/* Autosave status indicator */}
          {isUpdatingConfigurations && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          )}
          {!isUpdatingConfigurations && showSavedLabel && (
            <span className="text-xs text-blue-600">Saved</span>
          )}
          {hasChanges && !isUpdatingConfigurations && (
            <span className="text-xs text-yellow-600">Unsaved changes</span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          aria-label={isCollapsed ? 'Expand SMTP configuration' : 'Collapse SMTP configuration'}
        >
          {isCollapsed ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Collapsible content */}
      {!isCollapsed && (
        <div className="py-4 space-y-3">
          {smtpFields.map((field) => {
            const currentValue = formValues[field.slug] ?? field.defaultValue;
            const isBoolean = field.type === 'boolean';
            const hasError = validationErrors[field.slug];

            return (
              <div key={field.slug} className="space-y-1">
                <div
                  className="flex items-center justify-between rounded-lg border px-6 py-4 min-h-[70px]"
                  style={{ borderColor: hasError ? '#ef4444' : 'oklch(.922 0 0)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#646464]">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          aria-label={`More info about ${field.label}`}
                          className="hidden sm:block"
                        >
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm transition-opacity duration-300 z-50">
                          <p>{field.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2">
                    {isBoolean ? (
                      <Switch
                        checked={currentValue}
                        onCheckedChange={(checked) => handleValueChange(field.slug, checked)}
                        aria-label={`${field.label} ${currentValue ? 'enabled' : 'disabled'}`}
                        className="cursor-pointer data-[state=checked]:bg-blue-500"
                      />
                    ) : field.slug === 'PLATFORM_EMAIL_HOST_PASSWORD' ? (
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={currentValue || ''}
                          placeholder={field.placeholder}
                          onChange={(e) => handleValueChange(field.slug, e.target.value)}
                          className={`max-w-[120px] sm:max-w-[240px] w-[240px] font-medium text-[#646464] pr-10 ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                          aria-label={field.label}
                          aria-invalid={hasError ? 'true' : 'false'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <Input
                        type={field.type}
                        value={currentValue || ''}
                        placeholder={field.placeholder}
                        onChange={(e) => handleValueChange(field.slug, e.target.value)}
                        className={`max-w-[120px] sm:max-w-[240px] w-[240px] font-medium text-[#646464] ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        aria-label={field.label}
                        aria-invalid={hasError ? 'true' : 'false'}
                      />
                    )}
                  </div>
                </div>
                {hasError && (
                  <p className="text-sm text-red-500 px-6" role="alert">
                    {hasError}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
