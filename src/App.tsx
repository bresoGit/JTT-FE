// src/App.tsx
import React from "react";
import TipsPanel from "./components/tips/TipsPanel";
import GuillotinePanel from "./components/guillotine/GuillotinePanel";
import type { RiskLevel } from "./types/tips";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

const App: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = React.useState<RiskLevel | "ALL">(
    "ALL"
  );

  const [selectedDates, setSelectedDates] = React.useState<string[]>(() => {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10); // YYYY-MM-DD
    return [iso]; // default -> danas odabrano
  });

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
              selectedDates={selectedDates}
            />
            <GuillotinePanel />
          </section>

          {/* Desno: sidebar */}
          <aside className="mt-4 w-full md:mt-0 md:w-80">
            <Sidebar
              selectedDates={selectedDates}
              onChangeSelectedDates={setSelectedDates}
            />
          </aside>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
