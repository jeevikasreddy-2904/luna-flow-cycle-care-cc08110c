import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadState } from "@/lib/storage";
import { Flame, Droplets, Calendar, Heart, Sparkles } from "lucide-react";
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
  const [s, setS] = useState(() => loadState());
  const [greet] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  useEffect(() => {
    setS(loadState());
    speak(`Hello ${loadState().profile?.name ?? "love"}. ${greet}`);
  }, [greet]);

  const lastPeriod = s.periodDates.sort().at(-1);

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6">
        <p className="text-xs font-bold text-muted-foreground tracking-widest">HELLO</p>
        <h1 className="font-display text-3xl font-extrabold mt-1">
          Hi {s.profile?.name?.split(" ")[0] ?? "love"} 🌸
        </h1>
        <p className="text-foreground/80 mt-2 italic">"{greet}"</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Flame} label="Streak" value={`${s.streak} 🔥`} bg="bg-peach" />
        <Stat icon={Calendar} label="Last period" value={lastPeriod ? new Date(lastPeriod).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "—"} bg="bg-pink" />
        <Stat icon={Droplets} label="Logged days" value={`${Object.keys(s.meals).length}`} bg="bg-sky" />
        <Stat icon={Heart} label="Cycle care" value="Active" bg="bg-lavender" />
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
          <p className="text-xs text-foreground/60 mt-3">Tip: Every 5 days you reach a new milestone.</p>
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
