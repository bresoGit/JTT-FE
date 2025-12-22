// src/pages/LotteryDetailsPage.tsx
import React from "react";
import { useParams } from "react-router-dom";

const LotteryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-1 items-center justify-center py-6">
      <div className="w-full max-w-2xl rounded-2xl border border-jack-border bg-black/60 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-300">
          Loto detalji (u izradi)
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-100">
          Lottery ID: <span className="text-slate-200">{id}</span>
        </h2>

        <p className="mt-3 text-sm text-slate-300">
          Ovdje će ići detalji igre (pravila, izvlačenja, zadnji brojevi,
          statistika, generator kombinacija, itd.).
        </p>

        <div className="mt-4 rounded-2xl border border-jack-border bg-black/50 p-4 text-xs text-slate-300">
          Raw placeholder ✅
        </div>
      </div>
    </div>
  );
};

export default LotteryDetailsPage;
