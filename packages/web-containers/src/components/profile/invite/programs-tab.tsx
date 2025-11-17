'use client';

import { Button } from '@web-containers/components/ui/button';
import { Input } from '@web-containers/components/ui/input';
import { Checkbox } from '@web-containers/components/ui/checkbox';
import { Label } from '@web-containers/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@web-containers/components/ui/popover';
import {
  Plus,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  GraduationCap,
  ChevronDown,
  X,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  useGetCatalogInvitationsProgramQuery,
  useCreateCatalogInvitationProgramBulkMutation,
  useGetPersonnalizedSearchQuery,
  usePlatformUsersQuery,
  PlatformUserWithPolicies,
} from '@iblai/data-layer';
import { getUserName } from '@web-containers/utils';
import { toast } from 'sonner';
import { CSVEditor } from '../csv-editor';

interface ProgramsTabProps {
  tenant: string;
  currentPage: number;
  itemsPerPage: number;
}

export function ProgramsTab({ tenant, currentPage, itemsPerPage }: ProgramsTabProps) {
  const [inviteSent, setInviteSent] = useState<boolean>(false);

  // User selection states
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Program selection states
  const [selectedPrograms, setSelectedPrograms] = useState<any[]>([]);
  const [programSearchTerm, setProgramSearchTerm] = useState('');
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);

  // CSV upload states
  const [isParsingCSV, setIsParsingCSV] = useState(false);
  const [_, setCsvData] = useState<string>('');
  const [isCSVEditorOpen, setIsCSVEditorOpen] = useState(false);
  const [parsedCSVData, setParsedCSVData] = useState<{ headers: string[]; rows: string[][] }>({
    headers: [],
    rows: [],
  });

  const [createCatalogInvitationProgramBulk] = useCreateCatalogInvitationProgramBulkMutation();

  // Fetch program invitations
  const { data: programInvitations, isLoading: isLoadingData } =
    useGetCatalogInvitationsProgramQuery({
      platform_key: tenant,
      page: currentPage,
      page_size: itemsPerPage,
    });

  const currentUsers = programInvitations?.results || [];

  // Custom debounce hook
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
  const debouncedUserSearch = useDebounce(userSearchTerm, 300);

  // Fetch platform users
  const { data: usersData, isLoading: isLoadingUsers } = usePlatformUsersQuery(
    {
      platform_key: tenant,
      query: debouncedUserSearch || undefined,
      page: 1,
      page_size: 50,
    },
    {
      skip: !isUserDropdownOpen,
    },
  );

  const platformUsers = (usersData?.results as unknown as PlatformUserWithPolicies[]) || [];

  // Search query for programs
  const { data: programsData, isLoading: isLoadingPrograms } = useGetPersonnalizedSearchQuery(
    [
      {
        username: getUserName(),
        content: ['programs'],
        query: debouncedProgramSearch || '',
        returnFacet: false,
        tenant,
      },
    ],
    {
      skip: !isProgramDropdownOpen,
    },
  );

  const programs =
    programsData?.results
      ?.filter((item: any) => item.type === 'program')
      .map((item: any) => item.data) || [];

  const removeSelectedUser = (userEmail: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.email !== userEmail));
  };

  const removeSelectedProgram = (programId: string) => {
    setSelectedPrograms(selectedPrograms.filter((program) => program.id !== programId));
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    if (selectedPrograms.length === 0) {
      toast.error('Please select at least one program');
      return;
    }

    try {
      // Build invitation data array for bulk creation
      const invitationData = selectedUsers.flatMap((user) =>
        selectedPrograms.map((program) => ({
          program_key: program.program_key,
          email: user.email,
        })),
      );

      const totalInvitations = invitationData.length;

      // Send bulk program invitations
      await createCatalogInvitationProgramBulk({
        requestBody: {
          invitation_data: invitationData,
          platform_key: tenant,
        },
      }).unwrap();

      setInviteSent(true);

      toast.success(
        `Successfully sent ${totalInvitations} program invitation(s) to ${selectedUsers.length} user(s)`,
      );

      // Reset form
      setTimeout(() => {
        setSelectedUsers([]);
        setSelectedPrograms([]);
        setInviteSent(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to send program invitations. Please try again.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      toast.error('Please upload a valid CSV file');
      event.target.value = '';
      return;
    }

    setIsParsingCSV(true);

    try {
      const text = await file.text();
      setCsvData(text);

      // Parse CSV into editor format
      const lines = text.trim().split('\n');
      if (lines.length === 0) {
        toast.error('CSV file is empty');
        setIsParsingCSV(false);
        event.target.value = '';
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim());
      const rows = lines.slice(1).map((line) => line.split(',').map((cell) => cell.trim()));

      setParsedCSVData({ headers, rows });
      setIsCSVEditorOpen(true);
    } catch (error) {
      toast.error('Failed to parse CSV file. Please check the format.');
    } finally {
      setIsParsingCSV(false);
      event.target.value = '';
    }
  };

  const handleCSVEditorSave = async (data: { headers: string[]; rows: string[][] }) => {
    setIsCSVEditorOpen(false);

    // Extract invitation data from edited CSV
    const invitationData: Array<{ email: string; program_key: string }> = [];
    const emailIndex = data.headers.findIndex((h) => h.toLowerCase() === 'email');
    const programKeyIndex = data.headers.findIndex((h) => h.toLowerCase() === 'program_key');

    if (emailIndex === -1 || programKeyIndex === -1) {
      toast.error('CSV must have "email" and "program_key" columns');
      return;
    }

    data.rows.forEach((row) => {
      const email = row[emailIndex]?.trim();
      const program_key = row[programKeyIndex]?.trim();

      if (email && program_key) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
          invitationData.push({ email, program_key });
        }
      }
    });

    if (invitationData.length === 0) {
      toast.error('No valid invitation data found in CSV');
      return;
    }

    // Send bulk invitations
    await handleBulkInvitation(invitationData);
  };

  const handleCSVEditorCancel = () => {
    setIsCSVEditorOpen(false);
    setParsedCSVData({ headers: [], rows: [] });
    setCsvData('');
  };

  const handleBulkInvitation = async (
    invitationData: Array<{ email: string; program_key: string }>,
  ) => {
    try {
      await createCatalogInvitationProgramBulk({
        requestBody: {
          invitation_data: invitationData,
          platform_key: tenant,
        },
      }).unwrap();

      toast.success(`Successfully sent ${invitationData.length} program invitation(s)`);
    } catch (error) {
      toast.error('Failed to send bulk invitations. Please try again.');
      throw error;
    }
  };

  const downloadTemplate = () => {
    const csvContent = `email,program_key\nexample1@domain.com,program_123\nexample2@domain.com,program_456\nexample3@domain.com,program_789`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'program_invite_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (activeInvitation: boolean, expired?: string | null) => {
    if (expired) {
      return 'bg-gray-100 text-gray-800';
    }
    if (activeInvitation) {
      return 'text-blue-600 bg-blue-50';
    }
    return 'text-green-700 bg-green-100';
  };

  const getStatusText = (active: boolean, expired?: string | null) => {
    if (expired) {
      return 'Expired';
    }
    if (active) {
      return 'Pending';
    }
    return 'Accepted';
  };

  const isFormValid = selectedUsers.length > 0 && selectedPrograms.length > 0;

  return (
    <div className="mt-0 space-y-6">
      {/* Program Invitations Form */}
      <div className="space-y-4">
        <form onSubmit={handleSendInvite} className="space-y-4">
          {/* User and Program Selection Row */}
          <div className="flex gap-4 items-start flex-col lg:flex-row">
            {/* User Selector */}
            <div className="flex-1 w-full">
              <Popover open={isUserDropdownOpen} onOpenChange={setIsUserDropdownOpen} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50 h-11"
                  >
                    <span className="text-gray-500">
                      {selectedUsers.length > 0
                        ? `${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} selected`
                        : 'Select users...'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 max-h-80" align="start">
                  <div className="p-3 border-b">
                    <Input
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
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
                    {isLoadingUsers ? (
                      <div className="p-3 text-sm text-gray-500">Loading users...</div>
                    ) : platformUsers.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No users found</div>
                    ) : (
                      platformUsers.map((user: any) => (
                        <div
                          key={user.email}
                          className="flex items-start space-x-2 p-3 hover:bg-gray-50"
                        >
                          <Checkbox
                            id={`user-${user.email}`}
                            checked={selectedUsers.some((u) => u.email === user.email)}
                            className="mt-1"
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUsers([...selectedUsers, user]);
                              } else {
                                setSelectedUsers(
                                  selectedUsers.filter((u) => u.email !== user.email),
                                );
                              }
                            }}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`user-${user.email}`}
                              className="font-medium cursor-pointer text-sm"
                            >
                              {user.name || user.email || user.username}
                            </Label>
                            {user.email && user.name && (
                              <p className="text-xs text-gray-600">{user.email}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Program Selector */}
            <div className="flex-1 w-full">
              <Popover
                open={isProgramDropdownOpen}
                onOpenChange={setIsProgramDropdownOpen}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50 h-11"
                  >
                    <span className="text-gray-500">
                      {selectedPrograms.length > 0
                        ? `${selectedPrograms.length} program${selectedPrograms.length > 1 ? 's' : ''} selected`
                        : 'Select programs...'}
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
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Send Invite and CSV Upload Buttons */}
            <div className="flex gap-2 w-full lg:w-auto">
              <Button
                type="submit"
                className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] text-white hover:opacity-90 hover:text-white text-sm h-11 flex-1 lg:flex-none"
                disabled={inviteSent || !isFormValid}
              >
                {inviteSent ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Invite Sent</span>
                    <span className="sm:hidden">Sent</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Send Invite</span>
                    <span className="sm:hidden">Send</span>
                  </>
                )}
              </Button>
              <label className={isParsingCSV ? 'cursor-not-allowed' : 'cursor-pointer'}>
                <Button
                  variant="outline"
                  size="default"
                  className="gap-2 bg-transparent h-11"
                  disabled={isParsingCSV}
                  asChild={!isParsingCSV}
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    {isParsingCSV ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {isParsingCSV ? 'Parsing...' : 'Upload CSV'}
                    </span>
                    <span className="sm:hidden">{isParsingCSV ? '...' : 'CSV'}</span>
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isParsingCSV}
                />
              </label>
            </div>
          </div>

          {/* Selected Users Display */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Selected Users:</Label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    <span>{user.name || user.email || user.username}</span>
                    <button
                      type="button"
                      onClick={() => removeSelectedUser(user.email)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Programs Display */}
          {selectedPrograms.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Selected Programs:</Label>
              <div className="flex flex-wrap gap-2">
                {selectedPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                  >
                    <span>{program.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSelectedProgram(program.id)}
                      className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Need a template?</span>
          <Button
            variant="link"
            size="sm"
            onClick={downloadTemplate}
            className="p-0 h-auto text-blue-700 hover:text-blue-800"
          >
            Download CSV template
          </Button>
        </div>
      </div>

      {/* Program Invitations Table */}
      <div className="space-y-4">
        <div className="overflow-x-auto w-full scrollbar-hide">
          <div className="min-w-[200px] align-middle">
            <div className="overflow-hidden rounded-lg border border-gray-200 w-full">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                      Email
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">
                      Program
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[80px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingData ? (
                    // Loading skeleton rows
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={`loading-${index}`} className="animate-pulse">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div
                                className="h-8 w-8 rounded-full bg-gray-200"
                                aria-hidden="true"
                              ></div>
                            </div>
                            <div className="ml-3">
                              <div
                                className="h-4 bg-gray-200 rounded w-32"
                                aria-hidden="true"
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-40" aria-hidden="true"></div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div
                            className="h-5 bg-gray-200 rounded-full w-16"
                            aria-hidden="true"
                          ></div>
                        </td>
                      </tr>
                    ))
                  ) : currentUsers.length === 0 ? (
                    // Empty state
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <GraduationCap
                            className="h-12 w-12 mb-3 text-gray-300"
                            aria-hidden="true"
                          />
                          <p className="text-sm font-medium">No program invitations yet</p>
                          <p className="text-xs mt-1">
                            Start by selecting users and programs above or upload a CSV file
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((invitation) => (
                      <tr
                        key={invitation.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center truncate max-w-[200px] sm:max-w-full">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <GraduationCap
                                  className="h-4 w-4 text-purple-600"
                                  aria-hidden="true"
                                />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {invitation.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(invitation as any).program_key ||
                              (invitation as any).program?.name ||
                              'Unknown Program'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invitation.active, invitation.expired)}`}
                          >
                            {invitation.active && !invitation.expired && (
                              <Clock className="h-3 w-3 mr-1 text-blue-500" aria-hidden="true" />
                            )}
                            {!invitation.active && !invitation.expired && (
                              <CheckCircle2
                                className="h-3 w-3 mr-1 text-green-700"
                                aria-hidden="true"
                              />
                            )}
                            {invitation.expired && (
                              <XCircle className="h-3 w-3 mr-1 text-gray-500" aria-hidden="true" />
                            )}
                            {getStatusText(invitation.active, invitation.expired)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Editor Modal */}
      {isCSVEditorOpen && (
        <CSVEditor
          csvData={parsedCSVData}
          onSave={handleCSVEditorSave}
          onCancel={handleCSVEditorCancel}
        />
      )}
    </div>
  );
}
