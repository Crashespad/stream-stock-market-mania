
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Key, 
  Users, 
  TrendingUp, 
  FileText,
  Home
} from "lucide-react";

interface AdminNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
}

export const AdminNavigation = ({ activeTab, setActiveTab, userRole }: AdminNavigationProps) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: Home, allowedRoles: ["admin", "mod", "streamer"] },
    { id: "api-keys", label: "API Keys", icon: Key, allowedRoles: ["admin", "mod"] },
    { id: "streamers", label: "Streamers", icon: TrendingUp, allowedRoles: ["admin", "mod", "streamer"] },
    { id: "users", label: "User Roles", icon: Users, allowedRoles: ["admin"] },
    { id: "logs", label: "Admin Logs", icon: FileText, allowedRoles: ["admin"] },
  ];

  const availableTabs = tabs.filter(tab => tab.allowedRoles.includes(userRole));

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
      {availableTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 ${
              activeTab === tab.id 
                ? "bg-white text-purple-900" 
                : "text-white hover:bg-white/20"
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};
