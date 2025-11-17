import {
  usePlatformUsersQuery,
  useUpdateUserRoleMutation,
  platformApiSlice,
  PlatformUsersListWithPoliciesResponse,
  useUpdatePlatformUserRoleWithPoliciesMutation,
  PlatformUserWithPolicies,
  isPoliciesResponse,
  useUpdateUserStatusMutation,
} from '@iblai/data-layer';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@web-containers/components/ui/input';
import { Spinner } from '@web-containers/components/spinner';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@web-containers/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web-containers/components/ui/select';
import { Switch } from '@web-containers/components/ui/switch';
import { AdvancedPagination } from '@web-containers/components/advance-pagination';
import { toast } from 'sonner';
import { featureTags } from '@iblai/data-layer';
import { Checkbox } from '@web-containers/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@web-containers/components/ui/popover';

export function UsersTab({ tenant, onInviteClick }: { tenant: string; onInviteClick: () => void }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [searchQuery, setQuerySearch] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updatePlatformUserRoleWithPolicies] = useUpdatePlatformUserRoleWithPoliciesMutation();
  const [updatingUserIds, setUpdatingUserIds] = useState<Set<number>>(new Set());
  const [openPolicyPopover, setOpenPolicyPopover] = useState<number | null>(null);
  const {
    data: users,
    refetch: refetchPlatformUsers,
    isLoading,
  } = usePlatformUsersQuery({
    page,
    page_size: 10,
    platform_key: tenant,
    platform_org: tenant,
    query: debouncedSearchQuery,
    return_policies: 'true',
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.length > 3) {
        setDebouncedSearchQuery(searchQuery);
      } else {
        setDebouncedSearchQuery('');
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await refetchPlatformUsers();
  };

  const handleUserRoleChange = async (user: Record<string, any>) => {
    const userId = user?.user_id;
    if (!userId) return;

    // Add to updating state
    setUpdatingUserIds((prev) => new Set(prev).add(userId));

    try {
      await updateUserRole({
        username: user?.username,
        org: user?.platform_org,
        role: 'org-instructor',
        active: !user?.is_admin,
      }).unwrap();

      // Only clear policies if role change succeeded
      try {
        await updatePlatformUserRoleWithPolicies({
          requestBody: [
            {
              user_id: user?.user_id,
              platform_key: user?.platform_key,
              policies_to_set: [],
            },
          ],
        }).unwrap();
      } catch (policyError) {
        console.error('Failed to clear policies after role change:', policyError);
        // Role changed but policies didn't clear - log for debugging
        toast.warning('Role updated but policies may need manual review');
      }

      toast.success('User role updated successfully');
      // Manually invalidate the platformUsers query since it's in a different API slice
      dispatch(platformApiSlice.util.invalidateTags([featureTags.PLATFORM_USERS]));
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setUpdatingUserIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleUserStatusChange = async (user: Record<string, any>, newStatus: boolean) => {
    const userId = user?.user_id;
    if (!userId) return;

    // Add user to updating set
    setUpdatingUserIds((prev) => new Set(prev).add(userId));

    try {
      await updateUserStatus({
        requestBody: {
          user_id: userId,
          platform_key: user?.platform_key,
          active: newStatus,
        },
      }).unwrap();
      toast.success('User status updated successfully');
      // Refetch the users list after status update
      await refetchPlatformUsers();
    } catch (error) {
      toast.error(
        (error as unknown as { detail: string })?.detail || 'Failed to update user status',
      );
    } finally {
      // Remove user from updating set
      setUpdatingUserIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handlePolicyChange = async (
    user: PlatformUserWithPolicies,
    policy: string,
    isChecked: boolean,
  ) => {
    const userId = user?.user_id;
    if (!userId) return;
    if (user.is_admin) return;

    // Add user to updating set
    setUpdatingUserIds((prev) => new Set(prev).add(userId));

    try {
      let newPolicies = [...(user.policies || [])];
      if (isChecked) {
        newPolicies = [...newPolicies, policy];
      } else {
        newPolicies = newPolicies.filter((p) => p !== policy);
      }

      await updatePlatformUserRoleWithPolicies({
        requestBody: [
          {
            user_id: userId,
            platform_key: user?.platform_key,
            policies_to_set: newPolicies,
          },
        ],
      }).unwrap();

      toast.success('User policies updated successfully');
      // Refetch the users list after policy update
      await refetchPlatformUsers();
    } catch (error) {
      toast.error(
        (error as unknown as { detail: string })?.detail || 'Failed to update user policies',
      );
    } finally {
      // Remove user from updating set
      setUpdatingUserIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Calculate total pages
  const totalPages = users ? Math.ceil(users.count / 10) : 0; // Assuming 10 users per page

  // Extract allowed policies and user data
  const isResultsWithPolicies = users?.results ? isPoliciesResponse(users.results) : false;
  const allowedPolicies = isResultsWithPolicies
    ? (users?.results as PlatformUsersListWithPoliciesResponse).allowed_policies
    : [];
  const userData = isResultsWithPolicies
    ? (users?.results as PlatformUsersListWithPoliciesResponse).data
    : [];

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center gap-1">
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => setQuerySearch(event.target.value)}
            placeholder="Search Users"
            className="pl-10 focus:ring-blue-500 focus:border-blue-500 h-[35px]"
            aria-label="Search users"
          />
        </div>

        <div className="mb-6">
          <Button
            className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white h-[35px]"
            onClick={onInviteClick}
          >
            Invite
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="hidden lg:grid grid-cols-12 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 gap-4">
              <div className="col-span-2">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-3">Policies</div>
              <div className="col-span-2"></div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {userData.map((user, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-12 px-6 py-4 gap-2 lg:gap-4 lg:items-center"
                >
                  <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Name
                  </div>
                  <div
                    aria-label={'user-management-name-column'}
                    className="text-gray-900 dark:text-gray-100 font-medium lg:font-normal text-sm whitespace-nowrap overflow-hidden text-ellipsis lg:col-span-2"
                  >
                    {user.name}
                  </div>

                  <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                    Email
                  </div>
                  <div
                    aria-label={'user-management-email-column'}
                    className="text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap overflow-hidden text-ellipsis lg:col-span-3"
                  >
                    {user.email}
                  </div>

                  <div className="flex justify-between items-center mt-2 lg:mt-0 lg:justify-end lg:col-span-2">
                    <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Role
                    </div>
                    <Select
                      value={user.is_admin ? 'admin' : 'student'}
                      onValueChange={() => handleUserRoleChange(user)}
                    >
                      <SelectTrigger className="w-32 sm:w-full text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="text-sm">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between items-center mt-2 lg:mt-0 lg:col-span-3">
                    <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Policies
                    </div>
                    <Popover
                      modal={true}
                      open={openPolicyPopover === user.user_id}
                      onOpenChange={(open) => setOpenPolicyPopover(open ? user.user_id : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPolicyPopover === user.user_id}
                          aria-label={`Select policies for ${user.name}`}
                          className="w-full justify-between text-sm h-9 font-normal"
                          disabled={updatingUserIds.has(user?.user_id)}
                        >
                          <span className="truncate">
                            {user.is_admin
                              ? `All (${allowedPolicies.length}) selected`
                              : user.policies && user.policies.length > 0
                                ? `${user.policies.length} selected`
                                : 'No policies'}
                          </span>
                          {openPolicyPopover === user.user_id ? (
                            <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          ) : (
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" align="start">
                        <div className="space-y-2">
                          <div className="text-sm font-medium mb-2">Select Policies</div>
                          {allowedPolicies.map((policy) => (
                            <div key={policy} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${user.user_id}-${policy}`}
                                checked={user.is_admin || user.policies?.includes(policy)}
                                onCheckedChange={(checked) =>
                                  handlePolicyChange(user, policy, checked as boolean)
                                }
                                disabled={user.is_admin || updatingUserIds.has(user?.user_id)}
                                aria-label={`Toggle ${policy} for ${user.name}`}
                              />
                              <label
                                htmlFor={`${user.user_id}-${policy}`}
                                className={`text-sm font-normal ${user.is_admin ? 'cursor-default' : 'cursor-pointer'}`}
                              >
                                {policy}
                              </label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex justify-between items-center mt-2 lg:mt-0 lg:justify-end lg:col-span-2">
                    <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Status
                    </div>
                    <Switch
                      checked={user.active}
                      onCheckedChange={(checked) => handleUserStatusChange(user, checked)}
                      disabled={updatingUserIds.has(user?.user_id)}
                      aria-label={`Toggle user status for ${user.name}`}
                      className="cursor-pointer data-[state=checked]:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              ))}

              {(!userData || userData.length === 0) && (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <AdvancedPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={(_page) => handlePageChange(_page)}
            />
          </div>
        </>
      )}
    </div>
  );
}
