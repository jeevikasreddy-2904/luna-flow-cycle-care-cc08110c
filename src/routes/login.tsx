import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { primeVoices, speak } from "@/lib/voice";
import { loadState, updateState } from "@/lib/storage";
import { Phone, Mail, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Luna Flow" },
      { name: "description", content: "Welcome back to Luna Flow." },
    ],
  }),
  component: Login,
});

type Step = "id" | "otp";

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("id");
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => { primeVoices(); }, []);

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md glass shadow-glow rounded-[2rem] p-8">
        <h1 className="font-display text-3xl font-extrabold text-gradient">Welcome back 💖</h1>
        <p className="text-sm text-muted-foreground mt-1">Login to continue your journey</p>

        {step === "id" && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-2 p-1 rounded-full bg-white/60">
              {(["phone", "email"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-full py-2 text-sm font-bold capitalize transition ${
                    mode === m ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-foreground/70"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <label className="text-xs font-bold text-foreground/70 mb-1 block">{mode === "phone" ? "Mobile number" : "Email"}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {mode === "phone" ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </span>
                <input
                  type={mode === "phone" ? "tel" : "email"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={mode === "phone" ? "+1 555 0100" : "you@bloom.com"}
                  className="w-full rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none pl-9 pr-4 py-3 font-semibold transition"
                />
              </div>
            </div>

            <button
              disabled={value.length < 5}
              onClick={() => { setStep("otp"); speak(`We sent an O T P to your ${mode}.`); }}
              className="mt-5 w-full rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3.5 shadow-soft hover:shadow-glow transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Send OTP <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="text-sm text-muted-foreground mt-6">Enter the 6-digit code (demo: any 4+ digits)</p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="••••••"
              className="mt-3 w-full text-center tracking-[0.5em] text-2xl font-bold rounded-2xl bg-white/80 border-2 border-transparent focus:border-primary outline-none px-4 py-4 transition"
            />
            <button
              disabled={otp.length < 4}
              onClick={() => {
                const s = loadState();
                updateState({ loggedIn: true, profile: s.profile ?? { name: "Friend", age: "", occupation: "", dob: "", phone: mode === "phone" ? value : "", email: mode === "email" ? value : "" } });
                speak("You have successfully logged in. Welcome back to Luna Flow.");
                setTimeout(() => navigate({ to: "/app" }), 1500);
              }}
              className="mt-5 w-full rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3.5 shadow-soft hover:shadow-glow transition disabled:opacity-40"
            >
              Login
            </button>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          New here? <Link to="/signup" className="font-bold text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
