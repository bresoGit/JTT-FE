// src/components/tips/TipsPanel.tsx
import React from "react";

import TipCard from "./TipCard";
import type { RiskLevel, Tip } from "../../types/tips";
import RiskFilterButton from "./RiskFilterButtons";

interface TipsPanelProps {
  selectedRisk: RiskLevel | "ALL";
  onRiskChange: (r: RiskLevel | "ALL") => void;
  tips: Tip[];
}

const TipsPanel: React.FC<TipsPanelProps> = ({
  selectedRisk,
  onRiskChange,
  tips,
}) => {
  return (
    <section className="rounded-2xl border border-jack-border bg-jack-card/90 p-4 shadow-jack-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Današnji tipovi
          </h2>
          <p className="text-xs text-slate-400">
            Filtriraj po riziku i uzmi Jackove dnevne prijedloge.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <RiskFilterButton
            label="Svi"
            active={selectedRisk === "ALL"}
            onClick={() => onRiskChange("ALL")}
          />
          <RiskFilterButton
            label="Niski"
            color="bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
            active={selectedRisk === "LOW"}
            onClick={() => onRiskChange("LOW")}
          />
          <RiskFilterButton
            label="Srednji"
            color="bg-amber-500/10 text-amber-200 border-amber-500/40"
            active={selectedRisk === "MEDIUM"}
            onClick={() => onRiskChange("MEDIUM")}
          />
          <RiskFilterButton
            label="Visoki"
            color="bg-jack-redMuted text-red-200 border-red-500/60"
            active={selectedRisk === "HIGH"}
            onClick={() => onRiskChange("HIGH")}
          />
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
        {tips.length === 0 && (
          <div className="rounded-xl border border-dashed border-jack-border bg-black/40 px-4 py-6 text-center text-sm text-slate-400">
            Trenutno nema tipova za ovu razinu rizika. Jack oštri oštricu…
          </div>
        )}
      </div>
    </section>
  );
};

export default TipsPanel;
