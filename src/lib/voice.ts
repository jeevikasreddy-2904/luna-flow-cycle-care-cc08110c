// Browser SpeechSynthesis helper — picks a female voice when available
let cachedVoice: SpeechSynthesisVoice | null = null;

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

export function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
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
  // Trigger voice list load
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickFemaleVoice();
  };
}
