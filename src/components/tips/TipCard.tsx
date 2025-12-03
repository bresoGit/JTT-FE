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

const TipCard: React.FC<{ tip: Tip }> = ({ tip }) => {
  return (
    <article className="group flex cursor-pointer flex-col gap-2 rounded-2xl border border-jack-border bg-black/40 p-3 text-sm hover:border-jack-red/80 hover:bg-black/70">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wide text-slate-500">
            {tip.league}
          </span>
          <span className="text-sm font-medium text-slate-100">
            {tip.match}
          </span>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
            riskColor[tip.risk]
          }`}
        >
          {riskLabel[tip.risk]}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500">Market</span>
          <span className="text-sm text-slate-100">{tip.market}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-[11px] text-slate-500">Koef.</span>
            <span className="text-base font-semibold text-red-300">
              {tip.odds.toFixed(2)}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-slate-500">Početak</span>
            <span className="text-sm text-slate-100">{tip.kickoff}</span>
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400"
              style={{ width: `${tip.confidence}%` }}
            />
          </div>
          <span>{tip.confidence}% sigurnosti</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <button className="rounded-full bg-black/60 px-2 py-1 hover:bg-black/80">
            👍 Sviđa mi se
          </button>
          <button className="rounded-full bg-black/60 px-2 py-1 hover:bg-black/80">
            💬 Komentiraj
          </button>
        </div>
      </div>
    </article>
  );
};

export default TipCard;
