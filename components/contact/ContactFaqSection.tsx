import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { APP_NAME } from "@/lib/constants";

const faqs = [
  {
    question: "How quickly will I hear back?",
    answer:
      "We review contact submissions as we expand support. Email delivery is not live yet, so keep a copy of urgent requests and check back for updates on official support channels.",
  },
  {
    question: "What should I include for account help?",
    answer:
      "Use the email address you sign in with and describe what you tried (browser, sign-in method, and any error messages). That helps us troubleshoot faster.",
  },
  {
    question: "Can I report a problem with an image tool?",
    answer:
      "Yes. Choose “Image tools or technical issue,” note which tool you used, the file format, and what happened. Do not attach sensitive images in the message if you can describe the issue instead.",
  },
  {
    question: "Is there a public support email?",
    answer: `${APP_NAME} does not publish a public support inbox on this site until it is officially announced. Use this form for now.`,
  },
  {
    question: "How do privacy requests work?",
    answer:
      "Select “Privacy or data request” and explain your request. You can also read the Privacy Policy for how we handle information and uploaded files.",
  },
] as const;

export function ContactFaqSection() {
  return (
    <section className="section-padding bg-muted/25" aria-labelledby="contact-faq-heading">
      <Container className="max-w-3xl">
        <header className="text-center lg:text-left">
          <EyebrowPill className="mx-auto w-fit lg:mx-0">FAQ</EyebrowPill>
          <h2 id="contact-faq-heading" className="section-heading mt-6 text-foreground">
            Common questions.
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
