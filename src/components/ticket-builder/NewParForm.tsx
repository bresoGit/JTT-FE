// src/components/ticket-builder/NewParForm.tsx
import React from "react";
import type { SportType } from "../../types/ticket";

import type { MatchItem } from "../../store/useMatchesStore";
import type { JackOption } from "../ui/JackDropdown";
import JackDropdown from "../ui/JackDropdown";

export interface NewParFormState {
  sport: SportType;
  countryCode: string;
  leagueId: string;
  matchId: string;
  marketCode: string;
  odds: string;
}

export interface CountryOption {
  code: string;
  name: string;
  flag?: string | null;
}

export interface LeagueOption {
  id: string;
  name: string;
  logo?: string | null;
  latestSeason?: string | null;
}

export interface MarketOption {
  code: string;
  odds: number;
}

interface NewParFormProps {
  isAdding: boolean;
  disabled: boolean; // NEW – global lock while ticket scanning
  newPar: NewParFormState;

  countries: CountryOption[];
  leagues: LeagueOption[];
  currentMatches: MatchItem[];

  countriesLoading: boolean;
  countriesError: string | null;
  leaguesLoading: boolean;
  leaguesError: string | null;
  matchesLoading: boolean;
  matchesError: string | null;

  markets: MarketOption[];
  marketsLoading: boolean;
  marketsError: string | null;

