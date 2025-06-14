
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  balance: number;
  portfolioValue: number;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isLoggedIn: boolean;
}

export const Header = ({ balance, portfolioValue, currentTab, setCurrentTab, isLoggedIn }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white">StreamStock</h1>
            {isLoggedIn && (
              <nav className="flex gap-4">
                <Button
                  variant={currentTab === "market" ? "default" : "ghost"}
                  onClick={() => setCurrentTab("market")}
                  className="text-white hover:text-purple-300"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Market
                </Button>
                <Button
                  variant={currentTab === "portfolio" ? "default" : "ghost"}
                  onClick={() => setCurrentTab("portfolio")}
                  className="text-white hover:text-purple-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </nav>
            )}
          </div>
          
          {isLoggedIn && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-gray-300 text-sm">Cash Balance</p>
                <p className="text-white font-bold text-lg">
                  ${balance.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">Portfolio Value</p>
                <p className="text-green-400 font-bold text-lg">
                  ${portfolioValue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">Total Value</p>
                <p className="text-blue-400 font-bold text-lg">
                  ${(balance + portfolioValue).toLocaleString()}
                </p>
              </div>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
