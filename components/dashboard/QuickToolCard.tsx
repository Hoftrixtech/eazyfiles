import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function QuickToolCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="flex h-full flex-col p-5 sm:p-6">
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <Link href={href} className="mt-5 inline-block w-full sm:w-auto">
        <Button variant="secondary" size="sm" className="w-full sm:w-auto">
          Open tool
        </Button>
      </Link>
    </Card>
  );
}
