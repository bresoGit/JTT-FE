// src/components/ticket-builder/NewParForm.tsx
import React from "react";
import type { SportType } from "../../types/ticket";

export interface NewParFormState {
  sport: SportType;
  matchId: string;
  marketCode: string;
  odds: string;
}

interface NewParFormProps {
  isAdding: boolean;
  newPar: NewParFormState;
  currentMatches: { id: string; label: string }[];
  mockMarkets: { code: string; label: string; defaultOdds: number }[];
  onChange: (field: keyof NewParFormState, value: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  canSubmit: boolean;
}

const NewParForm: React.FC<NewParFormProps> = ({
  isAdding,
  newPar,
  currentMatches,
  mockMarkets,
  onChange,
  onCancel,
  onSubmit,
  canSubmit,
}) => {
  return (
    <section className="rounded-2xl border border-jack-border bg-black/60 p-4">
      <h2 className="text-sm md:text-base font-semibold tracking-tight">
        Novi par
      </h2>
      <p className="text-[11px] text-slate-400 mb-3">
        Odaberi sport, utakmicu i tip oklade. Dok je ovaj obrazac otvoren, ne
        možeš dodavati dodatne parove.
      </p>

      {!isAdding ? (
        <div className="text-[12px] text-slate-500 italic">
          Klikni na &quot;Dodaj novi par&quot; u listiću kako bi otvorio
          obrazac.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 text-xs md:text-sm">
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

          {/* Match */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-400">Utakmica</label>
            <select
              value={newPar.matchId}
              onChange={(e) => onChange("matchId", e.target.value)}
              className="rounded-xl border border-jack-border bg-black/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-red-400"
            >
              <option value="">Odaberi utakmicu</option>
              {currentMatches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Market */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-400">Tip oklade</label>
            <select
              value={newPar.marketCode}
              onChange={(e) => onChange("marketCode", e.target.value)}
              className="rounded-xl border border-jack-border bg-black/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-red-400"
            >
              <option value="">Odaberi tip</option>
              {mockMarkets.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Odds */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-400">Koeficijent</label>
            <input
              type="text"
              value={newPar.odds}
              onChange={(e) => onChange("odds", e.target.value)}
              placeholder="npr. 1.85"
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
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
            >
              Dodaj par na listić
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default NewParForm;
