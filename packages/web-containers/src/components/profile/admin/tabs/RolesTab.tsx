import { useMemo, useState } from 'react';
import {
  useGetRbacRolesQuery,
  useCreateRbacRoleMutation,
  useUpdateRbacRoleMutation,
  useDeleteRbacRoleMutation,
  useGetRbacRoleDetailsQuery,
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
import { Trash2, Loader2, X, Plus, Pencil } from 'lucide-react';
import { Badge } from '@web-containers/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';
import { CustomRbacRoleDetailsResponse } from '@iblai/data-layer';

export function RolesTab({ tenant }: { tenant: string }) {
  const { data, isLoading, isError } = useGetRbacRolesQuery({ platformKey: tenant });
  const [createRole] = useCreateRbacRoleMutation();
  const [updateRole] = useUpdateRbacRoleMutation();
  const [deleteRole] = useDeleteRbacRoleMutation();

  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<CustomRbacRoleDetailsResponse | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [dataActions, setDataActions] = useState<string[]>([]);
  const [actionInput, setActionInput] = useState('');
  const [dataActionInput, setDataActionInput] = useState('');

  // Fetch role details when editing
  const { data: roleDetails } = useGetRbacRoleDetailsQuery(
    { id: editingRoleId!, platform_key: tenant },
    { skip: !editingRoleId },
  );

  const roles = useMemo(() => {
    const list = (data as any)?.results ?? (data as any)?.data ?? data ?? [];
    if (!filter) return list;
    const f = filter.toLowerCase();
    return list.filter((r: any) => `${r.name} ${r.description}`.toLowerCase().includes(f));
  }, [data, filter]);

  function openNew() {
    setEditing(null);
    setEditingRoleId(null);
    setForm({ name: '', description: '' });
    setActions([]);
    setDataActions([]);
    setActionInput('');
    setDataActionInput('');
    setIsOpen(true);
  }

  function openEdit(r: any) {
    setEditing(r);
    setEditingRoleId(r.id);
    setForm({ name: r.name ?? '', description: r.description ?? '' });
    setActionInput('');
    setDataActionInput('');
    setIsOpen(true);
  }

  // Effect to populate actions and dataActions when role details are loaded
  useMemo(() => {
    if (roleDetails && editingRoleId) {
      setActions(roleDetails?.actions ?? []);
      setDataActions(roleDetails?.data_actions ?? []);
    }
  }, [roleDetails, editingRoleId]);

  function addAction() {
    if (actionInput.trim() && !actions.includes(actionInput.trim())) {
      setActions([...actions, actionInput.trim()]);
      setActionInput('');
    }
  }

  function removeAction(action: string) {
    setActions(actions.filter((a) => a !== action));
  }

  function addDataAction() {
    if (dataActionInput.trim() && !dataActions.includes(dataActionInput.trim())) {
      setDataActions([...dataActions, dataActionInput.trim()]);
      setDataActionInput('');
    }
  }

  function removeDataAction(action: string) {
    setDataActions(dataActions.filter((a) => a !== action));
  }

  function handleActionKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAction();
    }
  }

  function handleDataActionKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDataAction();
    }
  }

  async function onSubmit() {
    try {
      const payload = {
        ...form,
        platform_key: tenant,
        ...(actions.length > 0 && { actions }),
        ...(dataActions.length > 0 && { data_actions: dataActions }),
      };

      if (editing) {
        await updateRole({ id: editing.id, requestBody: payload } as any).unwrap();
        toast.success('Role updated');
      } else {
        await createRole({ requestBody: payload } as any).unwrap();
        toast.success('Role created');
      }
      setIsOpen(false);
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.data?.detail || 'Operation failed');
    }
  }

  async function onDelete(r: any) {
    setDeletingRoleId(r.id);
    try {
      await deleteRole({ id: r.id, platformKey: tenant } as any).unwrap();
      toast.success('Role deleted');
    } catch (e: any) {
      toast.error(e?.data?.detail || 'Delete failed');
    } finally {
      setDeletingRoleId(null);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center gap-1 mb-6">
        <div className="relative max-w-sm">
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter roles"
            aria-label="Filter roles"
            className="pl-3 focus:ring-blue-500 focus:border-blue-500 h-[35px]"
          />
        </div>
        <Button
          onClick={openNew}
          aria-label="New role"
          className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white h-[35px]"
        >
          New Role
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading…</div>
        </div>
      )}

      {isError && <div className="py-8 text-center text-sm text-red-500">Failed to load roles</div>}

      {!isLoading && !isError && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 gap-4">
            <div className="col-span-10">Name</div>
            <div className="col-span-2 text-right"></div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {roles.map((r: any) => (
              <div
                key={r.id}
                className="grid grid-cols-1 lg:grid-cols-12 px-6 py-4 gap-2 lg:gap-4 lg:items-center"
              >
                <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Name
                </div>
                <div className="text-gray-900 dark:text-gray-100 font-medium lg:font-normal text-sm lg:col-span-10">
                  {r.name}
                </div>

                <div className="mt-2 lg:mt-0 lg:col-span-2 flex gap-2 lg:justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(r)}
                    disabled={deletingRoleId === r.id}
                    aria-label={`Edit role ${r.name}`}
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
                            onClick={() => onDelete(r)}
                            className="text-red-600 hover:text-red-700"
                            disabled={deletingRoleId === r.id || r.is_internal}
                            aria-label={`Delete role ${r.name}`}
                          >
                            {deletingRoleId === r.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            )}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {r.is_internal && (
                        <TooltipContent>
                          <p>Cannot delete internal roles</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
            {roles.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No roles found
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
            <DialogTitle>{editing ? 'Edit Role' : 'New Role'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="r-name">Role Name</Label>
              <Input
                id="r-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter role name"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="r-actions">Actions</Label>
              <div className="space-y-2">
                {actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                    {actions.map((action, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1 flex items-center gap-1 font-mono text-xs"
                      >
                        <span>{action}</span>
                        <button
                          type="button"
                          onClick={() => removeAction(action)}
                          className="ml-1 hover:text-red-600"
                          aria-label={`Remove action ${action}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    id="r-actions"
                    value={actionInput}
                    onChange={(e) => setActionInput(e.target.value)}
                    onKeyDown={handleActionKeyDown}
                    placeholder="e.g., Ibl.Mentor/Settings/read, Ibl.Mentor/*/write"
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAction}
                    disabled={!actionInput.trim()}
                    aria-label="Add action"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Press Enter or click + to add. Supports wildcards (e.g., Ibl.Mentor/*/read)
                </p>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="r-data-actions">Data Actions</Label>
              <div className="space-y-2">
                {dataActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                    {dataActions.map((action, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1 flex items-center gap-1 font-mono text-xs"
                      >
                        <span>{action}</span>
                        <button
                          type="button"
                          onClick={() => removeDataAction(action)}
                          className="ml-1 hover:text-red-600"
                          aria-label={`Remove data action ${action}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    id="r-data-actions"
                    value={dataActionInput}
                    onChange={(e) => setDataActionInput(e.target.value)}
                    onKeyDown={handleDataActionKeyDown}
                    placeholder="e.g., Ibl.Mentor/Settings/email/read, Ibl.Core/*/name/write"
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDataAction}
                    disabled={!dataActionInput.trim()}
                    aria-label="Add data action"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Press Enter or click + to add. Field-level access (e.g.,
                  Ibl.Mentor/Settings/email/read)
                </p>
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
                      disabled={!!editing && roleDetails?.is_internal}
                      className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
                    >
                      {editing ? 'Save Role' : 'Create Role'}
                    </Button>
                  </span>
                </TooltipTrigger>
                {editing && roleDetails?.is_internal && (
                  <TooltipContent>
                    <p>Cannot edit internal roles</p>
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
