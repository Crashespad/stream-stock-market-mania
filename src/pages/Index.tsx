
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { Header } from "@/components/Header";
import { TradingModal } from "@/components/TradingModal";
import { FundTradingModal } from "@/components/funds/FundTradingModal";
import { Portfolio } from "@/components/Portfolio";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMarketData } from "@/hooks/useMarketData";
import { useFundsData } from "@/hooks/useFundsData";
import { MarketView } from "@/components/market/MarketView";
import { FundsView } from "@/components/funds/FundsView";
import { Tables } from "@/integrations/supabase/types";
import { Account } from "@/components/Account";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [selectedStreamer, setSelectedStreamer] = useState<Tables<'streamers'> | null>(null);
  const [selectedFund, setSelectedFund] = useState<Tables<'funds'> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("market");
  const [marketSubTab, setMarketSubTab] = useState("streamers");
  
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
  
  const { streamers, balance, portfolio, totalPortfolioValue, isLoading: isLoadingMarketData, profile, refetchStreamers, refetchProfile } = useMarketData(session);
  const { funds, fundPortfolio, totalFundPortfolioValue, isLoading: isLoadingFundsData, refetchFunds, refetchFundPortfolio } = useFundsData(session);
  
  const isLoading = isSessionLoading || isLoadingMarketData || isLoadingFundsData;

  const handleTrade = (streamerId: number, action: string, shares: number, price: number) => {
    toast({
      title: "Trading is coming soon!",
      description: "We are working on implementing the trade execution logic.",
    });
    setIsModalOpen(false);
  };

  const handleFundTrade = (fundId: number, action: string, shares: number, price: number) => {
    toast({
      title: "Fund trading is coming soon!",
      description: "We are working on implementing the fund trade execution logic.",
    });
    setIsFundModalOpen(false);
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

  const handleSelectFund = (fund: Tables<'funds'>) => {
    if (!session) {
      toast({
        title: 'Please log in to trade',
        description: 'You need an account to buy and sell fund shares.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    setSelectedFund(fund);
    setIsFundModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

  const totalCombinedPortfolioValue = totalPortfolioValue + totalFundPortfolioValue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header 
        balance={balance} 
        portfolioValue={totalCombinedPortfolioValue}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isLoggedIn={!!session}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentTab === "market" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 inline-flex">
                <button
                  onClick={() => setMarketSubTab("streamers")}
                  className={`px-6 py-2 rounded-md transition-all ${
                    marketSubTab === "streamers"
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Streamers
                </button>
                <button
                  onClick={() => setMarketSubTab("funds")}
                  className={`px-6 py-2 rounded-md transition-all ${
                    marketSubTab === "funds"
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Funds
                </button>
              </div>
            </div>

            {marketSubTab === "streamers" && (
              <MarketView 
                streamers={streamers}
                handleSelectStreamer={handleSelectStreamer}
              />
            )}

            {marketSubTab === "funds" && (
              <FundsView
                funds={funds}
                fundPortfolio={fundPortfolio}
                handleSelectFund={handleSelectFund}
                isLoading={isLoadingFundsData}
              />
            )}
          </div>
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
            totalPortfolioValue={totalCombinedPortfolioValue}
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

      {!!session && <FundTradingModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        fund={selectedFund}
        onTrade={handleFundTrade}
        currentShares={fundPortfolio?.find(p => p.fund_id === selectedFund?.id)?.shares || 0}
      />}
    </div>
  );
};

export default Index;
