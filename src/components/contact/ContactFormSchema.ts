
import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  submission_type: z.enum(["feature_suggestion", "bug_report", "general_feedback", "support_request"]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type FormData = z.infer<typeof formSchema>;

export const submissionTypeOptions = [
  { value: "feature_suggestion", label: "Feature Suggestion" },
  { value: "bug_report", label: "Bug Report" },
  { value: "general_feedback", label: "General Feedback" },
  { value: "support_request", label: "Support Request" },
];
