
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Gamepad2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useFundsData } from "@/hooks/useFundsData";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

interface PortfolioProps {
  portfolio: Tables<'portfolio'>[];
  streamers: Tables<'streamers'>[];
  balance: number;
}

export const Portfolio = ({ portfolio, streamers, balance }: PortfolioProps) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const { fundPortfolio, funds } = useFundsData(session);

  const getStreamerById = (id: number) => {
    return streamers.find(s => s.id === id);
  };

  const getFundById = (id: number) => {
    return funds?.find(f => f.id === id);
  };

  const totalStreamerValue = portfolio.reduce((total, item) => {
    const streamer = getStreamerById(item.streamer_id);
    return total + (item.shares * (streamer?.price || 0));
  }, 0);

  const totalFundValue = fundPortfolio?.reduce((total, item) => {
    const fund = getFundById(item.fund_id);
    return total + (item.shares * (fund?.price || 0));
  }, 0) || 0;

  const totalValue = totalStreamerValue + totalFundValue;

  const totalStreamerProfit = portfolio.reduce((total, item) => {
    const streamer = getStreamerById(item.streamer_id);
    const currentValue = item.shares * (streamer?.price || 0);
    const originalValue = item.shares * item.avg_price;
    return total + (currentValue - originalValue);
  }, 0);

  const totalFundProfit = fundPortfolio?.reduce((total, item) => {
    const fund = getFundById(item.fund_id);
    const currentValue = item.shares * (fund?.price || 0);
    const originalValue = item.shares * item.avg_price;
    return total + (currentValue - originalValue);
  }, 0) || 0;

  const totalProfit = totalStreamerProfit + totalFundProfit;
  const totalProfitPercent = totalValue > 0 ? (totalProfit / (totalValue - totalProfit)) * 100 : 0;

  if (portfolio.length === 0 && (!fundPortfolio || fundPortfolio.length === 0)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-2">Your Portfolio is Empty</h2>
        <p className="text-gray-300">Start trading streamers and funds to build your portfolio!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-gray-300 text-sm">Balance</p>
              <p className="text-2xl font-bold text-white">${balance.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-gray-300 text-sm">Portfolio Value</p>
              <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center gap-3">
            {totalProfit >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-400" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
            <div>
              <p className="text-gray-300 text-sm">Total P&L</p>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center gap-3">
            {totalProfitPercent >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-400" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
            <div>
              <p className="text-gray-300 text-sm">Total Return</p>
              <p className={`text-2xl font-bold ${totalProfitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Streamer Holdings */}
      {portfolio.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Streamer Holdings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.map((item) => {
              const streamer = getStreamerById(item.streamer_id);
              if (!streamer) return null;

              const currentValue = item.shares * streamer.price;
              const originalValue = item.shares * item.avg_price;
              const profit = currentValue - originalValue;
              const profitPercent = ((profit / originalValue) * 100) || 0;

              return (
                <Card key={item.id} className="bg-white/10 backdrop-blur-md border-white/20 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={streamer.avatar || "/placeholder.svg"}
                      alt={streamer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{streamer.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {streamer.platform}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Shares:</span>
                      <span className="text-white">{item.shares}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Avg Price:</span>
                      <span className="text-white">${item.avg_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Current Price:</span>
                      <span className="text-white">${streamer.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Total Value:</span>
                      <span className="text-white">${currentValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-300">P&L:</span>
                      <span className={profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Fund Holdings */}
      {fundPortfolio && fundPortfolio.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6" />
            Fund Holdings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fundPortfolio.map((item) => {
              const fund = getFundById(item.fund_id);
              if (!fund) return null;

              const currentValue = item.shares * fund.price;
              const originalValue = item.shares * item.avg_price;
              const profit = currentValue - originalValue;
              const profitPercent = ((profit / originalValue) * 100) || 0;

              return (
                <Card key={item.id} className="bg-white/10 backdrop-blur-md border-white/20 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Gamepad2 className="w-12 h-12 text-blue-400" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{fund.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          FUND
                        </Badge>
                        {fund.has_paid_out && (
                          <Badge className="bg-green-600 text-white text-xs">
                            PAID OUT
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Shares:</span>
                      <span className="text-white">{item.shares}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Avg Price:</span>
                      <span className="text-white">${item.avg_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Current Price:</span>
                      <span className="text-white">${fund.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Total Value:</span>
                      <span className="text-white">${currentValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-300">P&L:</span>
                      <span className={profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
