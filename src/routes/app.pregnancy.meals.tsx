import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { loadState, logMealForToday, estimateProteinFromText, safeProteinRange } from "@/lib/storage";
import { Flame, Sparkles, AlertTriangle, ShieldCheck, Snowflake, Baby, Ban } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/pregnancy/meals")({
  head: () => ({ meta: [{ title: "Pregnancy meals — Luna Flow" }] }),
  component: PregnancyMealsPage,
});

const AVOID = [
  "Raw or undercooked fish (sushi, oysters)",
  "High-mercury fish (shark, swordfish, king mackerel)",
  "Unpasteurized milk, cheese or juice",
  "Raw or runny eggs",
  "Deli meats unless heated steaming hot",
  "Excess caffeine (> 200mg/day)",
  "Alcohol — none is safest",
];

const thoughts = [
  "Every bite is love shared with your little one 🤍",
  "Slow meals, deep breaths, and lots of water today.",
  "Your body is growing a whole person — be gentle with it.",
];

function PregnancyMealsPage() {
  const [s, setS] = useState(() => loadState());
  const today = new Date().toISOString().slice(0, 10);
  const existing = s.meals[today];
  const [breakfast, setBreakfast] = useState(existing?.breakfast ?? "");
  const [lunch, setLunch] = useState(existing?.lunch ?? "");
  const [dinner, setDinner] = useState(existing?.dinner ?? "");
  const [thought, setThought] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [usedFreezer, setUsedFreezer] = useState(0);

  const protein =
    estimateProteinFromText(breakfast) +
    estimateProteinFromText(lunch) +
    estimateProteinFromText(dinner);

  const range = safeProteinRange(s.profile, "pregnancy");

  const save = () => {
    const { state, usedFreezer } = logMealForToday({ breakfast, lunch, dinner, protein });
    setS(state);
    setUsedFreezer(usedFreezer);

    let msg = "";
    if (protein < range.min) {
      msg = `You've had about ${protein} grams of protein today. During pregnancy, try to reach at least ${range.min} grams — add dal, paneer, eggs, curd, or lean chicken.`;
    } else if (protein > range.max) {
      msg = `You've had about ${protein} grams of protein today. That's above your safe range of ${range.max} grams — please reduce protein-heavy foods and drink plenty of water.`;
    } else {
      msg = `Beautiful! ${protein} grams of protein today, right within your safe pregnancy range of ${range.min} to ${range.max} grams.`;
    }
    if (range.note) msg += ` Note: ${range.note}.`;
    if (usedFreezer > 0) msg += ` I used ${usedFreezer} streak freezer to keep your streak safe.`;

    setFeedback(msg);
    const t = thoughts[Math.floor(Math.random() * thoughts.length)];
    setThought(t);
    speak(msg + " " + t);
  };

  const proteinStatus = protein < range.min ? "low" : protein > range.max ? "high" : "ok";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-sunrise shadow-soft rounded-[2rem] p-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Baby className="h-4 w-4" />
            <span className="text-xs font-bold tracking-widest">PREGNANCY MEALS</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold">Eat for two, gently 🤍</h1>
          <p className="text-foreground/80 mt-1">Higher protein needs. Softer, richer foods.</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end font-display font-extrabold text-2xl">
            <Flame className="h-6 w-6 text-primary" /> {s.streak}
          </div>
          <p className="text-xs text-muted-foreground">day streak</p>
          <div className="flex items-center gap-1 justify-end mt-1 text-xs font-bold text-sky-600">
            <Snowflake className="h-3.5 w-3.5" /> {s.streakFreezers} freezer{s.streakFreezers === 1 ? "" : "s"}
          </div>
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
        <div className="mt-3 relative h-3 rounded-full bg-white/60 overflow-hidden">
          <div
            className={`h-full transition-all ${
              proteinStatus === "high" ? "bg-red-400" : proteinStatus === "low" ? "bg-amber-400" : "bg-gradient-primary"
            }`}
            style={{ width: `${Math.min(100, (protein / range.max) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Pregnancy safe range: <b>{range.min}–{range.max} g/day</b>
          {range.note && <> · {range.note}</>}
        </p>

        <button
          onClick={save}
          className="mt-5 w-full rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3.5 shadow-soft hover:shadow-glow transition"
        >
          Save today's meals
        </button>
      </div>

      {feedback && (
        <div
          className={`shadow-soft rounded-[2rem] p-6 border-2 ${
            proteinStatus === "high"
              ? "bg-red-50 border-red-300"
              : proteinStatus === "low"
              ? "bg-amber-50 border-amber-300"
              : "bg-mint/40 border-emerald-300"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {proteinStatus === "high" ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            )}
            <h3 className="font-display font-extrabold">Protein check</h3>
          </div>
          <p className="text-sm font-semibold text-foreground/80">{feedback}</p>
          {usedFreezer > 0 && (
            <p className="text-xs text-sky-700 mt-2 flex items-center gap-1">
              <Snowflake className="h-3.5 w-3.5" /> {usedFreezer} streak freezer used ({s.streakFreezers} left).
            </p>
          )}
        </div>
      )}

      <div className="glass shadow-soft rounded-[2rem] p-6">
        <div className="flex items-center gap-2 mb-3">
          <Ban className="h-5 w-5 text-red-500" />
          <h3 className="font-display font-extrabold text-lg">Foods to avoid</h3>
        </div>
        <ul className="grid sm:grid-cols-2 gap-2">
          {AVOID.map((a) => (
            <li key={a} className="text-sm bg-white/70 rounded-2xl px-3 py-2 flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span> {a}
            </li>
          ))}
        </ul>
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

function MealCard({
  label, emoji, value, onChange, bg,
}: { label: string; emoji: string; value: string; onChange: (v: string) => void; bg: string }) {
  return (
    <div className="glass shadow-soft rounded-3xl p-5">
      <div className={`h-10 w-10 rounded-2xl ${bg} grid place-items-center mb-3 text-xl`}>{emoji}</div>
      <p className="font-display font-extrabold text-lg">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="e.g., 2 idli, dal tadka, curd, palak paneer..."
        className="mt-3 w-full rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none px-4 py-3 text-foreground font-medium placeholder:text-muted-foreground/60 transition resize-none"
      />
    </div>
  );
}
