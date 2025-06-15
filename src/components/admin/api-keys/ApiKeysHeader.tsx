
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ApiKeysHeader = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">API Keys Management</CardTitle>
        <CardDescription className="text-blue-200">
          Manage API keys for external services. These keys are securely stored and used for data synchronization.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
