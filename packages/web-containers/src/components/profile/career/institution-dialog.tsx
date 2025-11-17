'use client';

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
import { toast } from 'sonner';
import { useCreateUserInstitutionMutation } from '@iblai/data-layer';
import { INSTITUTION_TYPES } from './constants';
import { InstitutionTypeEnum } from '@iblai/iblai-api';

interface InstitutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  org: string;
  username: string;
}

export const InstitutionDialog = ({
  open,
  onOpenChange,
  org,
  username,
}: InstitutionDialogProps) => {
  const [createInstitution, { isLoading }] = useCreateUserInstitutionMutation();

  const form = useForm({
    defaultValues: {
      name: '',
      institution_type: '',
      location: '',
      website: '',
      /* accreditation: '',
      established_year: '', */
      is_current: true,
    },
    onSubmit: async ({ value }) => {
      try {
        await createInstitution({
          org,
          username,
          institution: {
            name: value.name,
            institution_type: value.institution_type as InstitutionTypeEnum,
            location: value.location,
            website: value.website,
            /* accreditation: value.accreditation,
            established_year: value.established_year ? Number(value.established_year) : undefined, */
          },
        }).unwrap();
        toast.success('Institution created successfully');
        onOpenChange(false);
        form.reset();
      } catch (error) {
        toast.error('Failed to create institution');
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="p-0 overflow-hidden max-w-lg">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!form.state.isFormValid) {
              toast.error('Please fill in all required fields');
              return;
            }
            form.handleSubmit();
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Add Institution</h2>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => (!value ? 'Name is required' : undefined),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="institution-name">Name</Label>
                  <Input
                    id="institution-name"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. Harvard University"
                  />
                  {!field.state.meta.isValid && (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="institution_type"
              validators={{
                onChange: ({ value }) => (!value ? 'Institution type is required' : undefined),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="institution-type">Institution type</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger id="institution-type" className="h-11">
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTITUTION_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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

            <form.Field name="location">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="institution-location">Location</Label>
                  <Input
                    id="institution-location"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. Cambridge, MA"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="website">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="institution-website">Website</Label>
                  <Input
                    id="institution-website"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="https://example.edu"
                  />
                </div>
              )}
            </form.Field>

            {/* <form.Field name="accreditation">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="institution-accreditation">Accreditation</Label>
                  <Input
                    id="institution-accreditation"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Accreditation body"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="established_year">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="institution-year">Year established</Label>
                  <Input
                    id="institution-year"
                    type="number"
                    min="0"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. 1890"
                  />
                </div>
              )}
            </form.Field> */}
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Institution'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
