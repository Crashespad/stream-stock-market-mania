
import TradingTypesSection from "@/components/about/TradingTypesSection";
import PricingSection from "@/components/about/PricingSection";
import ParticipationSection from "@/components/about/ParticipationSection";
import StrategiesSection from "@/components/about/StrategiesSection";
import FeaturesSection from "@/components/about/FeaturesSection";
import CallToActionSection from "@/components/about/CallToActionSection";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            About StreamStock
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The world's first creator economy stock exchange where you can invest in your favorite streamers and content creators like traditional stocks - now with long and short trading!
          </p>
        </div>

        {/* Trading Types Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <TradingTypesSection />
          <PricingSection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <ParticipationSection />
          <StrategiesSection />
        </div>

        <div className="mb-16">
          <FeaturesSection />
        </div>

        <CallToActionSection />
      </div>
    </div>
  );
};

export default About;
