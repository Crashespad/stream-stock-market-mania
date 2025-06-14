
import { Trophy, DollarSign, Users } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface MarketStatsProps {
  streamers: Tables<'streamers'>[] | null | undefined;
}

export const MarketStats = ({ streamers }: MarketStatsProps) => {
  if (!streamers || streamers.length === 0) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 h-[108px] animate-pulse" />
            ))}
        </div>
    );
  }

  const topGainer = [...streamers].sort((a,b) => b.change_percent - a.change_percent)[0];
  const highestPrice = [...streamers].sort((a,b) => b.price - a.price)[0];
  const mostFollowers = [...streamers].sort((a,b) => b.followers - a.followers)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {topGainer && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Top Gainer</p>
              <p className="text-white text-xl font-bold">{topGainer.name}</p>
              <p className="text-green-400 text-sm">+{topGainer.change_percent.toFixed(1)}%</p>
            </div>
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
        </div>
      )}
      {highestPrice && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Highest Price</p>
              <p className="text-white text-xl font-bold">{highestPrice.name}</p>
              <p className="text-blue-400 text-sm">${highestPrice.price.toFixed(2)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-400" />
          </div>
        </div>
      )}
      {mostFollowers && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Most Followers</p>
              <p className="text-white text-xl font-bold">{mostFollowers.name}</p>
              <p className="text-purple-400 text-sm">{(mostFollowers.followers / 1_000_000).toFixed(1)}M</p>
            </div>
            <Users className="w-10 h-10 text-purple-400" />
          </div>
        </div>
      )}
    </div>
  );
};
