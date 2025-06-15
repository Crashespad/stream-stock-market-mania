
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ApiKeysManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfigs, setApiConfigs] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const services = [
    { id: 'youtube', name: 'YouTube', fields: ['client_id', 'client_secret'] },
    { id: 'twitch', name: 'Twitch', fields: ['client_id', 'client_secret'] }
  ];

  useEffect(() => {
    fetchApiConfigs();
  }, []);

  const fetchApiConfigs = async () => {
    setIsLoading(true);
    try {
      for (const service of services) {
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
        description: `${services.find(s => s.id === serviceId)?.name} API configuration saved successfully.`,
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
      <Card>
        <CardHeader>
          <CardTitle className="text-white">API Keys Management</CardTitle>
          <CardDescription className="text-blue-200">
            Manage API keys for external services. These keys are securely stored and used for data synchronization.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue={services[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {services.map(service => (
            <TabsTrigger key={service.id} value={service.id}>
              {service.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {services.map(service => (
          <TabsContent key={service.id} value={service.id}>
            <ServiceConfigForm
              service={service}
              config={apiConfigs[service.id] || {}}
              onSave={(config) => handleSaveConfig(service.id, config)}
              isLoading={isLoading}
              showSecrets={showSecrets}
              onToggleSecret={toggleShowSecret}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface ServiceConfigFormProps {
  service: { id: string; name: string; fields: string[] };
  config: Record<string, string>;
  onSave: (config: Record<string, string>) => void;
  isLoading: boolean;
  showSecrets: Record<string, boolean>;
  onToggleSecret: (serviceId: string, field: string) => void;
}

const ServiceConfigForm = ({ 
  service, 
  config, 
  onSave, 
  isLoading, 
  showSecrets, 
  onToggleSecret 
}: ServiceConfigFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.name} API Configuration</CardTitle>
        <CardDescription>
          Configure {service.name} API credentials for data synchronization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {service.fields.map(field => {
            const isSecret = field.includes('secret');
            const showKey = `${service.id}-${field}`;
            const shouldShow = showSecrets[showKey];

            return (
              <div key={field} className="space-y-2">
                <Label htmlFor={`${service.id}-${field}`} className="capitalize">
                  {field.replace('_', ' ')}
                </Label>
                <div className="relative">
                  <Input
                    id={`${service.id}-${field}`}
                    type={isSecret && !shouldShow ? "password" : "text"}
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={`Enter ${field.replace('_', ' ')}`}
                    className="pr-10"
                  />
                  {isSecret && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => onToggleSecret(service.id, field)}
                    >
                      {shouldShow ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
