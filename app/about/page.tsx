import type { Metadata } from "next";
import { AboutPageBanner } from "@/components/about/AboutPageBanner";
import { AboutCommitmentsSection } from "@/components/about/AboutCommitmentsSection";
import { AboutAudiencesSection } from "@/components/about/AboutAudiencesSection";
import { AboutFilesSection } from "@/components/about/AboutFilesSection";
import { AboutOverviewSection } from "@/components/about/AboutOverviewSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ImageToolsSection } from "@/components/sections/ImageTools";
import { TrustStatement } from "@/components/sections/TrustStatement";
import { ABOUT_PAGE_SEO, createLegalPageMetadata } from "@/lib/legal/seo";

export const metadata: Metadata = createLegalPageMetadata({
  path: "/about",
  title: ABOUT_PAGE_SEO.title,
  description: ABOUT_PAGE_SEO.description,
});

export default function AboutPage() {
  return (
    <main>
      <AboutPageBanner />
      <AboutOverviewSection />
      <ImageToolsSection />
      <HowItWorks />
      <AboutCommitmentsSection />
      <AboutFilesSection />
      <AboutAudiencesSection />
      <TrustStatement />
    </main>
  );
}
