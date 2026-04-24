// LunaFlow local storage helpers
export type Profile = {
  name: string;
  age: string;
  occupation: "student" | "working" | "housewife" | "";
  dob: string;
  phone: string;
  email: string;
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
export type DayLog = { meals?: Meal; period?: boolean };

export type AppState = {
  profile?: Profile;
  onboarding?: Onboarding;
  periodDates: string[]; // ISO yyyy-mm-dd
  meals: Record<string, Meal>;
  streak: number;
  lastLogDate?: string;
  loggedIn: boolean;
};

const KEY = "lunaflow_state_v1";

const empty: AppState = {
  periodDates: [],
  meals: {},
  streak: 0,
  loggedIn: false,
};

export function loadState(): AppState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
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

export function logMealForToday(meal: Meal): AppState {
  const today = new Date().toISOString().slice(0, 10);
  const s = loadState();
  const meals = { ...s.meals, [today]: meal };
  let streak = s.streak;
  if (s.lastLogDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak = s.lastLogDate === yesterday ? streak + 1 : 1;
  }
  return updateState({ meals, streak, lastLogDate: today });
}
