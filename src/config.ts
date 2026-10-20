const rohEnv = (window as any).__ENV__ ?? {};

// Ist eine Variable im Container nicht gesetzt, ersetzt envsubst den Platzhalter nicht.
// "${VITE_API_URL}" wäre sonst ein gültiger String und der Fallback würde nie greifen.
const env: Record<string, string | undefined> = Object.fromEntries(
  Object.entries(rohEnv).map(([key, wert]) => [
    key,
    typeof wert === "string" && wert.trim() !== "" && !wert.startsWith("${") ? wert : undefined,
  ])
);

export const APP_NAME =
  env.VITE_APP_NAME || import.meta.env.VITE_APP_NAME || "Skiservice Kasse";
export const API_URL =
  env.VITE_API_URL || import.meta.env.VITE_API_URL || "http://localhost:8000";