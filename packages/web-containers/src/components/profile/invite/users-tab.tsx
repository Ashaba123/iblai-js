'use client';

import { Button } from '@web-containers/components/ui/button';
import { Input } from '@web-containers/components/ui/input';
import { Mail, Plus, Check, CheckCircle2, XCircle, Clock, Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useInviteUserMutation, usePlatformInvitationsQuery } from '@iblai/data-layer';
import { getUserName } from '@web-containers/utils';
import { toast } from 'sonner';
import { CSVEditor } from '../csv-editor';

interface UsersTabProps {
  tenant: string;
  currentPage: number;
  itemsPerPage: number;
  onInviteSuccess: () => void;
}

export function UsersTab({ tenant, currentPage, itemsPerPage, onInviteSuccess }: UsersTabProps) {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [inviteSent, setInviteSent] = useState<boolean>(false);
  const [isParsingCSV, setIsParsingCSV] = useState(false);
  const [isCSVEditorOpen, setIsCSVEditorOpen] = useState(false);
  const [parsedCSVData, setParsedCSVData] = useState<{ headers: string[]; rows: string[][] }>({
    headers: [],
    rows: [],
  });

  const [inviteUser, { isLoading }] = useInviteUserMutation();

  // Fetch invited users with pagination
  const { data: invitedUsers, isLoading: isLoadingInvitedUsers } = usePlatformInvitationsQuery({
    platformKey: tenant,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const currentUsers = invitedUsers?.results || [];

  const validateEmail = (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value.trim()) {
      return 'Email is required';
    }

    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }

    return '';
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateEmail(email);
    setEmailError(error);

    if (error) {
      return;
    }

    try {
      await inviteUser({
        requestBody: {
          email,
          platform_key: tenant,
          redirect_to: window.location.origin + window.location.pathname,
          source: getUserName(),
        },
      }).unwrap();

      setEmail('');
      setEmailError('');
      setInviteSent(true);
      onInviteSuccess();

      toast.success(`Invited user ${email} successfully`);

      setTimeout(() => {
        setInviteSent(false);
      }, 3000);
    } catch (error) {
      toast.error('Failed to invite user. Please try again.');
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
    const emailIndex = data.headers.findIndex((h) => h.toLowerCase() === 'email');
    const platformKeyIndex = data.headers.findIndex((h) => h.toLowerCase() === 'platform_key');

    if (emailIndex === -1) {
      toast.error('CSV must have "email" column');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const row of data.rows) {
      const emailValue = row[emailIndex]?.trim();
      const platformKey = platformKeyIndex !== -1 ? row[platformKeyIndex]?.trim() : tenant;

      if (emailValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(emailValue)) {
          try {
            await inviteUser({
              requestBody: {
                email: emailValue,
                platform_key: platformKey || tenant,
                redirect_to: window.location.origin + window.location.pathname,
                source: getUserName(),
              },
            }).unwrap();
            successCount++;
          } catch (error) {
            errorCount++;
          }
        }
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully invited ${successCount} user(s)`);
      onInviteSuccess();
    }

    if (errorCount > 0) {
      toast.error(`Failed to invite ${errorCount} user(s)`);
    }
  };

  const handleCSVEditorCancel = () => {
    setIsCSVEditorOpen(false);
    setParsedCSVData({ headers: [], rows: [] });
  };

  const downloadTemplate = () => {
    const csvContent = `email,platform_key\nexample1@domain.com,${tenant}\nexample2@domain.com,${tenant}\nexample3@domain.com,${tenant}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_invite_template.csv';
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

  const isFormValid = !emailError && email.trim().length > 0;
  return (
    <div className="mt-0 space-y-6">
      {/* Individual Invite */}
      <div className="space-y-4">
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div className="flex gap-4 items-center sm:items-end flex-col sm:flex-row">
            <div className="relative flex-1 w-full">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email-invite"
                type="email"
                placeholder="Enter email to invite..."
                value={email}
                onChange={handleEmailChange}
                required
                className={`pl-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#93C5FD] text-white hover:opacity-90 hover:text-white text-sm"
                disabled={inviteSent || !isFormValid || isLoading}
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
                  className="gap-2 bg-transparent"
                  disabled={isParsingCSV}
                  asChild={!isParsingCSV}
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

      {/* Invited Users Table */}
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
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[80px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingInvitedUsers ? (
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
                      <td colSpan={2} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Mail className="h-12 w-12 mb-3 text-gray-300" aria-hidden="true" />
                          <p className="text-sm font-medium">No invitations yet</p>
                          <p className="text-xs mt-1">
                            Start by inviting users above or uploading a CSV file
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center truncate max-w-[200px] sm:max-w-full">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Mail className="h-4 w-4 text-blue-600" aria-hidden="true" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {user.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.active, user.expired)}`}
                          >
                            {user.active && !user.expired && (
                              <Clock className="h-3 w-3 mr-1 text-blue-500" aria-hidden="true" />
                            )}
                            {!user.active && !user.expired && (
                              <CheckCircle2
                                className="h-3 w-3 mr-1 text-green-700"
                                aria-hidden="true"
                              />
                            )}
                            {user.expired && (
                              <XCircle className="h-3 w-3 mr-1 text-gray-500" aria-hidden="true" />
                            )}
                            {getStatusText(user.active, user.expired)}
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
