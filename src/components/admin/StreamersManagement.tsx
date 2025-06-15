
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";

interface StreamersManagementProps {
  userRole: string;
}

export const StreamersManagement = ({ userRole }: StreamersManagementProps) => {
  const [streamers, setStreamers] = useState<Tables<'streamers'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStreamer, setEditingStreamer] = useState<Tables<'streamers'> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStreamers();
  }, []);

  const fetchStreamers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('streamers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStreamers(data || []);
    } catch (error) {
      console.error('Error fetching streamers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch streamers.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerSync = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('sync-streamer-data');
      
      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Streamer data sync triggered successfully.',
      });

      // Refresh the streamers list after sync
      setTimeout(fetchStreamers, 2000);
    } catch (error) {
      console.error('Error triggering sync:', error);
      toast({
        title: 'Error',
        description: 'Failed to trigger streamer data sync.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canManageAllStreamers = userRole === 'admin' || userRole === 'mod';

  return (
    <div className="space-y-6">
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
                    onClick={handleTriggerSync}
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
                          fetchStreamers();
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

      <Card>
        <CardContent className="p-0">
          {isLoading && streamers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Avg Viewers</TableHead>
                  <TableHead>Status</TableHead>
                  {canManageAllStreamers && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {streamers.map((streamer) => (
                  <TableRow key={streamer.id}>
                    <TableCell className="font-medium">{streamer.name}</TableCell>
                    <TableCell className="capitalize">{streamer.platform}</TableCell>
                    <TableCell>${streamer.price.toFixed(2)}</TableCell>
                    <TableCell>{streamer.followers.toLocaleString()}</TableCell>
                    <TableCell>{streamer.avg_viewers.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        streamer.is_live 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {streamer.is_live ? 'Live' : 'Offline'}
                      </span>
                    </TableCell>
                    {canManageAllStreamers && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStreamer(streamer);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface StreamerFormProps {
  streamer: Tables<'streamers'> | null;
  onSave: () => void;
  onCancel: () => void;
}

const StreamerForm = ({ streamer, onSave, onCancel }: StreamerFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'twitch',
    price: 100,
    followers: 0,
    avg_viewers: 0,
    external_id: '',
    streaming_url: '',
    social_media_url: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (streamer) {
      setFormData({
        name: streamer.name,
        platform: streamer.platform,
        price: Number(streamer.price),
        followers: streamer.followers,
        avg_viewers: streamer.avg_viewers,
        external_id: streamer.external_id || '',
        streaming_url: streamer.streaming_url || '',
        social_media_url: streamer.social_media_url || '',
      });
    }
  }, [streamer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        change: 0,
        change_percent: 0,
      };

      const { error } = streamer
        ? await supabase.from('streamers').update(payload).eq('id', streamer.id)
        : await supabase.from('streamers').insert([payload]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Streamer ${streamer ? 'updated' : 'created'} successfully.`,
      });

      onSave();
    } catch (error) {
      console.error('Error saving streamer:', error);
      toast({
        title: 'Error',
        description: `Failed to ${streamer ? 'update' : 'create'} streamer.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="twitch">Twitch</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Initial Price</Label>
          <Input
            id="price"
            type="number"
            min="1"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="followers">Followers</Label>
          <Input
            id="followers"
            type="number"
            min="100"
            value={formData.followers}
            onChange={(e) => setFormData(prev => ({ ...prev, followers: Number(e.target.value) }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avg_viewers">Average Viewers</Label>
          <Input
            id="avg_viewers"
            type="number"
            min="0"
            value={formData.avg_viewers}
            onChange={(e) => setFormData(prev => ({ ...prev, avg_viewers: Number(e.target.value) }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="external_id">External ID</Label>
          <Input
            id="external_id"
            value={formData.external_id}
            onChange={(e) => setFormData(prev => ({ ...prev, external_id: e.target.value }))}
            placeholder="Channel/User ID on platform"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="streaming_url">Streaming URL</Label>
        <Input
          id="streaming_url"
          value={formData.streaming_url}
          onChange={(e) => setFormData(prev => ({ ...prev, streaming_url: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="social_media_url">Social Media URL</Label>
        <Input
          id="social_media_url"
          value={formData.social_media_url}
          onChange={(e) => setFormData(prev => ({ ...prev, social_media_url: e.target.value }))}
          placeholder="https://..."
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
              Saving...
            </>
          ) : (
            streamer ? 'Update' : 'Create'
          )}
        </Button>
      </div>
    </form>
  );
};
