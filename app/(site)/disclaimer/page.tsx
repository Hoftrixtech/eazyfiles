import type { Metadata } from "next";
import { DisclaimerContent } from "@/components/legal/DisclaimerContent";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { DISCLAIMER_PAGE_SEO, createLegalPageMetadata } from "@/lib/legal/seo";

export const metadata: Metadata = createLegalPageMetadata({
  path: "/disclaimer",
  title: DISCLAIMER_PAGE_SEO.title,
  description: DISCLAIMER_PAGE_SEO.description,
});

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Disclaimer"
      intro="Important limitations and responsibilities when using EazyFiles online utility tools."
    >
      <DisclaimerContent />
    </LegalPageLayout>
  );
}
