
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Eye, Twitch, Youtube, Activity, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StreamerCardProps {
  streamer: {
    id: number;
    name: string;
    platform: string;
    price: number;
    change: number;
    changePercent: number;
    followers: number;
    avgViewers: number;
    avatar: string;
    is_live?: boolean;
  };
  onTrade: () => void;
}

export const StreamerCard = ({ streamer, onTrade }: StreamerCardProps) => {
  const navigate = useNavigate();
  const isPositive = streamer.change >= 0;
  const PlatformIcon = streamer.platform === "twitch" ? Twitch : Youtube;
  const platformColor = streamer.platform === "twitch" ? "text-purple-400" : "text-red-400";

  const handleViewDetails = () => {
    navigate(`/streamer/${streamer.id}`);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={streamer.avatar} 
                alt={streamer.name}
                className="w-12 h-12 rounded-full border-2 border-white/20"
              />
              <PlatformIcon className={`w-4 h-4 ${platformColor} absolute -bottom-1 -right-1 bg-black rounded-full p-0.5`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-lg">{streamer.name}</h3>
                {streamer.is_live && (
                  <Activity className="w-4 h-4 text-red-400" />
                )}
              </div>
              <Badge variant="secondary" className="text-xs">
                {streamer.platform.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-white">
              ${streamer.price.toFixed(2)}
            </span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{streamer.change.toFixed(2)} ({isPositive ? '+' : ''}{streamer.changePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-white font-semibold">{(streamer.followers / 1000000).toFixed(1)}M</p>
            <p className="text-gray-400 text-xs">Followers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
              <Eye className="w-4 h-4" />
            </div>
            <p className="text-white font-semibold">{(streamer.avgViewers / 1000).toFixed(0)}K</p>
            <p className="text-gray-400 text-xs">Avg Viewers</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={onTrade}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          >
            Trade
          </Button>
          <Button 
            onClick={handleViewDetails}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
