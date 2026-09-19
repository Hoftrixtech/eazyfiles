import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { logoutAction } from "@/app/auth-actions";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/Container";
import { getSessionUser } from "@/lib/access/identity";

const navLinkClass =
  "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground";

export async function Hero() {
  const user = await getSessionUser();

  return (
    <>
      {/* Site header: menu + logo + auth (unchanged layout) */}
      <header className="relative z-20 w-full border-b border-border bg-background md:min-h-[4.5rem]">
        <div className="flex w-full flex-col gap-4 px-5 py-5 sm:px-8 lg:px-12 xl:px-16 md:flex-row md:items-center md:justify-between md:gap-6 md:py-6">
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Link href="/" className={navLinkClass}>Home</Link>
            <Link href="/tools" className={navLinkClass}>Tools</Link>
            <Link href="/#how-it-works" className={navLinkClass}>How It Works</Link>
            <Link href="/about" className={navLinkClass}>About</Link>
          </nav>
          <div className="flex justify-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:pointer-events-none">
            <div className="pointer-events-auto">
              <BrandLogo size="lg" className="!h-9 sm:!h-10" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            {user ? (
              <>
                <Link href="/account" className={navLinkClass}>Account</Link>
                <form action={logoutAction}>
                  <button type="submit" className={navLinkClass}>Logout</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className={navLinkClass}>Login</Link>
                <Link
                  href="/signup"
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Sign Up
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Banner: headline block below header — no background image */}
      <section className="w-full bg-background section-padding !pb-16 !pt-12 sm:!pt-14" aria-labelledby="home-hero-title">
        <Container className="flex flex-col items-center text-center">
          <p className="eyebrow-pill">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            Free online file tools
          </p>
          <h1
            id="home-hero-title"
            className="mt-8 max-w-4xl text-[2.25rem] font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl md:text-6xl"
          >
            Compress images without the{" "}
            <span className="text-gradient">hassle.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            EazyFiles is a simple online platform for everyday image tasks — target file size, resize, crop, and
            convert in your browser.
          </p>
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#image-tools"
              className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              Explore Image Tools
            </Link>
            <Link
              href="#compressor"
              className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Compress an Image
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
