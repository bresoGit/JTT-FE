// src/App.tsx
import React from "react";
import TipsPanel from "./components/tips/TipsPanel";
import GuillotinePanel from "./components/guillotine/GuillotinePanel";
import type { RiskLevel, Tip } from "./types/tips";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

const mockTips: Tip[] = [
  {
    id: 1,
    risk: "LOW",
    league: "Premier League",
    match: "Arsenal vs. Brighton",
    market: "Više od 1.5 gola",
    odds: 1.32,
    kickoff: "18:30",
    confidence: 92,
  },
  {
    id: 2,
    risk: "MEDIUM",
    league: "Serie A",
    match: "Milan vs. Lazio",
    market: "Obje ekipe daju gol",
    odds: 1.85,
    kickoff: "20:45",
    confidence: 78,
  },
  {
    id: 3,
    risk: "HIGH",
    league: "La Liga",
    match: "Valencia vs. Sevilla",
    market: "Pobjeda domaćina",
    odds: 2.35,
    kickoff: "21:00",
    confidence: 63,
  },
  {
    id: 4,
    risk: "LOW",
    league: "Bundesliga",
    match: "Bayern vs. Augsburg",
    market: "1 & više od 1.5 gola",
    odds: 1.42,
    kickoff: "15:30",
    confidence: 89,
  },
];

const App: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = React.useState<RiskLevel | "ALL">(
    "ALL"
  );

  const filteredTips =
    selectedRisk === "ALL"
      ? mockTips
      : mockTips.filter((t) => t.risk === selectedRisk);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-jack-redMuted to-jack-border text-slate-100 overflow-hidden">
      {/* Dekorativni glow u pozadini */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-80 w-80 rounded-full bg-black/60 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[90%] flex-col px-4 py-4 md:px-6 lg:px-8">
        <Header />

        <main className="mt-4 flex flex-1 flex-col gap-4 md:flex-row">
          {/* Lijevo: tipovi + giljotina */}
          <section className="flex-1 space-y-4">
            <TipsPanel
              selectedRisk={selectedRisk}
              onRiskChange={setSelectedRisk}
              tips={filteredTips}
            />
            <GuillotinePanel />
          </section>

          {/* Desno: sidebar */}
          <aside className="mt-4 w-full md:mt-0 md:w-80">
            <Sidebar />
          </aside>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
