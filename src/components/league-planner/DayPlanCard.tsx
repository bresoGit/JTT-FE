import React from "react";
import JackDropdown, { type JackOption } from "../ui/JackDropdown";
import type { DayPlanState } from "../../types/leaguePlanner";

interface DayPlanCardProps {
  day: DayPlanState;
  index: number;
  dayLabel: string;
  isToday: boolean;

  countryOptions: JackOption[];
  leagueOptions: JackOption[];

  loadingCountries: boolean;
  errorCountries: string | null;
  loadingLeagues: boolean;
  errorLeagues: string | null;

  onCountryChange: (index: number, countryCode: string) => void;
  onLeagueChange: (index: number, leagueId: string) => void;
  onAddLeague: (index: number) => void;
  onRemoveLeague: (dayIndex: number, leagueIndex: number) => void;
}

const DayPlanCard: React.FC<DayPlanCardProps> = ({
  day,
  index,
  dayLabel,
  isToday,
  countryOptions,
  leagueOptions,
  loadingCountries,
  errorCountries,
  loadingLeagues,
  errorLeagues,
  onCountryChange,
  onLeagueChange,
  onAddLeague,
  onRemoveLeague,
}) => {
  const [accordionOpen, setAccordionOpen] = React.useState(
    day.leagues.length > 0
  );

  const toggleAccordion = () => setAccordionOpen((prev) => !prev);

  return (
    <section
      className={`relative rounded-2xl border border-jack-border bg-black/70 p-4 ${
        isToday ? "opacity-70" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{dayLabel}</h2>
          {isToday && (
            <p className="text-[11px] text-slate-500">
              Današnji dan je zaključan. Plan vrijedi od sutra.
            </p>
          )}
        </div>
        <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700/60">
          {day.leagues.length} liga
        </span>
      </div>

      {/* Controls (country + league + add button) */}
      <div
        className={`space-y-2 text-xs ${isToday ? "pointer-events-none" : ""}`}
      >
        <JackDropdown
          label="Država"
          placeholder={
            loadingCountries
              ? "Učitavam države..."
              : errorCountries
              ? "Greška pri dohvaćanju država"
              : "Odaberi državu"
          }
          value={day.countryCode}
          onChange={(val) => onCountryChange(index, val)}
          options={countryOptions}
          disabled={
            loadingCountries || !!errorCountries || countryOptions.length === 0
          }
          loading={loadingCountries}
          error={errorCountries || undefined}
          searchable
          searchPlaceholder="Traži državu..."
        />

        <JackDropdown
          label="Liga"
          placeholder={
            !day.countryCode
              ? "Prvo odaberi državu"
              : loadingLeagues
              ? "Učitavam lige..."
              : errorLeagues
              ? "Greška pri dohvaćanju liga"
              : "Odaberi ligu"
          }
          value={day.leagueId}
          onChange={(val) => onLeagueChange(index, val)}
          options={leagueOptions}
          disabled={
            !day.countryCode ||
            loadingLeagues ||
            !!errorLeagues ||
            leagueOptions.length === 0
          }
          loading={loadingLeagues}
          error={errorLeagues || undefined}
          searchable
          searchPlaceholder="Traži ligu..."
        />

        <button
          type="button"
          onClick={() => onAddLeague(index)}
          disabled={isToday || !day.countryCode || !day.leagueId}
          className={`mt-1 inline-flex items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide
          ${
            !isToday && day.countryCode && day.leagueId
              ? "bg-jack-red text-red-50 shadow-[0_0_16px_rgba(248,113,113,0.9)] hover:bg-red-600"
              : "cursor-not-allowed bg-slate-700 text-slate-400"
          }`}
        >
          Dodaj ligu
        </button>
      </div>

      {/* Accordion with selected leagues – behaves like dropdown */}
      <div className="mt-3 relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={toggleAccordion}
          className="flex w-full items-center justify-between rounded-xl border border-jack-border bg-black/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-red-400"
        >
          <div className="flex flex-col text-left">
            <span className="font-semibold">
              Dodane lige ({day.leagues.length})
            </span>
            <span className="text-[10px] text-slate-400">
              {day.leagues.length === 0
                ? "Za ovaj dan još nema odabranih liga."
                : "Klikni za prikaz / skrivanje popisa liga."}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            {accordionOpen ? "▲" : "▼"}
          </span>
        </button>

        {/* Absolutely positioned panel under the trigger */}
        {accordionOpen && (
          <div className="absolute left-0 right-0 z-40 mt-1 max-h-44 overflow-y-auto rounded-xl border border-jack-border bg-black/95 px-2 py-2 shadow-[0_0_22px_rgba(0,0,0,0.9)]">
            {day.leagues.length === 0 ? (
              <p className="text-[11px] text-slate-500 px-1">
                Nema dodanih liga za ovaj dan.
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {day.leagues.map((l, li) => (
                  <li
                    key={`${l.sport}-${l.countryCode}-${l.leagueId}-${li}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-jack-border bg-black/80 px-3 py-1.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {l.leagueLogo && (
                        <img
                          src={l.leagueLogo}
                          alt={l.leagueName}
                          className="h-5 w-5 rounded-full bg-white object-contain ring-1 ring-black/40"
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-[12px] text-slate-100">
                          {l.leagueName ?? l.leagueId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {l.countryCode} •{" "}
                          {l.sport === "FOOTBALL" ? "Nogomet" : "Košarka"}
                        </span>
                      </div>
                    </div>
                    {!isToday && (
                      <button
                        type="button"
                        onClick={() => onRemoveLeague(index, li)}
                        className="text-[10px] rounded-full border border-red-500/60 px-2 py-0.5 text-red-200 hover:bg-red-900/40"
                      >
                        Ukloni
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DayPlanCard;
