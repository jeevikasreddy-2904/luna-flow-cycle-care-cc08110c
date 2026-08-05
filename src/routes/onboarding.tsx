import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { speak, primeVoices } from "@/lib/voice";
import { loadState, updateState, type Onboarding } from "@/lib/storage";
import { CalendarHeart } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Quick check-in — Luna Flow" },
      { name: "description", content: "A 10-question check-in so Luna can personalise your cycle care." },
      { property: "og:title", content: "Quick check-in — Luna Flow" },
      { property: "og:description", content: "A 10-question check-in so Luna can personalise your cycle care." },
    ],
  }),
  component: OnboardingPage,
});

const questions: { key: keyof Onboarding; q: string; emoji: string }[] = [
  { key: "cramps", q: "Do you usually have cramps during your period?", emoji: "🤕" },
  { key: "skipsMeals", q: "Do you skip meals during your cycle?", emoji: "🍽️" },
  { key: "drinksWater", q: "Do you drink enough water daily?", emoji: "💧" },
  { key: "exercises", q: "Do you exercise & follow self-care during periods?", emoji: "🧘🏽‍♀️" },
  { key: "onTime", q: "Does your period usually arrive on time?", emoji: "📅" },
  { key: "delays", q: "Does it sometimes get delayed?", emoji: "⏳" },
  { key: "early", q: "Or come earlier than expected?", emoji: "⚡" },
  { key: "sleepWell", q: "Do you sleep at least 7 hours most nights?", emoji: "😴" },
  { key: "moodSwings", q: "Do you notice big mood swings before your period?", emoji: "🎭" },
  { key: "heavyFlow", q: "Is your flow usually heavy?", emoji: "🩸" },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Partial<Onboarding>>({});
  const [askDate, setAskDate] = useState(false);
  const [lastPeriod, setLastPeriod] = useState("");

  useEffect(() => {
    primeVoices();
    speak("Let's get to know your cycle a little better.");
  }, []);

  const current = questions[i];
  const total = questions.length;

  const choose = (val: string) => {
    const next = { ...answers, [current.key]: val };
    setAnswers(next);
    if (i < total - 1) setI(i + 1);
    else {
      updateState({ onboarding: next as Onboarding });
      const already = loadState().periodDates.length > 0;
      if (already) {
        speak("Thank you for sharing. Your dashboard is ready.");
        setTimeout(() => navigate({ to: "/app" }), 700);
      } else {
        speak("Thank you for sharing. One last thing — when did your last period start?");
        setAskDate(true);
      }
    }
  };

  const saveDate = () => {
    if (lastPeriod) updateState({ periodDates: [lastPeriod] });
    navigate({ to: "/app" });
  };

  if (askDate) {
    return (
      <div className="min-h-screen grid place-items-center px-4 py-10">
        <div className="w-full max-w-lg glass shadow-glow rounded-[2rem] p-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <CalendarHeart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-extrabold mt-4">When did your last period start?</h2>
          <p className="text-muted-foreground mt-1 text-sm">Luna predicts your next period, ovulation day and fertile window from this.</p>
          <input
            type="date"
            value={lastPeriod}
            onChange={(e) => setLastPeriod(e.target.value)}
            className="mt-5 w-full rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none px-4 py-3 font-semibold text-center"
          />
          <button
            onClick={saveDate}
            disabled={!lastPeriod}
            className="mt-5 w-full rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3.5 shadow-soft disabled:opacity-40"
          >
            Open my dashboard
          </button>
          <button onClick={() => navigate({ to: "/app" })} className="mt-3 text-xs font-bold text-muted-foreground hover:text-primary">
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex gap-1 mb-6">
          {questions.map((_, idx) => (
            <div key={idx} className={`h-1.5 flex-1 rounded-full transition ${idx <= i ? "bg-gradient-primary" : "bg-white/60"}`} />
          ))}
        </div>

        <div className="glass shadow-glow rounded-[2rem] p-8 text-center">
          <div className="text-6xl mb-4">{current.emoji}</div>
          <p className="text-xs font-bold text-muted-foreground tracking-widest">QUESTION {i + 1} / {total}</p>
          <h2 className="font-display text-2xl font-extrabold mt-2">{current.q}</h2>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Yes", "Sometimes", "No"].map((opt) => (
              <button
                key={opt}
                onClick={() => choose(opt)}
                className="rounded-2xl bg-white/80 hover:bg-gradient-primary hover:text-primary-foreground font-bold py-4 shadow-soft transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
