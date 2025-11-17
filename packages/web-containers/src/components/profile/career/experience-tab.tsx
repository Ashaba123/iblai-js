'use client';

import { useState } from 'react';
import { Button } from '@web-containers/components/ui/button';
import { Skeleton } from '@web-containers/components/ui/skeleton';
import { Plus, Edit2 } from 'lucide-react';
import dayjs from 'dayjs';
import type { Experience } from '@iblai/iblai-api';
import { useGetUserExperienceQuery } from '@iblai/data-layer';
import { ExperienceDialog } from './experience-dialog';

interface ExperienceTabProps {
  org: string;
  username: string;
}

const formatExperienceDuration = (experience: Experience) => {
  const start = experience.start_date ? dayjs(experience.start_date).format('MMM YYYY') : null;
  const end = experience.is_current
    ? 'Present'
    : experience.end_date
      ? dayjs(experience.end_date).format('MMM YYYY')
      : undefined;
  if (!start) {
    return end ?? '—';
  }
  return end ? `${start} • ${end}` : start;
};

export const ExperienceTab = ({ org, username }: ExperienceTabProps) => {
  const { data, isLoading, isError, refetch } = useGetUserExperienceQuery({ org, username });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);

  const handleAdd = () => {
    setSelectedExperience(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Add Button */}
      {/* <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400"
        >
          <Plus className="h-4 w-4" />
          Add experience
        </Button>
      </div> */}

      <div className="space-y-4">
        {isLoading && (
          <>
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-start gap-4 p-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </>
        )}

        {!isLoading && (isError || !data || data.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <h3 className="text-base font-semibold text-gray-700">No experience added yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your roles, responsibilities, and achievements.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4 mr-2" /> Add experience
            </Button>
          </div>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <div className="space-y-4">
            {data.map((experience) => (
              <div
                key={experience.id}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                {/* Company Logo Placeholder */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#93C5FD] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {experience.company?.name?.charAt(0) || 'C'}
                </div>

                {/* Experience Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{experience.title}</h3>
                      <p className="text-sm text-gray-600">
                        {experience.company?.name || 'Company'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatExperienceDuration(experience)}{' '}
                        {experience.location && `| ${experience.location}`}{' '}
                        {experience.employment_type && `| ${experience.employment_type}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(experience)}
                      className="group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ExperienceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        experience={selectedExperience}
        org={org}
        username={username}
        onComplete={() => refetch()}
      />
    </div>
  );
};
