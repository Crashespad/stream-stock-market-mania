
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, User, LogOut, LogIn, UserCog, Info, Menu, BarChart3, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  };

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => setCurrentTab('market')}>StreamStock</h1>
            <nav className="hidden md:flex gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:text-purple-300"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View All Streamers
              </Button>
              {isLoggedIn && (
                <>
                  <Button
                    variant={currentTab === "market" ? "default" : "ghost"}
                    onClick={() => setCurrentTab("market")}
                    className="text-white hover:text-purple-300"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Market
                  </Button>
                  <Button
                    variant={currentTab === "dashboard" ? "default" : "ghost"}
                    onClick={() => setCurrentTab("dashboard")}
                    className="text-white hover:text-purple-300"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={currentTab === "portfolio" ? "default" : "ghost"}
                    onClick={() => setCurrentTab("portfolio")}
                    className="text-white hover:text-purple-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Portfolio
                  </Button>
                  <Button
                    variant={currentTab === "account" ? "default" : "ghost"}
                    onClick={() => setCurrentTab("account")}
                    className="text-white hover:text-purple-300"
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                onClick={() => navigate('/about')}
                className="text-white hover:text-purple-300"
              >
                <Info className="w-4 h-4 mr-2" />
                About
              </Button>
            </nav>
          </div>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <p className="text-gray-300 text-sm">Cash Balance</p>
                <p className="text-white font-bold text-lg">
                  ${balance.toLocaleString()}
                </p>
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-gray-300 text-sm">Portfolio Value</p>
                <p className="text-green-400 font-bold text-lg">
                  ${portfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-gray-300 text-sm">Total Value</p>
                <p className="text-blue-400 font-bold text-lg">
                  ${(balance + portfolioValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
              </div>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-white/10">
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-4">
                <Button 
                  onClick={() => navigate('/about')} 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                >
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Button>
                <Button 
                  onClick={() => navigate('/auth')} 
                  variant="outline" 
                  className="text-white border-white/50 hover:bg-white/10 hover:text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </Button>
              </div>
              
              {/* Mobile Menu */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/80 border-white/20 backdrop-blur-sm">
                    <DropdownMenuItem onClick={() => navigate('/')} className="text-white hover:bg-white/10">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View All Streamers
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/about')} className="text-white hover:bg-white/10">
                      <Info className="w-4 h-4 mr-2" />
                      About
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem onClick={() => navigate('/auth')} className="text-white hover:bg-white/10">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login / Sign Up
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
