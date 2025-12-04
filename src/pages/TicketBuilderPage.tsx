// src/pages/TicketBuilderPage.tsx
import React from "react";
import type { SportType, TicketPair } from "../types/ticket";
import { useTicket } from "../context/TicketContext";
import TicketSummaryPanel from "../components/ticket-builder/TicketSummaryPanel";
import type { NewParFormState } from "../components/ticket-builder/NewParForm";
import NewParForm from "../components/ticket-builder/NewParForm";

// Mock podaci (za sada)
const mockMatches: Record<SportType, { id: string; label: string }[]> = {
  FOOTBALL: [
    { id: "f1", label: "Arsenal – Brighton" },
    { id: "f2", label: "Dinamo – Hajduk" },
    { id: "f3", label: "Milan – Inter" },
  ],
  BASKETBALL: [
    { id: "b1", label: "Lakers – Warriors" },
    { id: "b2", label: "Zadar – Cibona" },
    { id: "b3", label: "Real Madrid – Barcelona" },
  ],
};

const mockMarkets: { code: string; label: string; defaultOdds: number }[] = [
  { code: "HOME_WIN", label: "Pobjeda domaćina", defaultOdds: 1.8 },
  { code: "AWAY_WIN", label: "Pobjeda gosta", defaultOdds: 2.1 },
  { code: "BTTS", label: "Obje ekipe daju gol", defaultOdds: 1.95 },
  { code: "OVER_2_5", label: "Više od 2.5 gola", defaultOdds: 1.85 },
  { code: "UNDER_2_5", label: "Manje od 2.5 gola", defaultOdds: 1.9 },
];

const defaultNewPar: NewParFormState = {
  sport: "FOOTBALL",
  matchId: "",
  marketCode: "",
  odds: "",
};

const TicketBuilderPage: React.FC = () => {
  const { pairs, addPair, clearTicket, removePair } = useTicket();

  const [isAdding, setIsAdding] = React.useState(false);
  const [newPar, setNewPar] = React.useState<NewParFormState>(defaultNewPar);

  const currentMatches = mockMatches[newPar.sport];
  const totalOdds = pairs.reduce((acc, p) => acc * p.odds, 1);

  const handleOpenForm = () => {
    setNewPar(defaultNewPar);
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setNewPar(defaultNewPar);
  };

  const handleChange = (field: keyof NewParFormState, value: string) => {
    // osnovni update
    setNewPar((prev) => ({
      ...prev,
      [field]: value,
    }));

    // ako mijenjamo market → auto postavi koeficijent
    if (field === "marketCode") {
      const m = mockMarkets.find((x) => x.code === value);
      if (m) {
        setNewPar((prev) => ({
          ...prev,
          marketCode: value,
          odds: m.defaultOdds.toString(),
        }));
      }
    }

    // promjena sporta → resetiraj matchId
    if (field === "sport") {
      setNewPar((prev) => ({
        ...prev,
        sport: value as SportType,
        matchId: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPar.matchId || !newPar.marketCode || !newPar.odds) {
      return;
    }

    const match = mockMatches[newPar.sport].find(
      (m) => m.id === newPar.matchId
    );
    const market = mockMarkets.find((m) => m.code === newPar.marketCode);

    if (!match || !market) return;

    const oddsNumber = Number(newPar.odds.replace(",", "."));
    if (Number.isNaN(oddsNumber)) return;

    const newItem: TicketPair = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sport: newPar.sport,
      matchId: match.id,
      matchLabel: match.label,
      marketCode: market.code,
      marketLabel: market.label,
      odds: oddsNumber,
    };

    addPair(newItem); // spremamo u context + localStorage
    setIsAdding(false);
    setNewPar(defaultNewPar);
  };

  const canSubmit = !!newPar.matchId && !!newPar.marketCode && !!newPar.odds;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          Jackov graditelj listića
        </h1>
        <p className="text-xs text-slate-400 md:text-sm">
          Dodaj parove jedan po jedan. Dok je obrazac za novi par otvoren,
          dodavanje novih parova je zaključano.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        {/* Lijevo: pregled listića + kontrola */}
        <TicketSummaryPanel
          pairs={pairs}
          totalOdds={totalOdds}
          isAdding={isAdding}
          onOpenForm={handleOpenForm}
          onClearTicket={clearTicket}
          onRemovePair={removePair}
        />

        {/* Desno: forma za novi par */}
        <NewParForm
          isAdding={isAdding}
          newPar={newPar}
          currentMatches={currentMatches}
          mockMarkets={mockMarkets}
          onChange={handleChange}
          onCancel={handleCancelForm}
          onSubmit={handleSubmit}
          canSubmit={canSubmit}
        />
      </div>
    </div>
  );
};

export default TicketBuilderPage;
