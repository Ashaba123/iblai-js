'use client';

import { useState } from 'react';
import { Button } from '@web-containers/components/ui/button';
import { Skeleton } from '@web-containers/components/ui/skeleton';
import { Plus, Edit2 } from 'lucide-react';
import type { Education } from '@iblai/iblai-api';
import { useGetUserEducationQuery } from '@iblai/data-layer';
import { EducationDialog } from './education-dialog';
import dayjs from 'dayjs';

interface EducationTabProps {
  org: string;
  username: string;
}

const formatEducationDuration = (education: Education) => {
  const start = education.start_date ? dayjs(education.start_date).format('MMM YYYY') : null;
  const end = education.is_current
    ? 'Present'
    : education.end_date
      ? dayjs(education.end_date).format('MMM YYYY')
      : undefined;
  if (!start) {
    return end ?? '—';
  }
  return end ? `${start} • ${end}` : start;
};

export const EducationTab = ({ org, username }: EducationTabProps) => {
  const { data, isLoading, isError, refetch } = useGetUserEducationQuery({ org, username });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | undefined>(undefined);

  const handleAdd = () => {
    setSelectedEducation(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (education: Education) => {
    setSelectedEducation(education);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {isLoading && (
          <>
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-start gap-4 p-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </>
        )}

        {!isLoading && (isError || !data || data.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <h3 className="text-base font-semibold text-gray-700">No education added yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your degrees, schools, and major achievements.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4 mr-2" /> Add education
            </Button>
          </div>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <div className="space-y-4">
            {data.map((education) => (
              <div
                key={education.id}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {/* Institution Logo Placeholder */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {education.institution?.name?.charAt(0) || 'E'}
                </div>

                {/* Education Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {education.institution?.name || 'Institution'}
                      </h3>
                      <p className="text-sm text-gray-600">{education.degree || 'Degree'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatEducationDuration(education)}{' '}
                        {education.grade && `| Grade: ${education.grade}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(education)}
                      className="group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* 
                  {education.description && (
                    <p className="mt-1 text-sm text-gray-600">{education.description}</p>
                  )}
                  {education.activities && (
                    <p className="mt-1 text-sm text-gray-600">{education.activities}</p>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EducationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        education={selectedEducation}
        org={org}
        username={username}
        onComplete={() => refetch()}
      />
    </div>
  );
};
