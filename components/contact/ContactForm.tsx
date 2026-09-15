"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type FormStatus = "idle" | "submitting" | "success" | "error";

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
    if (!subject.trim()) {
      next.subject = "Enter a subject.";
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

    // No contact API is configured yet; validate locally and confirm receipt.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-border bg-muted/40 p-6" role="status">
        <p className="font-medium text-foreground">Thank you for your message.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We have recorded your submission. Email delivery is not connected yet — please keep a copy if your request is
          urgent. We will use this channel as we finalize support for launch.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const fieldClass =
    "h-11 w-full rounded-sm border border-border bg-card px-3 text-sm transition-colors focus:border-foreground/40 disabled:opacity-60";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {status === "error" ? (
        <p className="rounded-sm border border-destructive/20 bg-destructive-soft px-3 py-2 text-sm text-destructive" role="alert">
          Something went wrong. Please try again.
        </p>
      ) : null}
      <div>
        <label htmlFor="contact-name" className="text-sm font-medium">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          disabled={status === "submitting"}
          onChange={(e) => setName(e.target.value)}
          className={`mt-2 ${fieldClass}`}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name ? (
          <p id="contact-name-error" className="mt-1.5 text-sm text-destructive" role="alert">{errors.name}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="contact-email" className="text-sm font-medium">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          disabled={status === "submitting"}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-2 ${fieldClass}`}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email ? (
          <p id="contact-email-error" className="mt-1.5 text-sm text-destructive" role="alert">{errors.email}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="contact-subject" className="text-sm font-medium">Subject</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={subject}
          disabled={status === "submitting"}
          onChange={(e) => setSubject(e.target.value)}
          className={`mt-2 ${fieldClass}`}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        />
        {errors.subject ? (
          <p id="contact-subject-error" className="mt-1.5 text-sm text-destructive" role="alert">{errors.subject}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm font-medium">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={message}
          disabled={status === "submitting"}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 min-h-[120px] w-full resize-y rounded-sm border border-border bg-card px-3 py-2 text-sm disabled:opacity-60"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-1.5 text-sm text-destructive" role="alert">{errors.message}</p>
        ) : null}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
