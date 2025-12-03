// src/components/guillotine/GuillotinePanel.tsx
import React from "react";

const GuillotinePanel: React.FC = () => {
  return (
    <section className="mt-4 rounded-2xl border border-jack-red/60 bg-gradient-to-r from-jack-redMuted/40 via-black to-jack-redMuted/30 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-red-100">
            Giljotina mod
          </h2>
          <p className="text-xs text-red-100/80">
            Ubaci svoj listić i pusti Jacka da ga razreže na dvije optimizirane
            verzije uz AI parove.
          </p>
          <p className="mt-2 text-[11px] text-red-200/70">
            Free korisnici: <span className="font-semibold">1 rez/dan</span> •
            Premium: <span className="font-semibold">10 rezova/dan</span>
          </p>
        </div>
        <div className="mt-2 flex flex-col items-stretch gap-2 md:mt-0 md:items-end">
          <button className="rounded-2xl bg-jack-red px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-50 shadow-[0_0_25px_rgba(248,113,113,0.65)] hover:bg-red-600">
            Otvori giljotinu
          </button>
          <span className="text-[11px] text-red-200/70">
            Danas: <span className="font-semibold">0 / 1</span> free rez
            iskorišten
          </span>
        </div>
      </div>
    </section>
  );
};

export default GuillotinePanel;
