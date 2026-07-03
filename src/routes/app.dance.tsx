import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Music2, Play, Pause, X, ListOrdered } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/dance")({
  head: () => ({ meta: [{ title: "Dance for cramp relief — Luna Flow" }] }),
  component: DancePage,
});

type Move = {
  name: string;
  emoji: string;
  time: string;
  desc: string;
  bg: string;
  gradient: string;
  steps: string[];
};

const moves: Move[] = [
  {
    name: "Hip Sway Groove", emoji: "💃🏽", time: "3 min", bg: "bg-pink", gradient: "bg-gradient-sunrise",
    desc: "Sway your hips side to side to a slow beat. Loosens the lower belly and melts cramps.",
    steps: [
      "Stand with feet shoulder-width apart, knees soft.",
      "Place both hands on your lower belly.",
      "Slowly sway your hips right, then left — 4 counts each side.",
      "Breathe in as you sway right, breathe out as you sway left.",
      "Repeat for 3 minutes. Feel warmth spread through your lower belly.",
    ],
  },
  {
    name: "Belly Roll", emoji: "🌀", time: "2 min", bg: "bg-peach", gradient: "bg-gradient-meadow",
    desc: "Gentle belly rolls — stand tall and roll your tummy like a wave. Stimulates blood flow.",
    steps: [
      "Stand tall, feet hip-width apart.",
      "Tuck your pelvis under, then push your belly forward like a wave.",
      "Roll from chest → belly → hips in one smooth motion.",
      "Keep breathing softly, never force it.",
      "8 slow rolls, rest, then 8 more.",
    ],
  },
  {
    name: "Shoulder Shimmy", emoji: "✨", time: "1 min", bg: "bg-lavender", gradient: "bg-gradient-dreamy",
    desc: "Shake out the tension in your shoulders. Releases stress hormones that worsen cramps.",
    steps: [
      "Stand or sit tall.",
      "Alternate pushing one shoulder forward, then the other, quickly.",
      "Keep it playful — shimmy for 30 seconds.",
      "Rest, roll shoulders backwards 5 times.",
      "Repeat once more.",
    ],
  },
  {
    name: "Slow Twirl", emoji: "🪩", time: "2 min", bg: "bg-mint", gradient: "bg-gradient-primary",
    desc: "Spin in a slow circle with arms above your head. Opens your hips and lifts your mood.",
    steps: [
      "Raise both arms overhead, palms soft.",
      "Take small steps to slowly rotate on the spot.",
      "One full turn should take about 8 seconds.",
      "Turn one way for 1 minute, then the other for 1 minute.",
      "Finish with hands on heart, deep breath.",
    ],
  },
  {
    name: "Free Flow Freestyle", emoji: "🦋", time: "5 min", bg: "bg-lemon", gradient: "bg-gradient-sunrise",
    desc: "Put on your favourite song and dance however your body wants. No rules — just release.",
    steps: [
      "Pick a song you love from the Music tab.",
      "Close your eyes for the first 15 seconds.",
      "Move whatever wants to move — hips, shoulders, hands.",
      "No mirrors, no judgement, just release.",
      "End by placing both hands on your belly and smiling.",
    ],
  },
  {
    name: "Cooling Sway-Down", emoji: "🌙", time: "2 min", bg: "bg-sky", gradient: "bg-gradient-dreamy",
    desc: "Sway gently, lower your arms, breathe deep. Slow your heart and end on calm.",
    steps: [
      "Start with arms raised overhead, swaying gently.",
      "With each breath out, lower your arms an inch.",
      "By 90 seconds, hands should rest at your sides.",
      "Fold forward slowly, hands to knees.",
      "Rise up one vertebra at a time. Done.",
    ],
  },
];

function DancePage() {
  const [open, setOpen] = useState<Move | null>(null);
  return (
    <div className="space-y-6">
      <div className="bg-gradient-sunrise shadow-soft rounded-[2rem] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Music2 className="h-5 w-5" />
          <span className="text-xs font-bold tracking-widest">CRAMP RELIEF</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold">Dance the cramps away 💃🏽</h1>
        <p className="text-foreground/80 mt-1">Tap a move for full-screen video-style steps.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {moves.map((m) => (
          <button
            key={m.name}
            onClick={() => { setOpen(m); speak(`${m.name}. ${m.desc}`); }}
            className="text-left glass shadow-soft rounded-3xl p-5 hover:shadow-glow transition group"
          >
            <div className={`h-14 w-14 rounded-2xl ${m.bg} grid place-items-center text-3xl mb-3 group-hover:scale-110 transition`}>{m.emoji}</div>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg">{m.name}</h3>
              <span className="text-xs font-bold rounded-full bg-white/70 px-2 py-1">{m.time}</span>
            </div>
            <p className="text-sm text-foreground/70 mt-2">{m.desc}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              <Play className="h-3.5 w-3.5" /> Watch & follow
            </div>
          </button>
        ))}
      </div>

      {open && <FullScreenPlayer move={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function FullScreenPlayer({ move, onClose }: { move: Move; onClose: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!playing) return;
    speak(`Step ${current + 1}. ${move.steps[current]}`);
    const iv = setTimeout(() => {
      setCurrent((c) => (c + 1 < move.steps.length ? c + 1 : c));
    }, 8000);
    return () => clearTimeout(iv);
  }, [playing, current, move.steps]);

  return (
    <div className="fixed inset-0 z-[70] bg-black">
      <div className={`absolute inset-0 ${move.gradient}`}>
        <div className="absolute inset-0 grid place-items-center">
          <span className={`text-[14rem] ${playing ? "animate-pulse-soft" : ""}`}>{move.emoji}</span>
        </div>
      </div>

      {/* top bar */}
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between">
        <div className="glass rounded-full px-3 py-1.5 text-xs font-extrabold">{move.name} · {move.time}</div>
        <button onClick={onClose} className="glass rounded-full p-2" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* steps overlay */}
      <div className="absolute bottom-0 inset-x-0 p-4">
        <div className="glass rounded-3xl p-5 shadow-glow">
          <div className="flex items-center gap-2 mb-3">
            <ListOrdered className="h-5 w-5 text-primary" />
            <h3 className="font-display font-extrabold">Follow along</h3>
          </div>
          <ol className="space-y-2">
            {move.steps.map((s, i) => (
              <li
                key={i}
                className={`flex gap-3 text-sm transition ${i === current ? "text-foreground font-bold" : "text-foreground/50"}`}
              >
                <span className={`h-6 w-6 shrink-0 rounded-full grid place-items-center text-xs font-extrabold ${i === current ? "bg-gradient-primary text-primary-foreground" : "bg-white/70"}`}>{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="mt-4 w-full rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3 shadow-soft flex items-center justify-center gap-2"
          >
            {playing ? <><Pause className="h-4 w-4" /> Pause guide</> : <><Play className="h-4 w-4" /> Resume guide</>}
          </button>
        </div>
      </div>
    </div>
  );
}
