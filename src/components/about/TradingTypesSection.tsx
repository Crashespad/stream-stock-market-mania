
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, ArrowUp, ArrowDown, TrendingDown } from "lucide-react";

const TradingTypesSection = () => {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Target className="w-6 h-6 text-green-400" />
          Trading Options
        </CardTitle>
        <CardDescription className="text-gray-300">
          Multiple ways to profit from streamer performance
        </CardDescription>
      </CardHeader>
      <CardContent className="text-gray-200 space-y-4">
        <div className="space-y-4">
          <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUp className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-green-400">Long Positions (Buy)</h4>
            </div>
            <p className="text-sm text-gray-300">
              Profit when a streamer's stock price increases. Perfect for when you believe a creator is about to grow their audience or engagement.
            </p>
          </div>
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDown className="w-5 h-5 text-red-400" />
              <h4 className="font-semibold text-red-400">Short Positions (Sell)</h4>
            </div>
            <p className="text-sm text-gray-300">
              Profit when a streamer's stock price decreases. Use this when you think a creator's popularity might decline or if they're taking a break.
            </p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-gray-400" />
              <h4 className="font-semibold text-gray-400">Close Positions (Exit)</h4>
            </div>
            <p className="text-sm text-gray-300">
              Exit your current positions to lock in profits or cut losses. Close anytime during market hours.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingTypesSection;
