import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/exercise")({
  head: () => ({ meta: [{ title: "Yoga & Exercise — Luna Flow" }] }),
  component: ExercisePage,
});

const poses = [
  { name: "Child's Pose", emoji: "🧘🏽‍♀️", time: "2 min", desc: "Gently relieves lower back tension and cramps.", bg: "bg-pink" },
  { name: "Cat-Cow Stretch", emoji: "🐈", time: "3 min", desc: "Eases period cramps and improves circulation.", bg: "bg-lavender" },
  { name: "Reclining Twist", emoji: "🌀", time: "4 min", desc: "Calms the nervous system and soothes bloating.", bg: "bg-peach" },
  { name: "Legs-Up-The-Wall", emoji: "🦋", time: "5 min", desc: "Reduces fatigue and gently stretches hamstrings.", bg: "bg-mint" },
  { name: "Bound Angle Pose", emoji: "🌸", time: "3 min", desc: "Opens hips and supports reproductive health.", bg: "bg-lemon" },
  { name: "Savasana", emoji: "🌙", time: "5 min", desc: "Deep rest. Let your body absorb the love.", bg: "bg-sky" },
];

const tips = [
  "Walk for 10–15 minutes daily — gentle is better than intense during your period.",
  "Apply a warm compress on your lower belly to ease cramps.",
  "Avoid skipping meals — your body is working hard, fuel it.",
  "Magnesium-rich foods (dark chocolate, bananas, almonds) help with cramps.",
];

function ExercisePage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-meadow shadow-soft rounded-[2rem] p-6">
        <h1 className="font-display text-3xl font-extrabold">Move with love 🧘🏽‍♀️</h1>
        <p className="text-foreground/80 mt-1">Gentle yoga & self-care for a happy cycle.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {poses.map((p) => (
          <button
            key={p.name}
            onClick={() => speak(`${p.name}. ${p.desc}`)}
            className="text-left glass shadow-soft rounded-3xl p-5 hover:shadow-glow transition group"
          >
            <div className={`h-14 w-14 rounded-2xl ${p.bg} grid place-items-center text-3xl mb-3 group-hover:scale-110 transition`}>{p.emoji}</div>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg">{p.name}</h3>
              <span className="text-xs font-bold rounded-full bg-white/70 px-2 py-1">{p.time}</span>
            </div>
            <p className="text-sm text-foreground/70 mt-2">{p.desc}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              <Play className="h-3.5 w-3.5" /> Hear about it
            </div>
          </button>
        ))}
      </div>

      <div className="glass shadow-soft rounded-[2rem] p-6">
        <h2 className="font-display font-extrabold text-xl mb-3">💡 Self-care tips</h2>
        <ul className="space-y-2">
          {tips.map((t, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-1 h-2 w-2 rounded-full bg-gradient-primary shrink-0" />
              <span className="text-foreground/80">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
