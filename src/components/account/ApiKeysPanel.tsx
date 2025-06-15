
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Key, Twitch, Youtube, RefreshCw } from "lucide-react";

interface ApiConfig {
  service: string;
  client_id: string;
  expires_at?: string;
}

export const ApiKeysPanel = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [formData, setFormData] = useState({
    twitch_client_id: '',
    twitch_client_secret: '',
    youtube_api_key: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchApiConfigs();
  }, []);

  const fetchApiConfigs = async () => {
    try {
      const { data: twitchData } = await supabase.functions.invoke('manage-api-keys', {
        method: 'GET',
        body: new URLSearchParams({ service: 'twitch' })
      });

      const { data: youtubeData } = await supabase.functions.invoke('manage-api-keys', {
        method: 'GET',
        body: new URLSearchParams({ service: 'youtube' })
      });

      const fetchedConfigs = [];
      if (twitchData && !twitchData.error) fetchedConfigs.push(twitchData);
      if (youtubeData && !youtubeData.error) fetchedConfigs.push(youtubeData);
      
      setConfigs(fetchedConfigs);
    } catch (error) {
      console.error('Error fetching API configs:', error);
    }
  };

  const handleSaveApiKeys = async () => {
    setLoading(true);
    try {
      const promises = [];

      if (formData.twitch_client_id && formData.twitch_client_secret) {
        promises.push(
          supabase.functions.invoke('manage-api-keys', {
            body: {
              service: 'twitch',
              client_id: formData.twitch_client_id,
              client_secret: formData.twitch_client_secret,
            }
          })
        );
      }

      if (formData.youtube_api_key) {
        promises.push(
          supabase.functions.invoke('manage-api-keys', {
            body: {
              service: 'youtube',
              client_id: formData.youtube_api_key,
            }
          })
        );
      }

      await Promise.all(promises);
      
      toast({
        title: "API Keys Saved",
        description: "Your API keys have been securely stored.",
      });

      // Clear form and refresh configs
      setFormData({
        twitch_client_id: '',
        twitch_client_secret: '',
        youtube_api_key: '',
      });
      fetchApiConfigs();
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Failed to save API keys. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-streamer-data');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Data Synced",
        description: `Successfully updated ${data?.updated || 0} streamers with latest data.`,
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync streamer data. Please check your API keys.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'twitch':
        return <Twitch className="w-4 h-4 text-purple-400" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-400" />;
      default:
        return <Key className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current API Status */}
          <div>
            <h4 className="text-sm font-medium mb-3">Current API Status</h4>
            <div className="flex flex-wrap gap-2">
              {configs.map((config) => (
                <Badge key={config.service} variant="secondary" className="flex items-center gap-1">
                  {getServiceIcon(config.service)}
                  {config.service.toUpperCase()} Connected
                </Badge>
              ))}
              {configs.length === 0 && (
                <Badge variant="outline" className="text-gray-400">
                  No APIs Connected
                </Badge>
              )}
            </div>
          </div>

          {/* Twitch API Configuration */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Twitch className="w-4 h-4 text-purple-400" />
              Twitch API
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="twitch_client_id">Client ID</Label>
                <Input
                  id="twitch_client_id"
                  type="text"
                  value={formData.twitch_client_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitch_client_id: e.target.value }))}
                  placeholder="Enter Twitch Client ID"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="twitch_client_secret">Client Secret</Label>
                <Input
                  id="twitch_client_secret"
                  type="password"
                  value={formData.twitch_client_secret}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitch_client_secret: e.target.value }))}
                  placeholder="Enter Twitch Client Secret"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* YouTube API Configuration */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-400" />
              YouTube Data API
            </h4>
            <div>
              <Label htmlFor="youtube_api_key">API Key</Label>
              <Input
                id="youtube_api_key"
                type="password"
                value={formData.youtube_api_key}
                onChange={(e) => setFormData(prev => ({ ...prev, youtube_api_key: e.target.value }))}
                placeholder="Enter YouTube Data API Key"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSaveApiKeys}
              disabled={loading || (!formData.twitch_client_id && !formData.youtube_api_key)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save API Keys'
              )}
            </Button>

            <Button
              onClick={handleSyncData}
              disabled={syncing || configs.length === 0}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Data Now
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>• Get Twitch API keys from: <a href="https://dev.twitch.tv/console" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Twitch Developer Console</a></p>
            <p>• Get YouTube API key from: <a href="https://console.developers.google.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">Google Developer Console</a></p>
            <p>• API keys are stored securely and used only for fetching public streamer data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
