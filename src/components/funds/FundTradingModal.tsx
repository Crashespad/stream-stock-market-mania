
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface FundTradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: Tables<'funds'> | null;
  onTrade: (fundId: number, action: string, shares: number, price: number) => void;
  currentShares: number;
}

export const FundTradingModal = ({ isOpen, onClose, fund, onTrade, currentShares }: FundTradingModalProps) => {
  const [action, setAction] = useState("buy");
  const [shares, setShares] = useState(1);

  if (!fund) return null;

  const total = shares * fund.price;
  const isPositive = fund.change >= 0;

  const handleTrade = () => {
    onTrade(fund.id, action, shares, fund.price);
    setShares(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Gamepad2 className="w-10 h-10 text-blue-400" />
            <div>
              <span className="text-xl">{fund.name}</span>
              <div className="flex items-center gap-2 mt-1">
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
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">${fund.price.toFixed(2)}</div>
            <div className={`flex items-center justify-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {isPositive ? '+' : ''}{fund.change.toFixed(2)} ({isPositive ? '+' : ''}{fund.change_percent.toFixed(1)}%)
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min((fund.price / fund.payout_threshold) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Current: ${fund.price.toFixed(2)}</span>
                <span>Payout: ${fund.payout_threshold.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {currentShares > 0 && (
            <div className="bg-blue-900/30 rounded-lg p-3 text-center">
              <p className="text-blue-300">You own <span className="font-bold">{currentShares}</span> shares</p>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm text-gray-300 font-semibold">Trade Type</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={action === "buy" ? "default" : "outline"}
                onClick={() => setAction("buy")}
                disabled={fund.has_paid_out || !fund.is_active}
                className={`flex-col h-auto py-3 ${action === "buy" ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-400 hover:bg-green-600/20"}`}
              >
                <ArrowUp className="w-5 h-5 mb-1" />
                <span className="text-xs">Buy Shares</span>
              </Button>
              <Button
                variant={action === "sell" ? "default" : "outline"}
                onClick={() => setAction("sell")}
                disabled={currentShares === 0 || fund.has_paid_out}
                className={`flex-col h-auto py-3 ${action === "sell" ? "bg-red-600 hover:bg-red-700" : "border-red-600 text-red-400 hover:bg-red-600/20"}`}
              >
                <ArrowDown className="w-5 h-5 mb-1" />
                <span className="text-xs">Sell Shares</span>
              </Button>
            </div>
          </div>

          {action === "buy" && (
            <div className="bg-green-900/30 rounded-lg p-3 text-sm">
              <p className="text-green-300 font-semibold mb-1">Fund Investment</p>
              <p className="text-gray-300">
                This fund tracks {fund.total_streamers} streamers. 
                When it reaches ${fund.payout_threshold.toFixed(2)}, all shareholders get paid out.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Number of Shares</label>
            <Input
              type="number"
              min="1"
              max={action === "sell" ? currentShares : 1000}
              value={shares}
              onChange={(e) => setShares(parseInt(e.target.value) || 1)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Shares:</span>
              <span>{shares}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Price per share:</span>
              <span>${fund.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
              <span>Total {action === "buy" ? "Cost" : "Value"}:</span>
              <span className="text-blue-400">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleTrade}
            disabled={fund.has_paid_out && action === "buy"}
            className={`w-full font-semibold ${
              action === "buy" 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {action === "buy" ? "Buy Fund Shares" : "Sell Fund Shares"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
