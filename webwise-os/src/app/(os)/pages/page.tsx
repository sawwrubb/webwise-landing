import { getSession } from "@/lib/session";
import { listAssets } from "@/lib/store";
import { pageEditAction, pageToggleAction } from "@/lib/actions";
import { EmptyState } from "@/components/states";
import { redirect } from "next/navigation";

export default async function PagesPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const pages = listAssets(user).filter((a) => a.type === "page").sort((a, b) => b.conversionRate - a.conversionRate);
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Landing pages</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>Ranked by conversion rate. Attribution flows into Leads.</p>
      {pages.length === 0 ? (
        <EmptyState title="No pages yet" body="Webwise publishes the first page during activation." />
      ) : pages.map((p) => (
        <article key={p.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{p.views} views · {p.conversionRate}% conv · {p.leads} leads · {p.status}</p>
          </div>
          <div className="flex gap-2">
            <form action={pageToggleAction}>
              <input type="hidden" name="assetId" value={p.id} />
              <button className="btn btn-ghost btn-sm" type="submit">{p.status === "live" ? "Unpublish" : "Publish"}</button>
            </form>
            <form action={pageEditAction}>
              <input type="hidden" name="assetId" value={p.id} />
              <button className="btn btn-primary btn-sm" type="submit">Request edit</button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
