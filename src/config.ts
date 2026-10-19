const env = (window as any).__ENV__ ?? {};

export const APP_NAME =
  env.VITE_APP_NAME || import.meta.env.VITE_APP_NAME || "Skiservice Kasse";
export const API_URL =
  env.VITE_API_URL || import.meta.env.VITE_API_URL || "http://localhost:8000";