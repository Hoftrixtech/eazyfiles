import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { APP_NAME } from "@/lib/constants";

const faqs = [
  {
    question: "How quickly will I hear back?",
    answer:
      "We review contact submissions and respond when support is available. Response times may vary while we continue to expand official support channels for launch.",
  },
  {
    question: "What should I include for account help?",
    answer:
      "Choose “Account & Sign-In” as the topic. Include the email address you use to sign in, your sign-in method (such as Google), your browser, and any error messages you see.",
  },
  {
    question: "Can I report a problem with an image tool?",
    answer:
      "Yes. Select “Image Tool Support” or “Technical Issue” and tell us which tool you used, the file format, your browser, and the steps that caused the problem. Do not include passwords or sensitive personal information.",
  },
  {
    question: "Is there a public support email?",
    answer:
      `${APP_NAME} does not publish a public support email on this site until one is officially announced. Please use the contact form on this page for now.`,
  },
  {
    question: "How do privacy requests work?",
    answer:
      "Select “Privacy Question,” describe your request, and include the email address associated with your account if relevant. You can also read our Privacy Policy for how we handle information and uploaded files.",
  },
] as const;

export function ContactFaqSection() {
  return (
    <section className="section-padding bg-muted/25" aria-labelledby="contact-faq-heading">
      <Container className="max-w-3xl">
        <header className="text-center lg:text-left">
          <EyebrowPill className="mx-auto w-fit lg:mx-0">FAQ</EyebrowPill>
          <h2 id="contact-faq-heading" className="section-heading mt-6 text-foreground">
            Common Questions.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Quick answers before you send a message.
          </p>
        </header>

        <div className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card lg:mt-12">
          {faqs.map((item) => (
            <details key={item.question} className="group px-5 py-4 sm:px-6">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-2 text-left font-medium transition-colors hover:text-foreground">
                <span>{item.question}</span>
                <span className="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="pb-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
