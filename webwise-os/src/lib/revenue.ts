export function revenueRecovered(input: {
  appointmentsShowed: number;
  recoveredNoShows: number;
  avgCaseValueInr: number | null;
}): { amount: number | null; needsCaseValue: boolean } {
  if (input.avgCaseValueInr == null || input.avgCaseValueInr <= 0) {
    return { amount: null, needsCaseValue: true };
  }
  const amount =
    input.appointmentsShowed * input.avgCaseValueInr +
    input.recoveredNoShows * input.avgCaseValueInr;
  return { amount, needsCaseValue: false };
}

export function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pctDelta(current: number, prior: number): number {
  if (prior === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - prior) / prior) * 1000) / 10;
}
