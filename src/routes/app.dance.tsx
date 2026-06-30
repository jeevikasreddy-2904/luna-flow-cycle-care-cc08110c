import { createFileRoute } from "@tanstack/react-router";
import { Music2, Play } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/dance")({
  head: () => ({ meta: [{ title: "Dance for cramp relief — Luna Flow" }] }),
  component: DancePage,
});

const moves = [
  { name: "Hip Sway Groove", emoji: "💃🏽", time: "3 min", desc: "Sway your hips side to side to a slow beat. Loosens the lower belly and melts cramps.", bg: "bg-pink" },
  { name: "Belly Roll", emoji: "🌀", time: "2 min", desc: "Gentle belly rolls — stand tall and roll your tummy like a wave. Stimulates blood flow.", bg: "bg-peach" },
  { name: "Shoulder Shimmy", emoji: "✨", time: "1 min", desc: "Shake out the tension in your shoulders. Releases stress hormones that worsen cramps.", bg: "bg-lavender" },
  { name: "Slow Twirl", emoji: "🪩", time: "2 min", desc: "Spin in a slow circle with arms above your head. Opens your hips and lifts your mood.", bg: "bg-mint" },
  { name: "Free Flow Freestyle", emoji: "🦋", time: "5 min", desc: "Put on your favourite song and dance however your body wants. No rules — just release.", bg: "bg-lemon" },
  { name: "Cooling Sway-Down", emoji: "🌙", time: "2 min", desc: "Sway gently, lower your arms, breathe deep. Slow your heart and end on calm.", bg: "bg-sky" },
];

function DancePage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-sunrise shadow-soft rounded-[2rem] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Music2 className="h-5 w-5" />
          <span className="text-xs font-bold tracking-widest">CRAMP RELIEF</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold">Dance the cramps away 💃🏽</h1>
        <p className="text-foreground/80 mt-1">Soft, sensual movement to ease your belly and lift your mood.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {moves.map((m) => (
          <button
            key={m.name}
            onClick={() => speak(`${m.name}. ${m.desc}`)}
            className="text-left glass shadow-soft rounded-3xl p-5 hover:shadow-glow transition group"
          >
            <div className={`h-14 w-14 rounded-2xl ${m.bg} grid place-items-center text-3xl mb-3 group-hover:scale-110 transition`}>{m.emoji}</div>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg">{m.name}</h3>
              <span className="text-xs font-bold rounded-full bg-white/70 px-2 py-1">{m.time}</span>
            </div>
            <p className="text-sm text-foreground/70 mt-2">{m.desc}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              <Play className="h-3.5 w-3.5" /> Hear the cue
            </div>
          </button>
        ))}
      </div>

      <div className="glass shadow-soft rounded-[2rem] p-6">
        <h2 className="font-display font-extrabold text-xl mb-2">Why dance?</h2>
        <p className="text-foreground/80">Dancing releases endorphins, increases pelvic circulation, and signals your body that it's safe to relax — three things that fight cramps fast.</p>
      </div>
    </div>
  );
}
