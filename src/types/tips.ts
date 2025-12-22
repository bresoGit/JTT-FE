export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type JelProslo = "D" | "N" | null;

export interface Tip {
  id: number;
  risk: RiskLevel;
  league: string;
  match: string;
  market: string;
  odds: number;
  kickoff: string;
  confidence: number; // 0-100

  // NEW visual stuff
  homeLogo?: string | null;
  awayLogo?: string | null;
  leagueLogo?: string | null;
  season?: string | null;

  country?: string | null;

  // ✅ NEW (settlement)
  rezultat?: string | null; // e.g. "2:1" or "98:92 - 45:40"
  jelProslo?: JelProslo; // "D" | "N" | null
}
