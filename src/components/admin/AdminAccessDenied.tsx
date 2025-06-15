
import { ShieldAlert } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminAccessDenied = () => {
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
};
