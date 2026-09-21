import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description: "EazyFiles image tools are free after login.",
  path: "/pricing",
  noIndex: true,
});

export default function PricingRedirectPage() {
  redirect("/tools");
}
