import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadState, setDayLog, getDayLog, updateState, type Mood, type Medication, type DayLog } from "@/lib/storage";
import { Droplets, Moon, Pill, NotebookPen, Plus, Trash2, Check } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/trackers")({
  head: () => ({
    meta: [
      { title: "Trackers — Luna Flow" },
      { name: "description", content: "Mood journal, water, sleep and medication tracking in one gentle place." },
      { property: "og:title", content: "Trackers — Luna Flow" },
      { property: "og:description", content: "Mood journal, water, sleep and medication tracking in one gentle place." },
    ],
  }),
  component: TrackersPage,
});

const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: "great", emoji: "🤩", label: "Great" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "low", emoji: "😔", label: "Low" },
  { id: "awful", emoji: "😣", label: "Awful" },
];

function TrackersPage() {
  const [s, setS] = useState(() => loadState());
  const [day, setDay] = useState<DayLog>({});
  const [note, setNote] = useState("");
  const [medName, setMedName] = useState("");
  const [medTime, setMedTime] = useState("09:00");
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const st = loadState();
    setS(st);
    const d = getDayLog();
    setDay(d);
    setNote(d.note ?? "");
  }, []);

  const patch = (p: DayLog) => {
    const next = setDayLog(p);
    setS(next);
    setDay(next.days[today] ?? {});
  };

  const addMed = () => {
    if (!medName.trim()) return;
    const med: Medication = { id: crypto.randomUUID(), name: medName.trim(), time: medTime };
    const next = updateState({ medications: [...s.medications, med] });
    setS(next);
    setMedName("");
  };

  const removeMed = (id: string) => {
    const next = updateState({ medications: s.medications.filter((m) => m.id !== id) });
    setS(next);
  };

  const toggleMed = (id: string) => {
    const taken = day.meds ?? [];
    patch({ meds: taken.includes(id) ? taken.filter((m) => m !== id) : [...taken, id] });
  };

  const recent = Object.entries(s.days)
    .filter(([, v]) => v.mood || v.note)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7);

  const water = day.water ?? 0;

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6">
        <h1 className="font-display text-3xl font-extrabold">Daily trackers 🌿</h1>
        <p className="text-muted-foreground mt-1">Mood, water, sleep and medicines — all in one gentle place.</p>
      </div>

      {/* Mood journal */}
      <section className="glass shadow-soft rounded-[2rem] p-6">
        <h2 className="font-display text-xl font-extrabold flex items-center gap-2"><NotebookPen className="h-5 w-5 text-primary" /> Mood journal</h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => { patch({ mood: m.id }); speak("Mood saved."); }}
              className={`rounded-2xl py-3 text-center transition border-2 ${day.mood === m.id ? "bg-gradient-primary text-primary-foreground border-primary shadow-soft" : "bg-white/70 border-transparent hover:border-primary/40"}`}
            >
              <div className="text-2xl">{m.emoji}</div>
              <p className="text-[10px] font-bold mt-1">{m.label}</p>
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => patch({ note })}
          rows={3}
          placeholder="Write how your day felt… (saved automatically)"
          className="mt-4 w-full rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none px-4 py-3 font-medium transition"
        />

        {recent.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-bold text-muted-foreground tracking-widest">RECENT ENTRIES</p>
            {recent.map(([d, v]) => (
              <div key={d} className="rounded-2xl bg-white/70 px-4 py-2 flex items-start gap-3">
                <span className="text-xl">{MOODS.find((m) => m.id === v.mood)?.emoji ?? "📝"}</span>
                <div>
                  <p className="text-xs font-bold text-muted-foreground">{new Date(d).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</p>
                  {v.note && <p className="text-sm">{v.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Water */}
        <section className="glass shadow-soft rounded-[2rem] p-6">
          <h2 className="font-display text-xl font-extrabold flex items-center gap-2"><Droplets className="h-5 w-5 text-primary" /> Water</h2>
          <p className="text-sm text-muted-foreground mt-1">{water} / 8 glasses today</p>
          <div className="mt-3 grid grid-cols-8 gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                onClick={() => patch({ water: i + 1 === water ? i : i + 1 })}
                className={`aspect-square rounded-xl grid place-items-center transition ${i < water ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-white/70 hover:bg-white"}`}
              >
                <Droplets className="h-4 w-4" />
              </button>
            ))}
          </div>
        </section>

        {/* Sleep */}
        <section className="glass shadow-soft rounded-[2rem] p-6">
          <h2 className="font-display text-xl font-extrabold flex items-center gap-2"><Moon className="h-5 w-5 text-primary" /> Sleep</h2>
          <p className="text-sm text-muted-foreground mt-1">{day.sleep ?? 0} hours last night</p>
          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={day.sleep ?? 0}
            onChange={(e) => patch({ sleep: Number(e.target.value) })}
            className="mt-4 w-full accent-primary"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {(day.sleep ?? 0) >= 7 ? "Beautiful — your hormones love this. 💜" : "Aim for 7–9 hours to keep your cycle steady."}
          </p>
        </section>
      </div>

      {/* Medication */}
      <section className="glass shadow-soft rounded-[2rem] p-6">
        <h2 className="font-display text-xl font-extrabold flex items-center gap-2"><Pill className="h-5 w-5 text-primary" /> Medication</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
            placeholder="Iron tablet, folic acid…"
            className="flex-1 min-w-[12rem] rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none px-4 py-2.5 font-semibold"
          />
          <input
            type="time"
            value={medTime}
            onChange={(e) => setMedTime(e.target.value)}
            className="rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none px-3 py-2.5 font-semibold"
          />
          <button onClick={addMed} className="rounded-2xl bg-gradient-primary text-primary-foreground font-bold px-4 py-2.5 shadow-soft flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {s.medications.length === 0 && <p className="text-sm text-muted-foreground">No medicines yet. Add one above to get a daily tick-list.</p>}
          {s.medications.map((m) => {
            const taken = (day.meds ?? []).includes(m.id);
            return (
              <div key={m.id} className="rounded-2xl bg-white/70 px-4 py-3 flex items-center gap-3">
                <button
                  onClick={() => toggleMed(m.id)}
                  className={`h-8 w-8 rounded-full grid place-items-center transition ${taken ? "bg-gradient-primary text-primary-foreground" : "bg-white border-2 border-border"}`}
                  aria-label={taken ? "Mark as not taken" : "Mark as taken"}
                >
                  <Check className="h-4 w-4" />
                </button>
                <div className="flex-1">
                  <p className={`font-bold ${taken ? "line-through opacity-60" : ""}`}>{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.time}</p>
                </div>
                <button onClick={() => removeMed(m.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
