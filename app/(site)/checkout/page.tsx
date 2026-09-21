import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Checkout",
  description: "EazyFiles image tools are free after login.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutRedirectPage() {
  redirect("/signup");
}
