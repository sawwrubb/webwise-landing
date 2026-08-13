import { getSession } from "@/lib/session";
import { AgencyShell } from "@/components/agency-shell";
import { redirect } from "next/navigation";

export default async function AgencyLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "webwise_admin") redirect("/home");
  return <AgencyShell user={user}>{children}</AgencyShell>;
}
