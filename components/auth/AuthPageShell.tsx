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
      <Card className="border-0 bg-transparent p-0 shadow-none sm:border sm:border-border sm:bg-card sm:p-7 sm:shadow-sm">
        {children}
      </Card>
    </AuthSplitLayout>
  );
}
