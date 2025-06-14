import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Twitch, Youtube, TrendingUp, TrendingDown } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamer: Tables<'streamers'> | null;
  onTrade: (streamerId: number, action: string, shares: number, price: number) => void;
  currentShares: number;
}

export const TradingModal = ({ isOpen, onClose, streamer, onTrade, currentShares }: TradingModalProps) => {
  const [action, setAction] = useState("buy");
  const [shares, setShares] = useState(1);

  if (!streamer) return null;

  const total = shares * streamer.price;
  const PlatformIcon = streamer.platform === "twitch" ? Twitch : Youtube;
  const platformColor = streamer.platform === "twitch" ? "text-purple-400" : "text-red-400";
  const isPositive = streamer.change >= 0;

  const handleTrade = () => {
    onTrade(streamer.id, action, shares, streamer.price);
    setShares(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img 
              src={streamer.avatar} 
              alt={streamer.name}
              className="w-10 h-10 rounded-full border-2 border-white/20"
            />
            <div>
              <span className="text-xl">{streamer.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <PlatformIcon className={`w-4 h-4 ${platformColor}`} />
                <Badge variant="secondary" className="text-xs">
                  {streamer.platform.toUpperCase()}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">${streamer.price.toFixed(2)}</div>
            <div className={`flex items-center justify-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {isPositive ? '+' : ''}{streamer.change.toFixed(2)} ({isPositive ? '+' : ''}{streamer.change_percent.toFixed(1)}%)
              </span>
            </div>
          </div>

          {currentShares > 0 && (
            <div className="bg-blue-900/30 rounded-lg p-3 text-center">
              <p className="text-blue-300">You own <span className="font-bold">{currentShares}</span> shares</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant={action === "buy" ? "default" : "outline"}
              onClick={() => setAction("buy")}
              className="flex-1"
            >
              Buy
            </Button>
            <Button
              variant={action === "sell" ? "default" : "outline"}
              onClick={() => setAction("sell")}
              className="flex-1"
              disabled={currentShares === 0}
            >
              Sell
            </Button>
          </div>

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
              <span>${streamer.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
              <span>Total:</span>
              <span className={action === "buy" ? "text-red-400" : "text-green-400"}>
                {action === "buy" ? "-" : "+"}${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleTrade}
            className={`w-full font-semibold ${
              action === "buy" 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {action === "buy" ? "Buy Shares" : "Sell Shares"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
