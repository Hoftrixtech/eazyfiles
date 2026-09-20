import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroOrbBanner } from "@/components/sections/HeroOrbBanner";

export async function Hero() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <SiteHeader />
      </header>
      <HeroOrbBanner />
    </>
  );
}
