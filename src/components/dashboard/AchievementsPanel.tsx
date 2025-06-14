
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AchievementsPanel = () => {
  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: userAchievements } = useQuery({
    queryKey: ['user-achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id, earned_at');
      if (error) throw error;
      return data;
    },
  });

  const earnedAchievementIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements?.map((achievement) => {
            const isEarned = earnedAchievementIds.has(achievement.id);
            const earnedDate = userAchievements?.find(ua => ua.achievement_id === achievement.id)?.earned_at;
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isEarned 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                    : 'bg-white/5 border-white/10 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    isEarned ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                  }`}>
                    {isEarned ? (
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-gray-300 mt-1">{achievement.description}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      {isEarned ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Earned
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
                          Locked
                        </Badge>
                      )}
                      
                      {achievement.reward_type === 'cash' && achievement.reward_value && (
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                          ${achievement.reward_value.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    
                    {isEarned && earnedDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Earned on {new Date(earnedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
