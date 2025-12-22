// src/components/layout/HeroSection.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import JttLogo from "../../assets/jtt_logo.png";
import { useUser } from "../../context/UserContext";

type Props = {
  mode: "TICKETS" | "LOTTO";
};

const HeroSection: React.FC<Props> = ({ mode }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const isTickets = mode === "TICKETS";

  const handleStartJack = () => {
    if (!user) {
      navigate("/prijava");
    } else {
      navigate("/jack");
    }
  };

  return (
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
              alt="Jackpot The Ripper Logo"
              className="w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(255,0,0,0.35)]"
            />

            {/* BADGE UNDER LOGO */}
            <div className="mt-4 flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 rounded-full border border-red-500/60 bg-black/70 px-6 py-2 shadow-[0_0_24px_rgba(248,113,113,0.6)]">
                <span className="text-red-300 text-sm opacity-80 tracking-widest drop-shadow-[0_0_6px_rgba(248,113,113,0.7)]">
                  🎰
                </span>

                <span
                  className="
                    flex-1 
                    text-xs 
                    sm:text-sm 
                    lg:text-[18px] 
                    font-serif font-semibold 
                    uppercase tracking-[0.18em] 
                    text-red-100 
                    text-center
                  "
                >
                  JACKPOT THE RIPPER
                </span>

                <span className="text-red-300 text-sm opacity-80 tracking-widest drop-shadow-[0_0_6px_rgba(248,113,113,0.7)]">
                  🎟️
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — Hero content */}
      <div className="flex flex-col justify-center space-y-3 md:pl-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-300">
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
              Loto pod giljotinom.
              <br className="hidden md:block" />
              Kombinacije i brojevi pod nožem.
            </>
          )}
        </h2>

        <p className="text-sm text-slate-300">
          {isTickets
            ? "Jackpot The Ripper ti pomaže slagati sportske listiće. AI filtrira parove i koefove, a ti biraš koliko želiš rezati rizik."
            : "Ovdje ide Lottery feature. Za sada je samo placeholder sadržaj."}
        </p>

        {/* SECTION SWITCH + CTA */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {/* Section buttons */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className={`rounded-2xl border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition ${
              isTickets
                ? "border-red-400/90 bg-red-900/40 text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.9)]"
                : "border-jack-border bg-black/40 text-slate-200 hover:border-red-400 hover:text-red-100"
            }`}
          >
            Listići
          </button>

          <button
            type="button"
            onClick={() => navigate("/loto")}
            className={`rounded-2xl border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition ${
              !isTickets
                ? "border-red-400/90 bg-red-900/40 text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.9)]"
                : "border-jack-border bg-black/40 text-slate-200 hover:border-red-400 hover:text-red-100"
            }`}
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
              className="rounded-2xl bg-jack-red px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-red-50 shadow-[0_0_30px_rgba(248,113,113,0.9)] hover:bg-red-600"
              onClick={() => {
                // placeholder for lotto start
                console.log("TODO: start lotto");
              }}
            >
              Pokreni Loto
            </button>
          )}

          {!user && (
            <button
              type="button"
              onClick={() => navigate("/registracija")}
              className="rounded-2xl border border-jack-border bg-black/40 px-4 py-2 text-[11px] font-semibold text-slate-200 hover:border-jack-red/80 hover:text-red-200"
            >
              Registriraj se za jackpot
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
