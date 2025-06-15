
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { UserRolesHeader } from "./user-roles/UserRolesHeader";
import { UserRolesTable } from "./user-roles/UserRolesTable";

type AdminRole = 'admin' | 'mod' | 'streamer';

interface UserRole {
  id: string;
  user_id: string;
  role: AdminRole;
  created_at: string;
}

export const UserRolesManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, user_id, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user roles.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to remove this role?')) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User role removed successfully.',
      });

      fetchUserRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove user role.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UserRolesHeader onRoleAssigned={fetchUserRoles} />

      <Card>
        <CardContent className="p-0">
          <UserRolesTable 
            userRoles={userRoles}
            isLoading={isLoading}
            onDeleteRole={handleDeleteRole}
          />
        </CardContent>
      </Card>
    </div>
  );
};
