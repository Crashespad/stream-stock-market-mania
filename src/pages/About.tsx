
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, BarChart3, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            About StreamStock
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The world's first creator economy stock exchange where you can invest in your favorite streamers and content creators like traditional stocks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
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
                    <p className="text-sm text-gray-300">Buy and sell pressure from other investors influences prices</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-6 h-6 text-green-400" />
                How to Participate
              </CardTitle>
              <CardDescription className="text-gray-300">
                Getting started is simple and fun
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
                  <p className="text-sm text-gray-300">Browse our marketplace, check stats, and find creators you believe in</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-2">3. Build Your Portfolio</h4>
                  <p className="text-sm text-gray-300">Buy shares in multiple streamers to diversify your creator portfolio</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-2">4. Track Performance</h4>
                  <p className="text-sm text-gray-300">Monitor your investments and sell when you think it's the right time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Pricing</h3>
              <p className="text-gray-300">Prices update based on live metrics and market activity</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Social Trading</h3>
              <p className="text-gray-300">See what other investors are buying and selling</p>
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

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of other investors who are already building their creator portfolios on StreamStock Exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Get Started Now
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline" 
              size="lg"
              className="border-white/50 text-white hover:bg-white/10"
            >
              Browse Market
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
