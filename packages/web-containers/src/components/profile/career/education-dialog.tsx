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
import type { Education, Institution } from '@iblai/iblai-api';
import {
  useCreateUserEducationMutation,
  useUpdateUserEducationMutation,
  useDeleteUserEducationMutation,
  useGetUserInstitutionsQuery,
} from '@iblai/data-layer';
import { FIELDS_OF_STUDY } from './constants';
import { getMonthsData, buildYearOptions } from './utils';
import { InstitutionDialog } from './institution-dialog';
import { Plus } from 'lucide-react';

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  org: string;
  username: string;
  education?: Education;
  onComplete: () => void;
}

const months = getMonthsData();
const yearOptions = buildYearOptions(60);

export const EducationDialog = ({
  open,
  onOpenChange,
  org,
  username,
  education,
  onComplete,
}: EducationDialogProps) => {
  const { data: institutions, refetch: refetchInstitutions } = useGetUserInstitutionsQuery({
    org,
    username,
  });
  const [createEducation, { isLoading: isCreating }] = useCreateUserEducationMutation();
  const [updateEducation, { isLoading: isUpdating }] = useUpdateUserEducationMutation();
  const [deleteEducation, { isLoading: isDeleting }] = useDeleteUserEducationMutation();
  const [isInstitutionDialogOpen, setIsInstitutionDialogOpen] = useState(false);

  const institutionOptions = useMemo(
    () =>
      (institutions ?? [])
        .map((institution: Institution) => ({
          label: institution.name,
          value: institution.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [institutions],
  );

  const form = useForm({
    defaultValues: {
      degree: education?.degree ?? '',
      field_of_study: education?.field_of_study ?? '',
      institution_id: education?.institution?.id ? String(education.institution.id) : '',
      start_year: education?.start_date ? String(dayjs(education.start_date).year()) : '',
      start_month: education?.start_date ? String(dayjs(education.start_date).month() + 1) : '',
      end_year: education?.end_date ? String(dayjs(education.end_date).year()) : '',
      end_month: education?.end_date ? String(dayjs(education.end_date).month() + 1) : '',
      grade: education?.grade ?? '',
      is_current: education?.is_current ?? false,
    },
    onSubmit: async ({ value }) => {
      if (!value.institution_id) {
        toast.error('Please select an institution');
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
        degree: value.degree,
        field_of_study: value.field_of_study,
        institution_id: Number(value.institution_id),
        start_date: startDate ?? dayjs().format('YYYY-MM-DD'),
        end_date: endDate,
        grade: value.grade,
        is_current: value.is_current,
      };

      try {
        if (education?.id) {
          await updateEducation({
            org,
            username,
            education_id: education.id,
            education: {
              ...payload,
              id: education.id,
            },
          }).unwrap();
          toast.success('Education updated successfully');
        } else {
          await createEducation({
            org,
            username,
            education: payload,
          }).unwrap();
          toast.success('Education added successfully');
        }
        onComplete();
        onOpenChange(false);
      } catch (error) {
        toast.error('Unable to save education information');
      }
    },
  });

  useEffect(() => {
    if (education) {
      form.reset({
        degree: education.degree ?? '',
        field_of_study: education.field_of_study ?? '',
        institution_id: education.institution?.id ? String(education.institution.id) : '',
        start_year: education.start_date ? String(dayjs(education.start_date).year()) : '',
        start_month: education.start_date ? String(dayjs(education.start_date).month() + 1) : '',
        end_year: education.end_date ? String(dayjs(education.end_date).year()) : '',
        end_month: education.end_date ? String(dayjs(education.end_date).month() + 1) : '',
        grade: education.grade ?? '',
        is_current: education.is_current ?? false,
      });
    } else {
      form.reset({
        degree: '',
        field_of_study: '',
        institution_id: '',
        start_year: '',
        start_month: '',
        end_year: '',
        end_month: '',
        grade: '',
        is_current: false,
      });
    }
  }, [education, form, open]);

  const handleDelete = async () => {
    if (!education?.id || isDeleting) {
      return;
    }
    try {
      await deleteEducation({
        org,
        username,
        education_id: education.id,
      }).unwrap();
      toast.success('Education removed successfully');
      onComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error('Unable to delete education');
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
                  {education ? 'Edit education' : 'Add education'}
                </h2>
                <p className="text-sm text-gray-500">
                  Provide details about your academic background
                </p>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="education-degree">Degree</Label>
                <form.Field
                  name="degree"
                  validators={{
                    onChange: ({ value }) => (!value ? 'Degree is required' : undefined),
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Input
                        id="education-degree"
                        className="h-10"
                        value={field.state.value}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="e.g. Bachelor of Science"
                      />
                      {!field.state.meta.isValid && (
                        <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education-field">Field of study</Label>
                <form.Field name="field_of_study">
                  {(field) => (
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger id="education-field" className="h-10">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELDS_OF_STUDY.map((fieldOption) => (
                          <SelectItem key={fieldOption} value={fieldOption}>
                            {fieldOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education-institution">Institution</Label>
                <form.Field
                  name="institution_id"
                  validators={{
                    onChange: ({ value }) => (!value ? 'Institution is required' : undefined),
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          if (value === 'add_new_institution') {
                            setIsInstitutionDialogOpen(true);
                          } else {
                            field.handleChange(value);
                          }
                        }}
                      >
                        <SelectTrigger id="education-institution" className="h-10">
                          <SelectValue placeholder="Select institution" />
                        </SelectTrigger>
                        <SelectContent>
                          {institutionOptions.map((institutionOption) => (
                            <SelectItem
                              key={institutionOption.value}
                              value={String(institutionOption.value)}
                            >
                              {institutionOption.label}
                            </SelectItem>
                          ))}
                          <SelectItem
                            value="add_new_institution"
                            className="border-t border-gray-200"
                          >
                            <div className="flex items-center">
                              <Plus className="h-4 w-4 mr-2" />
                              Add new institution
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
                          <SelectValue placeholder="Month" />
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
                          <SelectValue placeholder="Year" />
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
                            <SelectValue placeholder="Month" />
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
                            <SelectValue placeholder="Year" />
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

              <div className="space-y-2">
                <Label htmlFor="education-grade">Grade</Label>
                <form.Field name="grade">
                  {(field) => (
                    <Input
                      id="education-grade"
                      className="h-10"
                      value={field.state.value}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="e.g. 3.8 GPA"
                    />
                  )}
                </form.Field>
              </div>

              <div className="md:col-span-2">
                <form.Field name="is_current">
                  {(field) => (
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">I currently study here</p>
                        <p className="text-xs text-gray-500">
                          Disable the end date when you are still studying
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
              {education && (
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

      <InstitutionDialog
        open={isInstitutionDialogOpen}
        onOpenChange={(openState) => {
          setIsInstitutionDialogOpen(openState);
          if (!openState) {
            refetchInstitutions();
          }
        }}
        org={org}
        username={username}
      />
    </>
  );
};
