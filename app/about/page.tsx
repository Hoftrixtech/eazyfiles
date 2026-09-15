import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { ABOUT_PAGE_SEO, createLegalPageMetadata } from "@/lib/legal/seo";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = createLegalPageMetadata({
  path: "/about",
  title: ABOUT_PAGE_SEO.title,
  description: ABOUT_PAGE_SEO.description,
});

export default function AboutPage() {
  return (
    <main className="border-t border-border">
      <section className="border-b border-border bg-card">
        <Container className="max-w-3xl py-16 sm:py-20">
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">{APP_NAME}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Making Everyday File Tasks Easier.</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{APP_TAGLINE}</p>
        </Container>
      </section>
      <section className="section-padding">
        <Container className="max-w-3xl space-y-12 text-base leading-relaxed text-muted-foreground">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What {APP_NAME} is</h2>
            <p className="mt-4">
              {APP_NAME} is a simple online platform for practical file and image work. Instead of installing desktop
              software, you open a tool in your browser, upload a file, choose what you need, and download the result.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why we built it</h2>
            <p className="mt-4">
              Everyday tasks like shrinking a photo for email or converting a format should not require a cluttered app
              or confusing settings. We focus on clear steps, a calm interface, and tools that do one job well.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Image tools available today</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Image Compressor — reduce file size toward a target you choose (free to try without an account).</li>
              <li>Image Resizer — set exact dimensions (free with a {APP_NAME} account).</li>
              <li>Image Cropper — crop to the area you need (account required).</li>
              <li>Image Converter — change between JPG, PNG, and WebP (account required).</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Where we are headed</h2>
            <p className="mt-4">
              Image utilities are the starting point. Over time we plan to add more helpful online file tools that follow
              the same principles: minimal design, straightforward workflows, and no unnecessary complexity.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-muted/40 p-6">
            <p className="font-medium text-foreground">Try the Image Compressor</p>
            <p className="mt-2 text-sm">Start with up to five free compressions without signing in.</p>
            <Link
              href="/tools/image-compressor"
              className="mt-4 inline-flex h-11 items-center rounded-sm bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/88"
            >
              Compress an Image
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
