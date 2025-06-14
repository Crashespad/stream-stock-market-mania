
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Percent, Twitch, Youtube } from "lucide-react";

interface PortfolioProps {
  portfolio: any[];
  streamers: any[];
  balance: number;
}

export const Portfolio = ({ portfolio, streamers, balance }: PortfolioProps) => {
  const totalValue = portfolio.reduce((total, item) => {
    const streamer = streamers.find(s => s.id === item.streamerId);
    return total + (item.shares * (streamer?.price || 0));
  }, 0);

  const totalGainLoss = portfolio.reduce((total, item) => {
    const streamer = streamers.find(s => s.id === item.streamerId);
    const currentValue = item.shares * (streamer?.price || 0);
    const originalValue = item.shares * item.avgPrice;
    return total + (currentValue - originalValue);
  }, 0);

  const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Holdings Yet</h2>
        <p className="text-gray-300">Start trading to build your streamer portfolio!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Cash Balance</p>
            <p className="text-white text-xl font-bold">${balance.toLocaleString()}</p>
          </div>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Portfolio Value</p>
            <p className="text-white text-xl font-bold">${totalValue.toLocaleString()}</p>
          </div>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="text-center">
            {totalGainLoss >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400 mx-auto mb-2" />
            )}
            <p className="text-gray-300 text-sm">Total Gain/Loss</p>
            <p className={`text-xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
            </p>
          </div>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="text-center">
            <Percent className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Total Return</p>
            <p className={`text-xl font-bold ${totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(1)}%
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Holdings</h2>
        {portfolio.map((item) => {
          const streamer = streamers.find(s => s.id === item.streamerId);
          if (!streamer) return null;
          
          const currentValue = item.shares * streamer.price;
          const originalValue = item.shares * item.avgPrice;
          const gainLoss = currentValue - originalValue;
          const gainLossPercent = (gainLoss / originalValue) * 100;
          const PlatformIcon = streamer.platform === "twitch" ? Twitch : Youtube;
          const platformColor = streamer.platform === "twitch" ? "text-purple-400" : "text-red-400";

          return (
            <Card key={item.streamerId} className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={streamer.avatar} 
                      alt={streamer.name}
                      className="w-12 h-12 rounded-full border-2 border-white/20"
                    />
                    <PlatformIcon className={`w-4 h-4 ${platformColor} absolute -bottom-1 -right-1 bg-black rounded-full p-0.5`} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{streamer.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {streamer.platform.toUpperCase()}
                      </Badge>
                      <span className="text-gray-400 text-sm">{item.shares} shares</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-gray-300 text-sm">Avg Price</p>
                      <p className="text-white font-semibold">${item.avgPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Current Price</p>
                      <p className="text-white font-semibold">${streamer.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Market Value</p>
                      <p className="text-white font-semibold">${currentValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Gain/Loss</p>
                      <p className={`font-semibold ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)} ({gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
