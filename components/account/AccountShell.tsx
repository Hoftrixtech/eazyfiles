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
    <main className="w-full border-t border-border py-10 sm:py-14">
      <Container className="w-full">
        <div className="grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
          <AccountNav name={user.name} email={user.email} />
          <div className="w-full min-w-0">{children}</div>
        </div>
      </Container>
    </main>
  );
}
