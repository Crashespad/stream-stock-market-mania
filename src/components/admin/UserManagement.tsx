
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, Ban, UserCheck, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface AdminUser {
  id: string;
  email: string;
  registered_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  username: string | null;
  avatar_url: string | null;
  balance: number;
  role: string | null;
  is_banned: boolean;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [isSuspensionDialogOpen, setIsSuspensionDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users_view')
        .select('*')
        .order('registered_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
  );

  const openBalanceDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setIsBalanceDialogOpen(true);
  };

  const openSuspensionDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setIsSuspensionDialogOpen(true);
  };

  const getBadgeVariant = (role: string | null) => {
    if (!role) return 'outline';
    switch (role) {
      case 'admin': return 'destructive';
      case 'mod': return 'default';
      case 'streamer': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-white">User Management</CardTitle>
          <CardDescription className="text-blue-200">
            Manage users, adjust balances, and handle suspensions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by email, username, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.username || 'No username'}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {user.id.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{user.email}</p>
                        <Badge variant={user.email_confirmed_at ? 'default' : 'secondary'}>
                          {user.email_confirmed_at ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(user.role)}>
                        {user.role || 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">
                        ${user.balance?.toLocaleString() || '0'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_banned ? 'destructive' : 'default'}>
                        {user.is_banned ? 'Suspended' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openBalanceDialog(user)}
                        >
                          <DollarSign className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openSuspensionDialog(user)}
                        >
                          {user.is_banned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Balance Adjustment Dialog */}
      <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Balance</DialogTitle>
            <DialogDescription>
              Adjust the balance for {selectedUser?.username || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <BalanceAdjustmentForm
              user={selectedUser}
              onSave={() => {
                setIsBalanceDialogOpen(false);
                fetchUsers();
              }}
              onCancel={() => setIsBalanceDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* User Suspension Dialog */}
      <Dialog open={isSuspensionDialogOpen} onOpenChange={setIsSuspensionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.is_banned ? 'Lift Suspension' : 'Suspend User'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.is_banned 
                ? `Lift the suspension for ${selectedUser?.username || selectedUser?.email}`
                : `Suspend ${selectedUser?.username || selectedUser?.email}`
              }
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserSuspensionForm
              user={selectedUser}
              onSave={() => {
                setIsSuspensionDialogOpen(false);
                fetchUsers();
              }}
              onCancel={() => setIsSuspensionDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface BalanceAdjustmentFormProps {
  user: AdminUser;
  onSave: () => void;
  onCancel: () => void;
}

const BalanceAdjustmentForm = ({ user, onSave, onCancel }: BalanceAdjustmentFormProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    adjustment_type: 'credit' as 'credit' | 'debit' | 'bonus' | 'penalty' | 'correction',
    reason: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Amount must be a positive number');
      }

      // Insert balance adjustment record
      const { error: adjustmentError } = await supabase
        .from('balance_adjustments')
        .insert({
          user_id: user.id,
          amount: formData.adjustment_type === 'debit' || formData.adjustment_type === 'penalty' ? -amount : amount,
          reason: formData.reason,
          adjustment_type: formData.adjustment_type,
          admin_user_id: (await supabase.auth.getUser()).data.user?.id,
          notes: formData.notes || null,
        });

      if (adjustmentError) throw adjustmentError;

      // Update user balance
      const currentBalance = user.balance || 0;
      const newBalance = formData.adjustment_type === 'debit' || formData.adjustment_type === 'penalty' 
        ? currentBalance - amount 
        : currentBalance + amount;

      const { error: balanceError } = await supabase
        .from('balances')
        .upsert({
          user_id: user.id,
          balance: newBalance,
          updated_at: new Date().toISOString(),
        });

      if (balanceError) throw balanceError;

      toast({
        title: 'Success',
        description: 'Balance adjusted successfully.',
      });

      onSave();
    } catch (error: any) {
      console.error('Error adjusting balance:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to adjust balance.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="Enter amount"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adjustment_type">Adjustment Type</Label>
        <Select 
          value={formData.adjustment_type} 
          onValueChange={(value: typeof formData.adjustment_type) => 
            setFormData(prev => ({ ...prev, adjustment_type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit">Credit (Add Funds)</SelectItem>
            <SelectItem value="debit">Debit (Remove Funds)</SelectItem>
            <SelectItem value="bonus">Bonus</SelectItem>
            <SelectItem value="penalty">Penalty</SelectItem>
            <SelectItem value="correction">Correction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Input
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          placeholder="Enter reason for adjustment"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Optional additional notes"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Adjust Balance'
          )}
        </Button>
      </div>
    </form>
  );
};

interface UserSuspensionFormProps {
  user: AdminUser;
  onSave: () => void;
  onCancel: () => void;
}

const UserSuspensionForm = ({ user, onSave, onCancel }: UserSuspensionFormProps) => {
  const [formData, setFormData] = useState({
    reason: '',
    duration: 'temporary',
    suspended_until: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (user.is_banned) {
        // Lift suspension
        const { error } = await supabase.auth.admin.updateUserById(user.id, {
          ban_duration: 'none'
        });

        if (error) throw error;

        // Record the suspension lift
        const { error: suspensionError } = await supabase
          .from('user_suspensions')
          .insert({
            user_id: user.id,
            suspended_by: (await supabase.auth.getUser()).data.user?.id,
            reason: 'Suspension lifted',
            is_permanent: false,
            lifted_at: new Date().toISOString(),
            lifted_by: (await supabase.auth.getUser()).data.user?.id,
          });

        if (suspensionError) throw suspensionError;

        toast({
          title: 'Success',
          description: 'User suspension has been lifted.',
        });
      } else {
        // Apply suspension
        const suspensionDate = formData.duration === 'permanent' 
          ? null 
          : formData.suspended_until ? new Date(formData.suspended_until).toISOString() : null;

        const { error } = await supabase.auth.admin.updateUserById(user.id, {
          ban_duration: formData.duration === 'permanent' ? '876000h' : `${Math.ceil((new Date(formData.suspended_until).getTime() - Date.now()) / (1000 * 60 * 60))}h`
        });

        if (error) throw error;

        // Record the suspension
        const { error: suspensionError } = await supabase
          .from('user_suspensions')
          .insert({
            user_id: user.id,
            suspended_by: (await supabase.auth.getUser()).data.user?.id,
            reason: formData.reason,
            suspended_until: suspensionDate,
            is_permanent: formData.duration === 'permanent',
          });

        if (suspensionError) throw suspensionError;

        toast({
          title: 'Success',
          description: 'User has been suspended.',
        });
      }

      onSave();
    } catch (error: any) {
      console.error('Error managing suspension:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update suspension status.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user.is_banned) {
    return (
      <div className="space-y-4">
        <p>Are you sure you want to lift the suspension for this user?</p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Lift Suspension'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Suspension</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          placeholder="Enter reason for suspension"
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Select 
          value={formData.duration} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="temporary">Temporary</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.duration === 'temporary' && (
        <div className="space-y-2">
          <Label htmlFor="suspended_until">Suspend Until</Label>
          <Input
            id="suspended_until"
            type="datetime-local"
            value={formData.suspended_until}
            onChange={(e) => setFormData(prev => ({ ...prev, suspended_until: e.target.value }))}
            required
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} variant="destructive">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Suspend User'
          )}
        </Button>
      </div>
    </form>
  );
};
