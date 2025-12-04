// src/types/ticket.ts
export type SportType = "FOOTBALL" | "BASKETBALL";

export interface TicketPair {
  id: string;
  sport: SportType;
  matchId: string;
  matchLabel: string;
  marketCode: string;
  marketLabel: string;
  odds: number;
}
