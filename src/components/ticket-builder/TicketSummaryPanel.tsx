// src/components/ticket-builder/TicketSummaryPanel.tsx
import React from "react";
import type { TicketPair } from "../../types/ticket";
import TicketPairCard from "./TicketPairCard";

interface TicketSummaryPanelProps {
  pairs: TicketPair[];
  totalOdds: number;
  isAdding: boolean;
  onOpenForm: () => void;
  onClearTicket: () => void;
  onRemovePair: (id: string) => void; // 👈 NOVO
}

const TicketSummaryPanel: React.FC<TicketSummaryPanelProps> = ({
  pairs,
  totalOdds,
  isAdding,
  onOpenForm,
  onClearTicket,
  onRemovePair,
}) => {
  return (
    <section className="flex flex-col rounded-2xl border border-jack-border bg-black/50 p-4 shadow-jack-soft">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight md:text-base">
            Tvoj listić
          </h2>
          <p className="text-[11px] text-slate-400">
            Dodaj parove i kasnije ih pošalji kroz giljotinu.
          </p>
        </div>
        <div className="rounded-xl border border-jack-border bg-black/70 px-3 py-1.5 text-[15px] text-slate-300 max-[500px]:text-[12px]">
          Parovi:{" "}
          <span className="font-semibold text-red-200">{pairs.length}</span>
          <br />
          koef.:{" "}
          <span className="font-semibold text-red-300">
            {pairs.length === 0 ? "-" : totalOdds.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-jack-border/60 bg-black/60 p-3 max-h-[26rem] overflow-y-auto">
        {pairs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-[12px] text-slate-400">
            Još nema parova na listiću. Dodaj prvi par ispod.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-[900px]:grid-cols-1">
            {pairs.map((p, idx) => (
              <TicketPairCard
                key={p.id}
                pair={p}
                index={idx}
                onDelete={() => onRemovePair(p.id)} // 👈 ovdje šaljemo callback
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-between gap-2">
        {pairs.length > 0 && (
          <button
            type="button"
            onClick={onClearTicket}
            className="rounded-2xl border border-jack-border bg-black/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-300 hover:border-red-400 hover:bg-black/90 hover:text-red-200"
          >
            Očisti listić
          </button>
        )}

        <button
          type="button"
          disabled={isAdding}
          onClick={onOpenForm}
          className={`ml-auto rounded-2xl px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition
            ${
              isAdding
                ? "cursor-not-allowed border border-slate-600 bg-black/60 text-slate-500"
                : "border border-jack-border bg-gradient-to-r from-black via-red-900/40 to-black text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.7)] hover:brightness-110"
            }`}
        >
          {isAdding ? "Obrazac za novi par je otvoren" : "Dodaj novi par"}
        </button>
      </div>
    </section>
  );
};

export default TicketSummaryPanel;
