'use client';

import { Dialog, DialogContent, DialogTitle } from '@web-containers/components/ui/dialog';
import { Button } from '@web-containers/components/ui/button';
import { Input } from '@web-containers/components/ui/input';
import { Checkbox } from '@web-containers/components/ui/checkbox';
import { Label } from '@web-containers/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@web-containers/components/ui/popover';
import {
  useCreateCatalogInvitationProgramMutation,
  useCreateCatalogInvitationCourseMutation,
  useGetPersonnalizedSearchQuery,
} from '@iblai/data-layer';
import { useState, useEffect } from 'react';
import { getUserName } from '@web-containers/utils';
import { toast } from 'sonner';
import { BookOpen, GraduationCap, ChevronDown, X } from 'lucide-react';
import { useTenantMetadata } from '@iblai/web-utils';

// Catalog Invite Modal Component
interface CatalogInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledEmail: string;
  tenant: string;
}

function CatalogInviteModal({ isOpen, onClose, prefilledEmail, tenant }: CatalogInviteModalProps) {
  const [inviteSent, setInviteSent] = useState(false);
  const { metadata } = useTenantMetadata({
    org: tenant,
  });
  // Program and course invite states
  const [selectedPrograms, setSelectedPrograms] = useState<any[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<any[]>([]);
  const [programSearchTerm, setProgramSearchTerm] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  const [createCatalogInvitationProgram] = useCreateCatalogInvitationProgramMutation();
  const [createCatalogInvitationCourse] = useCreateCatalogInvitationCourseMutation();

  const handleCancel = () => {
    setSelectedPrograms([]);
    setSelectedCourses([]);
    onClose();
  };

  // Custom debounce function
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedProgramSearch = useDebounce(programSearchTerm, 300);
  const debouncedCourseSearch = useDebounce(courseSearchTerm, 300);

  // Search queries
  const { data: programsData, isLoading: isLoadingPrograms } = useGetPersonnalizedSearchQuery(
    [
      {
        username: getUserName(),
        content: ['programs'],
        query: debouncedProgramSearch || '',
        returnFacet: false,
        ...(!metadata?.skills_include_community_courses && { tenant }),
      },
    ],
    {
      skip: !isProgramDropdownOpen,
    },
  );

  const { data: coursesData, isLoading: isLoadingCourses } = useGetPersonnalizedSearchQuery(
    [
      {
        username: getUserName(),
        content: ['courses'],
        query: debouncedCourseSearch || '',
        returnFacet: false,
        ...(!metadata?.skills_include_community_courses && { tenant }),
      },
    ],
    {
      skip: !isCourseDropdownOpen,
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPrograms.length === 0 && selectedCourses.length === 0) return;

    try {
      let successCount = 0;
      let errorCount = 0;

      // Send program invitations one by one
      for (const program of selectedPrograms) {
        try {
          await createCatalogInvitationProgram({
            requestBody: {
              program_key: program.program_key,
              email: prefilledEmail,
              active: true,
            },
            org: tenant,
          }).unwrap();

          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      // Send course invitations one by one
      for (const course of selectedCourses) {
        try {
          await createCatalogInvitationCourse({
            requestBody: {
              course_id: course.course_id,
              email: prefilledEmail,
            },
          }).unwrap();
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      setInviteSent(true);

      if (errorCount > 0) {
        toast.error(`Sent ${successCount} invitations successfully, but ${errorCount} failed.`);
      } else {
        toast.success(`Successfully sent ${successCount} invitations`);
      }

      setTimeout(() => {
        setInviteSent(false);
        setSelectedPrograms([]);
        setSelectedCourses([]);
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Failed to send invitations. Please try again.');
    }
  };

  const removeSelectedProgram = (programId: string) => {
    setSelectedPrograms(selectedPrograms.filter((program) => program.id !== programId));
  };

  const removeSelectedCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter((course) => course.id !== courseId));
  };

  // Use API data instead of mock data - extract data from the nested structure
  const programs =
    programsData?.results
      ?.filter((item: any) => item.type === 'program')
      .map((item: any) => item.data) || [];
  const courses =
    coursesData?.results
      ?.filter((item: any) => item.type === 'course')
      .map((item: any) => item.data) || [];

  const isSubmitDisabled = selectedPrograms.length === 0 && selectedCourses.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>Catalog Invite</DialogTitle>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <div className="p-4 pt-[30px] flex-shrink-0 border-b border-gray-200">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Catalog Invite</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Invite {prefilledEmail} to specific catalog items.
          </p>
        </div>

        {/* Main content area */}
        <div className="flex-grow overflow-y-auto scrollbar-hide p-6 max-h-[60vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Programs Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                <Label className="text-base font-medium">Select Programs</Label>
                <span className="text-sm text-gray-500">(Optional)</span>
              </div>
              <Popover
                open={isProgramDropdownOpen}
                onOpenChange={setIsProgramDropdownOpen}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50 h-11"
                  >
                    <span className="text-gray-500">
                      {selectedPrograms.length > 0
                        ? `${selectedPrograms.length} program${selectedPrograms.length > 1 ? 's' : ''} selected`
                        : 'Choose programs...'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 max-h-80" align="start">
                  <div className="p-3 border-b">
                    <Input
                      placeholder="Search programs..."
                      value={programSearchTerm}
                      onChange={(e) => setProgramSearchTerm(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div
                    className="overflow-y-auto max-h-60"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#d1d5db #f3f4f6',
                    }}
                  >
                    {isLoadingPrograms ? (
                      <div className="p-3 text-sm text-gray-500">Loading programs...</div>
                    ) : programs.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No programs found</div>
                    ) : (
                      programs.map((program: any) => (
                        <div
                          key={program.id}
                          className="flex items-start space-x-2 p-3 hover:bg-gray-50"
                        >
                          <Checkbox
                            id={`program-${program.id}`}
                            className="mt-1"
                            checked={selectedPrograms.some((p) => p.id === program.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPrograms([...selectedPrograms, program]);
                              } else {
                                setSelectedPrograms(
                                  selectedPrograms.filter((p) => p.id !== program.id),
                                );
                              }
                            }}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`program-${program.id}`}
                              className="font-medium cursor-pointer text-sm"
                            >
                              {program.name}
                            </Label>
                            {/* <p className="text-xs text-gray-600">
                              {program.program_type || "Program"}
                            </p> */}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Selected Programs Display */}
              {selectedPrograms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedPrograms.map((program) => (
                    <div
                      key={program.id}
                      className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                    >
                      <span>{program.name}</span>
                      <button
                        onClick={() => removeSelectedProgram(program.id)}
                        className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Courses Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <Label className="text-base font-medium">Select Courses</Label>
                <span className="text-sm text-gray-500">(Optional)</span>
              </div>
              <Popover
                open={isCourseDropdownOpen}
                onOpenChange={setIsCourseDropdownOpen}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50 h-11"
                  >
                    <span className="text-gray-500">
                      {selectedCourses.length > 0
                        ? `${selectedCourses.length} course${selectedCourses.length > 1 ? 's' : ''} selected`
                        : 'Choose courses...'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 max-h-80" align="start">
                  <div className="p-3 border-b">
                    <Input
                      placeholder="Search courses..."
                      value={courseSearchTerm}
                      onChange={(e) => setCourseSearchTerm(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div
                    className="overflow-y-auto max-h-60"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#d1d5db #f3f4f6',
                    }}
                  >
                    {isLoadingCourses ? (
                      <div className="p-3 text-sm text-gray-500">Loading courses...</div>
                    ) : courses.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No courses found</div>
                    ) : (
                      courses.map((course: any) => (
                        <div
                          key={course.id}
                          className="flex items-start space-x-2 p-3 hover:bg-gray-50"
                        >
                          <Checkbox
                            id={`course-${course.id}`}
                            checked={selectedCourses.some((c) => c.id === course.id)}
                            className="mt-1"
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCourses([...selectedCourses, course]);
                              } else {
                                setSelectedCourses(
                                  selectedCourses.filter((c) => c.id !== course.id),
                                );
                              }
                            }}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`course-${course.id}`}
                              className="font-medium cursor-pointer text-sm"
                            >
                              {course.name}
                            </Label>
                            {/*  <p className="text-xs text-gray-600">
                              {course.description ||
                                course.course_type ||
                                "Course"}
                            </p> */}
                            {/* <p className="text-xs text-blue-600">
                              {course.program_name ||
                                course.program?.name ||
                                course.platform_name}
                            </p> */}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Selected Courses Display */}
              {selectedCourses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                    >
                      <span>{course.name}</span>
                      <button
                        onClick={() => removeSelectedCourse(course.id)}
                        className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 pt-0 flex-shrink-0 border-t border-gray-200">
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="px-6">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              onClick={handleSubmit}
              disabled={isSubmitDisabled || inviteSent}
              className="px-6 hover:bg-primary/90 h-10 px-4 py-2 gap-2 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] text-white hover:opacity-90 hover:text-white text-sm"
            >
              {inviteSent ? 'Invitations Sent!' : 'Send Invitations'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CatalogInviteModal;
