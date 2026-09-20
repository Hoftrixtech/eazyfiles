import { SiteHeader } from "@/components/layout/SiteHeader";

export async function Navbar() {
  return (
    <header className="sticky top-0 z-[60] w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <SiteHeader />
    </header>
  );
}
