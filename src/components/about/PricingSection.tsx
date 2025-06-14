
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Zap, DollarSign } from "lucide-react";

const PricingSection = () => {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          How Pricing Works
        </CardTitle>
        <CardDescription className="text-gray-300">
          Our dynamic pricing algorithm considers multiple factors
        </CardDescription>
      </CardHeader>
      <CardContent className="text-gray-200 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">Follower Count</h4>
              <p className="text-sm text-gray-300">Higher follower counts increase base stock price</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">Average Viewership</h4>
              <p className="text-sm text-gray-300">Consistent high viewership drives price stability</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">Live Status & Engagement</h4>
              <p className="text-sm text-gray-300">Active streaming and engagement metrics affect real-time pricing</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">Market Demand</h4>
              <p className="text-sm text-gray-300">Long/short pressure from other traders influences prices</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSection;
