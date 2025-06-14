
import { TrendingUp, Users, DollarSign } from "lucide-react";
import { StreamerCard } from "@/components/StreamerCard";
import { MarketStats } from "@/components/market/MarketStats";
import { Tables } from "@/integrations/supabase/types";

interface MarketViewProps {
  streamers: Tables<'streamers'>[] | null | undefined;
  handleSelectStreamer: (streamer: Tables<'streamers'>) => void;
}

export const MarketView = ({ streamers, handleSelectStreamer }: MarketViewProps) => {
  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          StreamStock Exchange
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Trade your favorite streamers like stocks! Buy low, sell high, and build your creator portfolio.
        </p>
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Market Open</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{streamers?.length || 0} Active Streamers</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-400">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">$1.2M Daily Volume</span>
          </div>
        </div>
      </div>

      <MarketStats streamers={streamers} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streamers?.map((streamer) => (
          <StreamerCard
            key={streamer.id}
            streamer={{
              id: streamer.id,
              name: streamer.name,
              platform: streamer.platform,
              price: streamer.price,
              change: streamer.change,
              changePercent: streamer.change_percent,
              followers: streamer.followers,
              avgViewers: streamer.avg_viewers,
              avatar: streamer.avatar || '',
            }}
            onTrade={() => handleSelectStreamer(streamer)}
          />
        ))}
      </div>
    </>
  );
};
