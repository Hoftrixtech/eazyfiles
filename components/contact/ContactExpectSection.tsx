import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";

const steps = [
  {
    step: "01",
    title: "We Review Your Message",
    body:
      "Your submission is reviewed so we can understand your question, feedback, or issue and determine the appropriate next step.",
  },
  {
    step: "02",
    title: "We May Need More Details",
    body:
      "For account or tool-related issues, providing relevant details such as the tool, file format, browser, or steps to reproduce can help us understand the problem.",
  },
  {
    step: "03",
    title: "We Point You to the Right Resource",
    body:
      "Some questions may already be covered in our How It Works, tool pages, Privacy Policy, or other EazyFiles resources. We may direct you to the most relevant information.",
  },
  {
    step: "04",
    title: "You Stay in Control",
    body:
      "Only share information that is relevant to your request. Do not include passwords, payment information, or other sensitive personal information in your message.",
  },
] as const;

export function ContactExpectSection() {
  return (
    <section className="section-padding bg-background" aria-labelledby="contact-expect-heading">
      <Container className="max-w-[90rem]">
        <header className="max-w-2xl">
          <EyebrowPill className="w-fit">What to expect</EyebrowPill>
          <h2 id="contact-expect-heading" className="section-heading mt-6 text-foreground">
            After You Reach Out.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We review contact submissions and use the information you provide to understand your request and direct you
            to the right support or information.
          </p>
        </header>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {steps.map((item) => (
            <article key={item.step} className="btn-radius border border-border bg-card/80 p-6 sm:p-7">
              <p className="text-sm font-semibold tracking-wide text-primary">{item.step}</p>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground sm:text-lg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
