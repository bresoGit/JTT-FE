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

  const { leagueName, leagueLogo, homeLogo, awayLogo, timestamp } = pair;

  // 🧠 normalize en dash → hyphen, then split
  const normalizedLabel = pair.matchLabel
    .replace(/ – /g, " - ")
    .replace(/–/g, "-");

  const [rawHome, rawAway] = normalizedLabel.split(" - ");
  const homeName = (rawHome ?? "").trim() || "Domaćin";
  const awayName = (rawAway ?? "").trim() || "Gost";

  const formatTime = (ts?: number) => {
    if (!ts) return undefined;
    const d = new Date(ts * 1000);
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const timeLabel = formatTime(timestamp);

  return (
    <div
      className="
        flex flex-col gap-2
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

      {/* League + time */}
      {(leagueName || leagueLogo || timeLabel) && (
        <div className="mt-1 flex items-center justify-between gap-2 max-[500px]:mt-0.5">
          <div className="flex items-center gap-2 min-w-0">
            {leagueLogo ? (
              <img
                src={leagueLogo}
                alt={leagueName ?? "Liga"}
                className="
                  h-5 w-5 rounded-full object-contain
                  bg-white border border-jack-border/40
                  max-[500px]:h-4 max-[500px]:w-4
                "
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-black/40 border border-jack-border/40 text-[9px] flex items-center justify-center text-slate-400 max-[500px]:h-4 max-[500px]:w-4">
                L
              </div>
            )}

            <span className="truncate text-[11px] font-medium text-slate-300 max-[500px]:text-[10px]">
              {leagueName ?? "Nepoznata liga"}
            </span>
          </div>

          {timeLabel && (
            <span className="shrink-0 rounded-full border border-jack-border/60 bg-black/70 px-2 py-0.5 text-[10px] text-slate-300 max-[500px]:text-[9px]">
              {timeLabel}
            </span>
          )}
        </div>
      )}

      {/* Teams row */}
      <div className="mt-1 flex items-center justify-between gap-3 max-[500px]:mt-0.5">
        {/* Home */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          {homeLogo ? (
            <img
              src={homeLogo}
              alt={homeName}
              className="
                h-7 w-7 rounded-full object-contain
                bg-white border border-jack-border/40
                max-[500px]:h-6 max-[500px]:w-6
              "
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-black/40 border border-jack-border/40 flex items-center justify-center text-[11px] text-slate-300 max-[500px]:h-6 max-[500px]:w-6">
              H
            </div>
          )}
          <span className="truncate text-xs font-semibold text-slate-100 max-[500px]:text-[11px]">
            {homeName}
          </span>
        </div>

        <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 max-[500px]:text-[9px]">
          VS
        </span>

        {/* Away */}
        <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
          <span className="truncate text-xs font-semibold text-slate-100 text-right max-[500px]:text-[11px]">
            {awayName}
          </span>
          {awayLogo ? (
            <img
              src={awayLogo}
              alt={awayName}
              className="
                h-7 w-7 rounded-full object-contain
                bg-white border border-jack-border/40
                max-[500px]:h-6 max-[500px]:w-6
              "
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-black/40 border border-jack-border/40 flex items-center justify-center text-[11px] text-slate-300 max-[500px]:h-6 max-[500px]:w-6">
              A
            </div>
          )}
        </div>
      </div>

      {/* Market + odds */}
      <div className="mt-2 flex items-center justify-between gap-3 max-[500px]:mt-1">
        <div className="flex-1 min-w-0">
          <p className="truncate text-[11px] text-slate-400 max-[500px]:text-[10px]">
            {pair.marketLabel}
          </p>
        </div>
        <div
          className="
            flex items-center justify-end gap-2
            text-[16px] text-slate-300
            max-[500px]:text-[13px]
          "
        >
          <span className="text-[11px] text-slate-400 max-[500px]:text-[10px]">
            Koef.
          </span>
          <span className="font-semibold text-red-300">
            {pair.odds.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketPairCard;
