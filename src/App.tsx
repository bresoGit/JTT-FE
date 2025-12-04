// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import TipsPanel from "./components/tips/TipsPanel";
import GuillotinePanel from "./components/guillotine/GuillotinePanel";
import type { RiskLevel } from "./types/tips";

import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TicketBuilderPage from "./pages/TicketBuilderPage";
import NavHeader from "./components/layout/NavHeader";
import HeroSection from "./components/layout/HeroSection";

const App: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = React.useState<RiskLevel | "ALL">(
    "ALL"
  );

  const [selectedDates, setSelectedDates] = React.useState<string[]>(() => {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    return [iso];
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-jack-redMuted to-jack-border text-slate-100 overflow-hidden">
      {/* Dekorativni glow u pozadini */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-80 w-80 rounded-full bg-black/60 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[90%] flex-col px-4 py-4 md:px-6 lg:px-8">
        <NavHeader />

        <main className="mt-4 flex-1 flex flex-col">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex flex-1 flex-col gap-4 md:flex-row">
                  {/* Lijevo: tipovi + giljotina */}
                  <section className="flex-1 space-y-4">
                    <HeroSection />
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
                </div>
              }
            />
            <Route path="/jack" element={<TicketBuilderPage />} />{" "}
            {/* 👈 NEW */}
            <Route path="/prijava" element={<LoginPage />} />
            <Route path="/registracija" element={<RegisterPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