  onChange: (field: keyof NewParFormState, value: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  canSubmit: boolean;

  selectedDayOffset: 0 | 1 | 2;
  onChangeDayOffset: (offset: 0 | 1 | 2) => void;
}

const formatMarketLabel = (code: string): string =>
  code.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const NewParForm: React.FC<NewParFormProps> = ({
  isAdding,
  disabled,
  newPar,
  countries,
  leagues,
  currentMatches,
  countriesLoading,
  countriesError,
  leaguesLoading,
  leaguesError,
  matchesLoading,
  matchesError,
  markets,
  marketsLoading,
  marketsError,
  onChange,
  onCancel,
  onSubmit,
  canSubmit,
  selectedDayOffset,
  onChangeDayOffset,
}) => {
  const countryOptions: JackOption[] = countries.map((c) => ({
    value: c.code,
    label: c.name,
    iconUrl:
      c.flag && (c.flag.startsWith("http://") || c.flag.startsWith("https://"))
        ? c.flag
        : undefined,
  }));

  const leagueOptions: JackOption[] = leagues.map((l) => ({
    value: l.id,
    label: l.name,
    iconUrl:
      l.logo && (l.logo.startsWith("http://") || l.logo.startsWith("https://"))
        ? l.logo
        : undefined,
    rightTag: l.latestSeason ?? undefined,
  }));

  const formatTime = (timestamp: number | undefined) => {
    if (!timestamp) return undefined;
    try {
      const date = new Date(timestamp * 1000);
      const hh = date.getHours().toString().padStart(2, "0");
      const mm = date.getMinutes().toString().padStart(2, "0");
      return `${hh}:${mm}`;
    } catch {
      return undefined;
    }
  };

  const matchOptions: JackOption[] = currentMatches.map((m) => ({
    value: m.id,
    label: m.label,
    iconUrls: [m.homeLogo ?? null, m.awayLogo ?? null],
    description: m.leagueName,
    rightTag: formatTime(m.timestamp),
  }));

  const marketOptions: JackOption[] = markets.map((m) => ({
    value: m.code,
    label: formatMarketLabel(m.code),
    rightTag: m.odds.toFixed(2),
  }));

  const dayLabels: Record<0 | 1 | 2, string> = {
    0: "Danas",
    1: "Sutra",
    2: "Prekosutra",
  };

  const effectiveDisabled = disabled;

  return (
    <section className="rounded-2xl border border-jack-border bg-black/60 p-4">
      <h2 className="text-sm md:text-base font-semibold tracking-tight">
        Novi par
      </h2>
      <p className="mb-3 text-[11px] text-slate-400">
        Odaberi sport, državu, ligu, dan, utakmicu i tip oklade. Dok je ovaj
        obrazac otvoren ili Jack skenira listić, ne možeš dodavati dodatne
        parove.
      </p>

      {!isAdding ? (
        <div className="text-[12px] italic text-slate-500">
          Klikni na &quot;Dodaj novi par&quot; u listiću kako bi otvorio
          obrazac.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 text-xs md:text-sm">
          <fieldset
            disabled={effectiveDisabled}
            className={
              effectiveDisabled ? "opacity-50 pointer-events-none" : ""
            }
          >
            {/* Sport */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">Sport</label>
              <select
                value={newPar.sport}
                onChange={(e) => onChange("sport", e.target.value)}
                className="rounded-xl border border-jack-border bg-black/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-red-400"
              >
                <option value="FOOTBALL">Nogomet</option>
                <option value="BASKETBALL">Košarka</option>
              </select>
            </div>

            {/* Country */}
            <JackDropdown
              label="Država"
              placeholder={
                countriesLoading
                  ? "Učitavam države..."
                  : countriesError
                  ? "Greška pri dohvaćanju država"
                  : "Odaberi državu"
              }
              value={newPar.countryCode}
              onChange={(val) => onChange("countryCode", val)}
              options={countryOptions}
              disabled={
                countriesLoading || !!countriesError || countries.length === 0
              }
              loading={countriesLoading}
              error={countriesError || undefined}
              searchable
              searchPlaceholder="Traži državu..."
            />

            {/* League */}
            <JackDropdown
              label="Liga"
              placeholder={
                !newPar.countryCode
                  ? "Prvo odaberi državu"
                  : leaguesLoading
                  ? "Učitavam lige..."
                  : leaguesError
                  ? "Greška pri dohvaćanju liga"
                  : "Odaberi ligu"
              }
              value={newPar.leagueId}
              onChange={(val) => onChange("leagueId", val)}
              options={leagueOptions}
              disabled={
                !newPar.countryCode ||
                leaguesLoading ||
                !!leaguesError ||
                leagues.length === 0
              }
              loading={leaguesLoading}
              error={leaguesError || undefined}
              searchable
              searchPlaceholder="Traži ligu..."
            />

            {/* Day filter */}
            <div className="w-full flex flex-col gap-1">
              <span className="text-[11px] text-slate-400">
                Dan odigravanja
              </span>
              <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-jack-border bg-black/70 text-[11px]">
                {[0, 1, 2].map((offset) => {
                  const off = offset as 0 | 1 | 2;
                  const active = selectedDayOffset === off;
                  return (
                    <button
                      key={off}
                      type="button"
                      onClick={() => onChangeDayOffset(off)}
                      className={`px-3 py-1.5 transition ${
                        active
                          ? "bg-jack-red text-red-50 shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                          : "bg-transparent text-slate-300 hover:bg-red-900/30"
                      }`}
                    >
                      {dayLabels[off]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Match */}
            <JackDropdown
              label="Utakmica"
              placeholder={
                !newPar.leagueId
                  ? "Prvo odaberi ligu"
                  : matchesLoading
                  ? "Učitavam utakmice..."
                  : matchesError
                  ? "Greška pri dohvaćanju utakmica"
                  : currentMatches.length === 0
                  ? "Nema utakmica za odabrani dan"
                  : "Odaberi utakmicu"
              }
              value={newPar.matchId}
              onChange={(val) => onChange("matchId", val)}
              options={matchOptions}
              disabled={
                !newPar.leagueId ||
                matchesLoading ||
                !!matchesError ||
                currentMatches.length === 0
              }
              loading={matchesLoading}
              error={matchesError || undefined}
              searchable
              searchPlaceholder="Traži utakmicu..."
              variant="match"
            />

            {/* Market */}
            <JackDropdown
              label="Tip oklade"
              placeholder={
                !newPar.matchId
                  ? "Prvo odaberi utakmicu"
                  : marketsLoading
                  ? "Učitavam tipove oklade..."
                  : marketsError
                  ? "Greška pri dohvaćanju tipova"
                  : markets.length === 0
                  ? "Nema dostupnih tipova"
                  : "Odaberi tip oklade"
              }
              value={newPar.marketCode}
              onChange={(val) => onChange("marketCode", val)}
              options={marketOptions}
              disabled={
                !newPar.matchId ||
                marketsLoading ||
                !!marketsError ||
                markets.length === 0
              }
              loading={marketsLoading}
              error={marketsError || undefined}
              searchable
              searchPlaceholder="Traži tip oklade..."
            />

            {/* Koeficijent (read-only) */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">Koeficijent</label>
              <input
                type="text"
                value={newPar.odds}
                readOnly
                placeholder="Odaberi tip oklade"
                className="rounded-xl border border-jack-border bg-black/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-red-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl border border-jack-border bg-black/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200 hover:border-red-400 hover:text-red-200 hover:bg-black/90"
              >
                Odustani
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`rounded-2xl px-4 py-2 text-[11px] font-semibold uppercase tracking-wide
                ${
                  canSubmit
                    ? "bg-jack-red text-red-50 shadow-[0_0_22px_rgba(248,113,113,0.9)] hover:bg-red-600"
                    : "cursor-not-allowed bg-slate-700 text-slate-400"
                }`}
              >
                Dodaj par na listić
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </section>
  );
};

export default NewParForm;
