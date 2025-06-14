
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { Header } from "@/components/Header";
import { TradingModal } from "@/components/TradingModal";
import { Portfolio } from "@/components/Portfolio";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMarketData } from "@/hooks/useMarketData";
import { MarketView } from "@/components/market/MarketView";
import { Tables } from "@/integrations/supabase/types";
import { Account } from "@/components/Account";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [selectedStreamer, setSelectedStreamer] = useState<Tables<'streamers'> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("market");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setIsSessionLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_OUT') {
        setCurrentTab('market');
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const { streamers, balance, portfolio, totalPortfolioValue, isLoading: isLoadingData, profile, refetchStreamers, refetchProfile } = useMarketData(session);
  
  const isLoading = isSessionLoading || isLoadingData;

  const handleTrade = (streamerId: number, action: string, shares: number, price: number) => {
    toast({
      title: "Trading is coming soon!",
      description: "We are working on implementing the trade execution logic.",
    });
    setIsModalOpen(false);
  };
  
  const handleSelectStreamer = (streamer: Tables<'streamers'>) => {
    if (!session) {
      toast({
        title: 'Please log in to trade',
        description: 'You need an account to buy and sell streamer stocks.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    setSelectedStreamer(streamer);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

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
          <MarketView 
            streamers={streamers}
            handleSelectStreamer={handleSelectStreamer}
          />
        )}

        {currentTab === "portfolio" && !!session && (
          <Portfolio 
            portfolio={portfolio || []} 
            streamers={streamers || []}
            balance={balance}
          />
        )}

        {currentTab === "dashboard" && !!session && (
          <Dashboard
            profile={profile}
            streamers={streamers}
            portfolio={portfolio}
            balance={balance}
            totalPortfolioValue={totalPortfolioValue}
          />
        )}
        
        {currentTab === "account" && !!session && (
          <Account
            profile={profile}
            streamers={streamers}
            refetchProfile={refetchProfile}
            refetchStreamers={refetchStreamers}
          />
        )}
      </main>

      {!!session && <TradingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        streamer={selectedStreamer}
        onTrade={handleTrade}
        currentShares={portfolio?.find(p => p.streamer_id === selectedStreamer?.id)?.shares || 0}
      />}
    </div>
  );
};

export default Index;
