
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { StreamerCard } from "@/components/StreamerCard";
import { TradingModal } from "@/components/TradingModal";
import { Portfolio } from "@/components/Portfolio";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Trophy } from "lucide-react";

// Mock streamer data
const streamers = [
  {
    id: 1,
    name: "xQcOW",
    platform: "twitch",
    price: 142.50,
    change: 5.2,
    changePercent: 3.8,
    followers: 11800000,
    avgViewers: 45000,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "MrBeast",
    platform: "youtube",
    price: 298.75,
    change: -12.3,
    changePercent: -4.1,
    followers: 218000000,
    avgViewers: 120000,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "PewDiePie",
    platform: "youtube",
    price: 187.20,
    change: 8.4,
    changePercent: 4.7,
    followers: 111000000,
    avgViewers: 85000,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Pokimane",
    platform: "twitch",
    price: 89.60,
    change: 2.1,
    changePercent: 2.4,
    followers: 9200000,
    avgViewers: 28000,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Ninja",
    platform: "twitch",
    price: 156.80,
    change: -3.2,
    changePercent: -2.0,
    followers: 18700000,
    avgViewers: 35000,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "Valkyrae",
    platform: "youtube",
    price: 78.90,
    change: 6.7,
    changePercent: 9.3,
    followers: 3800000,
    avgViewers: 22000,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];

const Index = () => {
  const [selectedStreamer, setSelectedStreamer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [currentTab, setCurrentTab] = useState("market");

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This would connect to real APIs in production
      console.log("Updating prices...");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (streamerId, action, shares, price) => {
    const streamer = streamers.find(s => s.id === streamerId);
    const totalCost = shares * price;

    if (action === "buy" && balance >= totalCost) {
      setBalance(prev => prev - totalCost);
      setPortfolio(prev => {
        const existing = prev.find(p => p.streamerId === streamerId);
        if (existing) {
          return prev.map(p => 
            p.streamerId === streamerId 
              ? { ...p, shares: p.shares + shares, avgPrice: ((p.avgPrice * p.shares) + totalCost) / (p.shares + shares) }
              : p
          );
        }
        return [...prev, { streamerId, streamerName: streamer.name, shares, avgPrice: price, platform: streamer.platform }];
      });
    } else if (action === "sell") {
      const portfolioItem = portfolio.find(p => p.streamerId === streamerId);
      if (portfolioItem && portfolioItem.shares >= shares) {
        setBalance(prev => prev + totalCost);
        setPortfolio(prev => 
          prev.map(p => 
            p.streamerId === streamerId 
              ? { ...p, shares: p.shares - shares }
              : p
          ).filter(p => p.shares > 0)
        );
      }
    }
    setIsModalOpen(false);
  };

  const totalPortfolioValue = portfolio.reduce((total, item) => {
    const streamer = streamers.find(s => s.id === item.streamerId);
    return total + (item.shares * (streamer?.price || 0));
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header 
        balance={balance} 
        portfolioValue={totalPortfolioValue}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentTab === "market" && (
          <>
            {/* Hero Section */}
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
                  <span className="font-semibold">6 Active Streamers</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold">$1.2M Daily Volume</span>
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Top Gainer</p>
                    <p className="text-white text-xl font-bold">Valkyrae</p>
                    <p className="text-green-400 text-sm">+9.3%</p>
                  </div>
                  <Trophy className="w-10 h-10 text-yellow-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Highest Price</p>
                    <p className="text-white text-xl font-bold">MrBeast</p>
                    <p className="text-blue-400 text-sm">$298.75</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Most Followers</p>
                    <p className="text-white text-xl font-bold">MrBeast</p>
                    <p className="text-purple-400 text-sm">218M</p>
                  </div>
                  <Users className="w-10 h-10 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Streamer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {streamers.map((streamer) => (
                <StreamerCard
                  key={streamer.id}
                  streamer={streamer}
                  onTrade={() => {
                    setSelectedStreamer(streamer);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {currentTab === "portfolio" && (
          <Portfolio 
            portfolio={portfolio} 
            streamers={streamers}
            balance={balance}
          />
        )}
      </main>

      <TradingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        streamer={selectedStreamer}
        onTrade={handleTrade}
        currentShares={portfolio.find(p => p.streamerId === selectedStreamer?.id)?.shares || 0}
      />
    </div>
  );
};

export default Index;
