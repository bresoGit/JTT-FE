// src/store/useMatchesStore.ts
import { create } from "zustand";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta as any).env?.BACKEND_URL ||
  "http://localhost:8080";

export interface MatchItem {
  id: string;
  label: string; // "Domacin – Gost"
  timestamp: number;

  leagueId: string;
  leagueName: string;
  leagueLogo?: string | null;

  homeLogo?: string | null;
  awayLogo?: string | null;

  // NEW – align with NatjecanjeDropdownItem
  homeId?: string;
  awayId?: string;
  homeName?: string;
  awayName?: string;
  seasonId?: string;
}

interface MatchesState {
  matchesByKey: Record<string, MatchItem[]>; // key: `${sportId}_${leagueId}_${season}_${dateFrom}_${dateTo}`
  loadingMatches: boolean;
  errorMatches: string | null;
  fetchMatches: (
    sportId: string,
    leagueId: string,
    season: string,
    dateFrom: string,
    dateTo: string
  ) => Promise<void>;
}

export const useMatchesStore = create<MatchesState>((set, get) => ({
  matchesByKey: {},
  loadingMatches: false,
  errorMatches: null,

  async fetchMatches(
    sportId: string,
    leagueId: string,
    season: string,
    dateFrom: string,
    dateTo: string
  ) {
    const key = `${sportId}_${leagueId}_${season}_${dateFrom}_${dateTo}`;
    const { matchesByKey } = get();
    if (matchesByKey[key]) return; // keširano

    set({ loadingMatches: true, errorMatches: null });
    try {
      const base = BACKEND_URL.replace(/\/+$/, "");
      const url =
        `${base}/api/natjecanja/natjecanja` +
        `?sport=${encodeURIComponent(sportId)}` +
        `&leagueId=${encodeURIComponent(leagueId)}` +
        `&season=${encodeURIComponent(season)}` +
        `&dateFrom=${encodeURIComponent(dateFrom)}` +
        `&dateTo=${encodeURIComponent(dateTo)}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Greška pri dohvaćanju utakmica: ${res.status}`);
      }

      const data: {
        matchId: number;
        domacinId: string;
        domacinIme: string;
        gostId: string;
        gostIme: string;
        domacinLogo?: string | null;
        gostLogo?: string | null;
        timestamp: number;
        leagueId: string;
        leagueIme: string;
        leagueLogo?: string | null;
        seasonId?: string | null;
      }[] = await res.json();

      const mapped: MatchItem[] = data.map((m) => ({
        id: String(m.matchId),
        label: `${m.domacinIme} – ${m.gostIme}`,
        timestamp: m.timestamp,

        leagueId: String(m.leagueId),
        leagueName: m.leagueIme,
        leagueLogo: m.leagueLogo ?? null,

        homeLogo: m.domacinLogo ?? null,
        awayLogo: m.gostLogo ?? null,

        homeId: m.domacinId,
        awayId: m.gostId,
        homeName: m.domacinIme,
        awayName: m.gostIme,
        seasonId: m.seasonId ?? undefined,
      }));

      set((state) => ({
        matchesByKey: { ...state.matchesByKey, [key]: mapped },
        loadingMatches: false,
      }));
    } catch (err: any) {
      set({
        errorMatches: err.message ?? "Došlo je do greške.",
        loadingMatches: false,
      });
    }
  },
}));
