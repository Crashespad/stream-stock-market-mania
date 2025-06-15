
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { Loader2, Shield, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { ApiKeysManagement } from "@/components/admin/ApiKeysManagement";
import { StreamersManagement } from "@/components/admin/StreamersManagement";
import { UserRolesManagement } from "@/components/admin/UserRolesManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { AdminLogs } from "@/components/admin/AdminLogs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setIsSessionLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session?.user?.id) {
      checkUserRole();
    }
  }, [session]);

  const checkUserRole = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin panel.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      if (!data) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setUserRole(data.role);
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/');
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

  if (!session) {
    navigate('/auth');
    return null;
  }

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "api-keys":
        if (userRole === 'admin' || userRole === 'mod') {
          return <ApiKeysManagement />;
        }
        return <div>Access denied</div>;
      case "streamers":
        return <StreamersManagement userRole={userRole} />;
      case "user-roles":
        if (userRole === 'admin') {
          return <UserRolesManagement />;
        }
        return <div>Access denied</div>;
      case "user-management":
        if (userRole === 'admin') {
          return <UserManagement />;
        }
        return <div>Access denied</div>;
      case "logs":
        if (userRole === 'admin') {
          return <AdminLogs />;
        }
        return <div>Access denied</div>;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Your Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold capitalize">{userRole}</p>
                <p className="text-sm text-muted-foreground">Current access level</p>
              </CardContent>
            </Card>

            {(userRole === 'admin' || userRole === 'mod') && (
              <Card>
                <CardHeader>
                  <CardTitle>API Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage API keys for external services like YouTube and Twitch.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Streamer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {userRole === 'streamer' 
                    ? 'Manage your streamer profile and settings.'
                    : 'Manage all streamers on the platform.'
                  }
                </p>
              </CardContent>
            </Card>

            {userRole === 'admin' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Manage user accounts, adjust balances, and handle suspensions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Role Assignment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Assign and manage user roles across the platform.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-blue-200">
            Welcome to the admin panel. Your role: <span className="font-semibold capitalize">{userRole}</span>
          </p>
        </div>

        <AdminNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userRole={userRole} 
        />

        <div className="mt-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
