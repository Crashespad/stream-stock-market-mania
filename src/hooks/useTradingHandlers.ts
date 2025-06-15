
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Session } from '@supabase/supabase-js';

export const useTradingHandlers = (session: Session | null) => {
  const [selectedStreamer, setSelectedStreamer] = useState<Tables<'streamers'> | null>(null);
  const [selectedFund, setSelectedFund] = useState<Tables<'funds'> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return {
    selectedStreamer,
    selectedFund,
    isModalOpen,
    setIsModalOpen,
    isFundModalOpen,
    setIsFundModalOpen,
    handleTrade,
    handleSelectStreamer,
    handleSelectFund,
  };
};
