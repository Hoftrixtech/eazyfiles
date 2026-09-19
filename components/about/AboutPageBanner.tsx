import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export function AboutPageBanner() {
  return (
    <PageHeroBanner
      id="about-hero-title"
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "About" },
      ]}
      eyebrow={`About ${APP_NAME}`}
      title="Making Everyday File Tasks Easier."
      tagline={APP_TAGLINE}
      description={`${APP_NAME} is an online file tools platform built to make common image tasks simpler. Compress, resize, crop, and convert JPG, PNG, and WebP images with straightforward tools designed for everyday digital work.`}
      titleClassName="lg:whitespace-nowrap"
      cta={{ href: "/tools?category=image-tools", label: "Explore Image Tools →" }}
    />
  );
}
