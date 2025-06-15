
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

export const useFundsData = (session: Session | null) => {
  const { data: funds, isLoading: isLoadingFunds, refetch: refetchFunds } = useQuery({
    queryKey: ['funds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funds')
        .select(`
          *,
          games (
            id,
            name,
            created_at
          )
        `)
        .order('price', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: true,
  });

  const { data: fundPortfolio, isLoading: isLoadingFundPortfolio, refetch: refetchFundPortfolio } = useQuery({
    queryKey: ['fund_portfolio', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('fund_portfolio').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: fundTransactions, isLoading: isLoadingFundTransactions, refetch: refetchFundTransactions } = useQuery({
    queryKey: ['fund_transactions', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('fund_transactions').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const totalFundPortfolioValue = fundPortfolio?.reduce((total, item) => {
    const fund = funds?.find(f => f.id === item.fund_id);
    return total + (item.shares * (fund?.price || 0));
  }, 0) || 0;

  const isLoading = isLoadingFunds || (!!session && (isLoadingFundPortfolio || isLoadingFundTransactions));

  return { 
    funds, 
    fundPortfolio, 
    fundTransactions, 
    totalFundPortfolioValue, 
    isLoading, 
    refetchFunds, 
    refetchFundPortfolio, 
    refetchFundTransactions 
  };
};
