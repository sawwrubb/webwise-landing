export function rangeWindow(key: "7d" | "30d" | "90d", now = new Date()) {
  const days = key === "7d" ? 7 : key === "90d" ? 90 : 30;
  const end = now.getTime();
  const start = end - days * 86400000;
  const priorEnd = start;
  const priorStart = priorEnd - days * 86400000;
  return { days, start, end, priorStart, priorEnd };
}

export function inRange(iso: string, start: number, end: number) {
  const t = new Date(iso).getTime();
  return t >= start && t <= end;
}

export function rangeLabel(key: "7d" | "30d" | "90d") {
  if (key === "7d") return "Last 7 days vs previous 7";
  if (key === "90d") return "Last 90 days vs previous 90";
  return "Last 30 days vs previous 30";
}
