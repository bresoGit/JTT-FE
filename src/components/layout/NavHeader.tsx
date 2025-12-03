// src/components/layout/NavHeader.tsx
import { Link, useLocation } from "react-router-dom";
import JttLogo from "../../assets/jtt_logo.png";

export default function NavHeader() {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/prijava";
  const isRegister = location.pathname === "/registracija";

  return (
    <header
      className="flex items-center justify-between rounded-2xl border border-jack-border bg-gradient-to-r from-jack-card via-jack-redMuted/20 to-jack-card px-4 py-3 shadow-jack-soft
             max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-3"
    >
      {/* LEFT: logo + auth buttons */}
      <div className="flex items-center gap-3">
        {/* Logo link */}
        <Link
          to="/"
          className={`flex items-center transition-transform duration-150 ${
            isHome ? "scale-105" : "hover:scale-105"
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-black/70 ring-1 ring-red-500/60 transition-shadow duration-150
            ${
              isHome
                ? "shadow-[0_0_30px_rgba(248,113,113,1)]"
                : "shadow-[0_0_18px_rgba(248,113,113,0.7)] hover:shadow-[0_0_30px_rgba(248,113,113,1)]"
            }`}
          >
            <img
              src={JttLogo}
              alt="Jack The Tipster"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          {/* Prijava */}
          <Link
            to="/prijava"
            className={`rounded-2xl border bg-gradient-to-r from-black via-red-900/40 to-black px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-red-100 ring-1 transition
            ${
              isLogin
                ? "border-red-400/90 ring-red-500/90 shadow-[0_0_35px_rgba(248,113,113,1)] brightness-125"
                : "border-red-400/70 ring-red-500/70 shadow-[0_0_28px_rgba(248,113,113,0.95)] hover:brightness-125 hover:shadow-[0_0_35px_rgba(248,113,113,1)]"
            }`}
          >
            Prijava
          </Link>

          {/* Registracija */}
          <Link
            to="/registracija"
            className={`rounded-2xl bg-gradient-to-r from-jack-red to-red-600 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-red-50 shadow-[0_0_24px_rgba(248,113,113,0.95)] transition
            ${
              isRegister
                ? "brightness-110 shadow-[0_0_30px_rgba(248,113,113,1)]"
                : "hover:brightness-110"
            }`}
          >
            Registracija
          </Link>
        </div>
      </div>

      {/* RIGHT: premium + giljotina status */}
      <div className="flex items-center gap-3">
        {/*  <button className="rounded-2xl bg-gradient-to-r from-jack-red to-red-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-red-50 shadow-[0_0_26px_rgba(248,113,113,0.9)] ring-1 ring-red-400/70 hover:brightness-110">
          Postani Premium
        </button>*/}
        <div className="flex items-center gap-2 rounded-2xl border border-jack-border bg-jack-card px-3 py-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-slate-300">Giljotina spremna</span>
        </div>
      </div>
    </header>
  );
}
