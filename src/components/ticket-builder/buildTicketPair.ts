// src/components/ticket-builder/utils/buildTicketPair.ts
import type { TicketPair, SportType } from "../../types/ticket";
import type {
  NewParFormState,
  CountryOption,
  LeagueOption,
} from "../ticket-builder/NewParForm"; // prilagodi path ako treba
import type { MatchItem } from "../../store/useMatchesStore";

// isti formatter kao u NewParForm
const formatMarketLabel = (code: string): string =>
  code.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

interface BuildTicketPairArgs {
  form: NewParFormState;
  countries: CountryOption[]; // i dalje ih primaš, ali ih TicketPair više ne koristi
  leagues: LeagueOption[];
  matches: MatchItem[];
  markets: { code: string; odds: number }[];
}

export function buildTicketPair({
  form,
  leagues,
  matches,
  markets,
}: BuildTicketPairArgs): TicketPair | null {
  const match = matches.find((m) => m.id === form.matchId);
  const league = leagues.find((l) => l.id === form.leagueId);
  const market = markets.find((m) => m.code === form.marketCode);

  if (!match || !market) {
    return null;
  }

  // koef: prvo probamo form.odds (string), fallback na market.odds
  const oddsSource =
    form.odds && form.odds.trim().length > 0
      ? form.odds.trim().replace(",", ".")
      : market.odds.toString();

  const parsed = Number(oddsSource);
  const finalOdds = Number.isFinite(parsed) ? parsed : market.odds;

  // siguran ID u browseru
  const generatedId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id: generatedId,

    sport: form.sport as SportType,

    // core match + market
    matchId: match.id,
    matchLabel: match.label,
    marketCode: market.code,
    marketLabel: formatMarketLabel(market.code),
    odds: finalOdds,

    // enriched info (samo ono što TicketPair sada ima)
    timestamp: match.timestamp,

    leagueId: league?.id,
    leagueName: match.leagueName ?? league?.name,
    leagueLogo:
      // ako MatchItem ima svoj logo, koristi njega, inače iz LeagueOption
      (match as any).leagueLogo ?? league?.logo ?? null,

    homeLogo: match.homeLogo ?? null,
    awayLogo: match.awayLogo ?? null,
  };
}
