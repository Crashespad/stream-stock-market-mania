
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Trading?</h2>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        Join thousands of other traders who are already building their creator portfolios with long and short strategies on StreamStock Exchange.
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
  );
};

export default CallToActionSection;
