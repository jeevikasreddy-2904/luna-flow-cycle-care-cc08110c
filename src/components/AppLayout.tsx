import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Calendar, Utensils, Dumbbell, Sparkles, Film, LogOut, Moon, Heart, Music2, Music, Settings, Ambulance, Baby } from "lucide-react";
import { loadState, updateState } from "@/lib/storage";
import { speak, clearMicGrant } from "@/lib/voice";
import { WaterReminder } from "./WaterReminder";
import { MicGate } from "./MicGate";

const periodLinks = [
  { to: "/app", label: "Home", icon: Heart },
  { to: "/app/calendar", label: "Cycle", icon: Calendar },
  { to: "/app/meals", label: "Meals", icon: Utensils },
  { to: "/app/exercise", label: "Yoga", icon: Dumbbell },
  { to: "/app/dance", label: "Dance", icon: Music2 },
  { to: "/app/thoughts", label: "Thoughts", icon: Sparkles },
  { to: "/app/music", label: "Music", icon: Music },
  { to: "/app/reels", label: "Reels", icon: Film },
  { to: "/app/settings", label: "Me", icon: Settings },
  { to: "/app/emergency", label: "SOS", icon: Ambulance },
] as const;

const pregnancyLinks = [
  { to: "/app", label: "Home", icon: Heart },
  { to: "/app/pregnancy", label: "Baby", icon: Baby },
  { to: "/app/pregnancy/meals", label: "Meals", icon: Utensils },
  { to: "/app/dance", label: "Dance", icon: Music2 },
  { to: "/app/thoughts", label: "Thoughts", icon: Sparkles },
  { to: "/app/music", label: "Music", icon: Music },
  { to: "/app/reels", label: "Reels", icon: Film },
  { to: "/app/settings", label: "Me", icon: Settings },
  { to: "/app/emergency", label: "SOS", icon: Ambulance },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    updateState({ loggedIn: false });
    speak("See you soon, take care of yourself.");
    clearMicGrant();
    navigate({ to: "/" });
  };

  const mode = loadState().mode;
  const links = mode === "pregnancy" ? pregnancyLinks : periodLinks;

  return (
    <div className="min-h-screen pb-24">
      <MicGate welcome={`Welcome back to Luna Flow. So happy to see you again.`} />


      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center shadow-soft">
              <Moon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-gradient">Luna Flow</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-semibold rounded-full px-3 py-1.5 bg-white/60 hover:bg-white text-foreground transition"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>

      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 glass shadow-soft rounded-full px-2 py-2 flex gap-1 border border-white/60">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || (to !== "/app" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
                active ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-foreground/70 hover:bg-white/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <WaterReminder />
    </div>
  );
}
