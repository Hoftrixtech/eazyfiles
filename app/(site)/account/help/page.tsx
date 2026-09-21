import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Help & support",
  description: "Get help using EazyFiles image tools.",
  path: "/account/help",
  noIndex: true,
});

export default function AccountHelpPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Card className="p-6 sm:p-8">
        <h2 className="text-base font-semibold">Using EazyFiles</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Open any image tool from the sidebar or the Quick Tools section on your dashboard. Compressor, resizer,
          cropper, and converter run in your browser and process files on our servers — download results before you
          leave the page.
        </p>
      </Card>
      <Card className="p-6 sm:p-8">
        <h2 className="text-base font-semibold">Need more help?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Visit the public FAQ on the homepage or send us a message.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/#faq">
            <Button variant="secondary" size="sm">View FAQ</Button>
          </Link>
          <Link href="/contact">
            <Button variant="primary" size="sm">Contact us</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
