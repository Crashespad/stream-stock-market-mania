
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { Header } from "@/components/Header";
import { TabContent } from "@/components/TabContent";
import { TradingModals } from "@/components/TradingModals";
import { Loader2 } from "lucide-react";
import { useMarketData } from "@/hooks/useMarketData";
import { useFundsData } from "@/hooks/useFundsData";
import { useFundTrading } from "@/hooks/useFundTrading";
import { useTradingHandlers } from "@/hooks/useTradingHandlers";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("market");
  const [marketSubTab, setMarketSubTab] = useState("streamers");
  
  const navigate = useNavigate();

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
  const { executeFundTrade, isTrading } = useFundTrading(session);
  
  const {
    selectedStreamer,
    selectedFund,
    isModalOpen,
    setIsModalOpen,
    isFundModalOpen,
    setIsFundModalOpen,
    handleTrade,
    handleSelectStreamer,
    handleSelectFund,
  } = useTradingHandlers(session);

  const isLoading = isSessionLoading || isLoadingMarketData || isLoadingFundsData;

  const handleFundTrade = async (fundId: number, action: string, shares: number, price: number) => {
    const success = await executeFundTrade(fundId, action, shares, price);
    if (success) {
      setIsFundModalOpen(false);
      // Refetch data to update the UI
      refetchFunds();
      refetchFundPortfolio();
    }
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
        <TabContent
          currentTab={currentTab}
          marketSubTab={marketSubTab}
          setMarketSubTab={setMarketSubTab}
          session={session}
          streamers={streamers}
          funds={funds}
          fundPortfolio={fundPortfolio}
          portfolio={portfolio}
          balance={balance}
          profile={profile}
          totalCombinedPortfolioValue={totalCombinedPortfolioValue}
          isLoadingFundsData={isLoadingFundsData}
          handleSelectStreamer={handleSelectStreamer}
          handleSelectFund={handleSelectFund}
          refetchProfile={refetchProfile}
          refetchStreamers={refetchStreamers}
        />
      </main>

      <TradingModals
        session={session}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isFundModalOpen={isFundModalOpen}
        setIsFundModalOpen={setIsFundModalOpen}
        selectedStreamer={selectedStreamer}
        selectedFund={selectedFund}
        portfolio={portfolio}
        fundPortfolio={fundPortfolio}
        isTrading={isTrading}
        handleTrade={handleTrade}
        handleFundTrade={handleFundTrade}
      />
    </div>
  );
};

export default Index;
