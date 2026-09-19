import { AboutAudiencesSection } from "@/components/about/AboutAudiencesSection";
import { HowItWorksSupportedFormatsSection } from "@/components/how-it-works/HowItWorksSupportedFormatsSection";
import { FAQ } from "@/components/sections/FAQ";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyUseThisTool } from "@/components/sections/WhyUseThisTool";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { Container } from "@/components/ui/Container";

export function ToolPageMarketingSections({
  toolSlug,
  faqId,
}: {
  toolSlug: string;
  faqId: string;
}) {
  return (
    <>
      <HowItWorks toolSlug={toolSlug} />
      <WhyUseThisTool toolSlug={toolSlug} />
      <HowItWorksSupportedFormatsSection toolSlug={toolSlug} />
      <AboutAudiencesSection toolSlug={toolSlug} />
      <Container className="section-padding" data-section-follow>
        <RelatedTools slug={toolSlug} />
      </Container>
      <FAQ id={faqId} toolSlug={toolSlug} />
    </>
  );
}
