import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { loadState, updateState } from "@/lib/storage";
import { speak, BADGES, currentBadge } from "@/lib/voice";
import { Snowflake, Flame, Check } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Luna Flow" }] }),
  component: SettingsPage,
});

// Avatar options — emoji-based girl avatars (no external network dependency).
const AVATARS = [
  { id: "girl-1", emoji: "👧🏻", bg: "bg-pink" },
  { id: "girl-2", emoji: "👧🏽", bg: "bg-peach" },
  { id: "girl-3", emoji: "👧🏾", bg: "bg-lavender" },
  { id: "girl-4", emoji: "👩🏻", bg: "bg-mint" },
  { id: "girl-5", emoji: "👩🏽", bg: "bg-sky" },
  { id: "girl-6", emoji: "👩🏾", bg: "bg-pink" },
  { id: "girl-7", emoji: "🧕🏻", bg: "bg-lavender" },
  { id: "girl-8", emoji: "🧕🏽", bg: "bg-peach" },
  { id: "girl-9", emoji: "👸🏻", bg: "bg-pink" },
  { id: "girl-10", emoji: "👸🏽", bg: "bg-mint" },
  { id: "girl-11", emoji: "👸🏾", bg: "bg-lavender" },
  { id: "girl-12", emoji: "🧚🏽‍♀️", bg: "bg-sky" },
];

function SettingsPage() {
  const [s, setS] = useState(() => loadState());
  const badge = currentBadge(s.streak);

  const chooseAvatar = (id: string) => {
    const next = updateState({
      profile: { ...(s.profile ?? { name: "", age: "", occupation: "" as const, dob: "", phone: "", email: "" }), avatar: id },
    });
    setS(next);
    speak("Avatar updated. You look lovely.");
  };

  const currentAvatar = AVATARS.find((a) => a.id === s.profile?.avatar) ?? AVATARS[0];

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6 flex items-center gap-5">
        <div className={`h-24 w-24 rounded-full ${currentAvatar.bg} grid place-items-center text-6xl shadow-glow border-4 border-white`}>
          {currentAvatar.emoji}
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold">{s.profile?.name || "Beautiful you"}</h1>
          <p className="text-muted-foreground">{s.profile?.email || s.profile?.phone || "Luna Flow member"}</p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-bold"><Flame className="h-4 w-4 text-primary" /> {s.streak} day streak</span>
            <span className="flex items-center gap-1 font-bold text-sky-700"><Snowflake className="h-4 w-4" /> {s.streakFreezers} freezers</span>
          </div>
        </div>
      </div>

      <section className="glass shadow-soft rounded-[2rem] p-6">
        <h2 className="font-display text-xl font-extrabold mb-1">Pick your avatar</h2>
        <p className="text-sm text-muted-foreground mb-4">Choose any girl avatar to represent you.</p>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {AVATARS.map((a) => {
            const active = s.profile?.avatar === a.id;
            return (
              <button
                key={a.id}
                onClick={() => chooseAvatar(a.id)}
                className={`aspect-square rounded-2xl ${a.bg} grid place-items-center text-4xl transition shadow-soft border-4 ${
                  active ? "border-primary scale-105" : "border-transparent hover:border-white"
                }`}
              >
                {a.emoji}
                {active && (
                  <span className="absolute mt-16 ml-16 h-5 w-5 rounded-full bg-primary text-primary-foreground grid place-items-center">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="glass shadow-soft rounded-[2rem] p-6">
        <h2 className="font-display text-xl font-extrabold mb-1">Streak stars</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keep logging every day to shine brighter. 2 streak freezers cover missed days automatically.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BADGES.map((b) => {
            const earned = s.streak >= b.need;
            return (
              <div
                key={b.id}
                className={`rounded-3xl p-5 text-center border-2 transition ${
                  earned
                    ? `bg-gradient-to-br ${b.color} text-white shadow-glow border-white`
                    : "bg-white/60 border-transparent opacity-70"
                }`}
              >
                <div className="text-4xl">{b.emoji}</div>
                <p className="font-display font-extrabold mt-2">{b.label}</p>
                <p className={`text-xs mt-1 ${earned ? "text-white/90" : "text-muted-foreground"}`}>
                  {earned ? "Earned!" : `${b.need} day streak`}
                </p>
              </div>
            );
          })}
        </div>
        {badge && (
          <p className="mt-4 text-sm font-bold text-primary">Current badge: {badge.emoji} {badge.label}</p>
        )}
      </section>

      <section className="glass shadow-soft rounded-[2rem] p-6">
        <h2 className="font-display text-xl font-extrabold mb-3">Your details</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Age" value={s.profile?.age} />
          <Info label="DOB" value={s.profile?.dob} />
          <Info label="Place" value={s.profile?.place} />
          <Info label="Occupation" value={s.profile?.occupation} />
          <Info label="Allergies" value={s.profile?.allergies || "None"} full />
          <Info label="Health conditions" value={s.profile?.healthConditions || "None"} full />
        </dl>
      </section>
    </div>
  );
}

function Info({ label, value, full }: { label: string; value?: string; full?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white/70 p-3 ${full ? "col-span-2" : ""}`}>
      <p className="text-[10px] font-bold text-muted-foreground tracking-widest">{label.toUpperCase()}</p>
      <p className="font-semibold mt-0.5">{value || "—"}</p>
    </div>
  );
}
