import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import { getSessionUser } from "@/lib/access/identity";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?next=/account");
  }

  return <AccountShell user={user}>{children}</AccountShell>;
}
