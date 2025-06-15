
import { TradingModal } from "@/components/TradingModal";
import { FundTradingModal } from "@/components/funds/FundTradingModal";
import { Tables } from "@/integrations/supabase/types";
import { Session } from '@supabase/supabase-js';

interface TradingModalsProps {
  session: Session | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isFundModalOpen: boolean;
  setIsFundModalOpen: (open: boolean) => void;
  selectedStreamer: Tables<'streamers'> | null;
  selectedFund: Tables<'funds'> | null;
  portfolio: Tables<'portfolio'>[] | null;
  fundPortfolio: Tables<'fund_portfolio'>[] | null | undefined;
  isTrading: boolean;
  handleTrade: (streamerId: number, action: string, shares: number, price: number) => void;
  handleFundTrade: (fundId: number, action: string, shares: number, price: number) => Promise<void>;
}

export const TradingModals = ({
  session,
  isModalOpen,
  setIsModalOpen,
  isFundModalOpen,
  setIsFundModalOpen,
  selectedStreamer,
  selectedFund,
  portfolio,
  fundPortfolio,
  isTrading,
  handleTrade,
  handleFundTrade,
}: TradingModalsProps) => {
  if (!session) return null;

  return (
    <>
      <TradingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        streamer={selectedStreamer}
        onTrade={handleTrade}
        currentShares={portfolio?.find(p => p.streamer_id === selectedStreamer?.id)?.shares || 0}
      />

      <FundTradingModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        fund={selectedFund}
        onTrade={handleFundTrade}
        currentShares={fundPortfolio?.find(p => p.fund_id === selectedFund?.id)?.shares || 0}
        isTrading={isTrading}
      />
    </>
  );
};
