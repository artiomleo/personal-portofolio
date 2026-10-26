import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { DRAFT_EVENT } from "./draft";
import type { ContactValues } from "./schema";

export type { ContactValues };
export type ContactField = keyof ContactValues;
export type ContactStatus = "idle" | "sending" | "sent" | "failed";

/** Honeypot field name. Formspree discards it; bots fill it in, people never see it. */
export const HONEYPOT = "_gotcha";
export const FORM_ACTION = `https://formspree.io/f/${import.meta.env.VITE_FORM_ID}`;

const EMPTY: ContactValues = { name: "", email: "", message: "" };

export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [focusRequest, setFocusRequest] = useState(0);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // A cursor-chat draft lands in the message field. Focus waits for the field to exist.
  useEffect(() => {
    const onDraft = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, message: v.message ? `${v.message}\n${text}` : text }));
      setErrors((current) => ({ ...current, message: undefined }));
      setStatus((s) => (s === "sending" ? s : "idle"));
      setFocusRequest((n) => n + 1);
    };
    window.addEventListener(DRAFT_EVENT, onDraft);
    return () => window.removeEventListener(DRAFT_EVENT, onDraft);
  }, []);

  useEffect(() => {
    if (focusRequest) messageRef.current?.focus({ preventScroll: true });
  }, [focusRequest]);

  // Move focus to the confirmation so it's announced and keyboard users aren't dropped on <body>.
  useEffect(() => {
    if (status === "sent") doneRef.current?.focus({ preventScroll: true });
  }, [status]);

  // Native validation stays on for visitors without JavaScript; with JavaScript the zod messages take over.
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, [status]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as ContactField;
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    if (new FormData(form).get(HONEYPOT)) {
      setStatus("sent");
      return;
    }
    // zod loads on the first submit, keeping it out of the main bundle.
    const { contactSchema } = await import("./schema");
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<ContactField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as ContactField;
        next[field] ??= issue.message;
      }
      // Render the errors before moving focus, so screen readers read the field together with its error.
      flushSync(() => setErrors(next));
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch(FORM_ACTION, {
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

  return { values, errors, status, onChange, submit, messageRef, doneRef, formRef };
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
