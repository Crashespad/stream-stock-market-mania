
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ApiKeysHeader } from "./api-keys/ApiKeysHeader";
import { ApiKeysTabs } from "./api-keys/ApiKeysTabs";
import { API_SERVICES } from "./api-keys/constants";

export const ApiKeysManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfigs, setApiConfigs] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchApiConfigs();
  }, []);

  const fetchApiConfigs = async () => {
    setIsLoading(true);
    try {
      for (const service of API_SERVICES) {
        const { data, error } = await supabase.functions.invoke('manage-api-keys', {
          body: { method: 'GET', service: service.id }
        });

        if (!error && data) {
          setApiConfigs(prev => ({
            ...prev,
            [service.id]: data
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching API configs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch API configurations.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async (serviceId: string, config: Record<string, string>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-keys', {
        body: {
          service: serviceId,
          ...config
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `${API_SERVICES.find(s => s.id === serviceId)?.name} API configuration saved successfully.`,
      });

      await fetchApiConfigs();
    } catch (error) {
      console.error('Error saving API config:', error);
      toast({
        title: 'Error',
        description: 'Failed to save API configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowSecret = (serviceId: string, field: string) => {
    const key = `${serviceId}-${field}`;
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading && Object.keys(apiConfigs).length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApiKeysHeader />
      
      <ApiKeysTabs
        services={API_SERVICES}
        apiConfigs={apiConfigs}
        onSaveConfig={handleSaveConfig}
        isLoading={isLoading}
        showSecrets={showSecrets}
        onToggleSecret={toggleShowSecret}
      />
    </div>
  );
};
