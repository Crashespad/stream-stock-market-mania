
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsOverview } from "./AnalyticsOverview";
import { NotificationsPanel } from "./NotificationsPanel";
import { WatchlistPanel } from "./WatchlistPanel";
import { PriceAlertsPanel } from "./PriceAlertsPanel";
import { AchievementsPanel } from "./AchievementsPanel";
import { LeaderboardPanel } from "./LeaderboardPanel";
import { Tables } from "@/integrations/supabase/types";

interface DashboardProps {
  profile: Tables<'profiles'> | null;
  streamers: Tables<'streamers'>[] | undefined;
  portfolio: Tables<'portfolio'>[] | undefined;
  balance: number;
  totalPortfolioValue: number;
}

export const Dashboard = ({ profile, streamers, portfolio, balance, totalPortfolioValue }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-300">Welcome back, {profile?.username || 'Trader'}!</p>
      </div>

      <AnalyticsOverview 
        balance={balance}
        totalPortfolioValue={totalPortfolioValue}
        portfolio={portfolio}
        streamers={streamers}
      />

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 border-white/20">
          <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-white/20">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="text-white data-[state=active]:bg-white/20">
            Watchlist
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-white data-[state=active]:bg-white/20">
            Price Alerts
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-white data-[state=active]:bg-white/20">
            Achievements
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-white data-[state=active]:bg-white/20">
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <NotificationsPanel />
        </TabsContent>

        <TabsContent value="watchlist">
          <WatchlistPanel streamers={streamers} />
        </TabsContent>

        <TabsContent value="alerts">
          <PriceAlertsPanel streamers={streamers} />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsPanel />
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
