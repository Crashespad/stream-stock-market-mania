
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

interface StreamerFormProps {
  streamer: Tables<'streamers'> | null;
  onSave: () => void;
  onCancel: () => void;
}

export const StreamerForm = ({ streamer, onSave, onCancel }: StreamerFormProps) => {
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
