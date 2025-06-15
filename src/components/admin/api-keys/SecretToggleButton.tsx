
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface SecretToggleButtonProps {
  shouldShow: boolean;
  onToggle: () => void;
}

export const SecretToggleButton = ({ shouldShow, onToggle }: SecretToggleButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3"
      onClick={onToggle}
    >
      {shouldShow ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </Button>
  );
};
