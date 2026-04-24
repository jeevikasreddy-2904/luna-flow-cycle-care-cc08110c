import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Moon, Sparkles, Heart } from "lucide-react";
import { primeVoices, speak } from "@/lib/voice";
import { loadState } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luna Flow — Your gentle period & wellness companion" },
      { name: "description", content: "Track your cycle, nurture your body, and bloom every day with Luna Flow." },
      { property: "og:title", content: "Luna Flow — period & wellness companion" },
      { property: "og:description", content: "Cycle tracking, hydration, meals, yoga and motivation in one cozy app." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    primeVoices();
    const t = setTimeout(() => speak("Welcome to Luna Flow. Your gentle companion for a healthy cycle."), 600);
    const s = loadState();
    if (s.loggedIn) navigate({ to: "/app" });
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* floating blobs */}
      <div className="absolute -top-20 -left-10 h-72 w-72 rounded-full bg-pink/60 blur-3xl animate-float" />
      <div className="absolute top-40 -right-10 h-80 w-80 rounded-full bg-lavender/60 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-peach/60 blur-3xl animate-float" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center shadow-soft">
            <Moon className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-gradient">Luna Flow</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-bold text-foreground shadow-soft mb-6">
              <Sparkles className="h-3.5 w-3.5" /> A cozy place for your cycle
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-tight">
              Bloom with every <span className="text-gradient">cycle</span> 🌸
            </h1>
            <p className="mt-5 text-lg text-foreground/80 max-w-md">
              Track your period, nourish your meals, sip more water, move with gentle yoga, and let Luna whisper sweet motivation every day.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/signup"
                className="rounded-full bg-gradient-primary text-primary-foreground font-bold px-8 py-4 text-center shadow-soft hover:shadow-glow transition"
              >
                Sign Up — I'm new
              </Link>
              <Link
                to="/login"
                className="rounded-full bg-white/80 hover:bg-white text-foreground font-bold px-8 py-4 text-center shadow-soft transition"
              >
                Login — I have an account
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="glass shadow-glow rounded-[2.5rem] p-8 space-y-4">
              {[
                { icon: Heart, label: "Cycle calendar with smart insights", color: "bg-pink" },
                { icon: Sparkles, label: "Daily motivation & period thoughts", color: "bg-lavender" },
                { icon: Moon, label: "Yoga, meals & hydration tracking", color: "bg-peach" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                  <div className={`h-10 w-10 rounded-xl ${f.color} grid place-items-center`}>
                    <f.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
