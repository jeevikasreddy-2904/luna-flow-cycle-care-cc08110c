import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { updateState } from "@/lib/storage";
import { speak, requestMicAccess, micGranted } from "@/lib/voice";
import { Baby, Mic, ArrowRight, Check, X } from "lucide-react";

export const Route = createFileRoute("/app/pregnancy/onboarding")({
  head: () => ({ meta: [{ title: "Pregnancy setup — Luna Flow" }] }),
  component: PregnancyOnboarding,
});

const SYMPTOMS = [
  { key: "dizziness",          question: "Are you feeling dizzy or light-headed?" },
  { key: "nausea",              question: "Do you have nausea or morning sickness?" },
  { key: "fatigue",             question: "Do you feel more tired than usual?" },
  { key: "tenderBreasts",       question: "Do your breasts feel tender or sore?" },
  { key: "foodCravings",        question: "Are you having strong food cravings?" },
  { key: "moodSwings",          question: "Do you notice sudden mood swings?" },
  { key: "backPain",            question: "Is there any lower back pain?" },
  { key: "frequentUrination",   question: "Are you going to the bathroom more often?" },
];

type Phase = "mic" | "months" | "symptoms" | "done";

function PregnancyOnboarding() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("mic");
  const [micOk, setMicOk] = useState<boolean>(() => micGranted());
  const [months, setMonths] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (phase === "symptoms") {
      const q = SYMPTOMS[idx];
      if (q) speak(q.question);
    }
  }, [phase, idx]);

  useEffect(() => {
    if (phase === "months") speak("First, how many months has it been since your last period?");
  }, [phase]);

  const askMic = async () => {
    const ok = await requestMicAccess();
    setMicOk(ok);
    setPhase("months");
  };

  const answer = (val: boolean) => {
    const key = SYMPTOMS[idx].key;
    setAnswers((a) => ({ ...a, [key]: val }));
    if (idx + 1 < SYMPTOMS.length) {
      setIdx(idx + 1);
    } else {
      const symptoms = { ...answers, [key]: val };
      updateState({
        mode: "pregnancy",
        pregnancy: { monthsMissed: months, symptoms, startedAt: new Date().toISOString() },
      });
      speak("All set. Welcome to your pregnancy care space.");
      setPhase("done");
      setTimeout(() => navigate({ to: "/app/pregnancy" }), 1600);
    }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center">
      <div className="w-full max-w-lg glass shadow-glow rounded-[2rem] p-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-sunrise grid place-items-center">
            <Baby className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-muted-foreground">PREGNANCY CARE</p>
            <h1 className="font-display text-2xl font-extrabold">Let's set you up 🤍</h1>
          </div>
        </div>

        {phase === "mic" && (
          <div className="mt-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-white/80 grid place-items-center shadow-soft">
              <Mic className="h-7 w-7 text-primary" />
            </div>
            <p className="mt-4 text-foreground/80">
              May I use your microphone so a soft girl voice can guide you through these questions?
            </p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => { setMicOk(false); setPhase("months"); }} className="flex-1 rounded-2xl bg-white/80 hover:bg-white font-bold py-3">No thanks</button>
              <button onClick={askMic} className="flex-1 rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3">Allow voice</button>
            </div>
            {micOk && <p className="text-xs text-emerald-700 mt-3">Mic already granted for this session.</p>}
          </div>
        )}

        {phase === "months" && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">How many months since your last period?</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`rounded-2xl py-3 font-display font-extrabold text-lg transition ${
                    months === m ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-white/70 hover:bg-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Approx. week {Math.max(4, Math.round(months * 4.3) + 4)}</p>
            <button
              onClick={() => setPhase("symptoms")}
              className="mt-5 w-full rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3.5 shadow-soft flex items-center justify-center gap-2"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {phase === "symptoms" && (
          <div className="mt-6">
            <p className="text-xs font-bold text-muted-foreground">Question {idx + 1} of {SYMPTOMS.length}</p>
            <h2 className="font-display text-2xl font-extrabold mt-2">{SYMPTOMS[idx].question}</h2>
            <p className="text-xs text-muted-foreground mt-1">Tap Yes or No — no typing needed.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => answer(false)}
                className="rounded-2xl bg-white/80 hover:bg-white font-display font-extrabold text-lg py-5 flex items-center justify-center gap-2 shadow-soft"
              >
                <X className="h-5 w-5" /> No
              </button>
              <button
                onClick={() => answer(true)}
                className="rounded-2xl bg-gradient-primary text-primary-foreground font-display font-extrabold text-lg py-5 flex items-center justify-center gap-2 shadow-glow"
              >
                <Check className="h-5 w-5" /> Yes
              </button>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-white/60 overflow-hidden">
              <div className="h-full bg-gradient-primary transition-all" style={{ width: `${((idx + 1) / SYMPTOMS.length) * 100}%` }} />
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="mt-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-sunrise grid place-items-center shadow-glow">
              <Baby className="h-8 w-8" />
            </div>
            <p className="mt-4 font-display font-extrabold text-xl">You're all set 🤍</p>
            <p className="text-sm text-muted-foreground">Taking you to your pregnancy dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
}
