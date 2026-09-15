import type { ReactNode } from "react";
import { APP_TAGLINE } from "@/lib/constants";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Container } from "@/components/ui/Container";

export function AuthSplitLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-4rem)] border-t border-border">
      <Container className="grid min-h-[inherit] lg:grid-cols-2 lg:gap-0 lg:p-0">
        <div className="flex flex-col justify-center border-b border-border bg-surface-dark px-0 py-12 text-surface-dark-foreground lg:border-b-0 lg:border-r lg:px-12 lg:py-16 xl:px-16">
          <BrandLogo />
          <p className="mt-8 text-sm font-medium tracking-wide text-zinc-400">{APP_TAGLINE}</p>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">{description}</p>
        </div>
        <div className="flex flex-col justify-center px-0 py-12 lg:px-12 lg:py-16 xl:px-16">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
      </Container>
    </main>
  );
}
