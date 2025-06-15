
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { ServiceConfigFormProps } from "./types";

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
