import { createFileRoute } from "@tanstack/react-router";
import { Phone, Ambulance, Stethoscope, HeartPulse, Baby } from "lucide-react";
import { speak } from "@/lib/voice";

export const Route = createFileRoute("/app/emergency")({
  head: () => ({ meta: [{ title: "Emergency — Luna Flow" }] }),
  component: EmergencyPage,
});

type Contact = {
  label: string;
  number: string;
  icon: typeof Phone;
  desc: string;
  bg: string;
};

// STRICTLY doctor / ambulance / emergency-medical numbers only.
const CONTACTS: Contact[] = [
  { label: "Ambulance", number: "108", icon: Ambulance, desc: "Emergency ambulance service (India)", bg: "bg-red-500" },
  { label: "Ambulance (US/CA)", number: "911", icon: Ambulance, desc: "Emergency services (US/Canada)", bg: "bg-red-600" },
  { label: "Ambulance (UK)", number: "999", icon: Ambulance, desc: "Emergency services (UK)", bg: "bg-red-500" },
  { label: "Ambulance (EU)", number: "112", icon: Ambulance, desc: "Pan-European emergency line", bg: "bg-red-500" },
  { label: "Women's Helpline (Doctor)", number: "1091", icon: HeartPulse, desc: "Women medical/health helpline (India)", bg: "bg-pink-500" },
  { label: "Maternity / Ob-Gyn Emergency", number: "102", icon: Baby, desc: "Free maternity ambulance (India)", bg: "bg-fuchsia-500" },
  { label: "On-call Doctor", number: "1075", icon: Stethoscope, desc: "24×7 medical helpline", bg: "bg-emerald-500" },
];

function EmergencyPage() {
  const call = (c: Contact) => {
    speak(`Calling ${c.label} at ${c.number}. Stay calm, help is on the way.`);
    if (typeof window !== "undefined") window.location.href = `tel:${c.number}`;
  };

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft rounded-[2rem] p-6">
        <h1 className="font-display text-3xl font-extrabold text-red-600">Emergency 🚑</h1>
        <p className="text-muted-foreground mt-1">
          Direct lines to ambulance and doctors only. For medical emergencies — nothing else.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {CONTACTS.map((c) => (
          <button
            key={c.label}
            onClick={() => call(c)}
            className="glass shadow-soft rounded-3xl p-5 flex items-center gap-4 text-left hover:shadow-glow hover:-translate-y-0.5 transition"
          >
            <div className={`h-14 w-14 rounded-2xl ${c.bg} grid place-items-center text-white shadow-soft`}>
              <c.icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-display font-extrabold text-lg">{c.label}</p>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
              <p className="mt-1 font-bold text-primary flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {c.number}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-[2rem] bg-red-50 border-2 border-red-300 p-5 text-sm font-semibold text-red-700">
        ⚠️ Only medical emergencies — ambulance and doctor lines. Please do not misuse these numbers.
      </div>
    </div>
  );
}
