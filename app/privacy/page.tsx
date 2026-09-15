import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";
import { PRIVACY_PAGE_SEO, createLegalPageMetadata } from "@/lib/legal/seo";

export const metadata: Metadata = createLegalPageMetadata({
  path: "/privacy",
  title: PRIVACY_PAGE_SEO.title,
  description: PRIVACY_PAGE_SEO.description,
});

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      intro="How EazyFiles handles information when you use our website and image tools."
    >
      <PrivacyPolicyContent />
    </LegalPageLayout>
  );
}
