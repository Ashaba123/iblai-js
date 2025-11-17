import { useMemo, useState } from 'react';
import {
  useGetRbacGroupsQuery,
  useCreateRbacGroupMutation,
  useUpdateRbacGroupMutation,
  useDeleteRbacGroupMutation,
  usePlatformUsersQuery,
  useGetRbacGroupDetailsQuery,
  CustomRbacGroupDetailsResponse,
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
import { X, Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';

export function GroupsTab({ tenant }: { tenant: string }) {
  const { data, isLoading, isError } = useGetRbacGroupsQuery({ platformKey: tenant });
  const [createGroup] = useCreateRbacGroupMutation();
  const [updateGroup] = useUpdateRbacGroupMutation();
  const [deleteGroup] = useDeleteRbacGroupMutation();

  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<CustomRbacGroupDetailsResponse | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', unique_id: '', description: '' });
  const [members, setMembers] = useState<
    Array<{ id: number; name: string; username: string; email: string }>
  >([]);
  const [originalMembers, setOriginalMembers] = useState<
    Array<{ id: number; name: string; username: string; email: string }>
  >([]);
  const [userSearch, setUserSearch] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<number | null>(null);

  // Fetch group details when editing
  const { data: groupDetails } = useGetRbacGroupDetailsQuery(
    { id: editingGroupId! },
    { skip: !editingGroupId },
  );

  // Fetch users for search
  const { data: usersData } = usePlatformUsersQuery({
    page: 1,
    page_size: 50,
    platform_key: tenant,
    platform_org: tenant,
    query: userSearch.length > 2 ? userSearch : '',
    return_policies: 'false',
  });

  const groups = useMemo(() => {
    const list = (data as any)?.results ?? (data as any)?.data ?? data ?? [];
    if (!filter) return list;
    const f = filter.toLowerCase();
    return list.filter((g: any) =>
      `${g.name} ${g.unique_id} ${g.description}`.toLowerCase().includes(f),
    );
  }, [data, filter]);

  function openNew() {
    setEditing(null);
    setEditingGroupId(null);
    setForm({ name: '', unique_id: '', description: '' });
    setMembers([]);
    setOriginalMembers([]);
    setUserSearch('');
    setShowUserSearch(false);
    setIsOpen(true);
  }

  function openEdit(g: any) {
    setEditing(g);
    setEditingGroupId(g.id);
    setForm({ name: g.name ?? '', unique_id: g.unique_id ?? '', description: g.description ?? '' });
    setUserSearch('');
    setShowUserSearch(false);
    setIsOpen(true);
  }

  // Effect to populate members when group details are loaded
  useMemo(() => {
    if (groupDetails && editingGroupId) {
      const groupUsers = groupDetails?.users ?? [];
      const membersList = groupUsers.map((user: any) => ({
        id: user.user_id ?? user.id,
        name: user.name ?? '',
        username: user.username ?? '',
        email: user.email ?? '',
      }));
      setMembers(membersList);
      setOriginalMembers(membersList);
    }
  }, [groupDetails, editingGroupId]);

  function addMember(user: { id: number; name: string; username: string; email: string }) {
    if (!members.find((m) => m.id === user.id)) {
      setMembers([...members, user]);
      setUserSearch('');
      setShowUserSearch(false);
    }
  }

  function removeMember(userId: number) {
    setMembers(members.filter((m) => m.id !== userId));
  }

  // Filter available users (exclude already added members)
  const availableUsers = useMemo(() => {
    const userData = (usersData as any)?.results?.data ?? [];
    return userData.filter((user: any) => !members.find((m) => m.id === user.user_id));
  }, [usersData, members]);

  // Generate slug from string
  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Generate unique ID from group name
  function generateUniqueId(name: string): string {
    const slug = generateSlug(name);
    const timestamp = Date.now();
    return slug ? `${slug}-${timestamp}` : `group-${timestamp}`;
  }

  async function onSubmit() {
    try {
      if (editing) {
        // For editing: determine which users were added and which were removed
        const originalMemberIds = originalMembers.map((m) => m.id);
        const currentMemberIds = members.map((m) => m.id);

        const users_to_add = currentMemberIds.filter((id) => !originalMemberIds.includes(id));
        const users_to_remove = originalMemberIds.filter((id) => !currentMemberIds.includes(id));

        const payload = {
          ...form,
          platform_key: tenant,
          ...(users_to_add.length > 0 && { users_to_add }),
          ...(users_to_remove.length > 0 && { users_to_remove }),
        };

        await updateGroup({ id: editing.id, requestBody: payload } as any).unwrap();
        toast.success('Group updated');
      } else {
        // For new groups: only include users_to_add
        const users_to_add = members.map((member) => member.id);

        const payload = {
          ...form,
          unique_id: generateUniqueId(form.name),
          platform_key: tenant,
          ...(users_to_add.length > 0 && { users_to_add }),
        };

        await createGroup({ requestBody: payload } as any).unwrap();
        toast.success('Group created');
      }

      setIsOpen(false);
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.data?.detail || 'Operation failed');
    }
  }

  async function onDelete(g: any) {
    setDeletingGroupId(g.id);
    try {
      await deleteGroup({ id: g.id, platformKey: tenant } as any).unwrap();
      toast.success('Group deleted');
    } catch (e: any) {
      toast.error(e?.data?.detail || 'Delete failed');
    } finally {
      setDeletingGroupId(null);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center gap-1 mb-6">
        <div className="relative max-w-sm">
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter groups"
            aria-label="Filter groups"
            className="pl-3 focus:ring-blue-500 focus:border-blue-500 h-[35px]"
          />
        </div>
        <Button
          onClick={openNew}
          aria-label="New group"
          className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white h-[35px]"
        >
          New Group
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading…</div>
        </div>
      )}

      {isError && (
        <div className="py-8 text-center text-sm text-red-500">Failed to load groups</div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 gap-4">
            <div className="col-span-3">Group Name</div>
            <div className="col-span-3">Unique ID</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-1 text-right"></div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {groups.map((g: any) => (
              <div
                key={g.id}
                className="grid grid-cols-1 lg:grid-cols-12 px-6 py-4 gap-2 lg:gap-4 lg:items-center"
              >
                <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Group Name
                </div>
                <div className="text-gray-900 dark:text-gray-100 font-medium lg:font-normal text-sm lg:col-span-3">
                  {g.name}
                </div>

                <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                  Unique ID
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm lg:col-span-3">
                  {g.unique_id}
                </div>

                <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                  Description
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm lg:col-span-5">
                  {g.description}
                </div>

                <div className="mt-2 lg:mt-0 lg:col-span-1 flex gap-2 lg:justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(g)}
                    disabled={deletingGroupId === g.id}
                    aria-label={`Edit group ${g.name}`}
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
                            onClick={() => onDelete(g)}
                            className="text-red-600 hover:text-red-700"
                            disabled={deletingGroupId === g.id || g.is_internal}
                            aria-label={`Delete group ${g.name}`}
                          >
                            {deletingGroupId === g.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            )}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {g.is_internal && (
                        <TooltipContent>
                          <p>Cannot delete internal groups</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No groups found
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Group' : 'New Group'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="g-name">Group Name</Label>
              <Input
                id="g-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter group name"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="g-desc">Description</Label>
              <Input
                id="g-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter group description"
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Group Members</Label>
              <div className="space-y-2">
                {members.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {member.name || member.username}
                          </span>
                          {member.email && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {member.email}
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(member.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label={`Remove ${member.name}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    No members added yet
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="user-search">Add Members</Label>
              <div className="relative">
                <Input
                  id="user-search"
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setShowUserSearch(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowUserSearch(userSearch.length > 0)}
                  placeholder="Type to search users..."
                  className="w-full"
                />
                {showUserSearch && availableUsers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
                    {availableUsers.map((user: any) => (
                      <button
                        key={user.user_id}
                        type="button"
                        onClick={() =>
                          addMember({
                            id: user.user_id,
                            name: user.name ?? '',
                            email: user.email,
                            username: user.username,
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
                {showUserSearch && userSearch.length > 2 && availableUsers.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-3 z-50">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No users found</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Type at least 3 characters to search for users
              </p>
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
                      disabled={!!editing && groupDetails?.is_internal}
                      className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
                    >
                      {editing ? 'Save Group' : 'Create Group'}
                    </Button>
                  </span>
                </TooltipTrigger>
                {editing && groupDetails?.is_internal && (
                  <TooltipContent>
                    <p>Cannot edit internal groups</p>
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
