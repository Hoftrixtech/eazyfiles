import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_PAGE_SEO, createLegalPageMetadata } from "@/lib/legal/seo";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = createLegalPageMetadata({
  path: "/contact",
  title: CONTACT_PAGE_SEO.title,
  description: CONTACT_PAGE_SEO.description,
});

export default function ContactPage() {
  return (
    <main className="border-t border-border">
      <Container className="section-padding">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Questions about {`EazyFiles`}, our image tools, or your account? Send us a message using the form. We read
              submissions as we expand support channels for launch.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              For account help, include the email address you use to sign in. We do not publish a public support inbox on
              this site until it is officially announced.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
