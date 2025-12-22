// src/pages/HomePage.tsx
import React from "react";
import Sidebar from "../components/layout/Sidebar";
import HeroSection from "../components/layout/HeroSection";
import TipsPanel from "../components/tips/TipsPanel";
import type { RiskLevel } from "../types/tips";

type Props = {
  mode: "TICKETS" | "LOTTO";
  selectedRisk: RiskLevel | "ALL";
  onRiskChange: React.Dispatch<React.SetStateAction<RiskLevel | "ALL">>;
  selectedDates: string[];
  onChangeSelectedDates: React.Dispatch<React.SetStateAction<string[]>>;
};

const HomePage: React.FC<Props> = ({
  mode,
  selectedRisk,
  onRiskChange,
  selectedDates,
  onChangeSelectedDates,
}) => {
  return (
    <div className="flex flex-1 flex-col gap-4 md:flex-row">
      <section className="flex-1 space-y-4">
        <HeroSection mode={mode} />

        {mode === "TICKETS" ? (
          <TipsPanel
            selectedRisk={selectedRisk}
            onRiskChange={onRiskChange}
            selectedDates={selectedDates}
          />
        ) : (
          <div className="rounded-2xl border border-jack-border bg-black/40 p-4 lg:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-300">
              Loto (u izradi)
            </p>

            <h3 className="mt-2 text-xl font-bold md:text-2xl">
              Ovdje ide Lottery feature.
            </h3>

            <p className="mt-2 text-sm text-slate-300">
              Placeholder sadržaj: kasnije ubacujemo generiranje kombinacija,
              filtere, statistiku izvlačenja, strategije itd.
            </p>

            <div className="mt-4 rounded-2xl border border-jack-border bg-black/50 p-4 text-xs text-slate-300">
              Raw text placeholder ✅
            </div>
          </div>
        )}
      </section>

      {mode === "TICKETS" ? (
        <aside className="mt-4 w-full md:mt-0 md:w-80">
          <Sidebar
            selectedDates={selectedDates}
            onChangeSelectedDates={onChangeSelectedDates}
          />
        </aside>
      ) : null}
    </div>
  );
};

export default HomePage;
