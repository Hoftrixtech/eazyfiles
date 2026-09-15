import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/Container";
import { getSessionUser } from "@/lib/access/identity";
import { logoutAction } from "@/app/auth-actions";

const linkClass =
  "rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

function NavLinks({ authenticated }: { authenticated: boolean }) {
  return (
    <>
      <Link href="/tools" className={linkClass}>
        Tools
      </Link>
      <Link href="/#how-it-works" className={linkClass}>
        How It Works
      </Link>
      {authenticated ? (
        <>
          <Link href="/account" className={linkClass}>
            Account
          </Link>
          <form action={logoutAction}>
            <button type="submit" className={linkClass}>
              Logout
            </button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login" className={linkClass}>
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/88"
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );
}

export async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        <BrandLogo />
        <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
          <NavLinks authenticated={Boolean(user)} />
        </nav>
        <details className="group relative md:hidden">
          <summary
            className="flex size-10 cursor-pointer list-none items-center justify-center rounded-sm border border-border bg-card text-foreground transition-colors hover:bg-muted"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 16 16" className="size-4 group-open:hidden" aria-hidden="true">
              <path d="M2.5 4.25h11M2.5 8h11M2.5 11.75h11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 16 16" className="hidden size-4 group-open:block" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </summary>
          <nav
            aria-label="Mobile"
            className="absolute right-0 mt-2 flex w-56 flex-col gap-0.5 rounded-sm border border-border bg-card p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <NavLinks authenticated={Boolean(user)} />
          </nav>
        </details>
      </Container>
    </header>
  );
}
