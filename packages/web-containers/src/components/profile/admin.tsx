import { Tabs, TabsContent, TabsList, TabsTrigger } from '@web-containers/components/ui/tabs';
import { UsersTab } from './admin/tabs/UsersTab';
import { GroupsTab } from './admin/tabs/GroupsTab';
import { RolesTab } from './admin/tabs/RolesTab';
import { PoliciesTab } from './admin/tabs/PoliciesTab';

export const Admin = ({ tenant, onInviteClick }: { tenant: string; onInviteClick: () => void }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <Tabs defaultValue="users" aria-label="RBAC Management Tabs">
        <TabsList aria-label="Management tabs">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab tenant={tenant} onInviteClick={onInviteClick} />
        </TabsContent>

        <TabsContent value="groups">
          <GroupsTab tenant={tenant} />
        </TabsContent>

        <TabsContent value="roles">
          <RolesTab tenant={tenant} />
        </TabsContent>

        <TabsContent value="policies">
          <PoliciesTab tenant={tenant} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
