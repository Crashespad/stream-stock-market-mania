
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { StreamerForm } from "./StreamerForm";
import { Tables } from "@/integrations/supabase/types";

interface StreamersManagementHeaderProps {
  userRole: string;
  isLoading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingStreamer: Tables<'streamers'> | null;
  setEditingStreamer: (streamer: Tables<'streamers'> | null) => void;
  onTriggerSync: () => void;
  onRefresh: () => void;
}

export const StreamersManagementHeader = ({
  userRole,
  isLoading,
  isDialogOpen,
  setIsDialogOpen,
  editingStreamer,
  setEditingStreamer,
  onTriggerSync,
  onRefresh,
}: StreamersManagementHeaderProps) => {
  const canManageAllStreamers = userRole === 'admin' || userRole === 'mod';

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Streamers Management</CardTitle>
            <CardDescription className="text-blue-200">
              {canManageAllStreamers 
                ? 'Manage all streamers on the platform and sync data from external APIs.'
                : 'Manage your streamer profile.'
              }
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {canManageAllStreamers && (
              <>
                <Button
                  onClick={onTriggerSync}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Sync Data
                </Button>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingStreamer(null)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Streamer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingStreamer ? 'Edit Streamer' : 'Add New Streamer'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingStreamer 
                          ? 'Update streamer information.'
                          : 'Add a new streamer to the platform.'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <StreamerForm
                      streamer={editingStreamer}
                      onSave={() => {
                        setIsDialogOpen(false);
                        setEditingStreamer(null);
                        onRefresh();
                      }}
                      onCancel={() => {
                        setIsDialogOpen(false);
                        setEditingStreamer(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
