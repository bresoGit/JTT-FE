// src/components/ticket-builder/utils/buildTicketPair.ts
import type { TicketPair, SportType } from "../../types/ticket";
import type {
  NewParFormState,
  CountryOption, // kept for signature compatibility, not used
  LeagueOption,
} from "../ticket-builder/NewParForm";
import type { MatchItem } from "../../store/useMatchesStore";

// isti formatter kao u NewParForm
const formatMarketLabel = (code: string): string =>
  code.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

interface BuildTicketPairArgs {
  form: NewParFormState;
  countries: CountryOption[]; // unused for now, ali ostaje u potpisu
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

  // pokušaj parsiranja imena iz labela "Home – Away" (EN dash)
  const [labelHome, labelAway] = match.label.split(" – ");

  const homeName = match.homeName || labelHome || "Domaćin";
  const awayName = match.awayName || labelAway || "Gost";

  return {
    id: generatedId,

    sport: form.sport as SportType,

    // core match + market
    matchId: match.id,
    matchLabel: match.label,
    marketCode: market.code,
    marketLabel: formatMarketLabel(market.code),
    odds: finalOdds,

    // enriched info
    timestamp: match.timestamp,

    leagueId: match.leagueId ?? league?.id,
    leagueName: match.leagueName ?? league?.name,
    leagueLogo: match.leagueLogo ?? league?.logo ?? null,

    homeLogo: match.homeLogo ?? null,
    awayLogo: match.awayLogo ?? null,

    // NEW fields for backend TicketPairDto
    homeName,
    awayName,
    homeId: match.homeId,
    awayId: match.awayId,
    season: match.seasonId ?? league?.latestSeason ?? undefined,
  };
}
