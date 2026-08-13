import { getSession } from "@/lib/session";
import { conversationsFor, getLead, listUsage, messagesFor, tenantOf } from "@/lib/store";
import { replyAction, takeoverAction } from "@/lib/actions";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/states";

export default async function WhatsAppPage() {
  const user = await getSession();
  if (!user?.tenantId) redirect("/login");
  const tenant = tenantOf(user.tenantId)!;
  const convos = conversationsFor(user);
  const usage = listUsage(user).find((u) => u.meter === "wa_conversations");
  const first = convos[0];
  const msgs = first ? messagesFor(user, first.id) : [];
  const lead = first ? getLead(user, first.leadId)?.lead : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
      <section className="card p-4">
        <h1 className="text-2xl font-semibold">WhatsApp</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {tenant.aiPaused ? "AI paused — humans only" : "AI on"} · number connected · takeover in one tap
        </p>
        {usage ? (
          <p className="mt-2 text-sm">Credits {usage.consumed}/{usage.included} this period {usage.consumed / usage.included >= 0.8 ? "· overage warning" : ""}</p>
        ) : null}
        {convos.length === 0 ? (
          <EmptyState title="Inbox empty" body="New WhatsApp enquiries land here." />
        ) : (
          <ul className="mt-4 grid gap-2">
            {convos.map((c) => (
              <li key={c.id} className="rounded-lg border p-3 text-sm" style={{ borderColor: "var(--line)" }}>
                {c.channel} · {c.humanTakeover ? "human" : "AI"} · {c.sentiment}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="card p-4">
        {lead ? <h2 className="font-semibold">{lead.name}</h2> : <h2 className="font-semibold">Thread</h2>}
        <div className="mt-3 grid gap-2">
          {msgs.map((m) => (
            <p key={m.id} className="rounded-md p-2 text-sm" style={{ background: m.sentBy === "ai" ? "rgba(41,121,255,.12)" : "transparent" }}>
              <b>{m.sentBy}</b> {m.body}
            </p>
          ))}
        </div>
        {first ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <form action={takeoverAction}>
              <input type="hidden" name="conversationId" value={first.id} />
              <input type="hidden" name="on" value={first.humanTakeover ? "0" : "1"} />
              <button className="btn btn-primary" type="submit">{first.humanTakeover ? "Hand back" : "Take over"}</button>
            </form>
            <form action={replyAction} className="flex flex-1 gap-2">
              <input type="hidden" name="conversationId" value={first.id} />
              <input name="body" required placeholder="Reply as human" className="flex-1 rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
              <button className="btn btn-ghost" type="submit">Send</button>
            </form>
          </div>
        ) : null}
      </section>
    </div>
  );
}
