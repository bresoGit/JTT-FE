// src/components/ticket-builder/TicketPairCard.tsx
import React from "react";
import type { TicketPair } from "../../types/ticket";

interface TicketPairCardProps {
  pair: TicketPair;
  index: number;
  onDelete?: () => void;
}

const TicketPairCard: React.FC<TicketPairCardProps> = ({
  pair,
  index,
  onDelete,
}) => {
  const sportIcon = pair.sport === "FOOTBALL" ? "⚽" : "🏀";
  const sportLabel = pair.sport === "FOOTBALL" ? "Nogomet" : "Košarka";

  return (
    <div
      className="
        flex flex-col gap-1
        rounded-2xl border border-jack-border
        bg-gradient-to-br from-black/80 via-jack-card/40 to-black/90
        p-3
        text-xs md:text-sm
        max-[500px]:p-2 max-[500px]:text-[11px]
      "
    >
      {/* Top row: index + sport + delete */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="
              rounded-full border border-jack-border bg-black/70
              px-2 py-0.5
              text-[11px] text-slate-300
              max-[500px]:text-[10px] max-[500px]:px-1.5
            "
          >
            #{index + 1}
          </span>
          <span
            className="
              flex items-center justify-center
              text-[24px]
              max-[500px]:text-[16px]
            "
            aria-label={sportLabel}
            title={sportLabel}
          >
            {sportIcon}
          </span>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="
              rounded-full border border-red-500/50 bg-black/70
              px-2 py-1
              text-[10px] text-red-300
              hover:border-red-400 hover:bg-red-900/30 hover:text-red-200
              transition
              max-[500px]:px-1.5
            "
            aria-label="Ukloni par"
            title="Ukloni par"
          >
            ✕
          </button>
        )}
      </div>

      {/* Match + market */}
      <div className="mt-1 flex flex-col gap-1 max-[500px]:mt-0.5">
        <span className="font-medium text-slate-100 max-[500px]:text-[11px]">
          {pair.matchLabel}
        </span>
        <span className="text-[11px] text-slate-400 max-[500px]:text-[10px]">
          {pair.marketLabel}
        </span>
      </div>

      {/* Odds row */}
      <div
        className="
          mt-1 flex items-center justify-center gap-4
          text-[16px] text-slate-300
          max-[500px]:mt-1 max-[500px]:text-[13px] max-[500px]:gap-2
        "
      >
        <span className="max-[500px]:text-[11px]">Koef.</span>
        <span className="font-semibold text-red-300">
          {pair.odds.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default TicketPairCard;
