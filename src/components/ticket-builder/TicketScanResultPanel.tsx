// src/components/ticket-builder/TicketScanResultPanel.tsx
import React from "react";
import type { TicketPair } from "../../types/ticket";

interface TicketScanResultPanelProps {
  scannedPairs: TicketPair[];
  originalTotalOdds: number | null;
  adjustedTotalOdds: number | null;
  onClearScan: () => void;
}

const TicketScanResultPanel: React.FC<TicketScanResultPanelProps> = ({
  scannedPairs,
  originalTotalOdds,
  adjustedTotalOdds,
  onClearScan,
}) => {
  if (!scannedPairs || scannedPairs.length === 0) return null;

  return (
    <section
      className="
        mt-4 rounded-2xl border border-jack-border/70
        bg-black/20
        px-3 py-3
        text-xs
        md:text-sm
        max-[900px]:text-[11px]
      "
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-3 max-[900px]:gap-2">
        <div className="flex-1 min-w-0">
          <h3
            className="
              text-xs md:text-sm max-[900px]:text-[11px]
              font-semibold uppercase tracking-wide text-red-200
            "
          >
            Jackova giljotina – prijedlog
          </h3>
          <p
            className="
              mt-0.5
            text-[11px] md:text-[12px]
            max-[900px]:text-[10px]
            text-slate-300
          "
          >
            Usporedba originalnih tipova i prijedloga nakon skeniranja (H2H,
            izostanci, koeficijenti).
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div
            className="
              text-right
              text-[11px] md:text-[12px]
              max-[900px]:text-[10px]
              text-slate-200
            "
          >
            <div>
              Original:{" "}
              <span className="font-semibold text-red-300">
                {originalTotalOdds != null ? originalTotalOdds.toFixed(2) : "-"}
              </span>
            </div>
            <div>
              Prijedlog:{" "}
              <span className="font-semibold text-emerald-300">
                {adjustedTotalOdds != null ? adjustedTotalOdds.toFixed(2) : "-"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClearScan}
            className="
              mt-1 rounded-full border border-jack-border/60
              bg-black/60 px-2 py-0.5
              text-[10px] max-[900px]:text-[9px]
              font-semibold uppercase tracking-wide
              text-slate-300 hover:border-red-400 hover:text-red-200 hover:bg-black/80
              transition
            "
            aria-label="Zatvori analizu"
          >
            Zatvori
          </button>
        </div>
      </div>

      {/* Body – pairs list */}
      <div className="flex flex-col gap-2">
        {scannedPairs.map((p, idx) => {
          const changedLabel =
            p.newMarketLabel &&
            p.newMarketLabel.trim() !== "" &&
            p.newMarketLabel !== p.marketLabel;

          const changedOdds =
            p.newOdds != null &&
            Number.isFinite(p.newOdds) &&
            p.newOdds !== p.odds;

          const finalLabel = p.newMarketLabel ?? p.marketLabel;
          const finalOdds = p.newOdds ?? p.odds;

          return (
            <div
              key={p.id}
              className="
                rounded-xl border border-jack-border/60
                px-3 py-2.5
                text-[11px]
                md:text-[12px]
                max-[900px]:text-[10px]
                text-slate-100
                bg-black/60
              "
            >
              {/* Match row */}
              <div className="flex justify-between gap-2 max-[900px]:gap-1.5">
                <div className="truncate font-semibold">
                  #{idx + 1} {p.matchLabel}
                </div>
                <div className="shrink-0 text-[10px] max-[900px]:text-[9px] text-slate-400">
                  {p.sport === "FOOTBALL" ? "Nogomet" : "Košarka"}
                </div>
              </div>

              <div className="mt-1.5 flex flex-col gap-1.5">
                {/* Tip */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] max-[900px]:text-[9px] uppercase tracking-wide text-slate-500">
                    Tip:
                  </span>
                  {!changedLabel ? (
                    <span className="text-slate-100">{p.marketLabel}</span>
                  ) : (
                    <>
                      <span className="line-through text-slate-500">
                        {p.marketLabel}
                      </span>
                      <span className="mx-1 text-[10px] max-[900px]:text-[9px] text-slate-500">
                        →
                      </span>
                      <span className="font-semibold text-amber-300">
                        {finalLabel}
                      </span>
                    </>
                  )}
                </div>

                {/* Koeficijent */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] max-[900px]:text-[9px] uppercase tracking-wide text-slate-500">
                    Koef.:
                  </span>
                  {!changedOdds ? (
                    <span className="text-slate-100">{p.odds.toFixed(2)}</span>
                  ) : (
                    <>
                      <span className="line-through text-slate-500">
                        {p.odds.toFixed(2)}
                      </span>
                      <span className="mx-1 text-[10px] max-[900px]:text-[9px] text-slate-500">
                        →
                      </span>
                      <span className="font-semibold text-emerald-300">
                        {finalOdds.toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Explanation */}
                {p.explanationOfChange && (
                  <p className="mt-1 text-[13px] max-[900px]:text-[11px] leading-snug text-slate-300">
                    {p.explanationOfChange}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TicketScanResultPanel;
