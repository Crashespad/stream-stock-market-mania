
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactSuccessMessageProps {
  onSubmitAnother: () => void;
}

export const ContactSuccessMessage = ({ onSubmitAnother }: ContactSuccessMessageProps) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-green-600">Thank You!</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          Your submission has been received successfully. We appreciate your feedback and will review it carefully.
        </p>
        <Button onClick={onSubmitAnother} variant="outline">
          Submit Another Message
        </Button>
      </CardContent>
    </Card>
  );
};
