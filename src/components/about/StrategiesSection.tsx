
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

const StrategiesSection = () => {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="w-6 h-6 text-yellow-400" />
          Trading Strategies
        </CardTitle>
        <CardDescription className="text-gray-300">
          Popular approaches to creator trading
        </CardDescription>
      </CardHeader>
      <CardContent className="text-gray-200 space-y-4">
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">Growth Investing</h4>
            <p className="text-sm text-gray-300">Long positions on emerging streamers with strong potential</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">Event Trading</h4>
            <p className="text-sm text-gray-300">Trade around major events, game releases, or announcements</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">Trend Following</h4>
            <p className="text-sm text-gray-300">Follow price momentum and market sentiment</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">Diversification</h4>
            <p className="text-sm text-gray-300">Spread risk across multiple creators and platforms</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategiesSection;
