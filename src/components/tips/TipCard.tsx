// src/components/tips/TipCard.tsx
import React from "react";
import type { RiskLevel, Tip } from "../../types/tips";

const riskLabel: Record<RiskLevel, string> = {
  LOW: "Niski rizik",
  MEDIUM: "Srednji rizik",
  HIGH: "Visoki rizik",
};

const riskColor: Record<RiskLevel, string> = {
  LOW: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  MEDIUM: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  HIGH: "bg-jack-redMuted text-red-300 border-red-500/40",
};

const riskContainer: Record<RiskLevel, string> = {
  LOW: "border-emerald-500/30 bg-gradient-to-br from-black/80 via-emerald-500/5 to-black/95 shadow-[inset_0_0_16px_rgba(16,185,129,0.35)]",
  MEDIUM:
    "border-amber-500/40 bg-gradient-to-br from-black/80 via-amber-500/5 to-black/95 shadow-[inset_0_0_16px_rgba(245,158,11,0.35)]",
  HIGH: "border-red-600/60 bg-gradient-to-br from-black/80 via-jack-redMuted/20 to-black/95 shadow-[inset_0_0_20px_rgba(248,113,113,0.55)]",
};

function formatRezultat(raw?: string | null) {
  if (!raw) return "";
  const s = raw.trim();

  // Match "1:2 - 0:1" (allow arbitrary spacing around "-")
  const parts = s.split(/\s*-\s*/);
  if (parts.length === 2) {
    const ft = parts[0].trim();
    const ht = parts[1].trim();
    if (ft && ht) return `${ft} (${ht})`;
  }

  return s;
}

function outcomeMeta(jelProslo: Tip["jelProslo"]) {
  if (jelProslo === "D") {
    return {
      label: "PROŠLO",
      className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    };
  }
  if (jelProslo === "N") {
    return {
      label: "PALO",
      className: "bg-red-500/10 text-red-300 border-red-500/50",
    };
  }
  return {
    label: "U TIJEKU",
    className: "bg-slate-500/10 text-slate-300 border-slate-500/40",
  };
}

const TipCard: React.FC<{ tip: Tip }> = ({ tip }) => {
  const [home, away] = tip.match.split(" vs. ");
  const outcome = outcomeMeta(tip.jelProslo);

  const hasRezultat =
    typeof tip.rezultat === "string" && tip.rezultat.trim() !== "";

  return (
    <article
      className={`group flex flex-col gap-3 rounded-2xl border p-3 text-sm transition hover:border-jack-red/90 hover:brightness-110
      max-[500px]:p-2 max-[500px]:gap-3 max-[500px]:text-[13px]
      ${riskContainer[tip.risk]}`}
    >
      {/* Top: league + season + badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {tip.leagueLogo && (
            <img
              src={tip.leagueLogo}
              alt={tip.league}
              className="h-6 w-6 rounded-full bg-white object-contain p-0.5"
            />
          )}
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wide text-slate-500">
              {tip.league}
              {tip.season ? ` • ${tip.season}` : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide
            max-[500px]:text-[10px] max-[500px]:px-2 max-[500px]:py-0.5
            ${outcome.className}`}
            title="Ishod"
          >
            {outcome.label}
          </span>

          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide
            max-[500px]:text-[10px] max-[500px]:px-2 max-[500px]:py-0.5
            ${riskColor[tip.risk]}`}
            title="Rizik"
          >
            {riskLabel[tip.risk]}
          </span>
        </div>
      </div>

      {/* Middle: teams row with logos */}
      <div className="flex items-center justify-between gap-3 max-[500px]:flex-col max-[500px]:items-start">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            {tip.homeLogo && (
              <img
                src={tip.homeLogo}
                alt={tip.match}
                className="h-6 w-6 rounded-full bg-black/60 object-contain p-0.5"
              />
            )}
            <span className="text-sm font-medium text-slate-100 max-[500px]:text-[13px]">
              {home}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {tip.awayLogo && (
              <img
                src={tip.awayLogo}
                alt={tip.match}
                className="h-6 w-6 rounded-full bg-black/60 object-contain p-0.5"
              />
            )}
            <span className="text-sm font-medium text-slate-100 max-[500px]:text-[13px]">
              {away}
            </span>
          </div>
        </div>

        {/* Odds + kickoff */}
        <div className="flex flex-col items-end gap-2 max-[500px]:items-start">
          <div className="text-right max-[500px]:text-left">
            <span className="block text-[11px] text-slate-400 max-[500px]:text-[10px]">
              Koef.
            </span>
            <span className="text-base font-semibold text-red-300 max-[500px]:text-[14px]">
              {tip.odds.toFixed(2)}
            </span>
          </div>

          <div className="text-right max-[500px]:text-left">
            <span className="block text-[11px] text-slate-400 max-[500px]:text-[10px]">
              Početak
            </span>
            <span className="text-sm text-slate-100 max-[500px]:text-[13px]">
              {tip.kickoff}
            </span>
          </div>
        </div>
      </div>

      {/* Market / tip description */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 max-[500px]:text-[10px]">
          Tip oklade
        </span>
        <span className="text-sm text-slate-100 max-[500px]:text-[13px]">
          {tip.market}
        </span>
      </div>

      {/* ✅ Result line */}
      {hasRezultat && (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2">
          <span className="text-[11px] uppercase tracking-wide text-slate-400">
            Rezultat
          </span>
          <span className="text-sm font-semibold text-slate-100">
            {formatRezultat(tip.rezultat)}
          </span>
        </div>
      )}

      {/* Confidence bar */}
      <div className="mt-1 flex items-center gap-3 max-[500px]:mt-0.5">
        <div className="flex items-center gap-2 text-[11px] text-slate-300 max-[500px]:text-[10px]">
          <div className="flex h-1.5 w-28 overflow-hidden rounded-full bg-slate-800/80 max-[500px]:w-24">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400"
              style={{ width: `${tip.confidence}%` }}
            />
          </div>
          <span>{tip.confidence}% sigurnosti</span>
        </div>
      </div>
    </article>
  );
};

export default TipCard;
