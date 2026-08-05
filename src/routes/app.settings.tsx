import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadState, updateState, daysUsed } from "@/lib/storage";
import { initTheme, toggleTheme } from "@/lib/theme";
import { speak, BADGES, currentBadge } from "@/lib/voice";
import { Snowflake, Flame, Check, Pencil, Save, Lock, ShieldCheck, KeyRound, Sun, MoonStar } from "lucide-react";
import { PinLock } from "@/components/PinLock";


export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Luna Flow" }] }),
  component: SettingsPage,
});

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
  const [unlocked, setUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState<null | "create" | "verify" | "change">(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: s.profile?.name ?? "",
    place: s.profile?.place ?? "",
    phone: s.profile?.phone ?? "",
  });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [pwForm, setPwForm] = useState({ current: "", next: "" });
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  useEffect(() => { setTheme(initTheme()); }, []);

  const changePassword = () => {
    const st = loadState();
    if (st.password && pwForm.current !== st.password) { setPwMsg("Current password is incorrect."); return; }
    if (pwForm.next.length < 6) { setPwMsg("New password needs at least 6 characters."); return; }
    updateState({ password: pwForm.next });
    setPwForm({ current: "", next: "" });
    setPwMsg("Password updated 💜");
    speak("Your password has been updated.");
  };

  const badge = currentBadge(s.streak);
  const currentAvatar = AVATARS.find((a) => a.id === s.profile?.avatar) ?? AVATARS[0];


  const chooseAvatar = (id: string) => {
    if (!unlocked) { setShowPinModal(s.pin ? "verify" : "create"); return; }
    const next = updateState({
      profile: { ...(s.profile ?? { name: "", age: "", occupation: "" as const, dob: "", phone: "", email: "" }), avatar: id },
    });
    setS(next);
    speak("Avatar updated. You look lovely.");
  };

  const startEdit = () => {
    if (!unlocked) { setShowPinModal(s.pin ? "verify" : "create"); return; }
    setEditing(true);
  };

  const saveEdits = () => {
    const next = updateState({
      profile: {
        ...(s.profile ?? { name: "", age: "", occupation: "" as const, dob: "", phone: "", email: "" }),
        name: form.name.trim(),
        place: form.place.trim(),
        phone: form.phone.trim(),
      },
    });
    setS(next);
    setEditing(false);
    speak("Your details are saved.");
  };

  const onPinSuccess = (pin: string) => {
    if (showPinModal === "create") {
      const next = updateState({ pin });
      setS(next);
    } else if (showPinModal === "change") {
      const next = updateState({ pin });
      setS(next);
      speak("Your pin has been changed.");
    }
    setShowPinModal(null);
    setUnlocked(true);
  };

  return (
    <div className="space-y-6">
      {/* Lock banner */}
      {!unlocked && (
        <div className="glass shadow-soft rounded-[2rem] p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-primary grid place-items-center">
              <Lock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-extrabold">Settings are locked</p>
              <p className="text-xs text-muted-foreground">{s.pin ? "Enter your 4-digit PIN to edit." : "Create a 4-digit PIN to protect your settings."}</p>
            </div>
          </div>
          <button
            onClick={() => setShowPinModal(s.pin ? "verify" : "create")}
            className="rounded-full bg-gradient-primary text-primary-foreground font-bold px-4 py-2 text-sm shadow-soft"
          >
            {s.pin ? "Unlock" : "Set PIN"}
          </button>
        </div>
      )}

      <div className="glass shadow-soft rounded-[2rem] p-6 flex items-center gap-5">
        <div className={`h-24 w-24 rounded-full ${currentAvatar.bg} grid place-items-center text-6xl shadow-glow border-4 border-white`}>
          {currentAvatar.emoji}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-extrabold">{s.profile?.name || "Beautiful you"}</h1>
          <p className="text-muted-foreground">{s.profile?.email || s.profile?.phone || "Luna Flow member"}</p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-bold"><Flame className="h-4 w-4 text-primary" /> {s.streak} day streak</span>
            <span className="flex items-center gap-1 font-bold text-sky-700"><Snowflake className="h-4 w-4" /> {s.streakFreezers} freezers</span>
          </div>
        </div>
      </div>

      {/* Journey stats */}
      <section className="glass shadow-soft rounded-[2rem] p-6">
        <h2 className="font-display text-xl font-extrabold mb-4">Your journey</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <JourneyStat label="Days with Luna" value={`${daysUsed()}`} />
          <JourneyStat label="Current streak" value={`${s.streak} 🔥`} />
          <JourneyStat label="Highest streak" value={`${s.highestStreak}`} />
          <JourneyStat label="Activities done" value={`${s.activities}`} />
        </div>
      </section>

      {/* Appearance & password */}
      <section className="glass shadow-soft rounded-[2rem] p-6 space-y-4">
        <h2 className="font-display text-xl font-extrabold">Preferences</h2>
        <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <MoonStar className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            <div>
              <p className="font-bold">{theme === "dark" ? "Night theme" : "Day theme"}</p>
              <p className="text-xs text-muted-foreground">Soothing dark mode for late-night check-ins.</p>
            </div>
          </div>
          <button
            onClick={() => setTheme(toggleTheme())}
            className="rounded-full bg-gradient-primary text-primary-foreground font-bold px-4 py-2 text-sm shadow-soft"
          >
            Switch to {theme === "dark" ? "day" : "night"}
          </button>
        </div>

        <div className="rounded-2xl bg-white/70 px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <p className="font-bold">Change password</p>
          </div>
          {!unlocked ? (
            <p className="text-xs text-muted-foreground">Unlock settings with your PIN to change your password.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-2">
              <input
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                placeholder="Current password"
                className="rounded-xl bg-white border-2 border-transparent focus:border-primary outline-none px-3 py-2 font-semibold"
              />
              <input
                type="password"
                value={pwForm.next}
                onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                placeholder="New password"
                className="rounded-xl bg-white border-2 border-transparent focus:border-primary outline-none px-3 py-2 font-semibold"
              />
              <button onClick={changePassword} className="rounded-xl bg-gradient-primary text-primary-foreground font-bold px-3 py-2 shadow-soft">
                Update
              </button>
            </div>
          )}
          {pwMsg && <p className="text-xs font-bold mt-2 text-primary">{pwMsg}</p>}
        </div>
      </section>

      {/* Editable details */}

      <section className="glass shadow-soft rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-extrabold">Personal details</h2>
          {editing ? (
            <button onClick={saveEdits} className="flex items-center gap-1.5 rounded-full bg-gradient-primary text-primary-foreground font-bold px-4 py-2 text-sm shadow-soft">
              <Save className="h-4 w-4" /> Save
            </button>
          ) : (
            <button onClick={startEdit} className="flex items-center gap-1.5 rounded-full bg-white/80 hover:bg-white font-bold px-4 py-2 text-sm shadow-soft">
              <Pencil className="h-4 w-4" /> Edit
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <EditField label="Name" value={form.name} editing={editing} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <EditField label="Place" value={form.place} editing={editing} onChange={(v) => setForm((f) => ({ ...f, place: v }))} />
          <EditField label="Phone" value={form.phone} editing={editing} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
        </div>
      </section>

      {/* PIN management */}
      <section className="glass shadow-soft rounded-[2rem] p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-lavender grid place-items-center">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display font-extrabold">Security PIN</p>
            <p className="text-xs text-muted-foreground">{s.pin ? "Your settings are protected." : "No PIN set yet."}</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (!s.pin) setShowPinModal("create");
            else if (!unlocked) setShowPinModal("verify");
            else setShowPinModal("change");
          }}
          className="rounded-full bg-white/80 hover:bg-white font-bold px-4 py-2 text-sm shadow-soft"
        >
          {s.pin ? (unlocked ? "Change PIN" : "Unlock") : "Set PIN"}
        </button>
      </section>

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
        <h2 className="font-display text-xl font-extrabold mb-3">Other info</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Age" value={s.profile?.age} />
          <Info label="DOB" value={s.profile?.dob} />
          <Info label="Occupation" value={s.profile?.occupation} />
          <Info label="Email" value={s.profile?.email} />
          <Info label="Allergies" value={s.profile?.allergies || "None"} full />
          <Info label="Health conditions" value={s.profile?.healthConditions || "None"} full />
        </dl>
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700">
          <ShieldCheck className="h-4 w-4" /> Your data lives only on this device.
        </div>
      </section>

      {showPinModal && (
        <PinLock
          mode={showPinModal === "verify" ? "verify" : "create"}
          existingPin={s.pin}
          title={showPinModal === "change" ? "Set a new PIN" : undefined}
          onSuccess={onPinSuccess}
          onCancel={() => setShowPinModal(null)}
        />
      )}
    </div>
  );
}

function EditField({ label, value, editing, onChange }: { label: string; value: string; editing: boolean; onChange: (v: string) => void }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3">
      <p className="text-[10px] font-bold text-muted-foreground tracking-widest">{label.toUpperCase()}</p>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl bg-white border-2 border-transparent focus:border-primary outline-none px-2 py-1.5 font-semibold"
        />
      ) : (
        <p className="font-semibold mt-0.5">{value || "—"}</p>
      )}
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

function JourneyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-4 text-center">
      <p className="font-display font-extrabold text-2xl">{value}</p>
      <p className="text-[11px] font-bold text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
