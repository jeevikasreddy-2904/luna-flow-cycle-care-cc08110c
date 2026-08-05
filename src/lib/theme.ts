import { loadState, updateState, type Theme } from "./storage";

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function initTheme(): Theme {
  const t = loadState().theme ?? "light";
  applyTheme(t);
  return t;
}

export function toggleTheme(): Theme {
  const next: Theme = (loadState().theme ?? "light") === "light" ? "dark" : "light";
  updateState({ theme: next });
  applyTheme(next);
  return next;
}
