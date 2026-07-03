import { useEffect, useRef, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { speak } from "@/lib/voice";

type Props = {
  mode: "create" | "verify";
  existingPin?: string;
  title?: string;
  subtitle?: string;
  onSuccess: (pin: string) => void;
  onCancel?: () => void;
};

export function PinLock({ mode, existingPin, title, subtitle, onSuccess, onCancel }: Props) {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phase, setPhase] = useState<"first" | "confirm">("first");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (mode === "create") speak("Please create a four digit pin to protect your settings.");
    else speak("Please enter your four digit pin.");
  }, [mode]);

  const submit = () => {
    setError(null);
    if (mode === "verify") {
      if (pin === existingPin) onSuccess(pin);
      else { setError("Wrong PIN. Try again."); setPin(""); speak("That pin is not right. Please try again."); }
      return;
    }
    if (phase === "first") {
      if (pin.length !== 4) return;
      setPhase("confirm");
      speak("Great. Please type your pin one more time to confirm.");
      return;
    }
    if (confirm !== pin) { setError("PINs don't match."); setConfirm(""); speak("The two pins don't match. Let's try again."); return; }
    speak("Your pin is set. Your settings are now protected.");
    onSuccess(pin);
  };

  const value = mode === "create" && phase === "confirm" ? confirm : pin;
  const setValue = mode === "create" && phase === "confirm" ? setConfirm : setPin;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm glass shadow-glow rounded-[2rem] p-7 text-center">
        <div className="h-14 w-14 rounded-2xl bg-gradient-primary mx-auto grid place-items-center shadow-soft">
          {mode === "create" ? <ShieldCheck className="h-7 w-7 text-primary-foreground" /> : <Lock className="h-7 w-7 text-primary-foreground" />}
        </div>
        <h2 className="font-display text-2xl font-extrabold mt-4">
          {title ?? (mode === "create" ? "Set a 4-digit PIN" : "Enter your PIN")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {subtitle ?? (mode === "create"
            ? phase === "first" ? "Pick 4 digits you'll remember." : "Type your PIN once more."
            : "Only you can unlock your settings.")}
        </p>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="\d*"
          maxLength={4}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="••••"
          className="mt-5 w-full text-center tracking-[0.7em] text-3xl font-extrabold rounded-2xl bg-white/85 border-2 border-transparent focus:border-primary outline-none px-4 py-4"
        />

        {error && <p className="text-sm text-red-600 mt-3 font-semibold">{error}</p>}

        <div className="mt-5 flex gap-2">
          {onCancel && (
            <button onClick={onCancel} className="flex-1 rounded-2xl bg-white/70 hover:bg-white font-bold py-3 transition">Cancel</button>
          )}
          <button
            onClick={submit}
            disabled={value.length !== 4}
            className="flex-1 rounded-2xl bg-gradient-primary text-primary-foreground font-bold py-3 shadow-soft hover:shadow-glow transition disabled:opacity-40"
          >
            {mode === "create" ? (phase === "first" ? "Next" : "Save PIN") : "Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
}
