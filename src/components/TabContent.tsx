
import { Portfolio } from "@/components/Portfolio";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Account } from "@/components/Account";
import { MarketNavigation } from "@/components/market/MarketNavigation";
import { MarketView } from "@/components/market/MarketView";
import { FundsView } from "@/components/funds/FundsView";
import { Tables } from "@/integrations/supabase/types";
import { Session } from '@supabase/supabase-js';

interface TabContentProps {
  currentTab: string;
  marketSubTab: string;
  setMarketSubTab: (tab: string) => void;
  session: Session | null;
  streamers: Tables<'streamers'>[] | null;
  funds: (Tables<'funds'> & { games: Tables<'games'> | null })[] | null | undefined;
  fundPortfolio: Tables<'fund_portfolio'>[] | null | undefined;
  portfolio: Tables<'portfolio'>[] | null;
  balance: number;
  profile: any;
  totalCombinedPortfolioValue: number;
  isLoadingFundsData: boolean;
  handleSelectStreamer: (streamer: Tables<'streamers'>) => void;
  handleSelectFund: (fund: Tables<'funds'>) => void;
  refetchProfile: () => void;
  refetchStreamers: () => void;
}

export const TabContent = ({
  currentTab,
  marketSubTab,
  setMarketSubTab,
  session,
  streamers,
  funds,
  fundPortfolio,
  portfolio,
  balance,
  profile,
  totalCombinedPortfolioValue,
  isLoadingFundsData,
  handleSelectStreamer,
  handleSelectFund,
  refetchProfile,
  refetchStreamers,
}: TabContentProps) => {
  if (currentTab === "market") {
    return (
      <div className="space-y-6">
        <MarketNavigation 
          marketSubTab={marketSubTab}
          setMarketSubTab={setMarketSubTab}
        />

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
    );
  }

  if (currentTab === "portfolio" && !!session) {
    return (
      <Portfolio 
        portfolio={portfolio || []} 
        streamers={streamers || []}
        balance={balance}
      />
    );
  }

  if (currentTab === "dashboard" && !!session) {
    return (
      <Dashboard
        profile={profile}
        streamers={streamers}
        portfolio={portfolio}
        balance={balance}
        totalPortfolioValue={totalCombinedPortfolioValue}
      />
    );
  }
  
  if (currentTab === "account" && !!session) {
    return (
      <Account
        profile={profile}
        streamers={streamers}
        refetchProfile={refetchProfile}
        refetchStreamers={refetchStreamers}
      />
    );
  }

  return null;
};
