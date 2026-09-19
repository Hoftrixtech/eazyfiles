import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { APP_NAME } from "@/lib/constants";

const steps = [
  {
    step: "01",
    title: "We read every message",
    body: "Submissions are reviewed as we build out official support channels for launch.",
  },
  {
    step: "02",
    title: "We ask for clarity when needed",
    body: "Account or tool issues are easier to resolve when you include relevant details up front.",
  },
  {
    step: "03",
    title: "We point you to the right place",
    body: "Many answers live in How It Works, tool pages, or the Privacy Policy — we will link you there when it helps.",
  },
  {
    step: "04",
    title: "You stay in control",
    body: "Only share what you are comfortable sending. Uploaded images are not stored via this form.",
  },
] as const;

export function ContactExpectSection() {
  return (
    <section className="section-padding bg-background" aria-labelledby="contact-expect-heading">
      <Container className="max-w-[90rem]">
        <header className="max-w-2xl">
          <EyebrowPill className="w-fit">What to expect</EyebrowPill>
          <h2 id="contact-expect-heading" className="section-heading mt-6 text-foreground">
            After you reach out.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {APP_NAME} is still expanding hands-on support. Here is how we handle contact submissions today.
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
