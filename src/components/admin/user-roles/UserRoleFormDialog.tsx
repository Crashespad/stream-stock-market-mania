
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";

type AdminRole = 'admin' | 'mod' | 'streamer';

interface UserRoleFormDialogProps {
  onRoleAssigned: () => void;
}

export const UserRoleFormDialog = ({ onRoleAssigned }: UserRoleFormDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    role: 'streamer' as AdminRole,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: formData.user_id,
          role: formData.role,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User role assigned successfully.',
      });

      setFormData({ user_id: '', role: 'streamer' });
      setIsDialogOpen(false);
      onRoleAssigned();
    } catch (error: any) {
      console.error('Error assigning role:', error);
      
      let errorMessage = 'Failed to assign user role.';
      if (error.code === '23505') {
        errorMessage = 'User already has this role assigned.';
      } else if (error.code === '23503') {
        errorMessage = 'Invalid user ID. User does not exist.';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Assign Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign User Role</DialogTitle>
          <DialogDescription>
            Assign a role to a user by entering their User ID.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_id">User ID</Label>
            <Input
              id="user_id"
              value={formData.user_id}
              onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
              placeholder="Enter user UUID"
              required
            />
            <p className="text-sm text-muted-foreground">
              You can find user IDs in the Supabase Auth dashboard.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value: AdminRole) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="mod">Moderator</SelectItem>
                <SelectItem value="streamer">Streamer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Role'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
