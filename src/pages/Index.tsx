
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { Header } from "@/components/Header";
import { StreamerCard } from "@/components/StreamerCard";
import { TradingModal } from "@/components/TradingModal";
import { Portfolio } from "@/components/Portfolio";
import { TrendingUp, Users, DollarSign, Trophy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedStreamer, setSelectedStreamer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("market");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: streamers, isLoading: isLoadingStreamers } = useQuery({
    queryKey: ['streamers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('streamers').select('*').order('price', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!session,
  });

  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['balance', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('balances').select('balance').single();
      if (error) {
        console.error("Error fetching balance:", error);
        return { balance: 0 };
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });
  const balance = balanceData?.balance || 0;

  const { data: portfolio, isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ['portfolio', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('portfolio').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleTrade = (streamerId: number, action: string, shares: number, price: number) => {
    toast({
      title: "Trading is coming soon!",
      description: "We are working on implementing the trade execution logic.",
    });
    setIsModalOpen(false);
  };

  const totalPortfolioValue = portfolio?.reduce((total, item) => {
    const streamer = streamers?.find(s => s.id === item.streamer_id);
    return total + (item.shares * (streamer?.price || 0));
  }, 0) || 0;

  const isLoading = !session || isLoadingStreamers || isLoadingBalance || isLoadingPortfolio;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

  const topGainer = streamers && streamers.length > 0 ? [...streamers].sort((a,b) => b.change_percent - a.change_percent)[0] : null;
  const highestPrice = streamers && streamers.length > 0 ? [...streamers].sort((a,b) => b.price - a.price)[0] : null;
  const mostFollowers = streamers && streamers.length > 0 ? [...streamers].sort((a,b) => b.followers - a.followers)[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header 
        balance={balance} 
        portfolioValue={totalPortfolioValue}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isLoggedIn={!!session}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentTab === "market" && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                StreamStock Exchange
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Trade your favorite streamers like stocks! Buy low, sell high, and build your creator portfolio.
              </p>
              <div className="flex justify-center gap-8 mb-8">
                <div className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Market Open</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{streamers?.length || 0} Active Streamers</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold">$1.2M Daily Volume</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {topGainer && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Top Gainer</p>
                      <p className="text-white text-xl font-bold">{topGainer.name}</p>
                      <p className="text-green-400 text-sm">+{topGainer.change_percent.toFixed(1)}%</p>
                    </div>
                    <Trophy className="w-10 h-10 text-yellow-400" />
                  </div>
                </div>
              )}
              {highestPrice && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Highest Price</p>
                      <p className="text-white text-xl font-bold">{highestPrice.name}</p>
                      <p className="text-blue-400 text-sm">${highestPrice.price.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-10 h-10 text-green-400" />
                  </div>
                </div>
              )}
              {mostFollowers && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Most Followers</p>
                      <p className="text-white text-xl font-bold">{mostFollowers.name}</p>
                      <p className="text-purple-400 text-sm">{(mostFollowers.followers / 1_000_000).toFixed(1)}M</p>
                    </div>
                    <Users className="w-10 h-10 text-purple-400" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {streamers?.map((streamer) => (
                <StreamerCard
                  key={streamer.id}
                  streamer={streamer}
                  onTrade={() => {
                    setSelectedStreamer(streamer);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {currentTab === "portfolio" && (
          <Portfolio 
            portfolio={portfolio || []} 
            streamers={streamers || []}
            balance={balance}
          />
        )}
      </main>

      <TradingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        streamer={selectedStreamer}
        onTrade={handleTrade}
        currentShares={portfolio?.find(p => p.streamer_id === selectedStreamer?.id)?.shares || 0}
      />
    </div>
  );
};

export default Index;
