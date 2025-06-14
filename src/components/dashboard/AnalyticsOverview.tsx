
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, Star } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsOverviewProps {
  balance: number;
  totalPortfolioValue: number;
  portfolio: Tables<'portfolio'>[] | undefined;
  streamers: Tables<'streamers'>[] | undefined;
}

export const AnalyticsOverview = ({ balance, totalPortfolioValue, portfolio, streamers }: AnalyticsOverviewProps) => {
  const { data: analytics } = useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ['user-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalValue = balance + totalPortfolioValue;
  const totalTrades = transactions?.length || 0;
  const recentTrades = transactions?.slice(0, 5) || [];
  
  // Calculate profit/loss from portfolio
  const portfolioProfitLoss = portfolio?.reduce((total, item) => {
    const streamer = streamers?.find(s => s.id === item.streamer_id);
    if (!streamer) return total;
    const currentValue = item.shares * streamer.price;
    const originalValue = item.shares * item.avg_price;
    return total + (currentValue - originalValue);
  }, 0) || 0;

  const profitLossPercentage = portfolioProfitLoss > 0 ? 
    ((portfolioProfitLoss / (totalPortfolioValue - portfolioProfitLoss)) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          <p className="text-xs text-gray-400">
            Cash + Portfolio
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
          {portfolioProfitLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${portfolioProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolioProfitLoss >= 0 ? '+' : ''}${portfolioProfitLoss.toFixed(2)}
          </div>
          <p className="text-xs text-gray-400">
            {profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          <Activity className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTrades}</div>
          <p className="text-xs text-gray-400">
            Lifetime transactions
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <Target className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.trading_streak || 0}
          </div>
          <p className="text-xs text-gray-400">
            Trading streak
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
