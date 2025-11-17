import { useMemo, useState } from 'react';
import {
  useGetRbacPoliciesQuery,
  useCreateRbacPolicyMutation,
  useUpdateRbacPolicyMutation,
  useDeleteRbacPolicyMutation,
  useGetRbacRolesQuery,
  useGetRbacGroupsQuery,
  usePlatformUsersQuery,
  useGetRbacPolicyDetailsQuery,
  CustomRbacPolicyDetailsResponse,
} from '@iblai/data-layer';
import { Input } from '@web-containers/components/ui/input';
import { Button } from '@web-containers/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@web-containers/components/ui/dialog';
import { Label } from '@web-containers/components/ui/label';
import { toast } from 'sonner';
import { X, Trash2, Loader2, Plus, Pencil } from 'lucide-react';
import { Badge } from '@web-containers/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';

export function PoliciesTab({ tenant }: { tenant: string }) {
  const { data, isLoading, isError } = useGetRbacPoliciesQuery({ platformKey: tenant });
  const [createPolicy] = useCreateRbacPolicyMutation();
  const [updatePolicy] = useUpdateRbacPolicyMutation();
  const [deletePolicy] = useDeleteRbacPolicyMutation();

  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<CustomRbacPolicyDetailsResponse | null>(null);
  const [editingPolicyId, setEditingPolicyId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', roleId: 0, roleName: '' });
  const [resources, setResources] = useState<string[]>([]);
  const [resourceInput, setResourceInput] = useState('');
  const [_, setOriginalResources] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<
    Array<{ id: number; name: string; email: string }>
  >([]);
  const [originalUsers, setOriginalUsers] = useState<
    Array<{ id: number; name: string; email: string }>
  >([]);
  const [selectedGroups, setSelectedGroups] = useState<Array<{ id: number; name: string }>>([]);
  const [originalGroups, setOriginalGroups] = useState<Array<{ id: number; name: string }>>([]);
  const [roleSearch, setRoleSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [showRoleSearch, setShowRoleSearch] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showGroupSearch, setShowGroupSearch] = useState(false);
  const [deletingPolicyId, setDeletingPolicyId] = useState<number | null>(null);

  // Fetch policy details when editing
  const { data: policyDetails } = useGetRbacPolicyDetailsQuery(
    { id: editingPolicyId!, platform_key: tenant },
    { skip: !editingPolicyId },
  );

  // Fetch roles for autocomplete
  const { data: rolesData } = useGetRbacRolesQuery({ platformKey: tenant });

  // Fetch groups for autocomplete
  const { data: groupsData } = useGetRbacGroupsQuery({ platformKey: tenant });

  // Fetch users for search
  const { data: usersData } = usePlatformUsersQuery({
    page: 1,
    page_size: 50,
    platform_key: tenant,
    platform_org: tenant,
    query: userSearch.length > 2 ? userSearch : '',
    return_policies: 'false',
  });

  const policies = useMemo(() => {
    const list = (data as any)?.results ?? (data as any)?.data ?? data ?? [];
    if (!filter) return list;
    const f = filter.toLowerCase();
    return list.filter((p: any) => `${p.name} ${p.role} ${p.resources}`.toLowerCase().includes(f));
  }, [data, filter]);

  // Filter available roles
  const availableRoles = useMemo(() => {
    const rolesList = (rolesData as any)?.results ?? (rolesData as any)?.data ?? rolesData ?? [];
    if (!roleSearch) return rolesList;
    return rolesList.filter((role: any) =>
      role.name.toLowerCase().includes(roleSearch.toLowerCase()),
    );
  }, [rolesData, roleSearch]);

  // Filter available groups
  const availableGroups = useMemo(() => {
    const groupsList =
      (groupsData as any)?.results ?? (groupsData as any)?.data ?? groupsData ?? [];
    const filtered = groupsList.filter(
      (group: any) =>
        !selectedGroups.find((g) => g.id === group.id) &&
        (groupSearch.length === 0 || group.name.toLowerCase().includes(groupSearch.toLowerCase())),
    );
    return filtered;
  }, [groupsData, groupSearch, selectedGroups]);

  // Filter available users
  const availableUsers = useMemo(() => {
    const userData = (usersData as any)?.results?.data ?? [];
    return userData.filter((user: any) => !selectedUsers.find((u) => u.id === user.user_id));
  }, [usersData, selectedUsers]);

  function openNew() {
    setEditing(null);
    setEditingPolicyId(null);
    setForm({ name: '', roleId: 0, roleName: '' });
    setResources([]);
    setOriginalResources([]);
    setResourceInput('');
    setSelectedUsers([]);
    setOriginalUsers([]);
    setSelectedGroups([]);
    setOriginalGroups([]);
    setRoleSearch('');
    setUserSearch('');
    setGroupSearch('');
    setShowRoleSearch(false);
    setShowUserSearch(false);
    setShowGroupSearch(false);
    setIsOpen(true);
  }

  function openEdit(p: any) {
    setEditing(p);
    setEditingPolicyId(p.id);
    setForm({
      name: p.name ?? '',
      roleId: p.role_id ?? p.role?.id ?? 0,
      roleName: p.role?.name ?? '',
    });
    setResourceInput('');
    setRoleSearch('');
    setUserSearch('');
    setGroupSearch('');
    setShowRoleSearch(false);
    setShowUserSearch(false);
    setShowGroupSearch(false);
    setIsOpen(true);
  }

  // Effect to populate users, groups, and resources when policy details are loaded
  useMemo(() => {
    if (policyDetails && editingPolicyId) {
      // Set resources
      const policyResources = policyDetails?.resources ?? [];
      setResources(policyResources);
      setOriginalResources(policyResources);

      // Set users
      const policyUsers = policyDetails?.users ?? [];
      const usersList = policyUsers.map((user: any) => ({
        id: user.user_id ?? user.id,
        name: user.name ?? '',
        email: user.email ?? '',
      }));
      setSelectedUsers(usersList);
      setOriginalUsers(usersList);

      // Set groups
      const policyGroups = policyDetails?.groups ?? [];
      const groupsList = policyGroups.map((group: any) => ({
        id: group.id,
        name: group.name ?? '',
      }));
      setSelectedGroups(groupsList);
      setOriginalGroups(groupsList);
    }
  }, [policyDetails, editingPolicyId]);

  function addResource() {
    if (resourceInput.trim() && !resources.includes(resourceInput.trim())) {
      setResources([...resources, resourceInput.trim()]);
      setResourceInput('');
    }
  }

  function removeResource(resource: string) {
    setResources(resources.filter((r) => r !== resource));
  }

  function handleResourceKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addResource();
    }
  }

  function addUser(user: { id: number; name: string; email: string }) {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
      setUserSearch('');
      setShowUserSearch(false);
    }
  }

  function removeUser(userId: number) {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  }

  function addGroup(group: { id: number; name: string }) {
    if (!selectedGroups.find((g) => g.id === group.id)) {
      setSelectedGroups([...selectedGroups, group]);
      setGroupSearch('');
      setShowGroupSearch(false);
    }
  }

  function removeGroup(groupId: number) {
    setSelectedGroups(selectedGroups.filter((g) => g.id !== groupId));
  }

  async function onSubmit() {
    try {
      if (editing) {
        // For editing: determine which users/groups were added and which were removed
        const originalUserIds = originalUsers.map((u) => u.id);
        const currentUserIds = selectedUsers.map((u) => u.id);
        const users_to_add = currentUserIds.filter((id) => !originalUserIds.includes(id));
        const users_to_remove = originalUserIds.filter((id) => !currentUserIds.includes(id));

        const originalGroupIds = originalGroups.map((g) => g.id);
        const currentGroupIds = selectedGroups.map((g) => g.id);
        const groups_to_add = currentGroupIds.filter((id) => !originalGroupIds.includes(id));
        const groups_to_remove = originalGroupIds.filter((id) => !currentGroupIds.includes(id));

        const payload: any = {
          name: form.name,
          role_id: form.roleId,
          resources,
          platform_key: tenant,
          ...(users_to_add.length > 0 && { users_to_add }),
          ...(users_to_remove.length > 0 && { users_to_remove }),
          ...(groups_to_add.length > 0 && { groups_to_add }),
          ...(groups_to_remove.length > 0 && { groups_to_remove }),
        };

        await updatePolicy({ id: editing.id, requestBody: payload } as any).unwrap();
        toast.success('Policy updated');
      } else {
        // For new policies: only include users_to_add and groups_to_add
        const users_to_add = selectedUsers.map((user) => user.id);
        const groups_to_add = selectedGroups.map((group) => group.id);
        const payload: any = {
          name: form.name,
          role_id: form.roleId,
          resources,
          platform_key: tenant,
          ...(users_to_add.length > 0 && { users_to_add }),
          ...(groups_to_add.length > 0 && { groups_to_add }),
        };

        await createPolicy({ requestBody: payload } as any).unwrap();
        toast.success('Policy created');
      }
      setIsOpen(false);
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.data?.detail || 'Operation failed');
    }
  }

  async function onDelete(p: any) {
    setDeletingPolicyId(p.id);
    try {
      await deletePolicy({ id: p.id, platformKey: tenant } as any).unwrap();
      toast.success('Policy deleted');
    } catch (e: any) {
      toast.error(e?.data?.detail || 'Delete failed');
    } finally {
      setDeletingPolicyId(null);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center gap-1 mb-6">
        <div className="relative max-w-sm">
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter policies"
            aria-label="Filter policies"
            className="pl-3 focus:ring-blue-500 focus:border-blue-500 h-[35px]"
          />
        </div>
        <Button
          onClick={openNew}
          aria-label="New policy"
          className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white h-[35px]"
        >
          New Policy
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading…</div>
        </div>
      )}

      {isError && (
        <div className="py-8 text-center text-sm text-red-500">Failed to load policies</div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 gap-4">
            <div className="col-span-5">Policy Name</div>
            <div className="col-span-5">Role</div>
            <div className="col-span-2 text-right"></div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {policies.map((p: any) => (
              <div
                key={p.id}
                className="grid grid-cols-1 lg:grid-cols-12 px-6 py-4 gap-2 lg:gap-4 lg:items-center"
              >
                <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Policy Name
                </div>
                <div className="text-gray-900 dark:text-gray-100 font-medium lg:font-normal text-sm lg:col-span-5">
                  {p.name}
                </div>

                <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                  Role
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm lg:col-span-5">
                  {p.role?.name ?? 'N/A'}
                </div>

                <div className="mt-2 lg:mt-0 lg:col-span-2 flex gap-2 lg:justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(p)}
                    disabled={deletingPolicyId === p.id}
                    aria-label={`Edit policy ${p.name}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(p)}
                            className="text-red-600 hover:text-red-700"
                            disabled={deletingPolicyId === p.id || p.is_internal}
                            aria-label={`Delete policy ${p.name}`}
                          >
                            {deletingPolicyId === p.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            )}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {p.is_internal && (
                        <TooltipContent>
                          <p>Cannot delete internal policies</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
            {policies.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No policies found
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Policy' : 'New Policy'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="p-name">Policy Name</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter policy name"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="p-role">Role</Label>
              <div className="relative">
                <Input
                  id="p-role"
                  value={form.roleName || roleSearch}
                  onChange={(e) => {
                    setRoleSearch(e.target.value);
                    setForm({ ...form, roleId: 0, roleName: '' });
                    setShowRoleSearch(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowRoleSearch(true)}
                  placeholder="Type to search roles..."
                  required
                />
                {showRoleSearch && availableRoles.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
                    {availableRoles.map((role: any) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, roleId: role.id, roleName: role.name });
                          setRoleSearch('');
                          setShowRoleSearch(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-col"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {role.name}
                        </span>
                        {role.description && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {role.description}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="p-res">Resources</Label>
              <div className="space-y-2">
                {resources.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                    {resources.map((resource, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1 flex items-center gap-1 font-mono text-xs"
                      >
                        <span>{resource}</span>
                        <button
                          type="button"
                          onClick={() => removeResource(resource)}
                          className="ml-1 hover:text-red-600"
                          aria-label={`Remove resource ${resource}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    id="p-res"
                    value={resourceInput}
                    onChange={(e) => setResourceInput(e.target.value)}
                    onKeyDown={handleResourceKeyDown}
                    placeholder="e.g., /platforms/{pk}/projects, /platforms/{pk}/mentors/*"
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addResource}
                    disabled={!resourceInput.trim()}
                    aria-label="Add resource"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Press Enter or click + to add. Supports wildcards and path parameters
                </p>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Users</Label>
              <div className="space-y-2">
                {selectedUsers.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUser(user.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label={`Remove ${user.name}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 p-3 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    No users added
                  </div>
                )}
                <div className="relative">
                  <Input
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowUserSearch(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowUserSearch(userSearch.length > 0)}
                    placeholder="Type to search and add users..."
                  />
                  {showUserSearch && availableUsers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
                      {availableUsers.map((user: any) => (
                        <button
                          key={user.user_id}
                          type="button"
                          onClick={() =>
                            addUser({
                              id: user.user_id,
                              name: user.name,
                              email: user.email,
                            })
                          }
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-col"
                        >
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Groups</Label>
              <div className="space-y-2">
                {selectedGroups.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2">
                    {selectedGroups.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {group.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGroup(group.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label={`Remove ${group.name}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 p-3 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    No groups added
                  </div>
                )}
                <div className="relative">
                  <Input
                    value={groupSearch}
                    onChange={(e) => {
                      setGroupSearch(e.target.value);
                      setShowGroupSearch(e.target.value.length > 0);
                    }}
                    onFocus={() =>
                      setShowGroupSearch(groupSearch.length > 0 || availableGroups.length > 0)
                    }
                    placeholder="Type to search and add groups..."
                  />
                  {showGroupSearch && availableGroups.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
                      {availableGroups.map((group: any) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() =>
                            addGroup({
                              id: group.id,
                              name: group.name,
                            })
                          }
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {group.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button
                      onClick={onSubmit}
                      disabled={!!editing && policyDetails?.is_internal}
                      className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
                    >
                      {editing ? 'Save Policy' : 'Create Policy'}
                    </Button>
                  </span>
                </TooltipTrigger>
                {editing && policyDetails?.is_internal && (
                  <TooltipContent>
                    <p>Cannot edit internal policies</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
