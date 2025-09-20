// Centralized theme config and helper utilities
// - Single source of truth for configurable settings
// - Provides React context + localStorage persistence for dark mode

export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "kira:theme";

export const tokens = {
  fonts: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  colors: {
    primary: "var(--color-primary)",
    primaryFg: "var(--color-primary-foreground)",
    surface: "var(--color-surface)",
    background: "var(--color-background)",
    foreground: "var(--color-foreground)",
    border: "var(--color-border)",
    muted: "var(--color-muted)",
    mutedFg: "var(--color-muted-foreground)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
  },
} as const;

export function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  if (stored) return stored;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches));
}