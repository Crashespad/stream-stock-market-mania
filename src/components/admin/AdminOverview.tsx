
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminOverviewProps {
  userRole: string;
}

export const AdminOverview = ({ userRole }: AdminOverviewProps) => {
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
};
