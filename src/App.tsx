// src/App.tsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import type { RiskLevel } from "./types/tips";

import Footer from "./components/layout/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TicketBuilderPage from "./pages/TicketBuilderPage";
import NavHeader from "./components/layout/NavHeader";
import UserPage from "./pages/UserPage";
import LeaguePlannerPage from "./pages/LeaguePlannerPage";

import HomePage from "./pages/HomePage";

import { getPreferredHome } from "./utils/preferredHome";
import LotteryDetailsPage from "./pages/LotteryDetailsPage";

const RISK_STORAGE_KEY = "jack_selectedRisk";
const DATES_STORAGE_KEY = "jack_selectedDates";

const App: React.FC = () => {
  const location = useLocation();

  // Theme logic:
  // - If you're on /loto -> lotto theme
  // - Else use cached preference (so /profil inherits lotto if you came from lotto)
  const isLottoUI =
    location.pathname.startsWith("/loto") || getPreferredHome() === "/loto";

  const [selectedRisk, setSelectedRisk] = React.useState<RiskLevel | "ALL">(
    () => {
      if (typeof window === "undefined") return "ALL";
      try {
        const stored = window.localStorage.getItem(RISK_STORAGE_KEY);
        if (!stored) return "ALL";
        const upper = stored.toUpperCase();
        const allowed: Array<RiskLevel | "ALL"> = [
          "ALL",
          "LOW",
          "MEDIUM",
          "HIGH",
        ];
        return allowed.includes(upper as RiskLevel | "ALL")
          ? (upper as RiskLevel | "ALL")
          : "ALL";
      } catch {
        return "ALL";
      }
    }
  );

  const [selectedDates, setSelectedDates] = React.useState<string[]>(() => {
    if (typeof window === "undefined") {
      const today = new Date();
      const iso = today.toISOString().slice(0, 10);
      return [iso];
    }

    try {
      const stored = window.localStorage.getItem(DATES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.every((d) => typeof d === "string")
        ) {
          return parsed;
        }
      }
    } catch {}

    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    return [iso];
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(RISK_STORAGE_KEY, selectedRisk);
    } catch {}
  }, [selectedRisk]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        DATES_STORAGE_KEY,
        JSON.stringify(selectedDates)
      );
    } catch {}
  }, [selectedDates]);

  return (
    <div
      className={[
        "relative min-h-screen text-slate-100 overflow-hidden",
        isLottoUI
          ? "bg-gradient-to-br from-black via-amber-950/40 to-zinc-950"
          : "bg-gradient-to-br from-black via-jack-redMuted to-jack-border",
      ].join(" ")}
    >
      <div className="pointer-events-none fixed inset-0 opacity-70">
        {isLottoUI ? (
          <>
            <div className="absolute -top-32 right-[-3rem] h-80 w-80 rounded-full bg-amber-400/15 blur-3xl" />
            <div className="absolute top-40 left-[-6rem] h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="absolute bottom-[-7rem] left-[-4rem] h-96 w-96 rounded-full bg-black/60 blur-3xl" />
            <div className="absolute bottom-[-5rem] right-[-5rem] h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
            <div className="absolute bottom-[-6rem] left-[-4rem] h-80 w-80 rounded-full bg-black/60 blur-3xl" />
          </>
        )}
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[90%] flex-col px-4 py-4 md:px-6 lg:px-8">
        <NavHeader />

        <main className="mt-4 flex-1 flex flex-col">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  mode="TICKETS"
                  selectedRisk={selectedRisk}
                  onRiskChange={setSelectedRisk}
                  selectedDates={selectedDates}
                  onChangeSelectedDates={setSelectedDates}
                />
              }
            />

            <Route
              path="/loto"
              element={
                <HomePage
                  mode="LOTTO"
                  selectedRisk={selectedRisk}
                  onRiskChange={setSelectedRisk}
                  selectedDates={selectedDates}
                  onChangeSelectedDates={setSelectedDates}
                />
              }
            />

            <Route path="/jack" element={<TicketBuilderPage />} />
            <Route path="/plan-liga" element={<LeaguePlannerPage />} />
            <Route path="/prijava" element={<LoginPage />} />
            <Route path="/registracija" element={<RegisterPage />} />
            <Route path="/profil" element={<UserPage />} />
            <Route path="/loto/:id" element={<LotteryDetailsPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
