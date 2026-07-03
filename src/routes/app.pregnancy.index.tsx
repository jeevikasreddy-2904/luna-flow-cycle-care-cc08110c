import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadState } from "@/lib/storage";
import { Baby, Calendar, Utensils, Music, Music2, Sparkles, Flame, Film } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/pregnancy/")({
  head: () => ({ meta: [{ title: "Pregnancy Dashboard — Luna Flow" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const s = loadState();
      if (!s.pregnancy) throw redirect({ to: "/app/pregnancy/onboarding" });
    }
  },
  component: PregnancyHome,
});

function PregnancyHome() {
  const [s, setS] = useState(() => loadState());
  useEffect(() => {
    setS(loadState());
    speak(`Welcome to your pregnancy care space, ${loadState().profile?.name ?? "love"}. Take a deep breath — you're doing beautifully.`);
  }, []);

  const p = s.pregnancy!;
  const months = p.monthsMissed;
  const weeks = Math.max(4, Math.min(42, Math.round(months * 4.3) + 4));
  const trimester = weeks <= 13 ? 1 : weeks <= 27 ? 2 : 3;

  const yesSymptoms = Object.entries(p.symptoms).filter(([, v]) => v).map(([k]) => k);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-sunrise shadow-glow rounded-[2rem] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Baby className="h-5 w-5" />
          <span className="text-xs font-bold tracking-widest">PREGNANCY CARE</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold">You're glowing 🤍</h1>
        <p className="text-foreground/80 mt-1">
          Approx. <b>week {weeks}</b> · trimester {trimester} · {months} month{months === 1 ? "" : "s"} since last period.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Flame} label="Streak" value={`${s.streak} 🔥`} bg="bg-peach" />
        <Stat icon={Calendar} label="Week" value={`${weeks}`} bg="bg-pink" />
        <Stat icon={Baby} label="Trimester" value={`${trimester}`} bg="bg-lavender" />
        <Stat icon={Sparkles} label="Symptoms" value={`${yesSymptoms.length}`} bg="bg-mint" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <TileLink to="/app/pregnancy/meals" icon={Utensils} title="Pregnancy meals" desc="Higher-protein tracking, foods to avoid." bg="bg-gradient-meadow" />
        <TileLink to="/app/dance" icon={Music2} title="Gentle dance" desc="Only your safe-for-pregnancy moves." bg="bg-gradient-sunrise" />
        <TileLink to="/app/music" icon={Music} title="Calming music" desc="Full-screen listening for you & baby." bg="bg-gradient-dreamy" />
        <TileLink to="/app/reels" icon={Film} title="Stories & reels" desc="Bite-sized mama wisdom." bg="bg-gradient-primary" />
      </div>

      {yesSymptoms.length > 0 && (
        <div className="glass shadow-soft rounded-[2rem] p-6">
          <h2 className="font-display font-extrabold text-lg mb-2">Your reported symptoms</h2>
          <div className="flex flex-wrap gap-2">
            {yesSymptoms.map((k) => (
              <span key={k} className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">If any symptom feels severe, please contact your doctor via the SOS page.</p>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, bg }: { icon: typeof Baby; label: string; value: string; bg: string }) {
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

function TileLink({ to, icon: Icon, title, desc, bg }: { to: string; icon: typeof Baby; title: string; desc: string; bg: string }) {
  return (
    <Link to={to} className={`${bg} shadow-soft rounded-3xl p-6 hover:shadow-glow transition block`}>
      <Icon className="h-6 w-6 mb-2" />
      <p className="font-display font-extrabold text-lg">{title}</p>
      <p className="text-sm text-foreground/80 mt-1">{desc}</p>
    </Link>
  );
}
