import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadState, safeProteinRange, PROTEIN_TARGET, type AppState } from "@/lib/storage";
import { getCycleInfo, PHASE_INFO, type CycleInfo } from "@/lib/cycle";
import { FileText, Download, Printer } from "lucide-react";

export const Route = createFileRoute("/app/report")({
  head: () => ({
    meta: [
      { title: "Monthly report — Luna Flow" },
      { name: "description", content: "A month of cycle, protein, mood, water and sleep data you can share with your doctor." },
      { property: "og:title", content: "Monthly report — Luna Flow" },
      { property: "og:description", content: "A month of cycle, protein, mood, water and sleep data you can share with your doctor." },
    ],
  }),
  component: ReportPage,
});

function monthKey(d = new Date()) {
  return d.toISOString().slice(0, 7);
}

function buildText(s: AppState, cycle: CycleInfo, month: string) {
  const lines: string[] = [];
  lines.push(`LUNA FLOW — MONTHLY HEALTH REPORT (${month})`);
  lines.push(`Name: ${s.profile?.name || "—"} | Age: ${s.profile?.age || "—"} | Place: ${s.profile?.place || "—"}`);
  lines.push(`Allergies: ${s.profile?.allergies || "none"} | Conditions: ${s.profile?.healthConditions || "none"}`);
  lines.push("");
  lines.push(`Cycle day: ${cycle.cycleDay} (${PHASE_INFO[cycle.phase].label})`);
  lines.push(`Average cycle length: ${cycle.avgLength} days`);
  lines.push(`Last period start: ${cycle.lastPeriodStart ?? "—"} | Next predicted: ${cycle.nextPeriod ?? "—"}`);
  lines.push(`Fertile window: ${cycle.fertileStart ?? "—"} to ${cycle.fertileEnd ?? "—"} | Ovulation: ${cycle.ovulationDate ?? "—"}`);
  lines.push("");
  lines.push("DAILY LOG");
  const dates = new Set([...Object.keys(s.meals), ...Object.keys(s.days)].filter((d) => d.startsWith(month)));
  for (const d of [...dates].sort()) {
    const m = s.meals[d];
    const l = s.days[d] ?? {};
    lines.push(
      `${d} — protein ${m?.protein ?? 0}g | mood ${l.mood ?? "—"} | water ${l.water ?? 0} glasses | sleep ${l.sleep ?? 0}h${l.note ? ` | note: ${l.note}` : ""}`,
    );
  }
  return lines.join("\n");
}

function ReportPage() {
  const [s, setS] = useState<AppState | null>(null);
  const [cycle, setCycle] = useState<CycleInfo | null>(null);
  const [month, setMonth] = useState(() => monthKey());

  useEffect(() => {
    setS(loadState());
    setCycle(getCycleInfo());
  }, []);

  if (!s || !cycle) return <div className="glass shadow-soft rounded-[2rem] p-6">Loading your report…</div>;

  const range = safeProteinRange(s.profile, s.mode);
  const dates = [...new Set([...Object.keys(s.meals), ...Object.keys(s.days)])].filter((d) => d.startsWith(month)).sort();
  const proteins = dates.map((d) => s.meals[d]?.protein ?? 0);
  const avgProtein = proteins.length ? Math.round(proteins.reduce((a, b) => a + b, 0) / proteins.length) : 0;
  const sleeps = dates.map((d) => s.days[d]?.sleep ?? 0).filter(Boolean);
  const avgSleep = sleeps.length ? (sleeps.reduce((a, b) => a + b, 0) / sleeps.length).toFixed(1) : "0";
  const waters = dates.map((d) => s.days[d]?.water ?? 0);
  const avgWater = waters.length ? Math.round(waters.reduce((a, b) => a + b, 0) / waters.length) : 0;
  const periodDays = s.periodDates.filter((d) => d.startsWith(month)).length;

  const download = () => {
    const text = buildText(s, cycle, month);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `luna-flow-report-${month}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold flex items-center gap-2"><FileText className="h-7 w-7 text-primary" /> Monthly report</h1>
          <p className="text-muted-foreground mt-1">Share this with your doctor — everything stays on your device until you export it.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none px-3 py-2 font-semibold"
          />
          <button onClick={download} className="rounded-2xl bg-gradient-primary text-primary-foreground font-bold px-4 py-2 shadow-soft flex items-center gap-1.5">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => window.print()} className="rounded-2xl bg-white/80 hover:bg-white font-bold px-4 py-2 shadow-soft flex items-center gap-1.5">
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Avg protein" value={`${avgProtein} g`} sub={`target ${PROTEIN_TARGET}g+ · safe ${range.min}–${range.max}g`} />
        <Card label="Period days" value={`${periodDays}`} sub={`avg cycle ${cycle.avgLength} days`} />
        <Card label="Avg sleep" value={`${avgSleep} h`} sub="7–9h recommended" />
        <Card label="Avg water" value={`${avgWater} glasses`} sub="8 glasses target" />
      </div>

      <section className="glass shadow-soft rounded-[2rem] p-6">
        <h2 className="font-display text-xl font-extrabold mb-3">Daily breakdown</h2>
        {dates.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing logged for this month yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground text-xs font-bold tracking-widest">
                  <th className="py-2">DATE</th><th>PROTEIN</th><th>MOOD</th><th>WATER</th><th>SLEEP</th><th>PERIOD</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((d) => {
                  const l = s.days[d] ?? {};
                  return (
                    <tr key={d} className="border-t border-border/60">
                      <td className="py-2 font-semibold">{new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</td>
                      <td>{s.meals[d]?.protein ?? 0} g</td>
                      <td className="capitalize">{l.mood ?? "—"}</td>
                      <td>{l.water ?? 0}</td>
                      <td>{l.sleep ?? 0} h</td>
                      <td>{s.periodDates.includes(d) ? "🩸" : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="glass shadow-soft rounded-3xl p-4">
      <p className="text-xs text-muted-foreground font-bold">{label}</p>
      <p className="font-display font-extrabold text-2xl">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}
