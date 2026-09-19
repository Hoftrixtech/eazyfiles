import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { UserMenu } from "@/components/account/UserMenu";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SiteHeaderImageToolsMenu } from "@/components/layout/SiteHeaderImageToolsMenu";
import { SiteHeaderMobileMenu } from "@/components/layout/SiteHeaderMobileMenu";
import { Container } from "@/components/ui/Container";
import { getSessionUser } from "@/lib/access/identity";
import { brandCtaClass, brandOutlineCtaClass } from "@/lib/brand-styles";
import { getImageToolsNavItems } from "@/lib/nav/image-tools-nav";

const navLinkClass =
  "rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
] as const;

export async function SiteHeader() {
  const user = await getSessionUser();
  const imageTools = getImageToolsNavItems();

  return (
    <Container className="flex h-16 items-center justify-between gap-4">
      <BrandLogo size="md" className="shrink-0" />

      <div className="flex items-center justify-end gap-2 sm:gap-3">
        <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
          <SiteHeaderImageToolsMenu items={imageTools} />
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/login" className={`${brandOutlineCtaClass} h-10`}>
                Log In
              </Link>
              <Link
                href="/signup"
                className={`${brandCtaClass} h-10`}
              >
                Sign Up
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {user ? <UserMenu user={user} /> : null}
          <SiteHeaderMobileMenu links={NAV_LINKS} imageTools={imageTools} user={user} />
        </div>
      </div>
    </Container>
  );
}
