
import { useState } from "react";
import { Header } from "@/components/Header";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactSuccessMessage } from "@/components/contact/ContactSuccessMessage";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Default props for Header component since this is a public page
  const headerProps = {
    balance: 0,
    portfolioValue: 0,
    currentTab: "contact",
    setCurrentTab: () => {},
    isLoggedIn: false,
  };

  const handleSubmissionSuccess = () => {
    setIsSubmitted(true);
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header {...headerProps} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {isSubmitted ? (
            <ContactSuccessMessage onSubmitAnother={handleSubmitAnother} />
          ) : (
            <ContactForm onSubmissionSuccess={handleSubmissionSuccess} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Contact;
