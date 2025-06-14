
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const ParticipationSection = () => {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="w-6 h-6 text-green-400" />
          How to Participate
        </CardTitle>
        <CardDescription className="text-gray-300">
          Getting started with creator trading
        </CardDescription>
      </CardHeader>
      <CardContent className="text-gray-200 space-y-4">
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">1. Create Your Account</h4>
            <p className="text-sm text-gray-300">Sign up and receive $200,000 in virtual currency to start trading</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">2. Research Streamers</h4>
            <p className="text-sm text-gray-300">Browse our marketplace, check stats, and analyze creator trends</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">3. Choose Your Strategy</h4>
            <p className="text-sm text-gray-300">Go long on rising stars or short declining creators</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">4. Track Performance</h4>
            <p className="text-sm text-gray-300">Monitor your positions and close them when profitable</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipationSection;
