// src/types/tips.ts
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Tip {
  id: number;
  risk: RiskLevel;
  league: string;
  match: string;
  market: string;
  odds: number;
  kickoff: string;
  confidence: number; // 0-100
}
