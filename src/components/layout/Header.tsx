// src/components/layout/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-jack-border bg-gradient-to-r from-jack-card via-jack-redMuted/20 to-jack-card px-4 py-3 shadow-jack-soft">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-jack-red to-jack-redMuted text-xl font-black tracking-tight">
          J
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight md:text-xl">
            JACK THE TIPSTER
          </h1>
          <p className="text-xs text-slate-400 md:text-sm">
            Dnevni AI tipovi. Ti slažeš listić. Jack brusi rub.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-2xl border border-jack-red/50 bg-jack-red/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-red-200 hover:bg-jack-red/20">
          Postani Premium
        </button>
        <div className="hidden items-center gap-2 rounded-2xl border border-jack-border bg-jack-card px-3 py-1.5 text-xs md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-slate-300">Giljotina spremna</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
