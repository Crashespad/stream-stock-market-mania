
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Eye, Twitch, Youtube, Twitter, ExternalLink, ArrowLeft, Activity } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMarketData } from "@/hooks/useMarketData";
import { TradingModal } from "@/components/TradingModal";
import { Session } from '@supabase/supabase-js';

const StreamerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [streamer, setStreamer] = useState<Tables<'streamers'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { balance, portfolio, totalPortfolioValue } = useMarketData(session);

  useEffect(() => {
    setIsSessionLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchStreamer = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('streamers')
        .select('*')
        .eq('id', parseInt(id, 10))
        .single();

      if (error) {
        toast({
          title: 'Error loading streamer',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setStreamer(data);
      setLoading(false);
    };

    fetchStreamer();
  }, [id, navigate, toast]);

  const handleTrade = (streamerId: number, action: string, shares: number, price: number) => {
    toast({
      title: "Trading is coming soon!",
      description: "We are working on implementing the trade execution logic.",
    });
    setIsModalOpen(false);
  };

  const handleTradeClick = () => {
    if (!session) {
      toast({
        title: 'Please log in to trade',
        description: 'You need an account to buy and sell streamer stocks.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    setIsModalOpen(true);
  };

  if (isSessionLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

  if (!streamer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Streamer not found</h1>
          <Button onClick={() => navigate('/')}>Go back to market</Button>
        </div>
      </div>
    );
  }

  const isPositive = streamer.change >= 0;
  const PlatformIcon = streamer.platform === "twitch" ? Twitch : Youtube;
  const platformColor = streamer.platform === "twitch" ? "text-purple-400" : "text-red-400";
  const currentShares = portfolio?.find(p => p.streamer_id === streamer.id)?.shares || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header 
        balance={balance} 
        portfolioValue={totalPortfolioValue}
        currentTab="market"
        setCurrentTab={() => {}}
        isLoggedIn={!!session}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Market
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Streamer Info */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={streamer.avatar || '/placeholder.svg'} 
                      alt={streamer.name}
                      className="w-20 h-20 rounded-full border-4 border-white/20"
                    />
                    <PlatformIcon className={`w-6 h-6 ${platformColor} absolute -bottom-1 -right-1 bg-black rounded-full p-1`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-3xl">{streamer.name}</CardTitle>
                      {streamer.is_live && (
                        <Badge variant="destructive" className="bg-red-500 text-white">
                          <Activity className="w-3 h-3 mr-1" />
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {streamer.platform.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Info */}
                <div className="text-center p-6 bg-white/5 rounded-lg">
                  <div className="text-5xl font-bold mb-2">
                    ${streamer.price.toFixed(2)}
                  </div>
                  <div className={`flex items-center justify-center gap-2 text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span>
                      {isPositive ? '+' : ''}{streamer.change.toFixed(2)} ({isPositive ? '+' : ''}{streamer.change_percent.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-bold">{(streamer.followers / 1000000).toFixed(1)}M</p>
                    <p className="text-gray-400">Followers</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
                      <Eye className="w-6 h-6" />
                    </div>
                    <p className="text-3xl font-bold">{(streamer.avg_viewers / 1000).toFixed(0)}K</p>
                    <p className="text-gray-400">Avg Viewers</p>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {streamer.streaming_url && (
                      <Button
                        onClick={() => window.open(streamer.streaming_url!, '_blank')}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <PlatformIcon className="w-4 h-4 mr-2" />
                        {streamer.platform === 'twitch' ? 'Twitch' : 'YouTube'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                    {streamer.social_media_url && (
                      <Button
                        onClick={() => window.open(streamer.social_media_url!, '_blank')}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Social Media
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white sticky top-8">
              <CardHeader>
                <CardTitle>Trade {streamer.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentShares > 0 && (
                  <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <h4 className="font-semibold text-green-400 mb-1">Your Holdings</h4>
                    <p className="text-2xl font-bold">{currentShares} shares</p>
                    <p className="text-sm text-gray-300">
                      Value: ${(currentShares * streamer.price).toFixed(2)}
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={handleTradeClick}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                  size="lg"
                >
                  Trade Now
                </Button>

                <div className="text-sm text-gray-400 space-y-1">
                  <p>Current Price: ${streamer.price.toFixed(2)}</p>
                  <p>24h Change: {isPositive ? '+' : ''}{streamer.change_percent.toFixed(1)}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {!!session && streamer && (
        <TradingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          streamer={streamer}
          onTrade={handleTrade}
          currentShares={currentShares}
        />
      )}
    </div>
  );
};

export default StreamerDetail;
