// src/pages/LoginPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getPreferredHome } from "../utils/preferredHome";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  "http://localhost:8080";

const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useUser();

  const preferredHome = getPreferredHome();
  const isLottoTheme = preferredHome === "/loto";

  // if already authenticated -> go to preferred home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(preferredHome);
    }
  }, [isAuthenticated, navigate, preferredHome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Neuspješna prijava");
      }

      const data = await res.json();
      login({ user: data.user, token: data.token });

      // go back to preferred section
      navigate(preferredHome);
    } catch (err: any) {
      setError(err.message || "Greška pri prijavi");
    } finally {
      setLoading(false);
    }
  };

  const cardBorder = isLottoTheme
    ? "border-amber-500/25"
    : "border-jack-border";
  const focusRing = isLottoTheme
    ? "focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
    : "focus:border-jack-red focus:ring-1 focus:ring-jack-red";

  const primaryBtn = isLottoTheme
    ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-[0_0_22px_rgba(251,191,36,0.55)] hover:brightness-110"
    : "bg-jack-red text-red-50 shadow-[0_0_24px_rgba(248,113,113,0.85)] hover:bg-red-600";

  const linkColor = isLottoTheme
    ? "text-amber-300 hover:text-amber-200"
    : "text-red-300 hover:text-red-200";

  return (
    <div className="flex flex-1 items-center justify-center py-6">
      <div
        className={[
          "w-full max-w-md rounded-2xl border bg-black/70 p-6 shadow-jack-soft",
          cardBorder,
        ].join(" ")}
      >
        <p
          className={[
            "text-[11px] font-semibold uppercase tracking-[0.25em]",
            isLottoTheme ? "text-amber-300" : "text-red-300",
          ].join(" ")}
        >
          {isLottoTheme ? "Lutrija / Loto" : "Jack / Listići"}
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">
          Prijava
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          {isLottoTheme
            ? "Vrati se u zlatni mod kombinacija."
            : "Vrati se u Jackovu tamnicu tipova."}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Korisničko ime ili email
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className={`w-full rounded-xl border ${cardBorder} bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none ${focusRing}`}
              placeholder="tvoj.username ili email"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-xl border ${cardBorder} bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none ${focusRing}`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={[
              "mt-2 w-full rounded-2xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition",
              "disabled:cursor-not-allowed disabled:opacity-60",
              primaryBtn,
            ].join(" ")}
          >
            {loading ? "Prijava..." : "Prijavi se"}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-400">
          Nemaš račun?{" "}
          <Link to="/registracija" className={`font-semibold ${linkColor}`}>
            Registriraj se
          </Link>
          .
        </p>

        <div className="mt-2 text-[11px] text-slate-500">
          <Link to={preferredHome} className={linkColor}>
            ← Natrag
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
