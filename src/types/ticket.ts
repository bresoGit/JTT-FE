export type SportType = "FOOTBALL" | "BASKETBALL";

export interface TicketPair {
  id: string;
  sport: SportType;

  // core match + market
  matchId: string;
  matchLabel: string;
  marketCode: string;
  marketLabel: string;
  odds: number;

  // enriched match info (from MatchItem + league)
  timestamp?: number;

  leagueId?: string;
  leagueName?: string;
  leagueLogo?: string | null;

  homeLogo?: string | null;
  awayLogo?: string | null;

  // NEW - to match TicketPairDto
  homeName?: string;
  awayName?: string;
  homeId?: string;
  awayId?: string;
  season?: string;
}
