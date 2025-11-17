'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Dialog, DialogContent, DialogTitle } from '@web-containers/components/ui/dialog';
import { Label } from '@web-containers/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web-containers/components/ui/select';
import { Input } from '@web-containers/components/ui/input';
import { Button } from '@web-containers/components/ui/button';
import { Switch } from '@web-containers/components/ui/switch';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import type { Company, Experience } from '@iblai/iblai-api';
import {
  useCreateUserExperienceMutation,
  useUpdateUserExperienceMutation,
  useDeleteUserExperienceMutation,
  useGetUserCompaniesQuery,
} from '@iblai/data-layer';
import { EMPLOYMENT_TYPES } from './constants';
import { getMonthsData, buildYearOptions } from './utils';
import { CompanyDialog } from './company-dialog';
import { Plus } from 'lucide-react';

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  org: string;
  username: string;
  experience?: Experience;
  onComplete: () => void;
}

const months = getMonthsData();
const yearOptions = buildYearOptions(60);

export const ExperienceDialog = ({
  open,
  onOpenChange,
  org,
  username,
  experience,
  onComplete,
}: ExperienceDialogProps) => {
  const { data: companies, refetch: refetchCompanies } = useGetUserCompaniesQuery({
    org,
    username,
  });
  const [createExperience, { isLoading: isCreating }] = useCreateUserExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] = useUpdateUserExperienceMutation();
  const [deleteExperience, { isLoading: isDeleting }] = useDeleteUserExperienceMutation();
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);

  const companyOptions = useMemo(
    () =>
      (companies ?? [])
        .map((company: Company) => ({ label: company.name, value: company.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [companies],
  );

  const form = useForm({
    defaultValues: {
      title: experience?.title ?? '',
      company_id: experience?.company?.id ? String(experience.company.id) : '',
      employment_type: experience?.employment_type ?? '',
      location: experience?.location ?? '',
      start_year: experience?.start_date ? String(dayjs(experience.start_date).year()) : '',
      start_month: experience?.start_date ? String(dayjs(experience.start_date).month() + 1) : '',
      end_year: experience?.end_date ? String(dayjs(experience.end_date).year()) : '',
      end_month: experience?.end_date ? String(dayjs(experience.end_date).month() + 1) : '',
      is_current: experience?.is_current ?? false,
    },
    onSubmit: async ({ value }) => {
      if (!value.company_id) {
        toast.error('Please select a company');
        return;
      }

      const startDate =
        value.start_year && value.start_month
          ? dayjs()
              .year(Number(value.start_year))
              .month(Number(value.start_month) - 1)
              .startOf('month')
              .format('YYYY-MM-DD')
          : undefined;

      const endDate =
        !value.is_current && value.end_year && value.end_month
          ? dayjs()
              .year(Number(value.end_year))
              .month(Number(value.end_month) - 1)
              .endOf('month')
              .format('YYYY-MM-DD')
          : null;

      // Validate that end date is not before start date
      if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
        toast.error('End date cannot be before start date');
        return;
      }

      const payload = {
        title: value.title,
        company_id: Number(value.company_id),
        employment_type: value.employment_type,
        location: value.location,
        start_date: startDate ?? dayjs().format('YYYY-MM-DD'),
        end_date: endDate,
        is_current: value.is_current,
      };

      try {
        if (experience?.id) {
          await updateExperience({
            org,
            username,
            experience_id: experience.id,
            experience: {
              ...payload,
              id: experience.id,
            },
          }).unwrap();
          toast.success('Experience updated successfully');
        } else {
          await createExperience({
            org,
            username,
            experience: payload,
          }).unwrap();
          toast.success('Experience added successfully');
        }
        onComplete();
        onOpenChange(false);
      } catch (error) {
        toast.error('Unable to save experience information');
      }
    },
  });

  useEffect(() => {
    if (experience) {
      form.reset({
        title: experience.title ?? '',
        company_id: experience.company?.id ? String(experience.company.id) : '',
        employment_type: experience.employment_type ?? '',
        location: experience.location ?? '',
        start_year: experience.start_date ? String(dayjs(experience.start_date).year()) : '',
        start_month: experience.start_date ? String(dayjs(experience.start_date).month() + 1) : '',
        end_year: experience.end_date ? String(dayjs(experience.end_date).year()) : '',
        end_month: experience.end_date ? String(dayjs(experience.end_date).month() + 1) : '',
        is_current: experience.is_current ?? false,
      });
    } else {
      form.reset({
        title: '',
        company_id: '',
        employment_type: '',
        location: '',
        start_year: '',
        start_month: '',
        end_year: '',
        end_month: '',
        is_current: false,
      });
    }
  }, [experience, form, open]);

  const handleDelete = async () => {
    if (!experience?.id || isDeleting) {
      return;
    }
    try {
      await deleteExperience({
        org,
        username,
        experience_id: experience.id,
      }).unwrap();
      toast.success('Experience removed successfully');
      onComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error('Unable to delete experience');
    }
  };

  const isSubmitting = form.state.isSubmitting || isCreating || isUpdating;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle></DialogTitle>
        <DialogContent className="p-0 overflow-hidden max-w-2xl max-h-[90vh] overflow-y-auto">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!form.state.isFormValid) {
                toast.error('Please fix the highlighted errors');
                return;
              }
              form.handleSubmit();
            }}
          >
            <div className="px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {experience ? 'Edit experience' : 'Add experience'}
                </h2>
                <p className="text-sm text-gray-500">Share your professional experience</p>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience-title">Title</Label>
                <form.Field
                  name="title"
                  validators={{
                    onChange: ({ value }) => (!value ? 'Title is required' : undefined),
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Input
                        id="experience-title"
                        className="h-10"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Enter title"
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience-company">Company</Label>
                <form.Field
                  name="company_id"
                  validators={{
                    onChange: ({ value }) => (!value ? 'Company is required' : undefined),
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          if (value === 'add_new_company') {
                            setIsCompanyDialogOpen(true);
                          } else {
                            field.handleChange(value);
                          }
                        }}
                      >
                        <SelectTrigger id="experience-company" className="h-10">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyOptions.map((companyOption) => (
                            <SelectItem
                              key={companyOption.value}
                              value={String(companyOption.value)}
                            >
                              {companyOption.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="add_new_company" className="border-t border-gray-200">
                            <div className="flex items-center">
                              <Plus className="h-4 w-4 mr-2" />
                              Add new company
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience-type">Employment type</Label>
                <form.Field name="employment_type">
                  {(field) => (
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger id="experience-type" className="h-10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience-location">Location</Label>
                <form.Field name="location">
                  {(field) => (
                    <Input
                      id="experience-location"
                      className="h-10"
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="Enter location"
                    />
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label>Start month</Label>
                <form.Field
                  name="start_month"
                  validators={{
                    onChange: ({ value }) => (!value ? 'Start month is required' : undefined),
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={String(month.value)}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label>Start year</Label>
                <form.Field
                  name="start_year"
                  validators={{
                    onChange: ({ value }) => (!value ? 'Start year is required' : undefined),
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label>End month</Label>
                <form.Field name="end_month">
                  {(field) => (
                    <form.Field name="is_current">
                      {(isCurrentField) => (
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                          disabled={isCurrentField.state.value}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={String(month.value)}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </form.Field>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label>End year</Label>
                <form.Field name="end_year">
                  {(field) => (
                    <form.Field name="is_current">
                      {(isCurrentField) => (
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                          disabled={isCurrentField.state.value}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </form.Field>
                  )}
                </form.Field>
              </div>

              <div className="md:col-span-2">
                <form.Field name="is_current">
                  {(field) => (
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">I currently work here</p>
                        <p className="text-xs text-gray-500">
                          Disable the end date when you are still working
                        </p>
                      </div>
                      <Switch
                        checked={field.state.value}
                        onCheckedChange={(value) => {
                          field.handleChange(value);
                          if (value) {
                            // Clear end date fields when is_current is set to true
                            setTimeout(() => {
                              form.setFieldValue('end_month', '');
                              form.setFieldValue('end_year', '');
                            }, 0);
                          }
                        }}
                        className="cursor-pointer data-[state=checked]:bg-[#2563EB]"
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
              {experience && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              )}

              <div className="ml-auto flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CompanyDialog
        open={isCompanyDialogOpen}
        onOpenChange={(openState) => {
          setIsCompanyDialogOpen(openState);
          if (!openState) {
            refetchCompanies();
          }
        }}
        org={org}
        username={username}
      />
    </>
  );
};
