
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Gamepad2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface FundCardProps {
  fund: Tables<'funds'>;
  onTrade: () => void;
}

export const FundCard = ({ fund, onTrade }: FundCardProps) => {
  const isPositive = fund.change >= 0;

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Gamepad2 className="w-12 h-12 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{fund.name}</h3>
              <Badge variant="secondary" className="text-xs">
                FUND
              </Badge>
            </div>
          </div>
          {fund.has_paid_out && (
            <Badge className="bg-green-600 text-white">
              PAID OUT
            </Badge>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-white">
              ${fund.price.toFixed(2)}
            </span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{fund.change.toFixed(2)} ({isPositive ? '+' : ''}{fund.change_percent.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((fund.price / fund.payout_threshold) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>${fund.price.toFixed(2)}</span>
            <span>Target: ${fund.payout_threshold.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-white font-semibold">{fund.total_streamers}</p>
            <p className="text-gray-400 text-xs">Active Streamers</p>
          </div>
        </div>

        {fund.description && (
          <p className="text-gray-300 text-sm mb-4">{fund.description}</p>
        )}

        <Button 
          onClick={onTrade}
          disabled={fund.has_paid_out || !fund.is_active}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {fund.has_paid_out ? 'Fund Paid Out' : 'Trade Fund'}
        </Button>
      </div>
    </Card>
  );
};
