import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { loadState, updateState } from "@/lib/storage";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({ meta: [{ title: "Cycle Calendar — Luna Flow" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const [s, setS] = useState(() => loadState());
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const monthName = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const startDay = cursor.getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));

  const toggle = (d: Date) => {
    const key = d.toISOString().slice(0, 10);
    const has = s.periodDates.includes(key);
    const next = has ? s.periodDates.filter((x) => x !== key) : [...s.periodDates, key];
    setS(updateState({ periodDates: next }));
  };

  const isPeriod = (d: Date) => s.periodDates.includes(d.toISOString().slice(0, 10));
  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6">
        <h1 className="font-display text-3xl font-extrabold">Your cycle calendar 📅</h1>
        <p className="text-muted-foreground mt-1">Tap any day to mark or unmark a period day.</p>
      </div>

      <div className="glass shadow-soft rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="rounded-full bg-white/70 hover:bg-white p-2 shadow-soft">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display text-xl font-extrabold">{monthName}</h2>
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="rounded-full bg-white/70 hover:bg-white p-2 shadow-soft">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const period = isPeriod(d);
            return (
              <button
                key={i}
                onClick={() => toggle(d)}
                className={`aspect-square rounded-2xl text-sm font-bold flex items-center justify-center transition relative ${
                  period ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-white/60 hover:bg-white text-foreground"
                } ${isToday(d) ? "ring-2 ring-accent" : ""}`}
              >
                {d.getDate()}
                {period && <Heart className="absolute top-1 right-1 h-2.5 w-2.5 fill-white" />}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gradient-primary" /> Period day</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded ring-2 ring-accent bg-white" /> Today</span>
        </div>
      </div>
    </div>
  );
}
