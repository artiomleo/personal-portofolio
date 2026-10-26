import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { profile } from "@/content/profile";
import { FORM_ACTION, HONEYPOT, useContactForm } from "./contact/useContactForm";
import { Frame, FrameTitle } from "./Frame";
import { NewTabNote } from "./ui";

export function Contact({ primary }: { primary: boolean }) {
  const form = useContactForm();
  const describedBy = (field: "name" | "email" | "message") =>
    form.errors[field] ? `contact-${field}-error` : undefined;

  return (
    <Frame id="contact" primary={primary}>
      <header className="frame-head">
        <p className="eyebrow">Contact</p>
        <FrameTitle>Let's talk</FrameTitle>
        <p className="frame-lede">Tell me about the product, the team or the role. Messages go straight to my inbox.</p>
      </header>

      {form.status === "sent" ? (
        <div className="form-done" role="status" tabIndex={-1} ref={form.doneRef}>
          <p className="form-done-title">Message sent</p>
          <p>Thanks for writing. I'll reply to the email address you gave.</p>
        </div>
      ) : (
        <form className="contact-form" ref={form.formRef} method="post" action={FORM_ACTION} onSubmit={form.submit}>
          <Field id="contact-name" label="Name" error={form.errors.name}>
            <input id="contact-name" name="name" type="text" autoComplete="name" required value={form.values.name} onChange={form.onChange} aria-invalid={!!form.errors.name} aria-describedby={describedBy("name")} />
          </Field>
          <Field id="contact-email" label="Email" error={form.errors.email}>
            <input id="contact-email" name="email" type="email" autoComplete="email" required value={form.values.email} onChange={form.onChange} aria-invalid={!!form.errors.email} aria-describedby={describedBy("email")} />
          </Field>
          <Field id="contact-message" label="Message" error={form.errors.message}>
            <textarea id="contact-message" name="message" rows={6} ref={form.messageRef} required value={form.values.message} onChange={form.onChange} aria-invalid={!!form.errors.message} aria-describedby={describedBy("message")} />
          </Field>
          <div className="hp" aria-hidden="true">
            <label htmlFor="contact-gotcha">Leave this field empty</label>
            <input id="contact-gotcha" name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
          </div>
          {form.status === "failed" && (
            <p className="form-error" role="alert">
              Your message didn't send. Try again, or email <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>
          )}
          <button className="btn btn--primary" type="submit" disabled={form.status === "sending"}>
            {form.status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      )}

      <ul className="contact-links" role="list">
        <li>
          <Mail size={16} aria-hidden="true" />
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        <li>
          <Linkedin size={16} aria-hidden="true" />
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <NewTabNote />
          </a>
        </li>
        <li>
          <Github size={16} aria-hidden="true" />
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
            <NewTabNote />
          </a>
        </li>
        <li>
          <MapPin size={16} aria-hidden="true" />
          <span>{profile.location}</span>
        </li>
      </ul>
    </Frame>
  );
}

// #region layer:contact-field
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="field" data-layer="contact-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
// #endregion
