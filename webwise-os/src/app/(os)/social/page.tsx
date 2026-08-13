import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { pageEditAction } from "@/lib/actions";

export default async function SocialPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Social</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>Approve or reject on this screen. DMs already sit in Leads.</p>
      <article className="card p-4">
        <div className="font-semibold">Tonight: 3 overnight bookings reel</div>
        <div className="mt-3 flex gap-2">
          <form action={pageEditAction}>
            <input type="hidden" name="assetId" value="pg_implant" />
            <button className="btn btn-primary" type="submit">Approve</button>
          </form>
          <form action={pageEditAction}>
            <input type="hidden" name="assetId" value="pg_white" />
            <button className="btn btn-ghost" type="submit">Reject</button>
          </form>
        </div>
      </article>
    </div>
  );
}
