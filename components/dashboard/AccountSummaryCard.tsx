import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/account/UserAvatar";
import { formatMemberSince } from "@/lib/dashboard/format";

export function AccountSummaryCard({
  name,
  email,
  memberSince,
}: {
  name: string;
  email: string;
  memberSince: Date | null;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <UserAvatar name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{name.trim() || email}</p>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
          <p className="mt-2 text-xs text-muted-foreground">Member since {formatMemberSince(memberSince)}</p>
        </div>
      </div>
      <Link href="/account/settings" className="mt-5 inline-block">
        <Button variant="secondary" size="sm">Account settings</Button>
      </Link>
    </Card>
  );
}
