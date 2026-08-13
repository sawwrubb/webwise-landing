import { upsellAction } from "@/lib/actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DiscoverPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">SEO / AEO / GEO</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>Visibility to booked enquiry, not vanity ranks. Last 30 days vs previous 30.</p>
      <article className="card flex items-center justify-between gap-3 p-4">
        <div>
          <div className="font-semibold">dentist near me · local pack 7th</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Gap: entity page for implants in Dwarka.</p>
        </div>
        <form action={upsellAction}>
          <input type="hidden" name="title" value="Commission: implant entity page for Dwarka local pack" />
          <button className="btn btn-primary btn-sm" type="submit">Commission this</button>
        </form>
      </article>
    </div>
  );
}
