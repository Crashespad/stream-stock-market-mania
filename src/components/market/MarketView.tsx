
import { useState, useMemo } from "react";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import { StreamerCard } from "@/components/StreamerCard";
import { MarketStats } from "@/components/market/MarketStats";
import { SearchBar } from "@/components/market/SearchBar";
import { Tables } from "@/integrations/supabase/types";

interface MarketViewProps {
  streamers: Tables<'streamers'>[] | null | undefined;
  handleSelectStreamer: (streamer: Tables<'streamers'>) => void;
}

export const MarketView = ({ streamers, handleSelectStreamer }: MarketViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price-desc");

  const filteredAndSortedStreamers = useMemo(() => {
    if (!streamers) return [];

    // Filter by search query
    let filtered = streamers.filter(streamer =>
      streamer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      streamer.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-desc":
          return b.price - a.price;
        case "price-asc":
          return a.price - b.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "followers-desc":
          return b.followers - a.followers;
        case "change-desc":
          return b.change_percent - a.change_percent;
        case "change-asc":
          return a.change_percent - b.change_percent;
        default:
          return b.price - a.price;
      }
    });

    return filtered;
  }, [streamers, searchQuery, sortBy]);

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

      <SearchBar 
        onSearch={setSearchQuery}
        onSortChange={setSortBy}
        sortBy={sortBy}
      />

      <div className="mb-4">
        <p className="text-gray-300 text-sm">
          Showing {filteredAndSortedStreamers.length} of {streamers?.length || 0} streamers
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedStreamers.map((streamer) => (
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
              is_live: streamer.is_live || false,
            }}
            onTrade={() => handleSelectStreamer(streamer)}
          />
        ))}
      </div>

      {filteredAndSortedStreamers.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No streamers found matching "{searchQuery}"</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms</p>
        </div>
      )}
    </>
  );
};
