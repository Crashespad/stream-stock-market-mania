
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2 } from "lucide-react";

type AdminRole = 'admin' | 'mod' | 'streamer';

interface UserRole {
  id: string;
  user_id: string;
  role: AdminRole;
  created_at: string;
}

interface UserRolesTableProps {
  userRoles: UserRole[];
  isLoading: boolean;
  onDeleteRole: (roleId: string) => void;
}

export const UserRolesTable = ({ userRoles, isLoading, onDeleteRole }: UserRolesTableProps) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'mod':
        return 'default';
      case 'streamer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading && userRoles.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Assigned</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userRoles.map((userRole) => (
          <TableRow key={userRole.id}>
            <TableCell className="font-mono text-sm">
              {userRole.user_id.slice(0, 8)}...
            </TableCell>
            <TableCell>
              <Badge variant={getRoleBadgeVariant(userRole.role)}>
                {userRole.role}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(userRole.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDeleteRole(userRole.id)}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
