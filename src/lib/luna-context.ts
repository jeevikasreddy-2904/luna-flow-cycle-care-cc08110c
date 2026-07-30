import { loadState } from "./storage";

/** Builds a compact memory blob describing the user, so Luna answers personally. */
export function buildLunaContext(): string {
  if (typeof window === "undefined") return "";
  const s = loadState();
  const lines: string[] = [];
  const p = s.profile;

  if (p) {
    lines.push(
      `Name: ${p.name || "unknown"} | Age: ${p.age || "unknown"} | Occupation: ${p.occupation || "unknown"} | Place: ${p.place || "unknown"}`,
    );
    if (p.allergies) lines.push(`Allergies: ${p.allergies}`);
    if (p.healthConditions) lines.push(`Health conditions: ${p.healthConditions}`);
  }

  lines.push(`Care mode: ${s.mode}`);
  lines.push(`Logging streak: ${s.streak} days (${s.streakFreezers} streak freezers left)`);

  const dates = [...s.periodDates].sort();
  if (dates.length) {
    const last = dates.at(-1)!;
    const dayOfCycle = Math.floor((Date.now() - new Date(last).getTime()) / 86400000) + 1;
    lines.push(`Recent period dates logged: ${dates.slice(-8).join(", ")}`);
    lines.push(`Last period start: ${last} → roughly cycle day ${dayOfCycle}`);
    if (dates.length > 1) {
      const gaps: number[] = [];
      for (let i = 1; i < dates.length; i++) {
        const g = Math.round((new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 86400000);
        if (g > 10 && g < 90) gaps.push(g);
      }
      if (gaps.length) {
        const avg = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
        lines.push(`Average cycle length: about ${avg} days`);
      }
    }
  } else {
    lines.push("No period dates logged yet.");
  }

  if (s.mode === "pregnancy" && s.pregnancy) {
    const weeks = Math.round(s.pregnancy.monthsMissed * 4.345);
    const yes = Object.entries(s.pregnancy.symptoms)
      .filter(([, v]) => v)
      .map(([k]) => k);
    lines.push(`Pregnancy: about ${s.pregnancy.monthsMissed} months (~week ${weeks}).`);
    lines.push(`Pregnancy symptoms reported: ${yes.length ? yes.join(", ") : "none"}`);
  }

  if (s.onboarding) {
    const o = s.onboarding;
    lines.push(
      `Cycle questionnaire — cramps: ${o.cramps}, skips meals: ${o.skipsMeals}, drinks enough water: ${o.drinksWater}, exercises: ${o.exercises}, periods on time: ${o.onTime}, delays: ${o.delays}, comes early: ${o.early}`,
    );
  }

  const mealDays = Object.entries(s.meals).sort(([a], [b]) => a.localeCompare(b)).slice(-5);
  if (mealDays.length) {
    lines.push("Recent meals & protein:");
    for (const [d, m] of mealDays) {
      lines.push(`  ${d}: B:${m.breakfast || "—"} / L:${m.lunch || "—"} / D:${m.dinner || "—"} → ${m.protein}g protein`);
    }
  } else {
    lines.push("No meals logged yet.");
  }

  lines.push(`Today's date: ${new Date().toISOString().slice(0, 10)}`);
  return lines.join("\n");
}
