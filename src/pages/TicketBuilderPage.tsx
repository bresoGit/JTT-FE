// src/pages/TicketBuilderPage.tsx
import React from "react";
import type { SportType, TicketPair } from "../types/ticket";
import { useTicket } from "../context/TicketContext";
import TicketSummaryPanel from "../components/ticket-builder/TicketSummaryPanel";
import NewParForm, {
  type NewParFormState,
  type MarketOption,
} from "../components/ticket-builder/NewParForm";
import { useCompetitionsStore } from "../store/useCompetitionStore";
import { useMatchesStore } from "../store/useMatchesStore";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta as any).env?.BACKEND_URL ||
  "http://localhost:8080";

const SCAN_STORAGE_KEY = "jack_ticket_scan_result";

const defaultNewPar: NewParFormState = {
  sport: "FOOTBALL",
  countryCode: "",
  leagueId: "",
  matchId: "",
  marketCode: "",
  odds: "",
};

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;

interface TicketScanApiResponse {
  status?: string;
  originalTotalOdds?: number;
  adjustedTotalOdds?: number;
  pairs?: TicketPair[];
}

const TicketBuilderPage: React.FC = () => {
  const { pairs, addPair, clearTicket, removePair } = useTicket();

  const [isAdding, setIsAdding] = React.useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = React.useState(false);
  const [newPar, setNewPar] = React.useState<NewParFormState>(defaultNewPar);
  const [selectedDayOffset, setSelectedDayOffset] = React.useState<0 | 1 | 2>(
    0
  );

  // scanned ticket result
  const [scannedPairs, setScannedPairs] = React.useState<TicketPair[] | null>(
    null
  );
  const [scannedOriginalTotalOdds, setScannedOriginalTotalOdds] =
    React.useState<number | null>(null);
  const [scannedAdjustedTotalOdds, setScannedAdjustedTotalOdds] =
    React.useState<number | null>(null);

  const {
    countries,
    leaguesByKey,
    loadingCountries,
    loadingLeagues,
    errorCountries,
    errorLeagues,
    fetchCountries,
    fetchLeagues,
  } = useCompetitionsStore();

  const { matchesByKey, loadingMatches, errorMatches, fetchMatches } =
    useMatchesStore();

  const [markets, setMarkets] = React.useState<MarketOption[]>([]);
  const [marketsLoading, setMarketsLoading] = React.useState(false);
  const [marketsError, setMarketsError] = React.useState<string | null>(null);

  const sportId = newPar.sport === "FOOTBALL" ? "football" : "basketball";

  const leaguesKey =
    newPar.countryCode !== "" ? `${sportId}_${newPar.countryCode}` : "";
  const leagues = leaguesKey ? leaguesByKey[leaguesKey] || [] : [];

  const selectedLeague = newPar.leagueId
    ? leagues.find((l) => l.id === newPar.leagueId) || null
    : null;

  const baseDate = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + selectedDayOffset);
    return d;
  }, [selectedDayOffset]);

  const dateFrom = formatDate(baseDate);
  const dateTo = dateFrom;

  const matchesKey =
    newPar.leagueId && selectedLeague?.latestSeason
      ? `${sportId}_${newPar.leagueId}_${selectedLeague.latestSeason}_${dateFrom}_${dateTo}`
      : "";

  const currentMatches = matchesKey ? matchesByKey[matchesKey] || [] : [];

  const totalOdds = pairs.reduce((acc, p) => acc * p.odds, 1);

  // hydrate scanned result from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SCAN_STORAGE_KEY);
      if (!raw) return;
      const parsed: {
        scannedPairs: TicketPair[];
        originalTotalOdds: number | null;
        adjustedTotalOdds: number | null;
      } = JSON.parse(raw);

      if (parsed.scannedPairs && parsed.scannedPairs.length > 0) {
        setScannedPairs(parsed.scannedPairs);
        setScannedOriginalTotalOdds(parsed.originalTotalOdds ?? null);
        setScannedAdjustedTotalOdds(parsed.adjustedTotalOdds ?? null);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // clear scan if pairs change (listić promijenjen nakon analize)
  React.useEffect(() => {
    if (!scannedPairs || scannedPairs.length === 0) return;
    if (pairs.length !== scannedPairs.length) {
      setScannedPairs(null);
      setScannedOriginalTotalOdds(null);
      setScannedAdjustedTotalOdds(null);
      try {
        window.localStorage.removeItem(SCAN_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [pairs.length, scannedPairs]);

  // fetch countries once
  React.useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // when country changes → fetch leagues
  React.useEffect(() => {
    if (!newPar.countryCode) return;
    fetchLeagues(sportId, newPar.countryCode);
  }, [fetchLeagues, sportId, newPar.countryCode]);

  // when league OR date changes → fetch matches for that league/day
  React.useEffect(() => {
    if (
      !newPar.leagueId ||
      !selectedLeague?.latestSeason ||
      !dateFrom ||
      !dateTo
    ) {
      return;
    }

    fetchMatches(
      sportId,
      newPar.leagueId,
      selectedLeague.latestSeason,
      dateFrom,
      dateTo
    );
  }, [
    fetchMatches,
    sportId,
    newPar.leagueId,
    selectedLeague?.latestSeason,
    dateFrom,
    dateTo,
  ]);

  // when match changes → fetch bet types (markets) for that match
  React.useEffect(() => {
    const loadMarkets = async () => {
      if (!newPar.matchId) {
        setMarkets([]);
        setMarketsError(null);
        setMarketsLoading(false);
        return;
      }

      setMarketsLoading(true);
      setMarketsError(null);

      try {
        const base = BACKEND_URL.replace(/\/+$/, "");
        const url =
          `${base}/api/natjecanja/bet-types` +
          `?matchId=${encodeURIComponent(newPar.matchId)}` +
          `&sport=${encodeURIComponent(newPar.sport)}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Greška pri dohvaćanju tipova oklade: ${res.status}`);
        }

        const data: Record<string, number> = await res.json();

        const mapped: MarketOption[] = Object.entries(data).map(
          ([code, odd]) => ({
            code, // već je labela
            odds: odd,
          })
        );

        setMarkets(mapped);
      } catch (err: any) {
        setMarkets([]);
        setMarketsError(
          err?.message ?? "Došlo je do greške pri dohvaćanju tipova oklade."
        );
      } finally {
        setMarketsLoading(false);
      }
    };

    loadMarkets();
  }, [newPar.matchId, newPar.sport]);

  const handleOpenForm = () => {
    setNewPar(defaultNewPar);
    setSelectedDayOffset(0);
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setNewPar(defaultNewPar);
    setMarkets([]);
    setMarketsError(null);
    setMarketsLoading(false);
  };

  const handleChange = (field: keyof NewParFormState, value: string) => {
    setNewPar((prev) => {
      if (field === "sport") {
        return {
          sport: value as SportType,
          countryCode: "",
          leagueId: "",
          matchId: "",
          marketCode: "",
          odds: "",
        };
      }
      if (field === "countryCode") {
        return {
          ...prev,
          countryCode: value,
          leagueId: "",
          matchId: "",
          marketCode: "",
          odds: "",
        };
      }
      if (field === "leagueId") {
        return {
          ...prev,
          leagueId: value,
          matchId: "",
          marketCode: "",
          odds: "",
        };
      }
      if (field === "matchId") {
        return {
          ...prev,
          matchId: value,
          marketCode: "",
          odds: "",
        };
      }

      const base = { ...prev, [field]: value };

      if (field === "marketCode") {
        const m = markets.find((x) => x.code === value);
        if (m) {
          base.marketCode = value;
          base.odds = m.odds.toString();
        } else {
          base.odds = "";
        }
      }

      return base;
    });
  };

  const handleClearScan = () => {
    setScannedPairs(null);
    setScannedOriginalTotalOdds(null);
    setScannedAdjustedTotalOdds(null);
    try {
      window.localStorage.removeItem(SCAN_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPar.matchId || !newPar.marketCode || !newPar.odds) {
      return;
    }

    const match = currentMatches.find((m) => m.id === newPar.matchId);
    if (!match) return;

    const oddsNumber = Number(newPar.odds.replace(",", "."));
    if (Number.isNaN(oddsNumber)) return;

    // ⬇️ KLJUČNA PROMJENA: ne formatiramo više, koristimo labelu kako je:
    const marketLabel = newPar.marketCode;

    const [labelHome, labelAway] = match.label.split(" – ");
    const homeName = (match as any).homeName ?? labelHome ?? "Domaćin";
    const awayName = (match as any).awayName ?? labelAway ?? "Gost";

    const newItem: TicketPair = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sport: newPar.sport,

      matchId: match.id,
      matchLabel: match.label,

      marketCode: newPar.marketCode,
      marketLabel,
      odds: oddsNumber,

      timestamp: match.timestamp,

      leagueId: newPar.leagueId,
      leagueName: match.leagueName ?? selectedLeague?.name ?? undefined,
      leagueLogo: (match as any).leagueLogo ?? selectedLeague?.logo ?? null,

      homeLogo: match.homeLogo ?? null,
      awayLogo: match.awayLogo ?? null,

      homeName,
      awayName,
      homeId: (match as any).homeId ?? undefined,
      awayId: (match as any).awayId ?? undefined,
      season:
        (match as any).seasonId ?? selectedLeague?.latestSeason ?? undefined,
    };

    addPair(newItem);
    setIsAdding(false);
    setNewPar(defaultNewPar);
    setMarkets([]);
    setMarketsError(null);
    setMarketsLoading(false);

    // novi par → stara analiza više ne vrijedi
    handleClearScan();
  };

  const canSubmit =
    !!newPar.sport &&
    !!newPar.countryCode &&
    !!newPar.leagueId &&
    !!newPar.matchId &&
    !!newPar.marketCode &&
    !!newPar.odds;

  const handleSubmitTicket = async () => {
    if (pairs.length === 0 || isSubmittingTicket) return;

    setIsSubmittingTicket(true);
    try {
      const base = BACKEND_URL.replace(/\/+$/, "");
      const res = await fetch(`${base}/api/natjecanja/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pairs: pairs.map((p) => ({
            sport: p.sport,
            matchId: p.matchId,
            matchLabel: p.matchLabel,
            marketCode: p.marketCode,
            marketLabel: p.marketLabel,
            odds: p.odds,
            timestamp: p.timestamp ?? null,
            leagueId: p.leagueId ?? null,
            leagueName: p.leagueName ?? null,
            leagueLogo: p.leagueLogo ?? null,
            homeLogo: p.homeLogo ?? null,
            awayLogo: p.awayLogo ?? null,
            homeName: p.homeName ?? null,
            awayName: p.awayName ?? null,
            homeId: p.homeId ?? null,
            awayId: p.awayId ?? null,
            season: p.season ?? null,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Greška pri slanju listića: ${res.status}`);
      }

      const data: TicketScanApiResponse = await res.json();

      const scanned = data.pairs && data.pairs.length > 0 ? data.pairs : null;
      const originalTotal =
        data.originalTotalOdds != null ? data.originalTotalOdds : totalOdds;
      const adjustedTotal =
        data.adjustedTotalOdds != null
          ? data.adjustedTotalOdds
          : data.originalTotalOdds ?? totalOdds;

      setScannedPairs(scanned);
      setScannedOriginalTotalOdds(originalTotal);
      setScannedAdjustedTotalOdds(adjustedTotal);

      try {
        window.localStorage.setItem(
          SCAN_STORAGE_KEY,
          JSON.stringify({
            scannedPairs: scanned,
            originalTotalOdds: originalTotal,
            adjustedTotalOdds: adjustedTotal,
          })
        );
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
          Jackov graditelj listića
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Dodaj parove jedan po jedan. Dok je obrazac za novi par otvoren,
          dodavanje novih parova je zaključano.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1.5fr]">
        {/* LEFT: ticket preview */}
        <TicketSummaryPanel
          pairs={pairs}
          totalOdds={totalOdds}
          isAdding={isAdding}
          onOpenForm={handleOpenForm}
          onClearTicket={() => {
            clearTicket();
            handleClearScan();
          }}
          onRemovePair={removePair}
          onSubmitTicket={handleSubmitTicket}
          canSubmitTicket={pairs.length > 0}
          isSubmittingTicket={isSubmittingTicket}
          scannedPairs={scannedPairs ?? undefined}
          scannedOriginalTotalOdds={scannedOriginalTotalOdds ?? undefined}
          scannedAdjustedTotalOdds={scannedAdjustedTotalOdds ?? undefined}
          onClearScan={handleClearScan}
        />

        {/* RIGHT: new par form */}
        <NewParForm
          isAdding={isAdding}
          disabled={isSubmittingTicket || !!scannedPairs}
          newPar={newPar}
          countries={countries || []}
          leagues={leagues}
          currentMatches={currentMatches}
          countriesLoading={loadingCountries}
          countriesError={errorCountries}
          leaguesLoading={loadingLeagues}
          leaguesError={errorLeagues}
          matchesLoading={loadingMatches}
          matchesError={errorMatches}
          markets={markets}
          marketsLoading={marketsLoading}
          marketsError={marketsError}
          onChange={handleChange}
          onCancel={handleCancelForm}
          onSubmit={handleSubmit}
          canSubmit={canSubmit && !isSubmittingTicket && !scannedPairs}
          selectedDayOffset={selectedDayOffset}
          onChangeDayOffset={(off) => {
            setSelectedDayOffset(off);
            setNewPar((prev) => ({
              ...prev,
              matchId: "",
              marketCode: "",
              odds: "",
            }));
            setMarkets([]);
            setMarketsError(null);
          }}
        />
      </div>
    </div>
  );
};

export default TicketBuilderPage;
