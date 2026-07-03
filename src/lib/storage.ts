// LunaFlow local storage helpers
export type Profile = {
  name: string;
  age: string;
  occupation: "student" | "working" | "housewife" | "";
  dob: string;
  phone: string;
  email: string;
  place?: string;
  allergies?: string;
  healthConditions?: string;
  avatar?: string; // avatar id
};

export type Onboarding = {
  cramps: string;
  skipsMeals: string;
  drinksWater: string;
  exercises: string;
  onTime: string;
  delays: string;
  early: string;
};

export type Meal = { breakfast: string; lunch: string; dinner: string; protein: number };

export type PregnancyInfo = {
  monthsMissed: number;
  symptoms: Record<string, boolean>;
  startedAt: string; // ISO datetime when onboarding completed
};

export type AppMode = "period" | "pregnancy";

export type AppState = {
  profile?: Profile;
  onboarding?: Onboarding;
  periodDates: string[];
  meals: Record<string, Meal>;
  streak: number;
  lastLogDate?: string;
  streakFreezers: number; // up to 2
  loggedIn: boolean;
  pin?: string; // 4-digit PIN for settings lock
  mode: AppMode;
  pregnancy?: PregnancyInfo;
};

const KEY = "lunaflow_state_v1";

const empty: AppState = {
  periodDates: [],
  meals: {},
  streak: 0,
  streakFreezers: 2,
  loggedIn: false,
  mode: "period",
};

export function loadState(): AppState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed, streakFreezers: parsed.streakFreezers ?? 2 };
  } catch {
    return empty;
  }
}

