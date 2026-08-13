import { getSession } from "@/lib/session";
import { listReviews } from "@/lib/store";
import { approveReviewAction } from "@/lib/actions";
import { EmptyState } from "@/components/states";
import { redirect } from "next/navigation";

export default async function ReviewsPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const rows = listReviews(user);
  const unanswered = rows.filter((r) => !r.respondedAt);
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>No review sits unanswered past 24 hours. Approve the draft — nothing posts without you.</p>
      {rows.length === 0 ? <EmptyState title="No reviews yet" body="Asks fire after completed visits." /> : null}
      {unanswered.map((r) => (
        <article key={r.id} className="card p-4">
          <div className="font-semibold">{r.rating}★ {r.platform}</div>
          <p className="mt-1 text-sm">{r.text}</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>AI draft (reversible): {r.aiDraft}</p>
          <form action={approveReviewAction} className="mt-3">
            <input type="hidden" name="reviewId" value={r.id} />
            <button className="btn btn-primary" type="submit">Approve & mark responded</button>
          </form>
        </article>
      ))}
      {rows.filter((r) => r.respondedAt).map((r) => (
        <article key={r.id} className="card p-4 opacity-70">
          <div>{r.rating}★ responded {new Date(r.respondedAt!).toLocaleString("en-IN")}</div>
          <p className="text-sm">{r.text}</p>
        </article>
      ))}
    </div>
  );
}
