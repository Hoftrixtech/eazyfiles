import type { Metadata } from "next";
import { ImageCompressor } from "@/components/compressor/ImageCompressor";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ImageToolsSection } from "@/components/sections/ImageTools";
import { TrustStatement } from "@/components/sections/TrustStatement";
import { WhyUseThisTool } from "@/components/sections/WhyUseThisTool";
import { HOME_PAGE_SEO, createPageMetadata } from "@/lib/seo";
import { organizationJsonLd, webApplicationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { getToolBySlug } from "@/lib/tools";

function requireCompressor() {
  const tool = getToolBySlug("image-compressor");
  if (!tool) {
    throw new Error("The Image Compressor tool is missing from the catalog.");
  }
  return tool;
}

const compressor = requireCompressor();

export const metadata: Metadata = createPageMetadata({
  title: HOME_PAGE_SEO.title,
  description: HOME_PAGE_SEO.description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <main>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd(), webApplicationJsonLd(compressor)]} />
      <Hero />
      <ImageCompressor />
      <ImageToolsSection />
      <HowItWorks />
      <WhyUseThisTool />
      <TrustStatement />
      <FAQ />
      <FinalCta />
    </main>
  );
}
