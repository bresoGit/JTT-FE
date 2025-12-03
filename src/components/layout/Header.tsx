// src/components/layout/Header.tsx
import React from "react";
import JttLogo from "../../assets/jtt_logo.png";
import NavHeader from "./NavHeader";

const Header: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Top nav/header */}
      <NavHeader />

      {/* Hero section */}
      <section className="grid gap-4 rounded-2xl border border-jack-border bg-black/40 p-4 md:grid-cols-2 lg:p-6">
        {/* LEFT SIDE — Logo */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-md rounded-2xl border border-jack-border/60 bg-black/30 p-4 shadow-[0_0_50px_rgba(255,0,0,0.12)]">
            {/* SOFT RED BACKLIGHT */}
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
              <div className="absolute bottom-[-3rem] left-[-2rem] h-48 w-48 rounded-full bg-black/80 blur-3xl" />
            </div>

            <div className="relative flex flex-col items-center">
              <img
                src={JttLogo}
                alt="Jack The Tipster Logo"
                className="w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(255,0,0,0.35)]"
              />

              {/* BADGE UNDER LOGO */}
              <div className="mt-4 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/60 bg-black/70 px-6 py-2 shadow-[0_0_24px_rgba(248,113,113,0.6)]">
                  <span className="text-red-300 text-sm opacity-80 tracking-widest drop-shadow-[0_0_6px_rgba(248,113,113,0.7)]">
                    🎫
                  </span>
                  <span className="text-[20px] font-serif font-semibold uppercase tracking-[0.10em] text-red-100">
                    JACK THE TIPSTER
                  </span>
                  <span className="text-red-300 text-sm opacity-80 tracking-widest drop-shadow-[0_0_6px_rgba(248,113,113,0.7)]">
                    🎫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Hero content */}
        <div className="flex flex-col justify-center space-y-3 md:pl-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-300">
            Jackov rez
          </p>

          <h2 className="text-2xl font-bold leading-tight md:text-3xl">
            Tipovi, ne listići.
            <br className="hidden md:block" />
            Ti biraš – Jack oštri.
          </h2>

          <p className="text-sm text-slate-300">
            Jack The Tipster ti svaki dan servira AI filtrirane parove
            podijeljene po riziku. Ti slažeš listić kod svoje kladionice, a Jack
            ti pomaže da makneš šum i ostaviš samo ono što ima smisla.
          </p>

          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Jasno podijeljeni tipovi: niski, srednji i visoki rizik</li>
            <li>
              • Giljotina mod: tvoj listić → dvije AI optimizirane verzije
            </li>
            <li>• Free verzija s oglasima ili Premium bez distrakcija</li>
          </ul>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button className="rounded-2xl bg-jack-red px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-red-50 shadow-[0_0_30px_rgba(248,113,113,0.9)] hover:bg-red-600">
              Pokreni Jacka sada
            </button>
            <button className="rounded-2xl border border-jack-border bg-black/40 px-4 py-2 text-[11px] font-semibold text-slate-200 hover:border-jack-red/80 hover:text-red-200">
              Pogledaj današnje tipove
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Header;
