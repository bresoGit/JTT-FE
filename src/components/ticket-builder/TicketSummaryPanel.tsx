// src/components/ticket-builder/TicketSummaryPanel.tsx
import React from "react";
import type { TicketPair } from "../../types/ticket";
import TicketPairCard from "./TicketPairCard";
import TicketScanResultPanel from "./TicketScanResultPanel";

interface TicketSummaryPanelProps {
  pairs: TicketPair[];
  totalOdds: number;
  isAdding: boolean;
  onOpenForm: () => void;
  onClearTicket: () => void;
  onRemovePair: (id: string) => void;

  onSubmitTicket: () => void;
  canSubmitTicket: boolean;
  isSubmittingTicket: boolean;

  scannedPairs?: TicketPair[] | null;
  scannedOriginalTotalOdds?: number | null;
  scannedAdjustedTotalOdds?: number | null;
  onClearScan: () => void;
}

const TicketSummaryPanel: React.FC<TicketSummaryPanelProps> = ({
  pairs,
  totalOdds,
  isAdding,
  onOpenForm,
  onClearTicket,
  onRemovePair,
  onSubmitTicket,
  canSubmitTicket,
  isSubmittingTicket,
  scannedPairs,
  scannedOriginalTotalOdds,
  scannedAdjustedTotalOdds,
  onClearScan,
}) => {
  const hasScan = !!(scannedPairs && scannedPairs.length > 0);
  const disabledSubmit = !canSubmitTicket || isSubmittingTicket || hasScan;

  return (
    <section
      className="
        flex flex-col
        rounded-2xl border border-jack-border
        bg-black/50
        p-4
        shadow-jack-soft
        text-xs md:text-sm
        max-[900px]:text-[11px]
      "
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2 max-[900px]:gap-1.5">
        <div>
          <h2
            className="
              text-sm md:text-base
              max-[900px]:text-[13px]
              font-semibold tracking-tight
            "
          >
            Tvoj listić
          </h2>
          <p
            className="
              text-[11px] md:text-[12px]
              max-[900px]:text-[10px]
              text-slate-400
            "
          >
            Dodaj parove i pošalji listić Jacku na giljotinu.
          </p>
        </div>
        <div
          className="
            rounded-xl border border-jack-border
            bg-black/70
            px-3 py-1.5
            text-[13px] md:text-[15px]
            max-[900px]:text-[11px]
            text-slate-300
            max-[500px]:text-[11px]
          "
        >
          Parovi:{" "}
          <span className="font-semibold text-red-200">{pairs.length}</span>
          <br />
          koef.:{" "}
          <span className="font-semibold text-red-300">
            {pairs.length === 0 ? "-" : totalOdds.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 rounded-xl border border-jack-border/60 bg-black/60 p-3 max-h-[26rem] overflow-y-auto">
        {pairs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-[12px] max-[900px]:text-[10px] text-slate-400">
            Još nema parova na listiću. Dodaj prvi par ispod.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pairs.map((p, idx) => (
              <TicketPairCard
                key={p.id}
                pair={p}
                index={idx}
                onDelete={() => onRemovePair(p.id)}
                disabledActions={isSubmittingTicket || hasScan}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scan result block */}
      {hasScan && (
        <TicketScanResultPanel
          scannedPairs={scannedPairs!}
          originalTotalOdds={scannedOriginalTotalOdds ?? null}
          adjustedTotalOdds={scannedAdjustedTotalOdds ?? null}
          onClearScan={onClearScan}
        />
      )}

      {/* Footer actions */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {pairs.length > 0 && (
            <button
              type="button"
              onClick={onClearTicket}
              disabled={isSubmittingTicket}
              className={`
                rounded-2xl border border-jack-border bg-black/70 px-4 py-2
                text-[10px] md:text-[11px] max-[900px]:text-[10px]
                font-semibold uppercase tracking-wide text-slate-300
                hover:border-red-400 hover:bg-black/90 hover:text-red-200
                ${
                  isSubmittingTicket
                    ? "opacity-50 cursor-not-allowed hover:border-jack-border hover:bg-black/70 hover:text-slate-300"
                    : ""
                }
              `}
            >
              Očisti listić
            </button>
          )}

          {pairs.length > 0 && (
            <button
              type="button"
              onClick={onSubmitTicket}
              disabled={disabledSubmit}
              className={`
                rounded-2xl px-4 py-2
                text-[10px] md:text-[11px] max-[900px]:text-[10px]
                font-semibold uppercase tracking-wide transition
                ${
                  disabledSubmit
                    ? "cursor-not-allowed border border-slate-700 bg-black/60 text-slate-500"
                    : "border border-jack-border bg-gradient-to-r from-red-900/60 via-red-700/70 to-red-900/60 text-red-50 shadow-[0_0_20px_rgba(248,113,113,0.85)] hover:brightness-110"
                }
              `}
            >
              {isSubmittingTicket
                ? "Jack skenira..."
                : hasScan
                ? "Analiza završena"
                : "Skeniraj listić"}
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={isAdding || isSubmittingTicket}
          onClick={onOpenForm}
          className={`
            ml-auto rounded-2xl px-4 py-2
            text-[11px] md:text-[12px] max-[900px]:text-[10px]
            font-semibold uppercase tracking-wide transition
            ${
              isAdding || isSubmittingTicket
                ? "cursor-not-allowed border border-slate-600 bg-black/60 text-slate-500"
                : "border border-jack-border bg-gradient-to-r from-black via-red-900/40 to-black text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.7)] hover:brightness-110"
            }
          `}
        >
          {isAdding
            ? "Obrazac za novi par je otvoren"
            : isSubmittingTicket
            ? "Pričekaj skeniranje..."
            : "Dodaj novi par"}
        </button>
      </div>
    </section>
  );
};

export default TicketSummaryPanel;
