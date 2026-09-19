import { PageHeroBanner } from "@/components/layout/PageHeroBanner";

export function ToolPageIntro({
  breadcrumb,
  title,
  titleLine2,
  description,
  eyebrow,
}: {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  titleLine2?: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <PageHeroBanner
      breadcrumb={breadcrumb}
      eyebrow={eyebrow ?? "Image tool"}
      title={title}
      titleLine2={titleLine2}
      description={description}
    />
  );
}
