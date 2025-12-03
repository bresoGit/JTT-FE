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

// background + INSET shadow based on risk
const riskContainer: Record<RiskLevel, string> = {
  LOW: "border-emerald-500/30 bg-gradient-to-br from-black/80 via-emerald-500/5 to-black/95 shadow-[inset_0_0_16px_rgba(16,185,129,0.35)]",
  MEDIUM:
    "border-amber-500/40 bg-gradient-to-br from-black/80 via-amber-500/5 to-black/95 shadow-[inset_0_0_16px_rgba(245,158,11,0.35)]",
  HIGH: "border-red-600/60 bg-gradient-to-br from-black/80 via-jack-redMuted/20 to-black/95 shadow-[inset_0_0_20px_rgba(248,113,113,0.55)]",
};

const TipCard: React.FC<{ tip: Tip }> = ({ tip }) => {
  return (
    <article
      className={`group flex cursor-pointer flex-col gap-2 rounded-2xl border p-3 text-sm transition hover:border-jack-red/90 hover:brightness-110
      max-[500px]:p-2 max-[500px]:gap-5 max-[500px]:text-[13px]
      ${riskContainer[tip.risk]}`}
    >
      {/* Gornji red: liga + meč + badge */}
      <div
        className="flex items-center justify-between gap-2
        max-[500px]:items-start max-[500px]:gap-1.5"
      >
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wide text-slate-500 max-[500px]:text-[10px]">
            {tip.league}
          </span>
          <span className="text-sm font-medium text-slate-100 max-[500px]:text-[13px]">
            {tip.match}
          </span>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide
          max-[500px]:text-[10px] max-[500px]:px-2 max-[500px]:py-0.5
          ${riskColor[tip.risk]}`}
        >
          {riskLabel[tip.risk]}
        </span>
      </div>

      {/* Srednji red: market + koef + početak */}
      <div
        className="flex items-center justify-between gap-2
        max-[500px]:flex-col max-[500px]:items-start max-[500px]:gap-3"
      >
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 max-[500px]:text-[10px]">
            Tip Oklade
          </span>
          <span className="text-sm text-slate-100 max-[500px]:text-[13px]">
            {tip.market}
          </span>
        </div>
        <div
          className="flex items-center gap-4
          max-[500px]:w-full max-[500px]:justify-between max-[500px]:gap-6"
        >
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

      {/* Donji red: confidence bar */}
      <div className="mt-1 flex items-center justify-center gap-3 max-[500px]:justify-start max-[500px]:mt-0.5">
        <div className="flex items-center gap-2 text-[11px] text-slate-300 max-[500px]:text-[10px]">
          <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-slate-800/80 max-[500px]:w-20">
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
