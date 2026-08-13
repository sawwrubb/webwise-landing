import { getSession } from "@/lib/session";
import { locationsFor, locationFilter, listActions, demoWatermark } from "@/lib/store";
import { ClientShell } from "@/components/client-shell";
import { redirect } from "next/navigation";

export default async function OsLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role === "webwise_admin" && !user.impersonating) {
    /* agency users may still open client routes while impersonating only */
  }
  if (!user.tenantId) redirect("/agency");
  const locs = locationsFor(user);
  const loc = locationFilter(user);
  const actions = listActions(user);
  return (
    <ClientShell
      user={user}
      locations={locs}
      locationId={loc}
      actionCount={actions.length}
      watermark={demoWatermark(user)}
    >
      {children}
    </ClientShell>
  );
}
