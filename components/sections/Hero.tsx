import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { logoutAction } from "@/app/auth-actions";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { getSessionUser } from "@/lib/access/identity";

const navLinkClass =
  "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground";

export async function Hero() {
  const user = await getSessionUser();

  return (
    <section className="w-full bg-background">
      <div className="relative flex min-h-[min(88vh,760px)] w-full flex-col overflow-hidden">
        <Image
          src="/brand/hero-banner.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-90"
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/95 from-0% via-background/80 via-[40%] to-background/20 to-100%"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/4 size-[28rem] rounded-full bg-white/[0.04] blur-3xl"
          aria-hidden="true"
        />

        <header className="relative z-10 flex w-full flex-col gap-4 px-5 py-5 sm:px-8 lg:px-12 xl:px-16 md:flex-row md:items-center md:justify-between md:gap-6 md:py-6">
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Link href="/" className={navLinkClass}>Home</Link>
            <Link href="/tools" className={navLinkClass}>Tools</Link>
            <Link href="/#how-it-works" className={navLinkClass}>How It Works</Link>
            <Link href="/about" className={navLinkClass}>About</Link>
          </nav>
          <div className="flex justify-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <BrandLogo />
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
        </header>

        <div className="relative z-10 flex w-full flex-1 flex-col px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 xl:px-16">
          <div className="max-w-3xl">
            <p className="eyebrow-pill text-foreground/90">
              <Sparkles className="size-3.5 text-foreground/70" aria-hidden="true" />
              Free online file tools
            </p>
            <h1
              id="home-hero-title"
              className="mt-8 text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-[3.75rem]"
            >
              Compress images without the{" "}
              <span className="text-gradient">hassle.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              EazyFiles is a simple online platform for everyday image tasks — target file size, resize, crop, and
              convert in your browser.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#image-tools"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
              >
                Explore Image Tools
              </Link>
              <Link
                href="#compressor"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Compress an Image
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
