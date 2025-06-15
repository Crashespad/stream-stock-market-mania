
export interface ServiceConfig {
  id: string;
  name: string;
  fields: string[];
}

export interface ServiceConfigFormProps {
  service: ServiceConfig;
  config: Record<string, string>;
  onSave: (config: Record<string, string>) => void;
  isLoading: boolean;
  showSecrets: Record<string, boolean>;
  onToggleSecret: (serviceId: string, field: string) => void;
}
