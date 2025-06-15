
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
}

export const SubmitButton = ({ isLoading }: SubmitButtonProps) => {
  return (
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
  );
};
