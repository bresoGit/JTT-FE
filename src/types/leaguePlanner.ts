// src/types/leaguePlanner.ts
import type { SportType } from "./ticket";

export interface PlannerLeague {
  sport: SportType; // "FOOTBALL" | "BASKETBALL"
  countryCode: string; // ISO code
  leagueId: string; // backend league id
  leagueName: string;
  leagueLogo: string | undefined;
}

export interface DayPlanState {
  date: string; // "2025-12-08"
  leagues: PlannerLeague[];
  countryCode: string; // current selected country
  leagueId: string; // current selected league
  leagueName: string;
  leagueLogo: string | undefined;
}

export interface BackendLeague {
  sport: string;
  leagueId: string;
  countryCode: string;
  leagueName: string;
  leagueLogo: string | undefined;
}

export interface BackendDayPlan {
  date: string;
  leagues: BackendLeague[];
}
