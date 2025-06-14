
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Shield } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
        <CardContent className="pt-6">
          <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Real-Time Pricing</h3>
          <p className="text-gray-300">Prices update based on live metrics and trading activity</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
        <CardContent className="pt-6">
          <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Social Trading</h3>
          <p className="text-gray-300">See market sentiment and trading volumes</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
        <CardContent className="pt-6">
          <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Risk-Free Fun</h3>
          <p className="text-gray-300">Trade with virtual currency - no real money at risk</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesSection;
