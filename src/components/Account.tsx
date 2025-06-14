
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

interface AccountProps {
  profile: Tables<'profiles'> | null | undefined;
  streamers: Tables<'streamers'>[] | null | undefined;
  refetchProfile: () => void;
  refetchStreamers: () => void;
}

export const Account = ({ profile, streamers, refetchProfile, refetchStreamers }: AccountProps) => {
    const { toast } = useToast();
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [claimableStreamerId, setClaimableStreamerId] = useState<string | undefined>(undefined);
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);
    
    const handleUpdateProfile = async () => {
        if (!profile) return;
        setLoading(true);
        const { error } = await supabase.from('profiles').update({ username, avatar_url: avatarUrl }).eq('id', profile.id);
        if (error) {
            toast({ title: 'Error updating profile', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Profile updated successfully!' });
            refetchProfile();
        }
        setLoading(false);
    };

    const handleClaimStreamer = async () => {
        if (!claimableStreamerId) {
            toast({ title: 'Please select a streamer to claim.', variant: 'destructive' });
            return;
        }
        if (!profile) return;

        setClaiming(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            toast({ title: 'You must be logged in to claim a streamer', variant: 'destructive' });
            setClaiming(false);
            return;
        }
        
        const { error } = await supabase.from('streamers').update({ user_id: user.id }).eq('id', claimableStreamerId);
        if (error) {
            toast({ title: 'Error claiming streamer', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Streamer claimed successfully!' });
            refetchStreamers();
            refetchProfile(); // A claimed streamer is part of profile state indirectly
            setClaimableStreamerId(undefined);
        }
        setClaiming(false);
    };

    const unClaimedStreamers = streamers?.filter(s => s.user_id === null) || [];
    const claimedStreamer = streamers?.find(s => s.user_id === profile?.id);

    return (
        <div className="space-y-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription className="text-gray-400">Update your username and avatar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400" />
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-1">Avatar URL</label>
                        <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400" />
                    </div>
                    <Button onClick={handleUpdateProfile} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Profile
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                    <CardTitle>Claim a Streamer</CardTitle>
                    <CardDescription className="text-gray-400">Claim a streamer to manage their stock. You can only claim one.</CardDescription>
                </CardHeader>
                <CardContent>
                    {claimedStreamer ? (
                        <div>
                            <p className="text-lg">You have claimed: <span className="font-bold text-purple-400">{claimedStreamer.name}</span></p>
                            <p className="text-gray-400 mt-2">You can manage this streamer's stock page (feature coming soon).</p>
                        </div>
                    ) : unClaimedStreamers.length > 0 ? (
                        <div className="flex items-center gap-4">
                            <Select onValueChange={setClaimableStreamerId} value={claimableStreamerId}>
                                <SelectTrigger className="w-full md:w-[280px] bg-gray-800 border-gray-600 text-white">
                                    <SelectValue placeholder="Select a streamer to claim" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                    {unClaimedStreamers.map(s => (
                                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleClaimStreamer} disabled={claiming || !claimableStreamerId}>
                                {claiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Claim
                            </Button>
                        </div>
                    ) : (
                        <p>All streamers are currently claimed.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
