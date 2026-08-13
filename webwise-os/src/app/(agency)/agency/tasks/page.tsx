import { getSession } from "@/lib/session";
import { listActions } from "@/lib/store";
import { EmptyState } from "@/components/states";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const rows = listActions(user).filter((a) => a.kind === "upsell" || a.kind === "edit_request");
  return (
    <div className="grid gap-3">
      <h1 className="text-3xl font-semibold">Task inbox</h1>
      {rows.length === 0 ? <EmptyState title="No client requests" body="Edit and Talk to Webwise land here." /> : rows.map((t) => (
        <article key={t.id} className="card p-4">{t.title}</article>
      ))}
    </div>
  );
}
