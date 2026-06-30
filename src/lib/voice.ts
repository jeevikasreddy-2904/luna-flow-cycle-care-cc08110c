// Browser SpeechSynthesis helper — picks a female voice when available.
// Voice is GATED behind explicit microphone permission from the user.

let cachedVoice: SpeechSynthesisVoice | null = null;
const MIC_KEY = "lunaflow_mic_ok";

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const preferred = [
    "Google UK English Female",
    "Google US English",
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Samantha",
    "Victoria",
    "Karen",
  ];
  for (const name of preferred) {
    const v = voices.find((x) => x.name === name);
    if (v) return v;
  }
  const female = voices.find((v) => /female|woman|samantha|victoria|karen|zira|aria|jenny|lily/i.test(v.name));
  return female ?? voices.find((v) => v.lang.startsWith("en")) ?? voices[0];
}

export function micGranted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MIC_KEY) === "1";
}

export function setMicGranted(v: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MIC_KEY, v ? "1" : "0");
}

export async function requestMicAccess(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // We only needed permission — release the track immediately.
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
  if (!opts.force && !micGranted()) return; // gated
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
