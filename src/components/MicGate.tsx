import { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { micGranted, requestMicAccess, speak } from "@/lib/voice";

/**
 * Prompts the user for microphone access BEFORE any voice plays.
 * On grant, speaks the welcome line. Persists choice in localStorage.
 */
export function MicGate({ welcome }: { welcome: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!micGranted()) setShow(true);
    else setTimeout(() => speak(welcome), 400);
  }, [welcome]);

  if (!show) return null;

  const allow = async () => {
    const ok = await requestMicAccess();
    setShow(false);
    if (ok) setTimeout(() => speak(welcome, { force: true }), 300);
  };

  const deny = () => {
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-[2rem] bg-card p-8 shadow-glow text-center animate-scale-in border-4 border-primary">
        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-primary grid place-items-center mb-4 animate-pulse-soft">
          <Mic className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-extrabold">Allow microphone?</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Luna Flow uses your microphone permission to enable her warm female voice for thoughts, reminders, and reels.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={allow}
            className="rounded-full bg-gradient-primary text-primary-foreground font-bold py-3 shadow-soft hover:shadow-glow transition flex items-center justify-center gap-2"
          >
            <Mic className="h-4 w-4" /> Allow & enable voice
          </button>
          <button
            onClick={deny}
            className="rounded-full bg-white/80 hover:bg-white text-foreground font-bold py-3 transition flex items-center justify-center gap-2"
          >
            <MicOff className="h-4 w-4" /> Not now
          </button>
        </div>
      </div>
    </div>
  );
}
