
import { useState } from "react";
import { FundCard } from "./FundCard";
import { FundTradingModal } from "./FundTradingModal";
import { Tables } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";

interface FundsViewProps {
  funds: (Tables<'funds'> & { games: Tables<'games'> | null })[] | null | undefined;
  fundPortfolio: Tables<'fund_portfolio'>[] | null | undefined;
  handleSelectFund: (fund: Tables<'funds'>) => void;
  isLoading?: boolean;
}

export const FundsView = ({ funds, fundPortfolio, handleSelectFund, isLoading }: FundsViewProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!funds || funds.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-2">No Funds Available</h2>
        <p className="text-gray-300">Funds will be created automatically based on streamer activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Game Funds</h2>
        <p className="text-gray-300">Invest in groups of streamers by game</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.map((fund) => (
          <FundCard
            key={fund.id}
            fund={fund}
            onTrade={() => handleSelectFund(fund)}
          />
        ))}
      </div>
    </div>
  );
};
