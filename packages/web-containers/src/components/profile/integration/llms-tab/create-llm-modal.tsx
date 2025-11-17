import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from '@web-containers/components/ui/dialog';
import { Input } from '@web-containers/components/ui/input';
import { Label } from '@web-containers/components/ui/label';
import { Button } from '@web-containers/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web-containers/components/ui/select';
import { useCreateLLMCredentialMutation } from '@iblai/data-layer';
import { useGetCredentialsSchemaQuery, useGetMaskedLLMCredentialsQuery } from '@iblai/data-layer';
import { Loader2 } from 'lucide-react';
import { CredentialsSchema } from '@iblai/data-layer';

// Dynamic schema based on selected provider
const createDynamicSchema = (schemaFields: string[]) => {
  const schemaObj: Record<string, any> = {
    provider: z.string().min(1, 'Provider is required'),
  };

  schemaFields.forEach((field) => {
    schemaObj[field] = z
      .string()
      .min(1, `${field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} is required`);
  });

  return z.object(schemaObj) as any;
};

type CreateExternalProviderForm = {
  provider: string;
  [key: string]: string;
};

const createExternalProviderFormDefaultValues: CreateExternalProviderForm = {
  provider: '',
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tenantKey: string;
  onSuccess?: () => void;
};

export function CreateLLMModal({ isOpen, onClose, tenantKey, onSuccess }: Props) {
  const [createLLMCredential, { isLoading }] = useCreateLLMCredentialMutation();
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [schemaFields, setSchemaFields] = useState<string[]>([]);
  const [availableProviders, setAvailableProviders] = useState<CredentialsSchema[]>([]);

  // Fetch provider schemas when modal opens
  const { data: credentialsSchemas = [], isLoading: isCredentialsSchemaLoading } =
    useGetCredentialsSchemaQuery({ org: tenantKey }, { skip: !isOpen || !tenantKey });

  const { refetch } = useGetMaskedLLMCredentialsQuery({ org: tenantKey }, { skip: false });

  // Update available providers when schemas are loaded
  useEffect(() => {
    if (credentialsSchemas.length > 0) {
      setAvailableProviders(credentialsSchemas);
    }
  }, [credentialsSchemas.length]);

  // Update form fields when provider is selected
  useEffect(() => {
    if (selectedProvider && availableProviders.length > 0) {
      const providerSchema = availableProviders.find((p) => p.name === selectedProvider);
      if (providerSchema) {
        const fields = Object.keys(providerSchema.schema);
        setSchemaFields(fields);
        setShowProviderForm(true);
      }
    }
  }, [selectedProvider, availableProviders.length]);

  const form = useForm({
    defaultValues: createExternalProviderFormDefaultValues,
    validators: {
      onChange:
        selectedProvider && schemaFields.length > 0 ? createDynamicSchema(schemaFields) : undefined,
    },
    onSubmit: async ({ value }) => {
      try {
        const requestValue: Record<string, string> = {};

        schemaFields.forEach((field) => {
          if (value[field]) {
            requestValue[field] = value[field];
          }
        });

        await createLLMCredential({
          org: tenantKey,
          requestBody: {
            name: value.provider,
            value: requestValue,
            platform: tenantKey,
          },
        }).unwrap();
        toast.success('LLM added successfully');
        form.reset();
        setSelectedProvider('');
        setShowProviderForm(false);
        setSchemaFields([]);
        onClose();
        refetch();
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error(JSON.stringify(error));
        toast.error('Failed to add LLM');
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent
        aria-describedby="external-provider-key-creation-description"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <DialogDescription className="sr-only">Add LLM Key</DialogDescription>
        <DialogHeader>
          <DialogTitle className="ibl-dialog-title">Add LLM</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(formEvent) => {
            formEvent.preventDefault();
            formEvent.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-5 grid gap-5"
        >
          {!isCredentialsSchemaLoading && (
            <form.Field name="provider">
              {(field) => {
                const hasError = field.state.meta.errors?.length > 0;
                const isTouched = field.state.meta.isTouched;
                const shouldShowError = hasError && isTouched;
                return (
                  <div className="space-y-1.5">
                    <Label className="flex items-center text-sm font-medium text-[#646464]">
                      Provider
                      <span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => {
                        field.handleChange(val);
                        setSelectedProvider(val);
                        setShowProviderForm(false);
                        setSchemaFields([]);
                      }}
                      onOpenChange={(open) => {
                        if (!open) {
                          field.handleBlur();
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProviders.map((provider) => {
                          const providerLogo = (provider as unknown as any)?.service_info?.logo;
                          const providerName =
                            (provider as unknown as any)?.service_info?.display_name ||
                            provider.name;
                          return (
                            <SelectItem key={provider.name} value={provider.name}>
                              <div className="flex items-center gap-2">
                                {providerLogo ? (
                                  <img
                                    src={providerLogo}
                                    alt={provider.name}
                                    className="w-4 h-4 rounded-sm object-contain"
                                  />
                                ) : (
                                  <span>🔑</span>
                                )}
                                {providerName || provider.name}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {shouldShowError && (
                      <p className="text-red-500 text-xs">{field.state.meta.errors[0]?.message}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>
          )}

          {/* Schema Loading State */}
          {isCredentialsSchemaLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Loading provider configurations...</span>
            </div>
          )}

          {/* Provider Form Fields */}
          {showProviderForm && !isCredentialsSchemaLoading && (
            <>
              {schemaFields.map((fieldName) => (
                <form.Field key={fieldName} name={fieldName}>
                  {(field) => {
                    const hasError = field.state.meta.errors?.length > 0;
                    const isTouched = field.state.meta.isTouched;
                    const shouldShowError = hasError && isTouched;
                    return (
                      <div className="space-y-1.5">
                        <Label className="flex items-center text-sm font-medium text-[#646464]">
                          {fieldName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          <span className="ml-1 text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder={`Enter ${fieldName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}`}
                          value={field.state.value || ''}
                          onChange={(event) => field.handleChange(event.target.value)}
                          onBlur={() => field.handleBlur()}
                          autoComplete="off"
                        />
                        {shouldShowError && (
                          <p className="text-red-500 text-xs">
                            {field.state.meta.errors[0]?.message || 'This field is required'}
                          </p>
                        )}
                      </div>
                    );
                  }}
                </form.Field>
              ))}
            </>
          )}
          <DialogFooter className="justify-end">
            <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit })}>
              {({ canSubmit }) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isLoading || isCredentialsSchemaLoading}
                  className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] text-white hover:opacity-90"
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
