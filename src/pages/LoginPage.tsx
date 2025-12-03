import React from "react";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: backend login
  };

  return (
    <div className="flex flex-1 items-center justify-center py-6">
      <div className="w-full max-w-md rounded-2xl border border-jack-border bg-black/70 p-6 shadow-jack-soft">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">
          Prijava
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Vrati se u Jackovu tamnicu tipova.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Korisničko ime ili email
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-jack-border bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-jack-red focus:ring-1 focus:ring-jack-red"
              placeholder="tvoj.username ili email"
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

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-3 w-3 rounded border border-slate-600 bg-black/80"
              />
              <label htmlFor="remember">Zapamti me</label>
            </div>
            <button
              type="button"
              className="text-red-300 hover:text-red-200 underline underline-offset-2"
            >
              Zaboravljena lozinka?
            </button>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-jack-red px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-red-50 shadow-[0_0_24px_rgba(248,113,113,0.85)] hover:bg-red-600"
          >
            Uđi u Jackovu sobu
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-400">
          Nemaš račun?{" "}
          <Link
            to="/registracija"
            className="font-semibold text-red-300 hover:text-red-200"
          >
            Registriraj se
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
