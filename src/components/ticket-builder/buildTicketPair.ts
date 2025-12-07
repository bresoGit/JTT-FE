// src/components/ticket-builder/utils/buildTicketPair.ts

import type { MatchItem } from "../../store/useMatchesStore";
import type { SportType, TicketPair } from "../../types/ticket";
import type {
  CountryOption,
  LeagueOption,
  NewParFormState,
} from "./NewParForm";

interface BuildTicketPairArgs {
  form: NewParFormState;
  countries: CountryOption[];
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

  const oddsSource =
    form.odds && form.odds.trim().length > 0
      ? form.odds.trim().replace(",", ".")
      : market.odds.toString();

  const parsed = Number(oddsSource);
  const finalOdds = Number.isFinite(parsed) ? parsed : market.odds;

  const generatedId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const [labelHome, labelAway] = match.label.split(" – ");

  return {
    id: generatedId,
    sport: form.sport as SportType,

    matchId: match.id,
    matchLabel: match.label,

    // 🔴 Bez formatiranja – koristimo vrijednost kakva jest
    marketCode: market.code,
    marketLabel: market.code,
    odds: finalOdds,

    timestamp: match.timestamp,

    leagueId: league?.id,
    leagueName: match.leagueName ?? league?.name,
    leagueLogo: (match as any).leagueLogo ?? league?.logo ?? null,

    homeLogo: match.homeLogo ?? null,
    awayLogo: match.awayLogo ?? null,

    homeName: (match as any).homeName ?? labelHome ?? "Domaćin",
    awayName: (match as any).awayName ?? labelAway ?? "Gost",
    homeId: (match as any).homeId ?? undefined,
    awayId: (match as any).awayId ?? undefined,
    season:
      (match as any).seasonId ?? (league as any)?.latestSeason ?? undefined,
  };
}
