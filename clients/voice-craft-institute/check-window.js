const startAt = Date.parse("2026-09-09T05:30:00.000Z");
const durationMs = 14 * 24 * 60 * 60 * 1000;
const end = startAt + durationMs;
const now = Date.parse("2026-09-10T05:30:00.000Z");
const left = end - now;
const days = Math.floor(left / (24 * 60 * 60 * 1000));
if (days !== 13) {
  console.error("expected 13 days remaining after 24h, got", days);
  process.exit(1);
}
const dayIndex = Math.floor((now - startAt) / (24 * 60 * 60 * 1000)) + 1;
if (dayIndex !== 2) {
  console.error("expected day 2, got", dayIndex);
  process.exit(1);
}
if (end <= Date.parse("2026-09-23T05:29:00.000Z")) {
  console.error("window closed too early");
  process.exit(1);
}
console.log("countdown math ok");
