import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { primeVoices, speak } from "@/lib/voice";
import { loadState, updateState } from "@/lib/storage";
import { Phone, ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import { PinLock } from "@/components/PinLock";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Luna Flow" },
      { name: "description", content: "Log in to Luna Flow with your mobile number and password." },
      { property: "og:title", content: "Login — Luna Flow" },
      { property: "og:description", content: "Log in to Luna Flow with your mobile number and password." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "pin">("form");

  useEffect(() => { primeVoices(); }, []);

  const completeLogin = () => {
    updateState({ loggedIn: true });
    speak("You have successfully logged in. Welcome back to Luna Flow.");
    setTimeout(() => navigate({ to: "/app" }), 1000);
  };

  const submit = () => {
    const s = loadState();
    if (!s.password) {
      setError("No account found on this device. Please sign up first.");
      return;
    }
    const savedPhone = (s.profile?.phone ?? "").replace(/\s/g, "");
    if (savedPhone && phone.replace(/\s/g, "") !== savedPhone) {
      setError("That mobile number doesn't match this account.");
      return;
    }
    if (pw !== s.password) {
      setError("Incorrect password. Please try again.");
      return;
    }
    setError(null);
    if (s.pin) setStep("pin");
    else completeLogin();
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md glass shadow-glow rounded-[2rem] p-8">
        <h1 className="font-display text-3xl font-extrabold text-gradient">Welcome back 💖</h1>
        <p className="text-sm text-muted-foreground mt-1">Log in with your mobile number & password</p>

        {step === "form" && (
          <>
            <div className="mt-6">
              <label className="text-xs font-bold text-foreground/70 mb-1 block">Mobile number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Phone className="h-4 w-4" /></span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 90000 00000"
                  className="w-full rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none pl-9 pr-4 py-3 font-semibold transition"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold text-foreground/70 mb-1 block">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock className="h-4 w-4" /></span>
                <input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Your password"
                  className="w-full rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none pl-9 pr-10 py-3 font-semibold transition"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}

            <button
              disabled={phone.length < 5 || pw.length < 1}
              onClick={submit}
              className="mt-5 w-full rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3.5 shadow-soft hover:shadow-glow transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Log in <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        {step === "pin" && (
          <PinLock
            mode="verify"
            existingPin={loadState().pin}
            title="Enter your Luna PIN"
            subtitle="One more step to keep your journey safe."
            onSuccess={() => completeLogin()}
            onCancel={() => setStep("form")}
          />
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          New here? <Link to="/signup" className="font-bold text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
