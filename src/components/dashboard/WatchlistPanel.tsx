
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Trash2, TrendingUp, TrendingDown, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WatchlistPanelProps {
  streamers: Tables<'streamers'>[] | undefined;
}

export const WatchlistPanel = ({ streamers }: WatchlistPanelProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStreamerId, setSelectedStreamerId] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*, streamers(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: async (streamerId: number) => {
      const { error } = await supabase
        .from('watchlist')
        .insert({ streamer_id: streamerId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      setIsAddDialogOpen(false);
      setSelectedStreamerId("");
      toast({
        title: "Added to watchlist",
        description: "Streamer has been added to your watchlist.",
      });
    },
    onError: (error: any) => {
      if (error.message.includes('duplicate')) {
        toast({
          title: "Already in watchlist",
          description: "This streamer is already in your watchlist.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add streamer to watchlist.",
          variant: "destructive",
        });
      }
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast({
        title: "Removed from watchlist",
        description: "Streamer has been removed from your watchlist.",
      });
    },
  });

  // Filter out streamers already in watchlist
  const availableStreamers = streamers?.filter(streamer => 
    !watchlist?.some(w => w.streamer_id === streamer.id)
  ) || [];

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-white/10 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Watchlist
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Plus className="w-4 h-4 mr-2" />
                Add Streamer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/80 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>Add Streamer to Watchlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={selectedStreamerId} onValueChange={setSelectedStreamerId}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select a streamer" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 border-white/20">
                    {availableStreamers.map((streamer) => (
                      <SelectItem 
                        key={streamer.id} 
                        value={streamer.id.toString()}
                        className="text-white hover:bg-white/10"
                      >
                        {streamer.name} - ${streamer.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => addToWatchlistMutation.mutate(parseInt(selectedStreamerId))}
                  disabled={!selectedStreamerId || addToWatchlistMutation.isPending}
                  className="w-full"
                >
                  Add to Watchlist
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!watchlist || watchlist.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No streamers in your watchlist yet</p>
        ) : (
          watchlist.map((item) => {
            const streamer = item.streamers;
            if (!streamer) return null;
            
            return (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={streamer.avatar || '/placeholder.svg'} 
                      alt={streamer.name}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                    <div>
                      <h4 className="font-semibold">{streamer.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Badge variant="secondary" className="text-xs">
                          {streamer.platform.toUpperCase()}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {(streamer.followers / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${streamer.price.toFixed(2)}</p>
                    <div className={`flex items-center gap-1 text-sm ${
                      streamer.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {streamer.change >= 0 ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      {streamer.change >= 0 ? '+' : ''}{streamer.change_percent.toFixed(1)}%
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromWatchlistMutation.mutate(item.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
