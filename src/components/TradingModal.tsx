
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Twitch, Youtube, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamer: Tables<'streamers'> | null;
  onTrade: (streamerId: number, action: string, shares: number, price: number) => void;
  currentShares: number;
}

export const TradingModal = ({ isOpen, onClose, streamer, onTrade, currentShares }: TradingModalProps) => {
  const [action, setAction] = useState("long");
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

          <div className="space-y-3">
            <label className="text-sm text-gray-300 font-semibold">Trade Type</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={action === "long" ? "default" : "outline"}
                onClick={() => setAction("long")}
                className={`flex-col h-auto py-3 ${action === "long" ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-400 hover:bg-green-600/20"}`}
              >
                <ArrowUp className="w-5 h-5 mb-1" />
                <span className="text-xs">Long</span>
                <span className="text-xs opacity-75">Buy</span>
              </Button>
              <Button
                variant={action === "short" ? "default" : "outline"}
                onClick={() => setAction("short")}
                className={`flex-col h-auto py-3 ${action === "short" ? "bg-red-600 hover:bg-red-700" : "border-red-600 text-red-400 hover:bg-red-600/20"}`}
              >
                <ArrowDown className="w-5 h-5 mb-1" />
                <span className="text-xs">Short</span>
                <span className="text-xs opacity-75">Sell</span>
              </Button>
              <Button
                variant={action === "sell" ? "default" : "outline"}
                onClick={() => setAction("sell")}
                className={`flex-col h-auto py-3 ${action === "sell" ? "bg-gray-600 hover:bg-gray-700" : "border-gray-600 text-gray-400 hover:bg-gray-600/20"}`}
                disabled={currentShares === 0}
              >
                <TrendingDown className="w-5 h-5 mb-1" />
                <span className="text-xs">Close</span>
                <span className="text-xs opacity-75">Exit</span>
              </Button>
            </div>
          </div>

          {action === "long" && (
            <div className="bg-green-900/30 rounded-lg p-3 text-sm">
              <p className="text-green-300 font-semibold mb-1">Long Position</p>
              <p className="text-gray-300">You profit if the price goes UP. You lose money if the price goes DOWN.</p>
            </div>
          )}

          {action === "short" && (
            <div className="bg-red-900/30 rounded-lg p-3 text-sm">
              <p className="text-red-300 font-semibold mb-1">Short Position</p>
              <p className="text-gray-300">You profit if the price goes DOWN. You lose money if the price goes UP.</p>
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
              <span>${streamer.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
              <span>Total Cost:</span>
              <span className="text-blue-400">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleTrade}
            className={`w-full font-semibold ${
              action === "long" 
                ? "bg-green-600 hover:bg-green-700" 
                : action === "short"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {action === "long" ? "Open Long Position" : action === "short" ? "Open Short Position" : "Close Position"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
