'use client';
import { Switch } from '@web-containers/components/ui/switch';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';
import {
  coreApiSlice,
  useGetStudentMentorCreationStatusQuery,
  useSetStudentMentorCreationStatusMutation,
} from '@iblai/data-layer';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';

interface StudentMentorCreationContentProps {
  platformKey: string;
}

export const StudentMentorCreationContent = ({
  platformKey,
}: StudentMentorCreationContentProps) => {
  const { data: studentMentorCreationStatus, isLoading: isLoadingStudentMentorCreationStatus } =
    useGetStudentMentorCreationStatusQuery({
      platformKey,
    });
  const [updateStudentMentorCreationStatus, { isLoading: isUpdatingStudentMentorCreationStatus }] =
    useSetStudentMentorCreationStatusMutation();
  const dispatch = useDispatch();

  const handleToggleStudentMentorCreation = async (checked: boolean) => {
    try {
      await updateStudentMentorCreationStatus({
        requestBody: {
          platform_key: platformKey,
          allow_students_to_create_mentors: checked,
        },
      }).unwrap();
      (dispatch as any)(
        coreApiSlice.util.updateQueryData(
          'getStudentMentorCreationStatus',
          { platformKey },
          (draft) => {
            draft.allow_students_to_create_mentors = checked;
          },
        ),
      );
      toast.success('Student mentor creation setting updated successfully');
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error('Failed to update student mentor creation setting');
    }
  };

  if (isLoadingStudentMentorCreationStatus) {
    return (
      <div className="rounded-lg border px-6 py-6" style={{ borderColor: 'oklch(.922 0 0)' }}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 w-11 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-between rounded-lg border px-6 py-6"
      style={{ borderColor: 'oklch(.922 0 0)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#646464]">Student Mentor Creation</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              aria-label="More info about public registration"
              className="hidden sm:block"
            >
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm transition-opacity duration-300 z-50">
              <p>Allow students to create mentors in the mentor platform</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={studentMentorCreationStatus?.allow_students_to_create_mentors}
          onCheckedChange={handleToggleStudentMentorCreation}
          disabled={isUpdatingStudentMentorCreationStatus}
          aria-label={`Student mentor creation ${studentMentorCreationStatus?.allow_students_to_create_mentors ? 'enabled' : 'disabled'}`}
          className="cursor-pointer data-[state=checked]:bg-blue-500"
        />
        {isUpdatingStudentMentorCreationStatus && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
};
