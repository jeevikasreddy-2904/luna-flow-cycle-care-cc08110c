import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, RefreshCw, Volume2 } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/thoughts")({
  head: () => ({ meta: [{ title: "Daily thoughts — Luna Flow" }] }),
  component: ThoughtsPage,
});

const thoughts = [
  "Your cycle is not a curse — it's a quiet kind of magic.",
  "You don't have to earn rest. You deserve it always.",
  "Cramps remind you that your body is alive and doing extraordinary work.",
  "Soft days are not lazy days. They are healing days.",
  "Period blood is just blood. It's normal, natural, and powerful.",
  "Hormones shift. Worth doesn't.",
  "Hydration is the cheapest skincare and the kindest cycle care.",
  "Move slowly. Breathe deeply. Trust your body's wisdom.",
  "Crying during your period is also a form of release.",
  "Feed your body warmth — warm foods, warm tea, warm thoughts.",
];

function ThoughtsPage() {
  const [i, setI] = useState(() => Math.floor(Math.random() * thoughts.length));

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6">
        <h1 className="font-display text-3xl font-extrabold">Thoughts to bloom by ✨</h1>
        <p className="text-muted-foreground mt-1">A little something to carry you through.</p>
      </div>

      <div className="bg-gradient-sunrise shadow-glow rounded-[2.5rem] p-10 text-center">
        <Sparkles className="mx-auto h-10 w-10 mb-4 animate-pulse-soft" />
        <p className="font-display text-2xl md:text-3xl font-extrabold leading-snug">"{thoughts[i]}"</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setI((i + 1) % thoughts.length)}
            className="rounded-full bg-white/80 hover:bg-white px-5 py-3 font-bold shadow-soft flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Another
          </button>
          <button
            onClick={() => speak(thoughts[i])}
            className="rounded-full bg-gradient-primary text-primary-foreground px-5 py-3 font-bold shadow-soft flex items-center gap-2"
          >
            <Volume2 className="h-4 w-4" /> Hear it
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {thoughts.map((t, idx) => (
          <button
            key={idx}
            onClick={() => { setI(idx); speak(t); }}
            className="text-left glass shadow-soft rounded-3xl p-4 hover:shadow-glow transition"
          >
            <p className="text-sm text-foreground/80">"{t}"</p>
          </button>
        ))}
      </div>
    </div>
  );
}
