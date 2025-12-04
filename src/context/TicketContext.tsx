// src/context/TicketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { TicketPair } from "../types/ticket";

interface TicketContextValue {
  pairs: TicketPair[];
  addPair: (pair: TicketPair) => void;
  removePair: (id: string) => void;
  clearTicket: () => void;
}

const TicketContext = createContext<TicketContextValue | undefined>(undefined);

const STORAGE_KEY = "jtt_ticket_pairs";

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pairs, setPairs] = useState<TicketPair[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as TicketPair[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
    } catch {
      // ignore
    }
  }, [pairs]);

  const addPair = (pair: TicketPair) => {
    setPairs((prev) => [...prev, pair]);
  };

  const removePair = (id: string) => {
    setPairs((prev) => prev.filter((p) => p.id !== id));
  };

  const clearTicket = () => {
    setPairs([]);
  };

  return (
    <TicketContext.Provider value={{ pairs, addPair, removePair, clearTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = (): TicketContextValue => {
  const ctx = useContext(TicketContext);
  if (!ctx) {
    throw new Error("useTicket must be used within a TicketProvider");
  }
  return ctx;
};
