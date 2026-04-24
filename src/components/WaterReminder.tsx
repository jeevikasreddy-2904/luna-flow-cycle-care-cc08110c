import { useEffect, useState } from "react";
import { speak } from "@/lib/voice";
import { Droplets, X } from "lucide-react";

export function WaterReminder() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(true);
      speak("Hey gorgeous, time to sip some water. Stay hydrated, stay glowing.");
    }, 30 * 60 * 1000); // every 30 minutes
    return () => clearInterval(interval);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed bottom-24 right-4 z-50 max-w-xs animate-pulse-soft">
      <div className="glass shadow-glow rounded-3xl p-4 flex items-start gap-3 border-2 border-sky">
        <div className="rounded-full bg-sky/60 p-2">
          <Droplets className="h-6 w-6 text-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-foreground">Hydration check 💧</p>
          <p className="text-sm text-muted-foreground">Take a sip of water, beautiful!</p>
        </div>
        <button onClick={() => setShow(false)} aria-label="Dismiss">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
