import type { ReactNode } from "react";
import { AccountNav } from "@/components/account/AccountNav";
import { Container } from "@/components/ui/Container";

export function AccountShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: ReactNode;
}) {
  return (
    <main className="border-t border-border py-10 sm:py-14">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          <AccountNav name={user.name} email={user.email} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </Container>
    </main>
  );
}
