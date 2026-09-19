import type { Metadata } from "next";
import { ContactExpectSection } from "@/components/contact/ContactExpectSection";
import { ContactFaqSection } from "@/components/contact/ContactFaqSection";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactOtherPathsSection } from "@/components/contact/ContactOtherPathsSection";
import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { CONTACT_PAGE_SEO, createLegalPageMetadata } from "@/lib/legal/seo";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = createLegalPageMetadata({
  path: "/contact",
  title: CONTACT_PAGE_SEO.title,
  description: CONTACT_PAGE_SEO.description,
});

export default function ContactPage() {
  return (
    <main>
      <PageHeroBanner
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
        eyebrow="Contact"
        title="Contact Us"
        description={`Questions about ${APP_NAME}, our image tools, or your account? Send us a message below. We read submissions as we expand support channels for launch.`}
      />
      <ContactFormSection />
      <ContactOtherPathsSection />
      <ContactExpectSection />
      <ContactFaqSection />
    </main>
  );
}
