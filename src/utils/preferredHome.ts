// src/utils/preferredHome.ts
export const PREFERRED_HOME_KEY = "jtt_preferred_home";

export function getPreferredHome(): "/" | "/loto" {
  if (typeof window === "undefined") return "/";
  const v = window.localStorage.getItem(PREFERRED_HOME_KEY);
  return v === "/loto" ? "/loto" : "/";
}

export function setPreferredHome(path: "/" | "/loto") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFERRED_HOME_KEY, path);
}

export function isLottoThemeByPreference(): boolean {
  return getPreferredHome() === "/loto";
}
