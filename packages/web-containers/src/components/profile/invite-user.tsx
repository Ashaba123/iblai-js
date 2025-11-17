'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@web-containers/components/ui/dialog';
import { Button } from '@web-containers/components/ui/button';

import {
  usePlatformInvitationsQuery,
  useGetCatalogInvitationsCourseQuery,
  useGetCatalogInvitationsProgramQuery,
} from '@iblai/data-layer';
import { useState, useEffect } from 'react';
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  Users,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { useTenantMetadata } from '@iblai/web-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@web-containers/components/ui/tabs';
import { UsersTab, CoursesTab, ProgramsTab } from './invite';

export function InviteUserDialog({
  tenant,
  onClose,
  isOpen,
  enableCatalogInvite = false,
}: {
  tenant: string;
  onClose: () => void;
  isOpen: boolean;
  enableCatalogInvite?: boolean;
}) {
  useTenantMetadata({
    org: tenant,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('users');
  const itemsPerPage = 5;

  // Fetch data for pagination counts (only what's needed for the active tab)
  const { data: invitedUsers } = usePlatformInvitationsQuery({
    platformKey: tenant,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const { data: courseInvitations } = useGetCatalogInvitationsCourseQuery(
    {
      platformKey: tenant,
      page: currentPage,
      pageSize: itemsPerPage,
    },
    {
      skip: !enableCatalogInvite,
    },
  );

  const { data: programInvitations } = useGetCatalogInvitationsProgramQuery(
    {
      platform_key: tenant,
      page: currentPage,
      page_size: itemsPerPage,
    },
    {
      skip: !enableCatalogInvite,
    },
  );

  const handleInviteSuccess = () => {
    // Callback for when invite is successful - can be used for additional logic
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
      setActiveTab('users');
    }
  }, [isOpen]);

  // Reset to users tab if catalog invite is disabled
  useEffect(() => {
    if (!enableCatalogInvite && activeTab !== 'users') {
      setActiveTab('users');
    }
  }, [enableCatalogInvite, activeTab]);

  // Reset current page to 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Pagination calculations
  const getCurrentData = () => {
    switch (activeTab) {
      case 'courses':
        return courseInvitations;
      case 'programs':
        return programInvitations;
      default:
        return invitedUsers;
    }
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil((currentData?.count || 0) / itemsPerPage);

  // Get dynamic header content based on active tab
  const getHeaderContent = () => {
    switch (activeTab) {
      case 'courses':
        return {
          title: 'Invite to Courses',
          description: 'Send course invitations to users and manage existing course invites.',
        };
      case 'programs':
        return {
          title: 'Invite to Programs',
          description: 'Send program invitations to users and manage existing program invites.',
        };
      default:
        return {
          title: 'Invite Users',
          description: 'Send invitations to new users and manage existing invites.',
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-5xl w-[95vw] p-0 gap-0 mx-auto my-auto rounded-lg flex flex-col justify-between max-h-[90vh]"
          aria-describedby="invite-users-description"
        >
          {/* Fixed Header */}
          <DialogHeader className="p-4 pt-[30px] flex-shrink-0 border-b border-gray-200">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">
              {headerContent.title}
            </DialogTitle>
            <DialogDescription
              id="invite-users-description"
              className="mt-1 text-xs sm:text-sm text-gray-700"
            >
              {headerContent.description}
            </DialogDescription>
          </DialogHeader>

          {/* Main scrollable content area */}
          <div className="flex-grow overflow-y-auto scrollbar-hide p-2 sm:p-4 pb-20 max-h-[60vh]">
            {enableCatalogInvite ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Courses</span>
                  </TabsTrigger>
                  <TabsTrigger value="programs" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="hidden sm:inline">Programs</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                  <UsersTab
                    tenant={tenant}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onInviteSuccess={handleInviteSuccess}
                  />
                </TabsContent>

                <TabsContent value="courses">
                  <CoursesTab
                    tenant={tenant}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                  />
                </TabsContent>

                <TabsContent value="programs">
                  <ProgramsTab
                    tenant={tenant}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <UsersTab
                tenant={tenant}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onInviteSuccess={handleInviteSuccess}
              />
            )}
          </div>

          {/* Pagination at the bottom */}
          {currentData && currentData.count > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 flex-shrink-0">
              <div className="flex flex-1 items-center justify-between">
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, currentData.count)}
                    </span>{' '}
                    of <span className="font-medium">{currentData.count}</span> invites
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md border-gray-300 hover:bg-gray-100 hidden sm:flex bg-transparent"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="Go to first page"
                  >
                    <ChevronFirst className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 px-2 sm:p-0 flex items-center justify-center rounded-md border-none sm:border-gray-300 hover:bg-gray-100 text-xs sm:text-sm bg-transparent"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1 sm:mr-0" />
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <span className="text-xs sm:text-sm text-gray-700 mx-1 sm:mx-2 px-2">
                    <span className="hidden sm:inline">Page </span>
                    {currentPage} <span className="hidden sm:inline">of </span>
                    <span className="inline sm:hidden"> / </span>
                    {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 px-2 sm:p-0 flex items-center justify-center rounded-md border-none sm:border-gray-300 hover:bg-gray-100 text-xs sm:text-sm bg-transparent"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Go to next page"
                  >
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="h-4 w-4 ml-1 sm:ml-0" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md border-gray-300 hover:bg-gray-100 hidden sm:flex bg-transparent"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Go to last page"
                  >
                    <ChevronLast className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
