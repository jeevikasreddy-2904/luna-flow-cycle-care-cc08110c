import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { speak, primeVoices } from "@/lib/voice";
import { updateState, type Onboarding } from "@/lib/storage";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Quick check-in — Luna Flow" }] }),
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
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Partial<Onboarding>>({});

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
      speak("Thank you for sharing. Let's mark your last period dates next.");
      setTimeout(() => navigate({ to: "/app/calendar" }), 800);
    }
  };

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
