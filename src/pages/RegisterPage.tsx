import React from "react";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: backend registracija
  };

  return (
    <div className="flex flex-1 items-center justify-center py-6">
      <div className="w-full max-w-md rounded-2xl border border-jack-border bg-black/70 p-6 shadow-jack-soft">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">
          Registracija
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Kreiraj račun i pusti Jacka da ti brusi rub listića.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Ime i prezime
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-jack-border bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-jack-red focus:ring-1 focus:ring-jack-red"
              placeholder="Ime Prezime"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Korisničko ime
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-jack-border bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-jack-red focus:ring-1 focus:ring-jack-red"
              placeholder="tvoj.username"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-jack-border bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-jack-red focus:ring-1 focus:ring-jack-red"
              placeholder="ti@primjer.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Lozinka
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-jack-border bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-jack-red focus:ring-1 focus:ring-jack-red"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Ponovi lozinku
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-jack-border bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-jack-red focus:ring-1 focus:ring-jack-red"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-jack-red px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-red-50 shadow-[0_0_24px_rgba(248,113,113,0.85)] hover:bg-red-600"
          >
            Kreiraj račun
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-400">
          Već imaš račun?{" "}
          <Link
            to="/prijava"
            className="font-semibold text-red-300 hover:text-red-200"
          >
            Prijavi se
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
