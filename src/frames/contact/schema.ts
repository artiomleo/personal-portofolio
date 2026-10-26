import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Use 100 characters or fewer."),
  email: z.string().trim().max(254, "Use 254 characters or fewer.").email("Enter an email address like name@example.com."),
  message: z.string().trim().min(10, "Write at least 10 characters.").max(5000, "Use 5,000 characters or fewer."),
});

export type ContactValues = z.infer<typeof contactSchema>;
