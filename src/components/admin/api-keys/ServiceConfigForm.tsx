
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceConfigFormProps } from "./types";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";

export const ServiceConfigForm = ({ 
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
          {service.fields.map(field => (
            <FormField
              key={field}
              serviceId={service.id}
              field={field}
              value={formData[field]}
              onChange={handleInputChange}
              showSecrets={showSecrets}
              onToggleSecret={onToggleSecret}
            />
          ))}

          <SubmitButton isLoading={isLoading} />
        </form>
      </CardContent>
    </Card>
  );
};
