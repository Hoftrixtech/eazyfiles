import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { formatBytes } from "@/lib/utils";

const COMPRESSOR_HEADER = {
  eyebrow: "Free online image compressor",
  title: "Compress Images Online to Reduce File Size",
  description:
    "Compress JPG, PNG, and WebP images online to reduce file size. Choose a target size such as 50 KB, 100 KB, 200 KB, 500 KB, or 1 MB, or enter a custom target size.",
} as const;

/** Reserved space for deferred home compressor load — matches ImageCompressor layout to avoid CLS. */
export function ImageCompressorSkeleton({ id = "compressor" }: { id?: string }) {
  return (
    <section
      id={id}
      className="section-padding section-surface scroll-mt-24 bg-background"
      aria-labelledby={`${id}-title`}
      aria-busy="true"
    >
      <Container className="max-w-5xl">
        <SectionHeader {...COMPRESSOR_HEADER} />

        <Card className="glass-panel mt-10 overflow-hidden p-0 sm:p-0">
          <div className="grid gap-0 lg:grid-cols-2 lg:gap-0">
            <div className="border-border p-5 sm:p-8 lg:border-r lg:p-10">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">1. Upload</p>
              <p className="mt-1 text-sm text-muted-foreground">
                JPG, PNG or WebP · Up to {formatBytes(MAX_UPLOAD_BYTES)} each
              </p>
              <div
                className="mt-6 min-h-52 rounded-xl border-2 border-dashed border-border bg-muted/50 motion-safe:animate-pulse"
                aria-hidden="true"
              />
            </div>

            <div className="bg-muted/25 p-5 sm:p-8 lg:p-10">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">2. Settings</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a target file size and output format for your compressed image.
              </p>
              <div className="mt-6 space-y-8" aria-hidden="true">
                <div className="space-y-3">
                  <div className="h-5 w-36 rounded bg-muted motion-safe:animate-pulse" />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="h-11 rounded-md bg-muted motion-safe:animate-pulse" />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-5 w-32 rounded bg-muted motion-safe:animate-pulse" />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-10 rounded-md bg-muted motion-safe:animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border p-5 sm:p-8 lg:px-10 lg:pb-10">
            <div className="h-12 w-full rounded-full bg-muted motion-safe:animate-pulse" aria-hidden="true" />
            <p className="sr-only">Loading image compressor…</p>
          </div>
        </Card>
      </Container>
    </section>
  );
}
