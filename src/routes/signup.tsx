import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { primeVoices, speak } from "@/lib/voice";
import { updateState, todayKey, type Profile } from "@/lib/storage";
import { ArrowRight, Phone, User as UserIcon, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Luna Flow" },
      { name: "description", content: "Create your Luna Flow account and start your wellness journey." },
      { property: "og:title", content: "Sign up — Luna Flow" },
      { property: "og:description", content: "Create your Luna Flow account and start your wellness journey." },
    ],
  }),
  component: Signup,
});

type Step = "details" | "health" | "phone" | "phone-otp" | "password" | "last-period" | "done";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [profile, setProfile] = useState<Profile>({
    name: "", age: "", occupation: "", dob: "", phone: "", email: "",
    place: "", allergies: "", healthConditions: "",
  });
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [lastPeriod, setLastPeriod] = useState("");

  useEffect(() => { primeVoices(); }, []);
  useEffect(() => {
    if (step === "done") {
      speak("You have successfully signed up. Welcome to Luna Flow!");
      const t = setTimeout(() => navigate({ to: "/onboarding" }), 2000);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  const update = (k: keyof Profile, v: string) => setProfile((p) => ({ ...p, [k]: v }));

  const pwOk = pw.length >= 6 && pw === pw2;

  const finish = () => {
    updateState({
      profile,
      password: pw,
      loggedIn: true,
      createdAt: todayKey(),
      periodDates: lastPeriod ? [lastPeriod] : [],
    });
    setStep("done");
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md glass shadow-glow rounded-[2rem] p-8">
        <h1 className="font-display text-3xl font-extrabold text-gradient">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Step into Luna Flow 🌙</p>

        <div className="mt-6 space-y-4">
          {step === "details" && (
            <>
              <Field icon={<UserIcon className="h-4 w-4" />} label="Full name" value={profile.name} onChange={(v) => update("name", v)} placeholder="Your beautiful name" />
              <Field label="Age" type="number" value={profile.age} onChange={(v) => update("age", v)} placeholder="22" />
              <div>
                <label className="text-xs font-bold text-foreground/70 mb-1 block">I am a</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["student", "working", "housewife"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => update("occupation", o)}
                      className={`rounded-2xl py-2.5 text-sm font-bold capitalize transition ${
                        profile.occupation === o ? "bg-gradient-primary text-primary-foreground shadow-soft" : "bg-white/70 text-foreground hover:bg-white"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Date of birth" type="date" value={profile.dob} onChange={(v) => update("dob", v)} />
              <Field label="Place / City" value={profile.place ?? ""} onChange={(v) => update("place", v)} placeholder="Bengaluru, India" />
              <NextBtn
                disabled={!profile.name || !profile.age || !profile.occupation || !profile.dob || !profile.place}
                onClick={() => setStep("health")}
              >Continue</NextBtn>
            </>
          )}

          {step === "health" && (
            <>
              <p className="text-sm text-muted-foreground">
                Any allergies or health conditions? This helps Luna set a <b>safe protein range</b> for your body.
              </p>
              <Field
                label="Allergies (type any)"
                value={profile.allergies ?? ""}
                onChange={(v) => update("allergies", v)}
                placeholder="e.g., peanuts, dairy, soy, eggs, none"
              />
              <Field
                label="Health conditions"
                value={profile.healthConditions ?? ""}
                onChange={(v) => update("healthConditions", v)}
                placeholder="e.g., PCOS, anemia, kidney issue, none"
              />
              <NextBtn onClick={() => setStep("phone")}>Continue</NextBtn>
            </>
          )}

          {step === "phone" && (
            <>
              <Field icon={<Phone className="h-4 w-4" />} label="Mobile number" value={profile.phone} onChange={(v) => update("phone", v)} placeholder="+91 90000 00000" />
              <Field label="Email (optional)" type="email" value={profile.email} onChange={(v) => update("email", v)} placeholder="you@bloom.com" />
              <NextBtn disabled={profile.phone.length < 7} onClick={() => { setStep("phone-otp"); speak("We sent an O T P to your phone."); }}>Send OTP</NextBtn>
            </>
          )}

          {step === "phone-otp" && (
            <>
              <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your mobile (demo: any 4+ digits)</p>
              <Field label="OTP" value={otp} onChange={setOtp} placeholder="••••••" />
              <NextBtn disabled={otp.length < 4} onClick={() => setStep("password")}>Verify</NextBtn>
            </>
          )}

          {step === "password" && (
            <>
              <p className="text-sm text-muted-foreground">Create a password so you can log in with your mobile number next time.</p>
              <div>
                <label className="text-xs font-bold text-foreground/70 mb-1 block">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock className="h-4 w-4" /></span>
                  <input
                    type={showPw ? "text" : "password"}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none pl-9 pr-10 py-3 font-semibold transition"
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Field label="Confirm password" type={showPw ? "text" : "password"} value={pw2} onChange={setPw2} placeholder="Repeat password" />
              {pw2 && pw !== pw2 && <p className="text-xs font-bold text-destructive">Passwords do not match.</p>}
              <NextBtn disabled={!pwOk} onClick={() => setStep("last-period")}>Continue</NextBtn>
            </>
          )}

          {step === "last-period" && (
            <>
              <p className="text-sm text-muted-foreground">When did your <b>last period</b> start? Luna uses this to predict your next cycle, ovulation and fertile window.</p>
              <Field label="Last period start date" type="date" value={lastPeriod} onChange={setLastPeriod} />
              <NextBtn disabled={!lastPeriod} onClick={finish}>Finish sign up</NextBtn>
              <button onClick={finish} className="w-full text-xs font-bold text-muted-foreground hover:text-primary">I'll add it later</button>
            </>
          )}

          {step === "done" && (
            <div className="text-center py-6">
              <div className="mx-auto h-20 w-20 rounded-full bg-mint grid place-items-center shadow-glow animate-pulse-soft">
                <CheckCircle2 className="h-10 w-10 text-foreground" />
              </div>
              <h2 className="font-display text-2xl font-extrabold mt-4">Welcome to Luna Flow! 🌸</h2>
              <p className="text-muted-foreground mt-2">You're successfully signed up.</p>
            </div>
          )}
        </div>

        {step !== "done" && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, icon }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-foreground/70 mb-1 block">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none px-4 py-3 text-foreground font-semibold placeholder:text-muted-foreground/60 transition ${icon ? "pl-9" : ""}`}
        />
      </div>
    </div>
  );
}

function NextBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3.5 shadow-soft hover:shadow-glow transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {children} <ArrowRight className="h-4 w-4" />
    </button>
  );
}
