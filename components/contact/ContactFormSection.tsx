import { Check } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { APP_NAME } from "@/lib/constants";

const highlights = [
  "We review messages and respond when support is available.",
  "Include your sign-in email for account-related requests.",
  "For tool issues, mention the file format, browser, and steps that caused the problem.",
  "Please do not include passwords or sensitive personal information in your message.",
] as const;

export function ContactFormSection() {
  return (
    <section className="section-padding bg-background" aria-labelledby="contact-form-heading">
      <Container className="max-w-[90rem]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-16 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,32rem)]">
          <header className="max-w-xl">
            <EyebrowPill className="w-fit">Start a conversation</EyebrowPill>
            <h2 id="contact-form-heading" className="section-heading mt-6 text-balance text-foreground">
              Tell us what you need.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Use the form to contact {APP_NAME} about our image tools, your account, privacy questions, technical
              issues, or general feedback. Choose a topic and provide a few details so we can better understand your
              request.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary"
                    aria-hidden="true"
                  >
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </header>

          <div
            className="btn-radius border border-border bg-card p-6 shadow-[var(--shadow-elevated)] sm:p-8 lg:sticky lg:top-24"
          >
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
