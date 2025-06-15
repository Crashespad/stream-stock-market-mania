
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SecretToggleButton } from "./SecretToggleButton";

interface FormFieldProps {
  serviceId: string;
  field: string;
  value: string;
  onChange: (field: string, value: string) => void;
  showSecrets: Record<string, boolean>;
  onToggleSecret: (serviceId: string, field: string) => void;
}

export const FormField = ({
  serviceId,
  field,
  value,
  onChange,
  showSecrets,
  onToggleSecret,
}: FormFieldProps) => {
  const isSecret = field.includes('secret');
  const showKey = `${serviceId}-${field}`;
  const shouldShow = showSecrets[showKey];

  return (
    <div className="space-y-2">
      <Label htmlFor={`${serviceId}-${field}`} className="capitalize">
        {field.replace('_', ' ')}
      </Label>
      <div className="relative">
        <Input
          id={`${serviceId}-${field}`}
          type={isSecret && !shouldShow ? "password" : "text"}
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={`Enter ${field.replace('_', ' ')}`}
          className="pr-10"
        />
        {isSecret && (
          <SecretToggleButton
            shouldShow={shouldShow}
            onToggle={() => onToggleSecret(serviceId, field)}
          />
        )}
      </div>
    </div>
  );
};
