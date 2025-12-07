// src/store/useCompetitionStore.ts
import { create } from "zustand";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta as any).env?.BACKEND_URL ||
  "http://localhost:8080";

export interface CountryOption {
  code: string;
  name: string;
  flag?: string | null;
}

export interface LeagueOption {
  id: string; // league.id
  name: string;
  type?: string | null;
  logo?: string | null;
  latestSeason?: string | null;
}

interface CompetitionState {
  countries: CountryOption[] | null;
  leaguesByKey: Record<string, LeagueOption[]>; // key: `${sportId}_${countryCode}`
  loadingCountries: boolean;
  loadingLeagues: boolean;
  errorCountries: string | null;
  errorLeagues: string | null;
  fetchCountries: () => Promise<void>;
  fetchLeagues: (sportId: string, countryCode: string) => Promise<void>;
}

export const useCompetitionsStore = create<CompetitionState>((set, get) => ({
  countries: null,
  leaguesByKey: {},
  loadingCountries: false,
  loadingLeagues: false,
  errorCountries: null,
  errorLeagues: null,

  async fetchCountries() {
    const { countries } = get();
    if (countries && countries.length > 0) return; // keširano

    set({ loadingCountries: true, errorCountries: null });
    try {
      const base = BACKEND_URL.replace(/\/+$/, "");
      const res = await fetch(`${base}/api/natjecanja/countries`);
      if (!res.ok) {
        throw new Error(`Greška pri dohvaćanju država: ${res.status}`);
      }

      const data: {
        code: string;
        name: string;
        flag?: string | null;
      }[] = await res.json();

      const mapped: CountryOption[] = data.map((c) => ({
        code: c.code,
        name: c.name,
        flag: c.flag,
      }));

      set({ countries: mapped, loadingCountries: false });
    } catch (err: any) {
      set({
        errorCountries: err.message ?? "Došlo je do greške.",
        loadingCountries: false,
      });
    }
  },

  async fetchLeagues(sportId: string, countryCode: string) {
    const key = `${sportId}_${countryCode}`;
    const { leaguesByKey, countries } = get();
    if (leaguesByKey[key]) return; // keširano

    set({ loadingLeagues: true, errorLeagues: null });
    try {
      const base = BACKEND_URL.replace(/\/+$/, "");

      // 🔁 FOOTBALL → šaljemo code
      // 🏀 BASKETBALL → šaljemo ime države
      let countryParam = countryCode;
      if (sportId.toLowerCase() === "basketball") {
        const found = (countries || []).find((c) => c.code === countryCode);
        if (found?.name) {
          countryParam = found.name;
        }
      }

      const url = `${base}/api/natjecanja/leagues?countryCode=${encodeURIComponent(
        countryParam
      )}&sportId=${encodeURIComponent(sportId)}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Greška pri dohvaćanju liga: ${res.status}`);
      }

      const data: {
        id: any;
        name: string;
        type?: string | null;
        logo?: string | null;
        latestSeason?: string | null;
      }[] = await res.json();

      const mapped: LeagueOption[] = data.map((l) => ({
        id: String(l.id),
        name: l.name,
        type: l.type,
        logo: l.logo,
        latestSeason: l.latestSeason,
      }));

      set((state) => ({
        leaguesByKey: { ...state.leaguesByKey, [key]: mapped },
        loadingLeagues: false,
      }));
    } catch (err: any) {
      set({
        errorLeagues: err.message ?? "Došlo je do greške.",
        loadingLeagues: false,
      });
    }
  },
}));
