// src/pages/HomePage.tsx
import React from "react";
import Sidebar from "../components/layout/Sidebar";
import HeroSection from "../components/layout/HeroSection";
import TipsPanel from "../components/tips/TipsPanel";
import type { RiskLevel } from "../types/tips";
import LotteryItem from "../components/loto/LotteryItem";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  "http://localhost:8080";

type Props = {
  mode: "TICKETS" | "LOTTO";
  selectedRisk: RiskLevel | "ALL";
  onRiskChange: React.Dispatch<React.SetStateAction<RiskLevel | "ALL">>;
  selectedDates: string[];
  onChangeSelectedDates: React.Dispatch<React.SetStateAction<string[]>>;
};

type LotteryEntity = {
  id: number;
  provider: string;
  gameCode: string;

  name: string | null;
  country: string | null;
  state: string | null;

  mainMin: number | null;
  mainMax: number | null;
  mainDrawn: number | null;

  bonusMin: number | null;
  bonusMax: number | null;
  bonusDrawn: number | null;

  sameBalls: string | null;
  digits: number | null;
  drawn: number | null;

  isOption: string | null;
  optionDesc: string | null;

  lastFetchAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const HomePage: React.FC<Props> = ({
  mode,
  selectedRisk,
  onRiskChange,
  selectedDates,
  onChangeSelectedDates,
}) => {
  const [lotteries, setLotteries] = React.useState<LotteryEntity[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load lotteries when we are in LOTTO mode
  React.useEffect(() => {
    if (mode !== "LOTTO") return;

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = BACKEND_URL.replace(/\/+$/, "");
        const url = `${base}/api/loto/lotteries`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Greška pri dohvaćanju lota: ${res.status}`);
        }

        const data: LotteryEntity[] = await res.json();
        setLotteries(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message ?? "Došlo je do greške pri dohvaćanju lota.");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [mode]);

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
              Dostupne igre (iz baze)
            </h3>

            <p className="mt-2 text-sm text-slate-300">
              Ovo su igre koje smo već povukli i spremili u bazu.
            </p>

            <div className="mt-4 rounded-2xl border border-jack-border bg-black/50 p-4">
              {loading ? (
                <div className="text-sm text-slate-300">Učitavam...</div>
              ) : error ? (
                <div className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
                  {error}
                </div>
              ) : lotteries.length === 0 ? (
                <div className="text-sm text-slate-300">
                  Nema spremljenih igara u bazi.
                </div>
              ) : (
                <div className="space-y-2">
                  {lotteries.map((l) => (
                    <LotteryItem key={l.id} lottery={l} />
                  ))}
                </div>
              )}
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
