import { SiteHeader } from "@/components/layout/SiteHeader";

export async function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <SiteHeader />
    </header>
  );
}
