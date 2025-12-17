import React from "react";
import type { SportType } from "../types/ticket";
import {
  type BackendDayPlan,
  type BackendLeague,
  type DayPlanState,
  type PlannerLeague,
} from "../types/leaguePlanner";
import { useCompetitionsStore } from "../store/useCompetitionStore";
import type { JackOption } from "../components/ui/JackDropdown";
import DayPlanCard from "../components/league-planner/DayPlanCard";

const BACKEND_URL =
  (import.meta as any).env?.VITE_BACKEND_URL ?? "http://localhost:8080";

const formatDateLabel = (iso: string, index: number) => {
  const d = new Date(iso + "T00:00:00");
  const weekday = d.toLocaleDateString("hr-HR", { weekday: "long" });
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  if (index === 0) {
    return `Danas • ${day}.${month}. (${weekday})`;
  }
  return `${day}.${month}. (${weekday})`;
};

// build YYYY-MM-DD using *local* date, no toISOString()
const makeDateRange = (): string[] => {
  const base = new Date();
  base.setHours(0, 0, 0, 0); // local midnight
  const out: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    out.push(`${year}-${month}-${day}`);
  }

  return out;
};

const LeaguePlannerPage: React.FC = () => {
  // ⚽🏀 controls which sport we use for dropdowns & new inserts
  const [sport, setSport] = React.useState<SportType>("FOOTBALL");

  // All planned leagues (both sports) for the next 7 days
  const [dayPlans, setDayPlans] = React.useState<DayPlanState[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [mutating, setMutating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

  const sportId = sport === "FOOTBALL" ? "football" : "basketball";

  // 1) fetch countries once
  React.useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // 2) load planner for next 7 days (both sports) on mount
  React.useEffect(() => {
    const dates = makeDateRange();
    const from = dates[0];
    const to = dates[dates.length - 1];

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = BACKEND_URL.replace(/\/+$/, "");
        const url = `${base}/api/league-planner?from=${from}&to=${to}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Greška pri dohvaćanju plana liga: ${res.status}`);
        }

        const data: BackendDayPlan[] = await res.json();

        const byDate = new Map<string, BackendDayPlan>();
        data.forEach((d) => byDate.set(d.date, d));

        const plans: DayPlanState[] = dates.map((d) => {
          const backendDay = byDate.get(d);
          const leagues: PlannerLeague[] =
            backendDay?.leagues?.map((l: BackendLeague) => ({
              sport: (l.sport || "FOOTBALL").toUpperCase() as SportType,
              leagueId: l.leagueId,
              countryCode: (l.countryCode || "").toUpperCase(),
              leagueName: l.leagueName ?? l.leagueId,
              leagueLogo: l.leagueLogo ?? undefined,
              season: l.season ?? null, // 🔹 season iz backenda
            })) ?? [];

          return {
            date: d,
            leagues,
            countryCode: "",
            leagueId: "",
            leagueName: "",
            leagueLogo: "",
            season: null, // za current selection nije bitno, ali držimo shape
          };
        });

        setDayPlans(plans);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message ?? "Došlo je do greške pri dohvaćanju plana.");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  // 🔁 Country change
  const handleDayCountryChange = (index: number, countryCode: string) => {
    setDayPlans((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, countryCode, leagueId: "" } : d
      )
    );
    if (countryCode) {
      fetchLeagues(sportId, countryCode);
    }
  };

  // 🔁 League change (only selection in dropdown)
  const handleDayLeagueChange = (index: number, leagueId: string) => {
    setDayPlans((prev) =>
      prev.map((d, i) => (i === index ? { ...d, leagueId } : d))
    );
  };

  // ➕ ADD league → immediate backend call (with season)
  const handleAddLeague = async (index: number) => {
    const day = dayPlans[index];
    if (!day || !day.countryCode || !day.leagueId) return;

    // find league option in current dropdown to get name + logo + season
    const key = `${sportId}_${day.countryCode}`;
    const leagues = leaguesByKey[key] || [];
    const selectedLeague = leagues.find((l) => l.id === day.leagueId);

    const leagueName = selectedLeague?.name ?? day.leagueId;
    const leagueLogo =
      selectedLeague?.logo &&
      (selectedLeague.logo.startsWith("http://") ||
        selectedLeague.logo.startsWith("https://"))
        ? selectedLeague.logo
        : undefined;

    const season = selectedLeague?.latestSeason ?? null; // 🔹 uzmi latestSeason

    setMutating(true);
    setError(null);

    try {
      const base = BACKEND_URL.replace(/\/+$/, "");
      const res = await fetch(`${base}/api/league-planner/league`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: day.date,
          sport, // "FOOTBALL" / "BASKETBALL"
          leagueId: day.leagueId,
          countryCode: day.countryCode,
          leagueName,
          leagueLogo,
          season, // 🔹 pošalji season
        }),
      });

      if (!res.ok) {
        throw new Error(`Greška pri dodavanju lige: ${res.status}`);
      }

      // local upsert
      setDayPlans((prev) => {
        const copy = [...prev];
        const d = copy[index];
        if (!d) return prev;

        const existsIndex = d.leagues.findIndex(
          (l) =>
            l.sport === sport &&
            l.leagueId === day.leagueId &&
            l.countryCode === day.countryCode
        );

        if (existsIndex >= 0) {
          // update existing row with fresh name/logo/season
          const updatedLeagues = [...d.leagues];
          updatedLeagues[existsIndex] = {
            ...updatedLeagues[existsIndex],
            leagueName,
            leagueLogo,
            season,
          };
          copy[index] = {
            ...d,
            leagues: updatedLeagues,
            leagueId: "",
          };
          return copy;
        }

        copy[index] = {
          ...d,
          leagues: [
            ...d.leagues,
            {
              sport,
              leagueId: day.leagueId,
              countryCode: day.countryCode,
              leagueName,
              leagueLogo,
              season,
            },
          ],
          leagueId: "",
        };
        return copy;
      });
    } catch (err: any) {
      setError(err.message ?? "Došlo je do greške pri dodavanju lige.");
    } finally {
      setMutating(false);
    }
  };

  // ➖ REMOVE league → immediate backend call
  const handleRemoveLeague = async (dayIndex: number, leagueIndex: number) => {
    const day = dayPlans[dayIndex];
    if (!day || !day.leagues[leagueIndex]) return;
    const league = day.leagues[leagueIndex];

    setMutating(true);
    setError(null);

    try {
      const base = BACKEND_URL.replace(/\/+$/, "");
      const params = new URLSearchParams({
        date: day.date,
        sport: league.sport, // from row
        leagueId: league.leagueId,
        countryCode: league.countryCode,
      });

      const res = await fetch(
        `${base}/api/league-planner/league?${params.toString()}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error(`Greška pri brisanju lige: ${res.status}`);
      }

      // local remove
      setDayPlans((prev) => {
        const copy = [...prev];
        const d = copy[dayIndex];
        if (!d) return prev;
        const leagues = [...d.leagues];
        leagues.splice(leagueIndex, 1);
        copy[dayIndex] = { ...d, leagues };
        return copy;
      });
    } catch (err: any) {
      setError(err.message ?? "Došlo je do greške pri brisanju lige.");
    } finally {
      setMutating(false);
    }
  };

  // Options for dropdowns (countries always the same)
  const countryOptions: JackOption[] = (countries || []).map((c) => ({
    value: c.code,
    label: c.name,
    iconUrl:
      c.flag && (c.flag.startsWith("http://") || c.flag.startsWith("https://"))
        ? c.flag
        : undefined,
  }));

  const getLeagueOptionsForDay = (d: DayPlanState): JackOption[] => {
    if (!d.countryCode) return [];
    const key = `${sportId}_${d.countryCode}`;
    const leagues = leaguesByKey[key] || [];
    return leagues.map((l) => ({
      value: l.id,
      label: l.name,
      iconUrl:
        l.logo &&
        (l.logo.startsWith("http://") || l.logo.startsWith("https://"))
          ? l.logo
          : undefined,
      rightTag: l.latestSeason ?? undefined, // ovo ostaje isto
    }));
  };

  const sportSwitcherDisabled = loading || mutating;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Planer liga za Jackpottove tipove
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Odaberi koje lige želiš pratiti idućih 7 dana. Današnji dan je
            zaključan; plan vrijedi od sutra nadalje.
          </p>
        </div>

        {/* Sport switcher – samo za odabir sporta za dodavanje */}
        <div className="mt-2 flex items-center gap-2 text-xs md:mt-0">
          <span className="text-[11px] text-slate-400">Sport za dodavanje</span>
          <div
            className={`inline-flex overflow-hidden rounded-2xl border border-jack-border bg-black/70 ${
              sportSwitcherDisabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <button
              type="button"
              disabled={sportSwitcherDisabled}
              onClick={() => setSport("FOOTBALL")}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${
                sport === "FOOTBALL"
                  ? "bg-jack-red text-red-50 shadow-[0_0_18px_rgba(248,113,113,0.9)]"
                  : "text-slate-300 hover:bg-red-900/30"
              } ${sportSwitcherDisabled ? "cursor-not-allowed" : ""}`}
            >
              Nogomet
            </button>
            <button
              type="button"
              disabled={sportSwitcherDisabled}
              onClick={() => setSport("BASKETBALL")}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${
                sport === "BASKETBALL"
                  ? "bg-jack-red text-red-50 shadow-[0_0_18px_rgba(248,113,113,0.9)]"
                  : "text-slate-300 hover:bg-red-900/30"
              } ${sportSwitcherDisabled ? "cursor-not-allowed" : ""}`}
            >
              Košarka
            </button>
          </div>
        </div>
      </div>

      {/* Status messages */}
      {loading && (
        <div className="rounded-xl border border-jack-border bg-black/50 px-4 py-2 text-xs text-slate-300">
          Učitavam postojeći plan liga…
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-500 bg-black/60 px-4 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Days grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dayPlans.map((day, idx) => (
          <DayPlanCard
            key={day.date}
            day={day}
            index={idx}
            dayLabel={formatDateLabel(day.date, idx)}
            isToday={idx === 0}
            countryOptions={countryOptions}
            leagueOptions={getLeagueOptionsForDay(day)}
            loadingCountries={loadingCountries}
            errorCountries={errorCountries}
            loadingLeagues={loadingLeagues}
            errorLeagues={errorLeagues}
            onCountryChange={handleDayCountryChange}
            onLeagueChange={handleDayLeagueChange}
            onAddLeague={handleAddLeague}
            onRemoveLeague={handleRemoveLeague}
          />
        ))}
      </div>
    </div>
  );
};

export default LeaguePlannerPage;