export function saveState(s: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function updateState(patch: Partial<AppState>): AppState {
  const next = { ...loadState(), ...patch };
  saveState(next);
  return next;
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function logMealForToday(meal: Meal): { state: AppState; usedFreezer: number } {
  const today = new Date().toISOString().slice(0, 10);
  const s = loadState();
  const meals = { ...s.meals, [today]: meal };
  let streak = s.streak;
  let freezers = s.streakFreezers;
  let usedFreezer = 0;

  if (s.lastLogDate === today) {
    // same day re-save, no change
  } else if (!s.lastLogDate) {
    streak = 1;
  } else {
    const gap = daysBetween(s.lastLogDate, today);
    if (gap === 1) streak += 1;
    else if (gap > 1) {
      const missed = gap - 1;
      if (freezers >= missed) {
        freezers -= missed;
        usedFreezer = missed;
        streak += 1;
      } else {
        streak = 1;
        freezers = Math.min(2, freezers); // do not refill on reset
      }
    }
  }

  const state = updateState({ meals, streak, streakFreezers: freezers, lastLogDate: today });
  return { state, usedFreezer };
}

// ---------- Protein database ----------
// Values are grams of protein for the described serving.
export type ProteinEntry = { keys: string[]; grams: number; serving: string; label: string };

export const PROTEIN_DB: ProteinEntry[] = [
  // Dals & curries
  { keys: ["dal tadka"], grams: 10, serving: "1 bowl", label: "Dal tadka" },
  { keys: ["dal fry"], grams: 11, serving: "1 bowl", label: "Dal fry" },
  { keys: ["moong dal"], grams: 12, serving: "1 bowl", label: "Moong dal" },
  { keys: ["masoor dal"], grams: 11, serving: "1 bowl", label: "Masoor dal" },
  { keys: ["chana dal"], grams: 12, serving: "1 bowl", label: "Chana dal" },
  { keys: ["rajma"], grams: 14, serving: "1 bowl", label: "Rajma curry" },
  { keys: ["chole", "chickpea"], grams: 14, serving: "1 bowl", label: "Chole" },
  { keys: ["kala chana"], grams: 15, serving: "1 bowl", label: "Kala chana" },
  { keys: ["sprouted moong", "sprouts"], grams: 14, serving: "1 bowl", label: "Sprouted moong" },
  { keys: ["sambar"], grams: 7, serving: "1 bowl", label: "Sambar" },
  { keys: ["kadhi"], grams: 6, serving: "1 bowl", label: "Kadhi" },
  { keys: ["khichdi"], grams: 10, serving: "1 bowl", label: "Khichdi" },
  // Paneer / soy
  { keys: ["palak paneer"], grams: 18, serving: "1 bowl", label: "Palak paneer" },
  { keys: ["matar paneer"], grams: 18, serving: "1 bowl", label: "Matar paneer" },
  { keys: ["kadai paneer"], grams: 20, serving: "1 bowl", label: "Kadai paneer" },
  { keys: ["paneer tikka"], grams: 22, serving: "100g", label: "Paneer tikka" },
  { keys: ["paneer"], grams: 18, serving: "100g", label: "Paneer" },
  { keys: ["tofu"], grams: 8, serving: "100g", label: "Tofu" },
  { keys: ["soya chunks", "soy chunks", "soya"], grams: 17, serving: "100g cooked", label: "Soya chunks" },
  { keys: ["mushroom"], grams: 7, serving: "1 bowl", label: "Mushroom curry" },
  { keys: ["dhokla"], grams: 9, serving: "100g", label: "Dhokla" },
  // South Indian
  { keys: ["idli"], grams: 7, serving: "2 pcs", label: "Idli" },
  { keys: ["masala dosa"], grams: 7, serving: "1 pc", label: "Masala dosa" },
  { keys: ["dosa"], grams: 5, serving: "1 pc", label: "Dosa" },
  { keys: ["uttapam"], grams: 7, serving: "1 pc", label: "Uttapam" },
  { keys: ["medu vada", "vada"], grams: 7, serving: "2 pcs", label: "Medu vada" },
  { keys: ["adai"], grams: 9, serving: "1 pc", label: "Adai" },
  { keys: ["upma"], grams: 6, serving: "1 bowl", label: "Upma" },
  { keys: ["pongal"], grams: 7, serving: "1 cup", label: "Ven pongal" },
  { keys: ["poha"], grams: 5, serving: "1 bowl", label: "Poha" },
  { keys: ["curd rice"], grams: 7, serving: "1 bowl", label: "Curd rice" },
  { keys: ["ragi"], grams: 5, serving: "1 pc", label: "Ragi mudde" },
  { keys: ["pulao"], grams: 6, serving: "1 bowl", label: "Veg pulao" },
  { keys: ["veg biryani"], grams: 8, serving: "1 plate", label: "Veg biryani" },
  // Breads/basics
  { keys: ["chapati", "roti", "phulka"], grams: 4, serving: "1 pc", label: "Chapati" },
  { keys: ["oats"], grams: 5, serving: "1 bowl", label: "Oats" },
  { keys: ["quinoa"], grams: 8, serving: "1 bowl", label: "Quinoa" },
  // Dairy
  { keys: ["curd", "dahi", "yogurt"], grams: 8, serving: "1 cup", label: "Curd" },
  { keys: ["milk"], grams: 8, serving: "250ml", label: "Milk" },
  { keys: ["cheese"], grams: 7, serving: "1 slice", label: "Cheese" },
  // Nuts
  { keys: ["peanut chutney"], grams: 5, serving: "2 tbsp", label: "Peanut chutney" },
  { keys: ["peanut"], grams: 26, serving: "100g", label: "Peanuts" },
  { keys: ["almond"], grams: 21, serving: "100g", label: "Almonds" },
  { keys: ["nuts"], grams: 6, serving: "handful", label: "Nuts" },
  // Non-veg
  { keys: ["chicken breast"], grams: 31, serving: "100g", label: "Chicken breast" },
  { keys: ["chicken curry"], grams: 30, serving: "1 bowl", label: "Chicken curry" },
  { keys: ["chicken biryani"], grams: 30, serving: "1 plate", label: "Chicken biryani" },
  { keys: ["tandoori chicken"], grams: 35, serving: "2 pcs", label: "Tandoori chicken" },
  { keys: ["chicken tikka"], grams: 27, serving: "100g", label: "Chicken tikka" },
  { keys: ["chicken kebab", "kebab"], grams: 27, serving: "100g", label: "Chicken kebab" },
  { keys: ["chicken 65"], grams: 24, serving: "100g", label: "Chicken 65" },
  { keys: ["chicken"], grams: 25, serving: "100g", label: "Chicken" },
  { keys: ["mutton curry", "mutton"], grams: 28, serving: "1 bowl", label: "Mutton" },
  { keys: ["mutton biryani"], grams: 30, serving: "1 plate", label: "Mutton biryani" },
  { keys: ["fish curry"], grams: 25, serving: "1 bowl", label: "Fish curry" },
  { keys: ["fish fry", "fish"], grams: 22, serving: "100g", label: "Fish" },
  { keys: ["salmon"], grams: 25, serving: "100g", label: "Salmon" },
  { keys: ["prawn", "shrimp"], grams: 24, serving: "100g", label: "Prawn" },
  { keys: ["crab"], grams: 20, serving: "100g", label: "Crab" },
  { keys: ["egg bhurji", "bhurji"], grams: 13, serving: "2 eggs", label: "Egg bhurji" },
  { keys: ["omelette", "omelet"], grams: 13, serving: "2 eggs", label: "Omelette" },
  { keys: ["egg curry"], grams: 13, serving: "2 eggs", label: "Egg curry" },
  { keys: ["eggs"], grams: 12, serving: "2 eggs", label: "Eggs" },
  { keys: ["egg"], grams: 6, serving: "1 egg", label: "Egg" },
  { keys: ["beans"], grams: 15, serving: "1 bowl", label: "Beans" },
  { keys: ["lentil"], grams: 18, serving: "1 bowl", label: "Lentils" },
];

export function estimateProteinFromText(text: string): number {
  if (!text) return 0;
  const t = text.toLowerCase();
  let total = 0;
  const matched = new Set<string>();
  // longest keys first so "chicken breast" wins over "chicken"
  const sorted = [...PROTEIN_DB].sort((a, b) => Math.max(...b.keys.map((k) => k.length)) - Math.max(...a.keys.map((k) => k.length)));
  for (const entry of sorted) {
    for (const k of entry.keys) {
      if (t.includes(k) && !matched.has(entry.label)) {
        total += entry.grams;
        matched.add(entry.label);
        // mark tokens used so shorter overlaps skip
        break;
      }
    }
  }
  return total;
}

// ---------- Safe protein intake ----------
// Base ~0.8 g/kg body weight. Without weight we estimate from age & occupation.
// Cap lower for kidney/liver related conditions.
export function safeProteinRange(profile?: Profile): { min: number; max: number; note: string } {
  const age = Number(profile?.age) || 25;
  const occ = profile?.occupation ?? "";
  const health = (profile?.healthConditions ?? "").toLowerCase();
  const allergies = (profile?.allergies ?? "").toLowerCase();

  // rough baseline for adult women
  let min = 46;
  let max = 60;
  if (age < 14) { min = 30; max = 40; }
  else if (age < 18) { min = 40; max = 50; }
  else if (age > 55) { min = 45; max = 55; }

  if (occ === "working" || occ === "student") max += 5;

  const notes: string[] = [];
  if (/kidney|renal|ckd/.test(health)) { max = Math.min(max, 40); min = Math.min(min, 30); notes.push("kidney care — keep protein gentle"); }
  if (/liver|hepatic/.test(health)) { max = Math.min(max, 45); notes.push("liver care — moderate protein"); }
  if (/pcos|pcod/.test(health)) { min += 5; notes.push("PCOS — steady protein helps hormones"); }
  if (/anemia|anaemia|iron/.test(health)) { notes.push("pair protein with iron-rich foods"); }
  if (/lactose|dairy/.test(allergies)) notes.push("avoid milk & paneer");
  if (/nut|peanut|almond/.test(allergies)) notes.push("avoid nuts");
  if (/egg/.test(allergies)) notes.push("avoid eggs");
  if (/soy|soya/.test(allergies)) notes.push("avoid soy & tofu");

  return { min, max, note: notes.join(" • ") };
}
