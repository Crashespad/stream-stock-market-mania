import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
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

interface PriceAlertsPanelProps {
  streamers: Tables<'streamers'>[] | undefined;
}

export const PriceAlertsPanel = ({ streamers }: PriceAlertsPanelProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStreamerId, setSelectedStreamerId] = useState<string>("");
  const [alertType, setAlertType] = useState<"above" | "below">("above");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['price-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*, streamers(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createAlertMutation = useMutation({
    mutationFn: async (alertData: { streamer_id: number; alert_type: string; target_price: number; user_id: string }) => {
      const { error } = await supabase
        .from('price_alerts')
        .insert(alertData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      setIsAddDialogOpen(false);
      setSelectedStreamerId("");
      setTargetPrice("");
      toast({
        title: "Price alert created",
        description: "You'll be notified when the price target is reached.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create price alert.",
        variant: "destructive",
      });
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      toast({
        title: "Price alert deleted",
        description: "The price alert has been removed.",
      });
    },
  });

  const handleCreateAlert = async () => {
    if (!selectedStreamerId || !targetPrice) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create price alerts.",
        variant: "destructive",
      });
      return;
    }
    
    createAlertMutation.mutate({
      streamer_id: parseInt(selectedStreamerId),
      alert_type: alertType,
      target_price: parseFloat(targetPrice),
      user_id: user.id,
    });
  };

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
            <AlertTriangle className="w-5 h-5" />
            Price Alerts
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Plus className="w-4 h-4 mr-2" />
                Add Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/80 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={selectedStreamerId} onValueChange={setSelectedStreamerId}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select a streamer" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 border-white/20">
                    {streamers?.map((streamer) => (
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
                
                <Select value={alertType} onValueChange={(value: "above" | "below") => setAlertType(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 border-white/20">
                    <SelectItem value="above" className="text-white hover:bg-white/10">
                      Price goes above
                    </SelectItem>
                    <SelectItem value="below" className="text-white hover:bg-white/10">
                      Price goes below
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Target price"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />

                <Button 
                  onClick={handleCreateAlert}
                  disabled={!selectedStreamerId || !targetPrice || createAlertMutation.isPending}
                  className="w-full"
                >
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!alerts || alerts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No price alerts set up yet</p>
        ) : (
          alerts.map((alert) => {
            const streamer = alert.streamers;
            if (!streamer) return null;
            
            const isTriggered = alert.alert_type === 'above' 
              ? streamer.price >= alert.target_price
              : streamer.price <= alert.target_price;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isTriggered 
                    ? 'bg-yellow-500/20 border-yellow-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={streamer.avatar || '/placeholder.svg'} 
                      alt={streamer.name}
                      className="w-10 h-10 rounded-full border-2 border-white/20"
                    />
                    <div>
                      <h4 className="font-semibold">{streamer.name}</h4>
                      <div className="flex items-center gap-2 text-sm">
                        {alert.alert_type === 'above' ? (
                          <TrendingUp className="w-3 h-3 text-green-400" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        )}
                        <span className="text-gray-400">
                          {alert.alert_type === 'above' ? 'Above' : 'Below'} ${alert.target_price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm text-gray-400">Current</p>
                      <p className="font-bold">${streamer.price.toFixed(2)}</p>
                    </div>
                    {isTriggered && (
                      <Badge variant="destructive" className="bg-yellow-500">
                        Triggered
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAlertMutation.mutate(alert.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
