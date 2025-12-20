// src/components/tips/TipsPanel.tsx
import React from "react";

import TipCard from "./TipCard";
import type { RiskLevel, Tip } from "../../types/tips";
import RiskFilterButton from "./RiskFilterButtons";

interface TipsPanelProps {
  selectedRisk: RiskLevel | "ALL";
  onRiskChange: (r: RiskLevel | "ALL") => void;
  selectedDates: string[]; // npr. ["2025-12-03", "2025-12-02"]
}

interface BackendTip {
  id: number;
  sport: string;
  league: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string | null;
  awayLogo?: string | null;
  leagueLogo?: string | null;
  season?: string | null;
  label: string;
  odds: number;
  risk: RiskLevel;
  confidencePct: number | null;
  tipDay: string;
  kickoffAt: string | null;
}

const BACKEND_URL =
  (import.meta as any).env?.VITE_BACKEND_URL ?? "http://localhost:8080";

const TipsPanel: React.FC<TipsPanelProps> = ({
  selectedRisk,
  onRiskChange,
  selectedDates,
}) => {
  const [tips, setTips] = React.useState<Tip[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    const fetchTips = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        // datumi iz sidebara
        if (selectedDates?.length) {
          selectedDates.forEach((d) => params.append("dates", d));
        }

        // risk filter – backend ignorira ako je ALL/null
        if (selectedRisk !== "ALL") {
          params.append("risk", selectedRisk);
        }

        // sport hardkodiran na "nogomet" (kako smo dogovorili)
        params.append("sport", "nogomet");

        const base = BACKEND_URL.replace(/\/+$/, "");
        const url = `${base}/api/tipovi?${params.toString()}`;

        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Greška pri dohvaćanju tipova: ${res.status}`);
        }

        const data: BackendTip[] = await res.json();

        const mapped: Tip[] = data.map((t) => {
          const match = `${t.homeTeam} vs. ${t.awayTeam}`;
          const market = t.label;

          const confidence =
            typeof t.confidencePct === "number" ? t.confidencePct : 0;

          let kickoff = "";
          if (t.kickoffAt) {
            const dt = new Date(t.kickoffAt);
            const hh = dt.getHours().toString().padStart(2, "0");
            const mm = dt.getMinutes().toString().padStart(2, "0");
            kickoff = `${hh}:${mm}`;
          }

          return {
            id: t.id,
            league: t.league,
            match,
            market,
            odds: t.odds,
            risk: t.risk,
            confidence,
            kickoff,
            homeLogo: t.homeLogo ?? null,
            awayLogo: t.awayLogo ?? null,
            leagueLogo: t.leagueLogo ?? null,
            season: t.season ?? null,
          };
        });

        setTips(mapped);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (err instanceof Error) setError(err.message);
        else setError("Došlo je do greške.");
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
    return () => controller.abort();
  }, [
    selectedRisk,
    // stabilize dependency: if parent recreates array each render, join prevents infinite fetch loop
    selectedDates.join(","),
  ]);

  return (
    <section className="rounded-2xl border border-jack-border bg-jack-card/90 p-4 shadow-jack-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Jackpottovi tipovi
          </h2>
          <p className="text-xs text-slate-400">
            Filtriraj po riziku i pogledaj što je Ripper pripremio za danas.
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

      <div className="max-h-[35rem] overflow-y-auto">
        {loading && (
          <div className="rounded-xl border border-jack-border bg-black/40 px-4 py-6 text-center text-sm text-slate-400">
            Ripper traži najbolje tipove…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-700 bg-black/60 px-4 py-6 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && tips.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}

        {!loading && !error && tips.length === 0 && (
          <div className="rounded-xl border border-dashed border-jack-border bg-black/40 px-4 py-6 text-center text-sm text-slate-400">
            Trenutno nema tipova za ove filtere. Ripper još slaže kombinacije…
          </div>
        )}
      </div>
    </section>
  );
};

export default TipsPanel;
