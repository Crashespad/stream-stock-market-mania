
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { User, Settings, Key, Plus } from "lucide-react";
import { ApiKeysPanel } from "./account/ApiKeysPanel";

interface AccountProps {
  profile: Tables<'profiles'> | null;
  streamers: Tables<'streamers'>[] | undefined;
  refetchProfile: () => void;
  refetchStreamers: () => void;
}

export const Account = ({ profile, streamers, refetchProfile, refetchStreamers }: AccountProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const { toast } = useToast();

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      refetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
          <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/20">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="api" className="text-white data-[state=active]:bg-white/20">
            <Key className="w-4 h-4 mr-2" />
            API Integration
          </TabsTrigger>
          <TabsTrigger value="streamers" className="text-white data-[state=active]:bg-white/20">
            <Plus className="w-4 h-4 mr-2" />
            My Streamers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              
              <Button 
                onClick={handleUpdateProfile}
                disabled={isUpdating || username === profile?.username}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <ApiKeysPanel />
        </TabsContent>

        <TabsContent value="streamers">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                My Streamers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Add Your Own Streamers</h3>
                <p className="text-gray-400 mb-4">
                  This feature is coming soon! You'll be able to add your own streaming channels to the platform.
                </p>
                <Button disabled variant="outline" className="bg-white/10 border-white/20 text-white">
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
