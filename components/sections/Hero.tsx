import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroOrbBanner } from "@/components/sections/HeroOrbBanner";

export async function Hero() {
  return (
    <>
      <header className="relative z-20 w-full border-b border-border bg-background">
        <SiteHeader />
      </header>
      <HeroOrbBanner />
    </>
  );
}
