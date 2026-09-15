import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { TermsContent } from "@/components/legal/TermsContent";
import { TERMS_PAGE_SEO, createLegalPageMetadata } from "@/lib/legal/seo";

export const metadata: Metadata = createLegalPageMetadata({
  path: "/terms",
  title: TERMS_PAGE_SEO.title,
  description: TERMS_PAGE_SEO.description,
});

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      intro="Terms that govern your use of the EazyFiles website and online tools."
    >
      <TermsContent />
    </LegalPageLayout>
  );
}
