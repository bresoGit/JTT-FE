// src/components/layout/Sidebar.tsx
import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-jack-border bg-jack-card/90 p-4">
        <h3 className="text-sm font-semibold tracking-tight">Danas ukratko</h3>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span>Ukupno tipova</span>
            <span className="font-semibold text-slate-100">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Niski rizik</span>
            <span className="font-semibold text-emerald-300">4</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Srednji rizik</span>
            <span className="font-semibold text-amber-300">4</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Visoki rizik</span>
            <span className="font-semibold text-red-300">4</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-jack-border bg-black/60 p-4 text-xs text-slate-300">
        <h3 className="text-sm font-semibold tracking-tight text-slate-100">
          Jackova napomena
        </h3>
        <p className="mt-2">
          Vikendom očekuj više tipova. Radnim danom manje, ali filtriranije.
          Giljotina najbolje radi kad listić ima{" "}
          <span className="font-semibold text-red-200">3–6 parova</span>.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
