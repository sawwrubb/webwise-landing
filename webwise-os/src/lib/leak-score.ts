export type LeakComponentId =
  | "response_speed"
  | "after_hours"
  | "missed_call"
  | "follow_up"
  | "review_ask"
  | "no_show";

export interface LeakComponent {
  id: LeakComponentId;
  label: string;
  weight: number;
  current: number;
  target: number;
  actionLabel: string;
  actionHref: string;
}

const WEIGHTS: Record<LeakComponentId, number> = {
  response_speed: 25,
  after_hours: 20,
  missed_call: 15,
  follow_up: 15,
  review_ask: 15,
  no_show: 10,
};

export function scoreComponent(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, (current / target) * 100));
}

export function leakScore(components: LeakComponent[]): number {
  const total = components.reduce((sum, c) => {
    return sum + (scoreComponent(c.current, c.target) * c.weight) / 100;
  }, 0);
  return Math.round(total);
}

export function clinicLeakComponents(): LeakComponent[] {
  return [
    {
      id: "response_speed",
      label: "Response speed",
      weight: WEIGHTS.response_speed,
      current: 4.2,
      target: 60,
      actionLabel: "Tighten first-reply rules",
      actionHref: "/ai",
    },
    {
      id: "after_hours",
      label: "After-hours coverage",
      weight: WEIGHTS.after_hours,
      current: 88,
      target: 100,
      actionLabel: "Cover remaining night gaps",
      actionHref: "/whatsapp",
    },
    {
      id: "missed_call",
      label: "Missed-call recovery",
      weight: WEIGHTS.missed_call,
      current: 41,
      target: 100,
      actionLabel: "Recover unanswered calls",
      actionHref: "/voice",
    },
    {
      id: "follow_up",
      label: "Follow-up completion",
      weight: WEIGHTS.follow_up,
      current: 72,
      target: 100,
      actionLabel: "Finish open sequences",
      actionHref: "/leads",
    },
    {
      id: "review_ask",
      label: "Review ask rate",
      weight: WEIGHTS.review_ask,
      current: 64,
      target: 100,
      actionLabel: "Ask after completed visits",
      actionHref: "/reviews",
    },
    {
      id: "no_show",
      label: "No-show recovery",
      weight: WEIGHTS.no_show,
      current: 55,
      target: 100,
      actionLabel: "Rebook no-shows",
      actionHref: "/leads",
    },
  ];
}

export const LEAK_SCORE_DEFINITION =
  "Leak Score is 0–100 from six weighted gaps: reply speed (25), after-hours (20), missed-call recovery (15), follow-up completion (15), review asks (15), no-show recovery (10). Each component is current ÷ target, then weighted.";
