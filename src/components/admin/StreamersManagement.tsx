
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { StreamersManagementHeader } from "./streamers/StreamersManagementHeader";
import { StreamersTable } from "./streamers/StreamersTable";

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

  const handleEditStreamer = (streamer: Tables<'streamers'>) => {
    setEditingStreamer(streamer);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <StreamersManagementHeader
        userRole={userRole}
        isLoading={isLoading}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingStreamer={editingStreamer}
        setEditingStreamer={setEditingStreamer}
        onTriggerSync={handleTriggerSync}
        onRefresh={fetchStreamers}
      />

      <StreamersTable
        streamers={streamers}
        isLoading={isLoading}
        userRole={userRole}
        onEditStreamer={handleEditStreamer}
      />
    </div>
  );
};
