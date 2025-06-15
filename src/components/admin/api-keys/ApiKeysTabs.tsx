
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceConfigForm } from "./ServiceConfigForm";
import { ServiceConfig } from "./types";

interface ApiKeysTabsProps {
  services: ServiceConfig[];
  apiConfigs: Record<string, any>;
  onSaveConfig: (serviceId: string, config: Record<string, string>) => void;
  isLoading: boolean;
  showSecrets: Record<string, boolean>;
  onToggleSecret: (serviceId: string, field: string) => void;
}

export const ApiKeysTabs = ({
  services,
  apiConfigs,
  onSaveConfig,
  isLoading,
  showSecrets,
  onToggleSecret,
}: ApiKeysTabsProps) => {
  return (
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
            onSave={(config) => onSaveConfig(service.id, config)}
            isLoading={isLoading}
            showSecrets={showSecrets}
            onToggleSecret={onToggleSecret}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
