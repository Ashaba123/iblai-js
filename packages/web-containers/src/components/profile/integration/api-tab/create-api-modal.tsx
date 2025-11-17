import React from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from '@tanstack/react-form';

import { cn } from '@web-containers/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@web-containers/components/ui/popover';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from '@web-containers/components/ui/dialog';
import { Input } from '@web-containers/components/ui/input';
import { ApiKeyModal } from './api-key-modal';
import { Label } from '@web-containers/components/ui/label';
import { Button } from '@web-containers/components/ui/button';
import { Calendar } from '@web-containers/components/ui/calendar';
import { useCreateApiKeyMutation } from '@iblai/data-layer';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tenantKey: string;
  username: string;
};

const createApiFormSchema = z.object({
  name: z
    .string()
    .min(1, 'API Key name is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'can only contain letters, numbers, and hyphens'),
  expiration_date: z.date(),
});

type CreateApiForm = {
  name: string;
  expiration_date: Date | null;
};

const createApiFormDefaultValues: CreateApiForm = {
  name: '',
  expiration_date: null,
};

function daysFromCurrentDate(targetDate: Date) {
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysDifference = Math.round(timeDifference / oneDay);
  return daysDifference * 24 * 3600;
}

export function CreateApiModal({ isOpen, onClose, tenantKey, username }: Props) {
  const [apiKey, setApiKey] = React.useState<string | null>(null);

  const [createApiKey, { isLoading }] = useCreateApiKeyMutation();

  const form = useForm({
    defaultValues: createApiFormDefaultValues,
    validators: {
      onChange: createApiFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await createApiKey({
          requestBody: {
            username: username ?? '',
            name: value.name,
            key: '',
            platform_key: tenantKey,
            expires: value.expiration_date
              ? daysFromCurrentDate(value.expiration_date).toString()
              : '',
            expires_in: value.expiration_date
              ? daysFromCurrentDate(value.expiration_date).toString()
              : '',
            created: new Date().toISOString(),
          },
        }).unwrap();
        toast.success('API Key created successfully');
        form.reset();
        setApiKey(response.key);
      } catch (error) {
        console.error(JSON.stringify(error));
        toast.error('Failed to create API Key');
        //Sentry.captureException(String(error));
      }
    },
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
        <DialogContent aria-describedby="api-key-creation-description" className="w-full max-w-md">
          <DialogDescription className="sr-only">Create API Key</DialogDescription>
          <DialogHeader>
            <DialogTitle className="ibl-dialog-title">Create API Key</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(formEvent) => {
              formEvent.preventDefault();
              formEvent.stopPropagation();
              form.handleSubmit();
            }}
            className="mt-5 grid gap-5"
          >
            <form.Field name="name">
              {(field) => {
                const hasError = field.state.meta.errors?.length > 0;
                const isDirty = field.state.meta.isDirty;
                const hasErrorAndIsDirty = hasError && isDirty;

                return (
                  <div className="space-y-1.5">
                    <Label className="flex items-center text-sm font-medium text-[#646464]">
                      API Key Name
                      <span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="API Key Name"
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      autoComplete="off"
                    />
                    {hasErrorAndIsDirty && (
                      <p className="text-red-500 text-xs">{field.state.meta.errors[0]?.message}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>
            <form.Field name="expiration_date">
              {(field) => (
                <div className="space-y-1.5">
                  <Label className="flex items-center text-sm font-medium text-[#646464]">
                    Expiration Date
                    <span className="ml-1 text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.state.value && 'text-muted-foreground',
                        )}
                      >
                        {field.state.value ? (
                          format(field.state.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.state.value || undefined}
                        onSelect={field.handleChange}
                        disabled={(date) => date && date < new Date()}
                        required
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </form.Field>
            <DialogFooter className="justify-end">
              <form.Subscribe
                selector={(state) => ({
                  canSubmit: state.canSubmit,
                })}
              >
                {({ canSubmit }) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isLoading}
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
      {apiKey && <ApiKeyModal isOpen={true} onClose={() => setApiKey(null)} apiKey={apiKey} />}
    </>
  );
}
