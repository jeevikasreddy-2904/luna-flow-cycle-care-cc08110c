import { loadState } from "./storage";

export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

export type CycleInfo = {
  hasData: boolean;
  lastPeriodStart?: string;
  avgLength: number;
  cycleDay: number;
  nextPeriod?: string;
  daysUntilNext: number;
  ovulationDate?: string;
  fertileStart?: string;
  fertileEnd?: string;
  phase: CyclePhase;
};

const DAY = 86400000;

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr: string, n: number) {
  return iso(new Date(new Date(dateStr).getTime() + n * DAY));
}

/** Groups sorted period dates into cycles and returns the start date of each. */
export function periodStarts(dates: string[]): string[] {
  const sorted = [...dates].sort();
  const starts: string[] = [];
  for (const d of sorted) {
    const prev = starts.length ? sorted[sorted.indexOf(d) - 1] : undefined;
    if (!prev) {
      starts.push(d);
      continue;
    }
    const gap = Math.round((new Date(d).getTime() - new Date(prev).getTime()) / DAY);
    if (gap > 3) starts.push(d);
  }
  return starts;
}

export function getCycleInfo(): CycleInfo {
  const s = loadState();
  const starts = periodStarts(s.periodDates);
  const last = starts.at(-1);

  const gaps: number[] = [];
  for (let i = 1; i < starts.length; i++) {
    const g = Math.round((new Date(starts[i]).getTime() - new Date(starts[i - 1]).getTime()) / DAY);
    if (g > 15 && g < 60) gaps.push(g);
  }
  const avgLength = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 28;

  if (!last) {
    return { hasData: false, avgLength, cycleDay: 0, daysUntilNext: 0, phase: "follicular" };
  }

  const cycleDayRaw = Math.floor((Date.now() - new Date(last).getTime()) / DAY) + 1;
  const cycleDay = ((cycleDayRaw - 1) % avgLength) + 1;
  const cyclesPassed = Math.floor((cycleDayRaw - 1) / avgLength);
  const nextPeriod = addDays(last, avgLength * (cyclesPassed + 1));
  const daysUntilNext = Math.max(0, Math.round((new Date(nextPeriod).getTime() - Date.now()) / DAY));
  const currentStart = addDays(last, avgLength * cyclesPassed);
  const ovulationDay = avgLength - 14;
  const ovulationDate = addDays(currentStart, ovulationDay - 1);
  const fertileStart = addDays(currentStart, ovulationDay - 6);
  const fertileEnd = addDays(currentStart, ovulationDay);

  let phase: CyclePhase = "follicular";
  if (cycleDay <= 5) phase = "menstrual";
  else if (cycleDay >= ovulationDay - 2 && cycleDay <= ovulationDay + 1) phase = "ovulation";
  else if (cycleDay > ovulationDay + 1) phase = "luteal";

  return {
    hasData: true,
    lastPeriodStart: last,
    avgLength,
    cycleDay,
    nextPeriod,
    daysUntilNext,
    ovulationDate,
    fertileStart,
    fertileEnd,
    phase,
  };
}

export const PHASE_INFO: Record<
  CyclePhase,
  { label: string; emoji: string; body: string; food: string; move: string; care: string }
> = {
  menstrual: {
    label: "Menstrual phase",
    emoji: "🌺",
    body: "Energy is lowest — bleeding days. Rest is productive.",
    food: "Iron-rich foods: rajma, spinach dal, dates, jaggery, sesame ladoo.",
    move: "Gentle child's pose, supta baddha konasana, slow walks.",
    care: "Warm compress on the belly, warm water, early sleep.",
  },
  follicular: {
    label: "Follicular phase",
    emoji: "🌱",
    body: "Energy is rising, mood lifts, skin clears up.",
    food: "Fresh protein: sprouts, paneer, eggs, curd, seasonal fruit.",
    move: "Great time for cardio, dance workouts and strength.",
    care: "Plan the busy tasks now — you have the most stamina.",
  },
  ovulation: {
    label: "Ovulation window",
    emoji: "✨",
    body: "Peak energy and fertility. You may feel most confident.",
    food: "Antioxidants + protein: berries, nuts, fish, tofu, leafy greens.",
    move: "High-intensity is fine — dance, HIIT, brisk cycling.",
    care: "Hydrate well; note any mid-cycle twinge, it is normal.",
  },
  luteal: {
    label: "Luteal phase",
    emoji: "🌙",
    body: "Progesterone rises — PMS, cravings and mood dips can appear.",
    food: "Magnesium & complex carbs: bananas, ragi, oats, dark chocolate, pumpkin seeds.",
    move: "Yoga, pilates, stretching, long walks.",
    care: "Cut caffeine, keep sleep steady, be softer with yourself.",
  },
};
