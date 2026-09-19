import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { brandCtaClass } from "@/lib/brand-styles";
import { cn } from "@/lib/utils";

function SampleImagePreview({ variant }: { variant: "before" | "after" }) {
  return (
    <div
      className={cn(
        "aspect-[5/4] w-full overflow-hidden rounded-xl border border-border/60 shadow-sm",
        variant === "before"
          ? "bg-gradient-to-br from-sky-300 via-teal-400 to-slate-700"
          : "bg-gradient-to-br from-sky-200 via-teal-300 to-slate-600"
      )}
      aria-hidden="true"
    >
      <div className="flex h-full flex-col justify-end bg-gradient-to-t from-black/35 to-transparent p-3">
        <div className="h-8 w-3/5 rounded-full bg-white/25 blur-[1px]" />
      </div>
    </div>
  );
}

export function HowItWorksTargetCompressionSection() {
  return (
    <section className="section-padding bg-background" aria-labelledby="how-it-works-target-compression-heading">
      <Container className="max-w-[90rem]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div
            className="btn-radius border border-primary/10 bg-primary/[0.06] p-6 sm:p-8 lg:p-10"
            aria-hidden="true"
          >
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
              <div className="min-w-0 text-center">
                <SampleImagePreview variant="before" />
                <p className="mt-3 text-sm font-semibold text-foreground">3.5 MB</p>
                <p className="text-xs text-muted-foreground">Before</p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-primary sm:size-6" strokeWidth={2} />
              <div className="min-w-0 text-center">
                <SampleImagePreview variant="after" />
                <p className="mt-3 text-sm font-semibold text-foreground">200 KB</p>
                <p className="text-xs text-muted-foreground">After</p>
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <EyebrowPill className="w-fit">Target size compression</EyebrowPill>
            <h2
              id="how-it-works-target-compression-heading"
              className="section-heading mt-6 text-balance text-foreground"
            >
              Compress Images to a Target File Size.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              With the EazyFiles Image Compressor, choose a target size such as 50 KB, 100 KB, 200 KB, 500 KB, or 1 MB,
              or enter your own custom target size.
            </p>

            <div className="mt-6 flex gap-3 rounded-xl border border-primary/15 bg-primary/[0.08] p-4 sm:p-5">
              <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                The compressor aims to produce an image at or below the selected target size. The final file size can vary
                depending on the original image and selected output format.
              </p>
            </div>

            <Link href="/tools/image-compressor" className={cn(brandCtaClass, "mt-8 h-12 px-7")}>
              Try Image Compressor →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
