// src/types/leaguePlanner.ts

import type { SportType } from "./ticket";

export interface BackendLeague {
  sport: string;
  leagueId: string;
  countryCode: string;
  leagueName?: string | null;
  leagueLogo?: string | null;
  season?: string | null; // 🔹 NEW
}

export interface BackendDayPlan {
  date: string; // "2025-12-08"
  leagues: BackendLeague[];
}

export interface PlannerLeague {
  sport: SportType;
  leagueId: string;
  countryCode: string;
  leagueName?: string;
  leagueLogo?: string;
  season?: string | null; // 🔹 NEW
}

export interface DayPlanState {
  date: string;
  leagues: PlannerLeague[];
  countryCode: string;
  leagueId: string;
  leagueName?: string;
  leagueLogo?: string;
  season?: string | null; // optional for selection, not critical
}
