import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadState, updateState, type AppMode } from "@/lib/storage";
import { Flame, Droplets, Calendar, Heart, Sparkles, Baby, Flower2 } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Home — Luna Flow" }] }),
  component: Home,
});

const greetings = [
  "You are blooming today, beautiful.",
  "Your body is doing magic. Trust it.",
  "Gentle days call for gentle hearts.",
  "Hydrate, rest, repeat. You're glowing.",
];

function Home() {
  const navigate = useNavigate();
  const [s, setS] = useState(() => loadState());
  const [greet] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  useEffect(() => {
    setS(loadState());
    speak(`Hello ${loadState().profile?.name ?? "love"}. ${greet}`);
  }, [greet]);

  const lastPeriod = s.periodDates.sort().at(-1);

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

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6">
        <p className="text-xs font-bold text-muted-foreground tracking-widest">HELLO</p>
        <h1 className="font-display text-3xl font-extrabold mt-1">
          Hi {s.profile?.name?.split(" ")[0] ?? "love"} 🌸
        </h1>
        <p className="text-foreground/80 mt-2 italic">"{greet}"</p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Flame} label="Streak" value={`${s.streak} 🔥`} bg="bg-peach" />
        <Stat icon={Calendar} label="Last period" value={lastPeriod ? new Date(lastPeriod).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—"} bg="bg-pink" />
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
