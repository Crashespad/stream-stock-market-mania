
import { ApiKeysManagement } from "./ApiKeysManagement";
import { StreamersManagement } from "./StreamersManagement";
import { UserRolesManagement } from "./UserRolesManagement";
import { UserManagement } from "./UserManagement";
import { AdminLogs } from "./AdminLogs";
import { AdminOverview } from "./AdminOverview";

interface AdminTabContentProps {
  activeTab: string;
  userRole: string;
}

export const AdminTabContent = ({ activeTab, userRole }: AdminTabContentProps) => {
  switch (activeTab) {
    case "api-keys":
      if (userRole === 'admin' || userRole === 'mod') {
        return <ApiKeysManagement />;
      }
      return <div>Access denied</div>;
    case "streamers":
      return <StreamersManagement userRole={userRole} />;
    case "user-roles":
      if (userRole === 'admin') {
        return <UserRolesManagement />;
      }
      return <div>Access denied</div>;
    case "user-management":
      if (userRole === 'admin') {
        return <UserManagement />;
      }
      return <div>Access denied</div>;
    case "logs":
      if (userRole === 'admin') {
        return <AdminLogs />;
      }
      return <div>Access denied</div>;
    default:
      return <AdminOverview userRole={userRole} />;
  }
};
