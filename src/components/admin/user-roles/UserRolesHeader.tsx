
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRoleFormDialog } from "./UserRoleFormDialog";

interface UserRolesHeaderProps {
  onRoleAssigned: () => void;
}

export const UserRolesHeader = ({ onRoleAssigned }: UserRolesHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">User Roles Management</CardTitle>
            <CardDescription className="text-blue-200">
              Manage user roles and permissions across the platform.
            </CardDescription>
          </div>
          <UserRoleFormDialog onRoleAssigned={onRoleAssigned} />
        </div>
      </CardHeader>
    </Card>
  );
};
