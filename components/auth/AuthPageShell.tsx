import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

export function AuthPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <AuthSplitLayout title={title} description={description}>
      <Card className="border-0 bg-transparent p-0 shadow-none sm:bg-card/80 sm:p-7 sm:shadow-[var(--shadow-elevated)]">
        {children}
      </Card>
    </AuthSplitLayout>
  );
}
