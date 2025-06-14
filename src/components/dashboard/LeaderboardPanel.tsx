
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Medal, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const LeaderboardPanel = () => {
  const { data: weeklyLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'weekly'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*, profiles(username)')
        .eq('period', 'weekly')
        .order('rank', { ascending: true })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const { data: monthlyLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'monthly'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*, profiles(username)')
        .eq('period', 'monthly')
        .order('rank', { ascending: true })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const { data: allTimeLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'all_time'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*, profiles(username)')
        .eq('period', 'all_time')
        .order('rank', { ascending: true })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400 fill-current" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300 fill-current" />;
      case 3:
        return <Trophy className="w-5 h-5 text-orange-400 fill-current" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">{rank}</span>;
    }
  };

  const LeaderboardTable = ({ data }: { data: any[] | undefined }) => (
    <div className="space-y-3">
      {!data || data.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No leaderboard data available yet</p>
      ) : (
        data.map((entry) => (
          <div
            key={entry.id}
            className={`p-4 rounded-lg border transition-colors ${
              entry.rank <= 3 
                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRankIcon(entry.rank)}
                <div>
                  <h4 className="font-semibold">
                    {entry.profiles?.username || `User ${entry.user_id.slice(0, 8)}`}
                  </h4>
                  <p className="text-sm text-gray-400">
                    Portfolio: ${entry.total_portfolio_value.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 ${
                  entry.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {entry.profit_loss >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-bold">
                    {entry.profit_loss >= 0 ? '+' : ''}${entry.profit_loss.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {entry.profit_loss_percentage >= 0 ? '+' : ''}
                  {entry.profit_loss_percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            <TabsTrigger value="weekly" className="text-white data-[state=active]:bg-white/20">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-white data-[state=active]:bg-white/20">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="all_time" className="text-white data-[state=active]:bg-white/20">
              All Time
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <LeaderboardTable data={weeklyLeaderboard} />
          </TabsContent>

          <TabsContent value="monthly">
            <LeaderboardTable data={monthlyLeaderboard} />
          </TabsContent>

          <TabsContent value="all_time">
            <LeaderboardTable data={allTimeLeaderboard} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
