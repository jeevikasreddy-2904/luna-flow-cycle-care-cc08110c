import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { primeVoices, speak } from "@/lib/voice";
import { updateState, type Profile } from "@/lib/storage";
import { ArrowRight, Phone, User as UserIcon, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Luna Flow" },
      { name: "description", content: "Create your Luna Flow account and start your wellness journey." },
    ],
  }),
  component: Signup,
});

type Step = "details" | "phone" | "phone-otp" | "done";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [profile, setProfile] = useState<Profile>({
    name: "", age: "", occupation: "", dob: "", phone: "", email: "",
  });
  const [otp, setOtp] = useState("");

  useEffect(() => { primeVoices(); }, []);
  useEffect(() => {
    if (step === "done") {
      speak("You have successfully signed up. Welcome to Luna Flow!");
      const t = setTimeout(() => navigate({ to: "/onboarding" }), 2200);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  const update = (k: keyof Profile, v: string) => setProfile((p) => ({ ...p, [k]: v }));

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
              <NextBtn
                disabled={!profile.name || !profile.age || !profile.occupation || !profile.dob}
                onClick={() => setStep("phone")}
              >Continue</NextBtn>
            </>
          )}

          {step === "phone" && (
            <>
              <Field icon={<Phone className="h-4 w-4" />} label="Mobile number" value={profile.phone} onChange={(v) => update("phone", v)} placeholder="+1 555 0100" />
              <NextBtn disabled={profile.phone.length < 7} onClick={() => { setStep("phone-otp"); speak("We sent an O T P to your phone."); }}>Send OTP</NextBtn>
            </>
          )}

          {step === "phone-otp" && (
            <>
              <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your mobile (demo: any 4+ digits)</p>
              <Field label="OTP" value={otp} onChange={setOtp} placeholder="••••••" />
              <NextBtn
                disabled={otp.length < 4}
                onClick={() => {
                  updateState({ profile, loggedIn: true });
                  setStep("done");
                }}
              >Verify & finish</NextBtn>
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
