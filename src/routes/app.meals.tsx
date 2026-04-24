import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { loadState, logMealForToday } from "@/lib/storage";
import { Flame, Sparkles } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/meals")({
  head: () => ({ meta: [{ title: "Meals — Luna Flow" }] }),
  component: MealsPage,
});

// rough protein estimate per meal text (very simple keyword scoring)
function estimateProtein(text: string): number {
  const t = text.toLowerCase();
  let g = 0;
  const map: [string, number][] = [
    ["egg", 6], ["eggs", 12], ["chicken", 25], ["paneer", 18], ["tofu", 15],
    ["lentil", 18], ["dal", 18], ["fish", 22], ["yogurt", 10], ["milk", 8],
    ["nuts", 6], ["almond", 6], ["peanut", 8], ["beans", 15], ["quinoa", 8],
    ["oats", 5], ["cheese", 7], ["soy", 12],
  ];
  for (const [k, v] of map) if (t.includes(k)) g += v;
  return g;
}

const thoughts = [
  "Your cycle is a superpower, not a setback. 💖",
  "Rest is productive. Honor your body's rhythm.",
  "Cramps pass. Strength stays.",
  "A warm cup of tea is a tiny hug from inside.",
  "You don't have to glow constantly. Soft is also beautiful.",
  "Track gently, live wildly.",
];

function MealsPage() {
  const [s, setS] = useState(() => loadState());
  const today = new Date().toISOString().slice(0, 10);
  const existing = s.meals[today];
  const [breakfast, setBreakfast] = useState(existing?.breakfast ?? "");
  const [lunch, setLunch] = useState(existing?.lunch ?? "");
  const [dinner, setDinner] = useState(existing?.dinner ?? "");
  const [thought, setThought] = useState<string | null>(null);

  const protein = estimateProtein(breakfast) + estimateProtein(lunch) + estimateProtein(dinner);

  const save = () => {
    const next = logMealForToday({ breakfast, lunch, dinner, protein });
    setS(next);
    const t = thoughts[Math.floor(Math.random() * thoughts.length)];
    setThought(t);
    speak(t);
  };

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Today's meals 🍓</h1>
          <p className="text-muted-foreground mt-1">Log your meals to nourish your cycle.</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end font-display font-extrabold text-2xl">
            <Flame className="h-6 w-6 text-primary" /> {s.streak}
          </div>
          <p className="text-xs text-muted-foreground">day streak</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <MealCard label="Breakfast" emoji="🥣" value={breakfast} onChange={setBreakfast} bg="bg-peach" />
        <MealCard label="Lunch" emoji="🥗" value={lunch} onChange={setLunch} bg="bg-mint" />
        <MealCard label="Dinner" emoji="🍲" value={dinner} onChange={setDinner} bg="bg-lavender" />
      </div>

      <div className="glass shadow-soft rounded-[2rem] p-6">
        <p className="text-xs font-bold text-muted-foreground tracking-widest">ESTIMATED PROTEIN TODAY</p>
        <div className="mt-2 flex items-end gap-2">
          <span className="font-display text-5xl font-extrabold text-gradient">{protein}</span>
          <span className="font-bold text-foreground/70 mb-1">grams</span>
        </div>
        <div className="mt-3 h-3 rounded-full bg-white/60 overflow-hidden">
          <div className="h-full bg-gradient-primary transition-all" style={{ width: `${Math.min(100, (protein / 60) * 100)}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Goal: ~60g per day</p>

        <button
          onClick={save}
          className="mt-5 w-full rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3.5 shadow-soft hover:shadow-glow transition"
        >
          Save today's meals
        </button>
      </div>

      {thought && (
        <div className="bg-gradient-sunrise shadow-glow rounded-[2rem] p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-display font-extrabold">A little thought for you</h3>
          </div>
          <p className="text-lg font-semibold italic">{thought}</p>
        </div>
      )}
    </div>
  );
}

function MealCard({ label, emoji, value, onChange, bg }: { label: string; emoji: string; value: string; onChange: (v: string) => void; bg: string }) {
  return (
    <div className="glass shadow-soft rounded-3xl p-5">
      <div className={`h-10 w-10 rounded-2xl ${bg} grid place-items-center mb-3 text-xl`}>{emoji}</div>
      <p className="font-display font-extrabold text-lg">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="What did you eat? e.g., eggs, oats, lentils..."
        className="mt-3 w-full rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none px-4 py-3 text-foreground font-medium placeholder:text-muted-foreground/60 transition resize-none"
      />
    </div>
  );
}
