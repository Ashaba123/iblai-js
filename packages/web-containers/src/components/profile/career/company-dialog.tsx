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
import { useCreateUserCompanyMutation } from '@iblai/data-layer';
import { INDUSTRIES } from './constants';

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  org: string;
  username: string;
}

export const CompanyDialog = ({ open, onOpenChange, org, username }: CompanyDialogProps) => {
  const [createCompany, { isLoading }] = useCreateUserCompanyMutation();

  const form = useForm({
    defaultValues: {
      name: '',
      industry: '',
      website: '',
      //logo_url: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await createCompany({
          org,
          username,
          company: {
            name: value.name,
            industry: value.industry,
            website: value.website,
            //logo_url: value.logo_url,
          },
        }).unwrap();
        toast.success('Company created successfully');
        onOpenChange(false);
        form.reset();
      } catch (error) {
        toast.error('Failed to create company');
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
            <h2 className="text-lg font-semibold text-gray-900">Add Company</h2>
          </div>

          <div className="p-6 space-y-6">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => (!value ? 'Name is required' : undefined),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="company-name">Name</Label>
                  <Input
                    id="company-name"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Enter company name"
                  />
                  {!field.state.meta.isValid && (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="industry"
              validators={{
                onChange: ({ value }) => (!value ? 'Industry is required' : undefined),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="company-industry">Industry</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger id="company-industry" className="h-11">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
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

            <form.Field name="website">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input
                    id="company-website"
                    type="url"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Enter website url"
                  />
                </div>
              )}
            </form.Field>
            {/* 
            <form.Field name="logo_url">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="company-logo">Logo URL</Label>
                  <Input
                    id="company-logo"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="https://cdn.example.com/logo.png"
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
              {isLoading ? 'Saving...' : 'Save Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
