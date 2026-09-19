import type { Metadata } from "next";
import { HowItWorksChooseToolsSection } from "@/components/how-it-works/HowItWorksChooseToolsSection";
import { HowItWorksSupportedFormatsSection } from "@/components/how-it-works/HowItWorksSupportedFormatsSection";
import { HowItWorksAccountAccessSection } from "@/components/how-it-works/HowItWorksAccountAccessSection";
import { HowItWorksTargetCompressionSection } from "@/components/how-it-works/HowItWorksTargetCompressionSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { HOW_IT_WORKS_PAGE_SEO, createLegalPageMetadata } from "@/lib/legal/seo";

export const metadata: Metadata = createLegalPageMetadata({
  path: "/how-it-works",
  title: HOW_IT_WORKS_PAGE_SEO.title,
  description: HOW_IT_WORKS_PAGE_SEO.description,
});

export default function HowItWorksPage() {
  return (
    <main>
      <PageHeroBanner
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "How It Works" },
        ]}
        eyebrow="How it works"
        title="How EazyFiles Works"
        description="Learn how EazyFiles online image tools work. Upload your image, choose the settings you need, and download the processed result with a simple, straightforward workflow."
        cta={{ href: "/tools?category=image-tools", label: "Explore Image Tools →" }}
      />
      <HowItWorks id="how-it-works-page" />
      <HowItWorksChooseToolsSection />
      <HowItWorksSupportedFormatsSection />
      <HowItWorksTargetCompressionSection />
      <HowItWorksAccountAccessSection />
    </main>
  );
}
