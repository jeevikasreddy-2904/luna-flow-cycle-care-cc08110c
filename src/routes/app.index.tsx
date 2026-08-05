import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadState, updateState, getDayLog, setDayLog, type AppMode, type Mood } from "@/lib/storage";
import { getCycleInfo, PHASE_INFO } from "@/lib/cycle";
import { Flame, Droplets, Calendar, Heart, Sparkles, Baby, Flower2, Egg, Pill, Utensils, Moon } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Home — Luna Flow" },
      { name: "description", content: "Your cycle day, next period, fertile window, mood and daily reminders." },
    ],
  }),
  component: Home,
});

const greetings = [
  "You are blooming today, beautiful.",
  "Your body is doing magic. Trust it.",
  "Gentle days call for gentle hearts.",
  "Hydrate, rest, repeat. You're glowing.",
];

const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: "great", emoji: "🤩", label: "Great" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "low", emoji: "😔", label: "Low" },
  { id: "awful", emoji: "😣", label: "Awful" },
];

function fmt(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function Home() {
  const navigate = useNavigate();
  const [s, setS] = useState(() => loadState());
  const [cycle, setCycle] = useState(() => getCycleInfo());
  const [day, setDay] = useState(() => getDayLog());
  const [greet] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  useEffect(() => {
    setS(loadState());
    setCycle(getCycleInfo());
    setDay(getDayLog());
    speak(`Hello ${loadState().profile?.name ?? "love"}. ${greet}`);
  }, [greet]);

  const phase = PHASE_INFO[cycle.phase];
  const water = day.water ?? 0;
  const medsTaken = (day.meds ?? []).length;

  const switchMode = (mode: AppMode) => {
    const next = updateState({ mode });
    setS(next);
    if (mode === "pregnancy") {
      speak("Switching to pregnancy care mode.");
      if (!next.pregnancy) navigate({ to: "/app/pregnancy/onboarding" });
      else navigate({ to: "/app/pregnancy" });
    } else {
      speak("Switching to period tracking mode.");
    }
  };

  const pickMood = (m: Mood) => {
    setDay(setDayLog({ mood: m }).days[new Date().toISOString().slice(0, 10)] ?? { mood: m });
    speak("Mood saved. Thank you for checking in.");
  };

  const addWater = () => {
    const next = Math.min(12, water + 1);
    setDayLog({ water: next });
    setDay((d) => ({ ...d, water: next }));
  };

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6">
        <p className="text-xs font-bold text-muted-foreground tracking-widest">HELLO</p>
        <h1 className="font-display text-3xl font-extrabold mt-1">
          Hi {s.profile?.name?.split(" ")[0] ?? "love"} 🌸
        </h1>
        <p className="text-foreground/80 mt-2 italic">"{greet}"</p>
      </div>

      {/* Cycle overview */}
      <div className="bg-gradient-sunrise shadow-soft rounded-[2rem] p-6">
        {cycle.hasData ? (
          <>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-bold tracking-widest opacity-70">CYCLE DAY</p>
                <p className="font-display text-5xl font-extrabold">{cycle.cycleDay}</p>
                <p className="text-sm font-semibold mt-1">{phase.emoji} {phase.label}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <MiniStat icon={Calendar} label="Next period" value={`${fmt(cycle.nextPeriod)} · ${cycle.daysUntilNext}d`} />
                <MiniStat icon={Egg} label="Ovulation" value={fmt(cycle.ovulationDate)} />
                <MiniStat icon={Heart} label="Fertile window" value={`${fmt(cycle.fertileStart)} – ${fmt(cycle.fertileEnd)}`} />
                <MiniStat icon={Moon} label="Avg length" value={`${cycle.avgLength} days`} />
              </div>
            </div>
            <p className="text-sm text-foreground/80 mt-4">{phase.body}</p>
          </>
        ) : (
          <div>
            <h2 className="font-display text-2xl font-extrabold">Let's start your cycle map 📅</h2>
            <p className="text-foreground/80 mt-1 text-sm">Mark your last period on the calendar and Luna will predict your next period, ovulation day and fertile window.</p>
            <Link to="/app/calendar" className="mt-3 inline-block rounded-full bg-white/80 hover:bg-white font-bold text-sm px-4 py-1.5">Open calendar</Link>
          </div>
        )}
      </div>

      {/* Mode switcher */}
      <div className="glass shadow-soft rounded-[2rem] p-5">
        <p className="text-xs font-bold text-muted-foreground tracking-widest mb-3">CARE MODE</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => switchMode("period")}
            className={`rounded-2xl p-4 text-left transition border-2 ${s.mode === "period" ? "bg-gradient-primary text-primary-foreground border-primary shadow-glow" : "bg-white/60 border-transparent hover:border-primary/40"}`}
          >
            <Flower2 className="h-6 w-6 mb-2" />
            <p className="font-display font-extrabold">Period care</p>
            <p className="text-xs opacity-80">Cycle, cramps, meals</p>
          </button>
          <button
            onClick={() => switchMode("pregnancy")}
            className={`rounded-2xl p-4 text-left transition border-2 ${s.mode === "pregnancy" ? "bg-gradient-sunrise text-foreground border-primary shadow-glow" : "bg-white/60 border-transparent hover:border-primary/40"}`}
          >
            <Baby className="h-6 w-6 mb-2" />
            <p className="font-display font-extrabold">Pregnancy care</p>
            <p className="text-xs opacity-80">Months, symptoms, meals</p>
          </button>
        </div>
      </div>

      {/* Mood check-in */}
      <div className="glass shadow-soft rounded-[2rem] p-6">
        <h3 className="font-display font-extrabold text-lg">How do you feel today?</h3>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => pickMood(m.id)}
              className={`rounded-2xl py-3 text-center transition border-2 ${day.mood === m.id ? "bg-gradient-primary text-primary-foreground border-primary shadow-soft" : "bg-white/70 border-transparent hover:border-primary/40"}`}
            >
              <div className="text-2xl">{m.emoji}</div>
              <p className="text-[10px] font-bold mt-1">{m.label}</p>
            </button>
          ))}
        </div>
        <Link to="/app/trackers" className="mt-3 inline-block text-xs font-bold text-primary hover:underline">Open mood journal & trackers →</Link>
      </div>

      {/* Reminders */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass shadow-soft rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-5 w-5 text-primary" />
            <h3 className="font-display font-extrabold text-lg">Water reminder</h3>
          </div>
          <p className="text-sm text-muted-foreground">{water} / 8 glasses today</p>
          <div className="mt-2 h-2.5 rounded-full bg-white/70 overflow-hidden">
            <div className="h-full bg-gradient-primary transition-all" style={{ width: `${Math.min(100, (water / 8) * 100)}%` }} />
          </div>
          <button onClick={addWater} className="mt-3 rounded-full bg-gradient-primary text-primary-foreground font-bold text-sm px-4 py-1.5 shadow-soft">
            + I drank a glass
          </button>
        </div>

        <div className="glass shadow-soft rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Pill className="h-5 w-5 text-primary" />
            <h3 className="font-display font-extrabold text-lg">Medication</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {s.medications.length
              ? `${medsTaken} / ${s.medications.length} taken today`
              : "No medicines added yet."}
          </p>
          <Link to="/app/trackers" className="mt-3 inline-block rounded-full bg-white/80 hover:bg-white font-bold text-sm px-4 py-1.5 shadow-soft">
            {s.medications.length ? "Mark as taken" : "Add a medicine"}
          </Link>
        </div>
      </div>

      {/* Phase recommendations */}
      {cycle.hasData && (
        <div className="glass shadow-soft rounded-[2rem] p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-display font-extrabold text-lg">Recommended for your {phase.label.toLowerCase()}</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <Rec icon={Utensils} title="Eat" text={phase.food} />
            <Rec icon={Flower2} title="Move" text={phase.move} />
            <Rec icon={Heart} title="Care" text={phase.care} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Flame} label="Streak" value={`${s.streak} 🔥`} bg="bg-peach" />
        <Stat icon={Calendar} label="Last period" value={fmt(cycle.lastPeriodStart)} bg="bg-pink" />
        <Stat icon={Droplets} label="Logged days" value={`${Object.keys(s.meals).length}`} bg="bg-sky" />
        <Stat icon={Heart} label={s.mode === "pregnancy" ? "Preg. care" : "Cycle care"} value="Active" bg="bg-lavender" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass shadow-soft rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-display font-extrabold text-lg">Today's gentle reminder</h3>
          </div>
          <p className="text-foreground/80">Take 5 deep breaths. Stretch. Pour yourself a glass of warm water with a slice of lemon. Your body deserves softness today.</p>
        </div>

        <div className="bg-gradient-meadow shadow-soft rounded-3xl p-6">
          <h3 className="font-display font-extrabold text-lg">Streak boost ⚡</h3>
          <p className="text-foreground/80 mt-1">Log your meals today to keep your streak alive!</p>
          <Link to="/app/meals" className="mt-3 inline-block rounded-full bg-white/80 hover:bg-white font-bold text-sm px-4 py-1.5">Log now</Link>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2">
      <p className="text-[10px] font-bold text-muted-foreground tracking-widest flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label.toUpperCase()}
      </p>
      <p className="font-bold text-sm mt-0.5">{value}</p>
    </div>
  );
}

function Rec({ icon: Icon, title, text }: { icon: typeof Flame; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-4">
      <p className="font-display font-extrabold flex items-center gap-1.5"><Icon className="h-4 w-4 text-primary" /> {title}</p>
      <p className="text-sm text-foreground/80 mt-1">{text}</p>
    </div>
  );
}

function Stat({ icon: Icon, label, value, bg }: { icon: typeof Flame; label: string; value: string; bg: string }) {
  return (
    <div className="glass shadow-soft rounded-3xl p-4">
      <div className={`h-10 w-10 rounded-2xl ${bg} grid place-items-center mb-3`}>
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <p className="text-xs text-muted-foreground font-bold">{label}</p>
      <p className="font-display font-extrabold text-xl">{value}</p>
    </div>
  );
}
