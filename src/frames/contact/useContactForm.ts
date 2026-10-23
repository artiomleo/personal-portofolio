import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { z } from "zod";
import { DRAFT_EVENT } from "./draft";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Use 100 characters or fewer."),
  email: z.string().trim().email("Enter an email address like name@example.com."),
  message: z.string().trim().min(10, "Write at least 10 characters.").max(5000, "Use 5,000 characters or fewer."),
});

export type ContactValues = z.infer<typeof schema>;
export type ContactField = keyof ContactValues;
export type ContactStatus = "idle" | "sending" | "sent" | "failed";

const EMPTY: ContactValues = { name: "", email: "", message: "" };

export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<ContactStatus>("idle");
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onDraft = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, message: v.message ? `${v.message}\n${text}` : text }));
      setStatus("idle");
      messageRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener(DRAFT_EVENT, onDraft);
    return () => window.removeEventListener(DRAFT_EVENT, onDraft);
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as ContactField;
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Honeypot: people never see the "company" field, bots fill it in.
    if (new FormData(form).get("company")) {
      setStatus("sent");
      return;
    }
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<ContactField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as ContactField;
        next[field] ??= issue.message;
      }
      setErrors(next);
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${import.meta.env.VITE_FORM_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}: ${(await res.text()).slice(0, 500)}`);
      setStatus("sent");
      setValues(EMPTY);
    } catch (err) {
      setStatus("failed");
      reportError(err, parsed.data);
    }
  };

  return { values, errors, status, onChange, submit, messageRef };
}

function reportError(err: unknown, data: ContactValues): void {
  fetch("/.netlify/functions/report-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      error: String(err).slice(0, 1000),
      data: { name: data.name, email: data.email, message: data.message.slice(0, 1500) },
    }),
  }).catch(() => {
    // Reporting is best effort; the visitor already sees the failure message.
  });
}
