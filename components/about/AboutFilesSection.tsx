import Link from "next/link";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { Container } from "@/components/ui/Container";
import { APP_NAME } from "@/lib/constants";
import { brandCtaClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";

export function AboutFilesSection() {
  return (
    <section className="section-padding bg-background">
      <Container className="max-w-[90rem]">
        <div className="max-w-4xl">
          <EyebrowPill className="w-fit">Your files</EyebrowPill>

          <h2 className="section-heading mt-6 max-w-5xl text-balance text-foreground">
            How {APP_NAME} Handles Your Uploaded Files
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            When you use an {APP_NAME} image tool, your uploaded image is processed for the task you select. Uploaded
            images are processed temporarily and removed after processing. Image files are not stored in the database.
          </p>

          <Link
            href="/privacy"
            className={cn(brandCtaClass, "mt-8 h-12 px-7 text-sm sm:inline-flex")}
          >
            Read Our Privacy Policy →
          </Link>
        </div>
      </Container>
    </section>
  );
}
