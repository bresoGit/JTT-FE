// src/pages/LoginPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

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

  // ako je već logiran, nema smisla biti na loginu
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Neuspješna prijava");
      }

      const data = await res.json();

      // upiši u globalni UserContext (ovo interno rješava i localStorage)
      login({ user: data.user, token: data.token });

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Greška pri prijavi");
    } finally {
      setLoading(false);
    }
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
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-jack-border bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-jack-red focus:ring-1 focus:ring-jack-red"
              placeholder="••••••••"
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
            className="mt-2 w-full rounded-2xl bg-jack-red px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-red-50 shadow-[0_0_24px_rgba(248,113,113,0.85)] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Prijava..." : "Prijavi se"}
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
