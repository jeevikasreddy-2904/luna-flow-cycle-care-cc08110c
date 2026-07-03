// Browser SpeechSynthesis helper — picks a female voice when available.
// Voice is GATED behind explicit microphone permission from the user, asked
// once PER BROWSER SESSION (sessionStorage) so every fresh visit re-prompts.

let cachedVoice: SpeechSynthesisVoice | null = null;
const MIC_KEY = "lunaflow_mic_ok"; // sessionStorage key

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Exclude anything that reads male.
  const isMale = (v: SpeechSynthesisVoice) =>
    /male|man\b|david|mark|guy|alex|daniel|fred|george|thomas|ryan|william|james|paul|bruce/i.test(v.name);

  const preferred = [
    "Google UK English Female",
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Samantha",
    "Karen",
    "Victoria",
    "Tessa",
    "Google US English",
  ];
  for (const name of preferred) {
    const v = voices.find((x) => x.name === name && !isMale(x));
    if (v) return v;
  }
  const female = voices.find((v) => !isMale(v) && /female|woman|girl|samantha|victoria|karen|zira|aria|jenny|lily|amy|emma/i.test(v.name));
  return female ?? voices.find((v) => !isMale(v) && v.lang.startsWith("en")) ?? voices.find((v) => !isMale(v)) ?? voices[0];
}

export function micGranted(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(MIC_KEY) === "1";
}

export function micAsked(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(MIC_KEY) !== null;
}

export function setMicGranted(v: boolean) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MIC_KEY, v ? "1" : "0");
}

export function clearMicGrant() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(MIC_KEY);
}

export async function requestMicAccess(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    setMicGranted(true);
    primeVoices();
    return true;
  } catch {
    setMicGranted(false);
    return false;
  }
}

export function speak(text: string, opts: { rate?: number; pitch?: number; force?: boolean } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (!opts.force && !micGranted()) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (!cachedVoice) cachedVoice = pickFemaleVoice();
    if (cachedVoice) u.voice = cachedVoice;
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 1.15;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

export function primeVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickFemaleVoice();
  };
}

// ---------- Badges ----------
export type Badge = {
  id: "bronze" | "silver" | "gold" | "shining";
  label: string;
  need: number;
  emoji: string;
  color: string;
};

export const BADGES: Badge[] = [
  { id: "bronze", label: "Bronze Star", need: 30, emoji: "⭐", color: "from-amber-600 to-amber-400" },
  { id: "silver", label: "Silver Star", need: 100, emoji: "🌟", color: "from-slate-400 to-slate-200" },
  { id: "gold", label: "Gold Star", need: 365, emoji: "🏅", color: "from-yellow-500 to-yellow-300" },
  { id: "shining", label: "Shining Star", need: 2000, emoji: "✨", color: "from-fuchsia-500 to-pink-300" },
];

export function currentBadge(streak: number): Badge | null {
  let earned: Badge | null = null;
  for (const b of BADGES) if (streak >= b.need) earned = b;
  return earned;
}
