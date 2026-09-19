import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { Container } from "@/components/ui/Container";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const commitments = [
  {
    title: "Simple Tools First",
    body:
      "Each tool focuses on a specific file task with clear controls and a straightforward workflow, so you can complete common tasks without unnecessary complexity.",
  },
  {
    title: "Works in Your Browser",
    body:
      "Use EazyFiles directly from your web browser. Upload your file, choose the options you need, process it, and download the result.",
  },
  {
    title: "Free to Get Started",
    body:
      "Start with the Image Compressor without creating an account. Anonymous users can complete up to five successful compressions before signing in is required.",
  },
  {
    title: "Privacy-Focused Processing",
    body:
      "Uploaded image files are processed temporarily and removed after processing. Image files are not stored in the database.",
  },
  {
    title: "Clear Usage Limits",
    body:
      "EazyFiles clearly shows applicable usage limits and tool availability, so you can understand how the service works before processing your files.",
  },
  {
    title: "Built to Grow",
    body:
      "EazyFiles currently offers image compression, resizing, cropping, and conversion tools, with additional PDF and file utilities planned for the future.",
  },
] as const;

function cellBorderClass(index: number) {
  return cn(
    "p-8 sm:p-10 lg:p-10 xl:p-12",
    index !== commitments.length - 1 && "max-lg:border-b border-border",
    index % 3 !== 2 && "lg:border-r border-border",
    index < 3 && "lg:border-b border-border"
  );
}

export function AboutCommitmentsSection() {
  return (
    <section className="section-padding bg-background">
      <Container className="max-w-[90rem]">
        <header className="max-w-4xl">
          <EyebrowPill className="w-fit">Why {APP_NAME}</EyebrowPill>
          <h2 className="section-heading mt-6 max-w-5xl text-balance text-foreground">
            Six Reasons to Choose {APP_NAME}.
          </h2>
        </header>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]">
          <div className="grid lg:grid-cols-3">
            {commitments.map((item, index) => (
              <article key={item.title} className={cellBorderClass(index)}>
                <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
