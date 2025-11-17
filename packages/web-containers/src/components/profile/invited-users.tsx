"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@web-containers/components/ui/dialog";
import { Input } from "@web-containers/components/ui/input";
import { usePlatformInvitationsQuery } from "@iblai/data-layer";
import { useState } from "react";

export function InvitedUsersDialog({
  tenant,
  onClose,
}: {
  tenant: string;
  onClose: () => void;
}) {
  const [query, setQuery] = useState<string>("");
  const { data: invitedUsers } = usePlatformInvitationsQuery({
    platformKey: tenant,
    page: 1,
    //org: tenant,
  });
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => {
        if (!_open) {
          setOpen(_open);
          onClose();
        }
      }}
    >
      <DialogPortal forceMount={true}>
        <DialogContent
          aria-label="Invited Users Dialog"
          className="max-w-sm rounded-2xl px-6 py-8 pointer-events-auto"
          aria-describedby="invited-users-dialog"
        >
          <DialogHeader className="relative flex-row justify-between">
            <DialogTitle className="text-blue-600 text-xl font-semibold">
              Invited Users
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-1">
            <p className="text-gray-500 text-sm">
              Showing list of invited users pending confirmation
            </p>
            <form>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Invited Users"
                className="mt-2"
              />
            </form>
          </div>
          <div>
            <h2 className="text-md text-gray-600 font-semibold mb-4">
              Email
            </h2>
            {invitedUsers?.results.map((user) => (
              <div
                key={user.id}
                className="border-b-gray-50 pb-2 mb-4 text-sm text-gray-600 dark:text-gray-400"
              >
                {user.email}
              </div>
            ))}
            {invitedUsers?.results.length === 0 && (
              <p className="text-gray">No records found</p>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
