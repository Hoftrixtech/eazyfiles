"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { brandCtaClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";

const SUBJECT_OPTIONS = [
  { value: "", label: "Choose one to help us route your message" },
  { value: "general", label: "General question" },
  { value: "account", label: "Account or sign-in help" },
  { value: "tools", label: "Image tools or technical issue" },
  { value: "privacy", label: "Privacy or data request" },
  { value: "feedback", label: "Feedback or suggestion" },
] as const;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type FormStatus = "idle" | "submitting" | "success" | "error";

const labelClass = "text-xs font-semibold tracking-[0.14em] text-foreground uppercase";
const fieldClass =
  "btn-radius mt-2 h-11 w-full border border-border bg-background px-3 text-sm transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:opacity-60";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) {
      next.name = "Enter your name.";
    }
    if (!email.trim()) {
      next.email = "Enter your email.";
    } else if (!isValidEmail(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!subject) {
      next.subject = "Choose what your message is about.";
    }
    if (!message.trim()) {
      next.message = "Enter a message.";
    } else if (message.trim().length < 10) {
      next.message = "Message should be at least 10 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setStatus("submitting");
    setErrors({});

    await new Promise((resolve) => setTimeout(resolve, 400));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="btn-radius border border-border bg-muted/40 p-6 sm:p-8" role="status">
        <p className="text-lg font-semibold text-foreground">Thank you for your message.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We have recorded your submission. Email delivery is not connected yet — please keep a copy if your request is
          urgent. We will use this channel as we finalize support for launch.
        </p>
        <button
          type="button"
          className="btn-radius mt-6 inline-flex h-11 items-center justify-center border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-muted"
          onClick={() => {
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            setStatus("idle");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {status === "error" ? (
        <p
          className="btn-radius border border-destructive/20 bg-destructive-soft px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          Something went wrong. Please try again.
        </p>
      ) : null}

      <div>
        <label htmlFor="contact-subject" className={labelClass}>What&apos;s this about?</label>
        <select
          id="contact-subject"
          name="subject"
          value={subject}
          disabled={status === "submitting"}
          onChange={(e) => setSubject(e.target.value)}
          className={cn(fieldClass, "appearance-none")}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        >
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option.value || "placeholder"} value={option.value} disabled={option.value === ""}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.subject ? (
          <p id="contact-subject-error" className="mt-1.5 text-sm text-destructive" role="alert">{errors.subject}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-name" className={labelClass}>Your name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          disabled={status === "submitting"}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name ? (
          <p id="contact-name-error" className="mt-1.5 text-sm text-destructive" role="alert">{errors.name}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          disabled={status === "submitting"}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email ? (
          <p id="contact-email-error" className="mt-1.5 text-sm text-destructive" role="alert">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>Your message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Share enough detail for us to help — one short paragraph is fine."
          value={message}
          disabled={status === "submitting"}
          onChange={(e) => setMessage(e.target.value)}
          className="btn-radius mt-2 min-h-[140px] w-full resize-y border border-border bg-background px-3 py-2.5 text-sm transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-1.5 text-sm text-destructive" role="alert">{errors.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className={cn(brandCtaClass, "h-12 w-full text-sm disabled:opacity-60")}
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        By sending this form, you agree that we may use your details to respond. See our{" "}
        <Link href="/privacy" className="text-foreground underline-offset-4 hover:underline">Privacy Policy</Link>.
      </p>
    </form>
  );
}
