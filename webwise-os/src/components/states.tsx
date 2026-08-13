import Link from "next/link";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card p-6 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="card p-6 border-[color:var(--danger)]">
      <h3 className="font-semibold">Could not load this screen</h3>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{message}</p>
      <Link href="/home" className="btn btn-primary mt-4">Back to home</Link>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="grid gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skel h-16" />
      ))}
    </div>
  );
}

export function Delta({ current, prior }: { current: number; prior: number }) {
  const d = prior === 0 ? 100 : Math.round(((current - prior) / prior) * 1000) / 10;
  const up = d >= 0;
  return (
    <span style={{ color: up ? "var(--teal)" : "var(--danger)" }}>
      {up ? "+" : ""}{d}% vs prior period
    </span>
  );
}
