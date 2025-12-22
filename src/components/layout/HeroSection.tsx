// src/components/layout/HeroSection.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import JttLogo from "../../assets/jtt_logo.png";
import { useUser } from "../../context/UserContext";
import { setPreferredHome } from "../../utils/preferredHome";

type Props = {
  mode: "TICKETS" | "LOTTO";
};

const HeroSection: React.FC<Props> = ({ mode }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const isTickets = mode === "TICKETS";

  const handleStartJack = () => {
    if (!user) navigate("/prijava");
    else navigate("/jack");
  };

  const goTickets = () => {
    setPreferredHome("/");
    navigate("/");
  };

  const goLotto = () => {
    setPreferredHome("/loto");
    navigate("/loto");
  };

  return (
    <section
      className={[
        "grid gap-4 rounded-2xl border p-4 md:grid-cols-2 lg:p-6",
        isTickets
          ? "border-jack-border bg-black/40"
          : "border-amber-500/30 bg-gradient-to-br from-black/55 via-zinc-950/40 to-amber-950/25",
      ].join(" ")}
    >
      {/* LEFT SIDE — Logo */}
      <div className="flex items-center justify-center">
        <div
          className={[
            "relative w-full max-w-md rounded-2xl border p-4",
            isTickets
              ? "border-jack-border/60 bg-black/30 shadow-[0_0_50px_rgba(255,0,0,0.12)]"
              : "border-amber-500/25 bg-black/35 shadow-[0_0_55px_rgba(245,158,11,0.12)]",
          ].join(" ")}
        >
          {/* SOFT BACKLIGHT */}
          <div className="pointer-events-none absolute inset-0 opacity-70">
            {isTickets ? (
              <>
                <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
                <div className="absolute bottom-[-3rem] left-[-2rem] h-48 w-48 rounded-full bg-black/80 blur-3xl" />
              </>
            ) : (
              <>
                <div className="absolute -top-10 right-[-1rem] h-44 w-44 rounded-full bg-amber-400/18 blur-3xl" />
                <div className="absolute top-24 left-[-2rem] h-44 w-44 rounded-full bg-yellow-300/10 blur-3xl" />
                <div className="absolute bottom-[-3rem] left-[-2rem] h-56 w-56 rounded-full bg-black/80 blur-3xl" />
              </>
            )}
          </div>

          <div className="relative flex flex-col items-center">
            <img
              src={JttLogo}
              alt="Jackpot The Ripper Logo"
              className={[
                "w-full h-auto object-contain",
                isTickets
                  ? "drop-shadow-[0_0_25px_rgba(255,0,0,0.35)]"
                  : "drop-shadow-[0_0_25px_rgba(245,158,11,0.28)]",
              ].join(" ")}
            />

            {/* BADGE UNDER LOGO */}
            <div className="mt-4 flex flex-col items-center">
              <div
                className={[
                  "flex items-center justify-center gap-2 rounded-full border px-6 py-2",
                  isTickets
                    ? "border-red-500/60 bg-black/70 shadow-[0_0_24px_rgba(248,113,113,0.6)]"
                    : "border-amber-400/60 bg-black/70 shadow-[0_0_24px_rgba(251,191,36,0.45)]",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-sm opacity-80 tracking-widest",
                    isTickets
                      ? "text-red-300 drop-shadow-[0_0_6px_rgba(248,113,113,0.7)]"
                      : "text-amber-200 drop-shadow-[0_0_6px_rgba(251,191,36,0.55)]",
                  ].join(" ")}
                >
                  {isTickets ? "🎰" : "⭐"}
                </span>

                <span
                  className={[
                    "flex-1 text-xs sm:text-sm lg:text-[18px] font-serif font-semibold uppercase tracking-[0.18em] text-center",
                    isTickets ? "text-red-100" : "text-amber-50",
                  ].join(" ")}
                >
                  {isTickets ? "JACKPOT THE RIPPER" : "LOTO MOD"}
                </span>

                <span
                  className={[
                    "text-sm opacity-80 tracking-widest",
                    isTickets
                      ? "text-red-300 drop-shadow-[0_0_6px_rgba(248,113,113,0.7)]"
                      : "text-amber-200 drop-shadow-[0_0_6px_rgba(251,191,36,0.55)]",
                  ].join(" ")}
                >
                  {isTickets ? "🎟️" : "🍀"}
                </span>
              </div>
            </div>

            {/* LOTTO-ONLY MICRO STRIP */}
            {!isTickets && (
              <div className="mt-3 w-full max-w-sm rounded-2xl border border-amber-500/25 bg-black/55 px-4 py-2 text-center text-[11px] text-amber-100/90">
                Hrvatska lutrija vibe • tamno + žuto • fokus na kombinacije
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — Hero content */}
      <div className="flex flex-col justify-center space-y-3 md:pl-4">
        <p
          className={[
            "text-[11px] font-semibold uppercase tracking-[0.25em]",
            isTickets ? "text-red-300" : "text-amber-300",
          ].join(" ")}
        >
          {isTickets ? "Ripperov rez" : "Lutrija / Loto"}
        </p>

        <h2 className="text-2xl font-bold leading-tight md:text-3xl">
          {isTickets ? (
            <>
              Jackpot pod giljotinom.
              <br className="hidden md:block" />
              Brojevi, kombinacije i listići pod nožem.
            </>
          ) : (
            <>
              Loto u zlatu.
              <br className="hidden md:block" />
              Kombinacije s karakterom, bez šuma.
            </>
          )}
        </h2>

        <p className="text-sm text-slate-300">
          {isTickets
            ? "Jackpot The Ripper ti pomaže slagati sportske listiće. AI filtrira parove i koefove, a ti biraš koliko želiš rezati rizik."
            : "Loto sekcija ima svoj ‘HL’ feel: tamna podloga + žuti fokus. Ovdje gradimo kombinacije, filtere i strategije."}
        </p>

        {/* bullets */}
        {isTickets ? (
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Koefovi i rizik: LOW / MEDIUM / HIGH</li>
            <li>• Filtriranje po datumima i analiza parova</li>
            <li>• Builder za listiće kad si prijavljen</li>
          </ul>
        ) : (
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• Fokus: generator kombinacija + pametni filteri</li>
            <li>• “Sreća u zlatu”: čisto, kontrastno, bez distrakcija</li>
            <li>• Kasnije: spremanje šablona i brzi preset-i</li>
          </ul>
        )}

        {/* SECTION SWITCH + CTA */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {/* Section buttons */}
          <button
            type="button"
            onClick={goTickets}
            className={[
              "rounded-2xl border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition",
              isTickets
                ? "border-red-400/90 bg-red-900/40 text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.9)]"
                : "border-jack-border bg-black/40 text-slate-200 hover:border-red-400 hover:text-red-100",
            ].join(" ")}
          >
            Listići
          </button>

          <button
            type="button"
            onClick={goLotto}
            className={[
              "rounded-2xl border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition",
              !isTickets
                ? "border-amber-400/90 bg-amber-900/25 text-amber-100 shadow-[0_0_22px_rgba(251,191,36,0.55)]"
                : "border-jack-border bg-black/40 text-slate-200 hover:border-amber-400 hover:text-amber-100",
            ].join(" ")}
          >
            Loto
          </button>

          {/* CTA differs per section */}
          {isTickets ? (
            <button
              className="rounded-2xl bg-jack-red px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-red-50 shadow-[0_0_30px_rgba(248,113,113,0.9)] hover:bg-red-600"
              onClick={handleStartJack}
            >
              Pokreni Jacka
            </button>
          ) : (
            <button
              type="button"
              className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-black shadow-[0_0_28px_rgba(251,191,36,0.55)] hover:brightness-110"
              onClick={() => console.log("TODO: start lotto")}
            >
              Pokreni Loto
            </button>
          )}

          {!user && (
            <button
              type="button"
              onClick={() => navigate("/registracija")}
              className={[
                "rounded-2xl border bg-black/40 px-4 py-2 text-[11px] font-semibold transition",
                isTickets
                  ? "border-jack-border text-slate-200 hover:border-jack-red/80 hover:text-red-200"
                  : "border-amber-500/30 text-slate-200 hover:border-amber-400 hover:text-amber-100",
              ].join(" ")}
            >
              Registracija
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
