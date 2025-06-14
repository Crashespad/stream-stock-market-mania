
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

export const useMarketData = (session: Session | null) => {
  const { data: streamers, isLoading: isLoadingStreamers, refetch: refetchStreamers } = useQuery({
    queryKey: ['streamers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('streamers').select('*').order('price', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: true,
  });

  const { data: balanceData, isLoading: isLoadingBalance, refetch: refetchBalance } = useQuery({
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

  const { data: portfolio, isLoading: isLoadingPortfolio, refetch: refetchPortfolio } = useQuery({
    queryKey: ['portfolio', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('portfolio').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: profile, isLoading: isLoadingProfile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (error && error.code !== 'PGRST116') { // Ignore error if profile doesn't exist yet
         throw new Error(error.message);
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const totalPortfolioValue = portfolio?.reduce((total, item) => {
    const streamer = streamers?.find(s => s.id === item.streamer_id);
    return total + (item.shares * (streamer?.price || 0));
  }, 0) || 0;

  const isLoading = isLoadingStreamers || (!!session && (isLoadingBalance || isLoadingPortfolio || isLoadingProfile));

  return { streamers, balance, portfolio, totalPortfolioValue, isLoading, profile, refetchStreamers, refetchPortfolio, refetchBalance, refetchProfile };
};
