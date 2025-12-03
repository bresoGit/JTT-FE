// src/pages/RegisterPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  "http://localhost:8080";

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useUser();

  // ako je već logiran, nema smisla registracija
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError("Lozinke se ne podudaraju");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Neuspješna registracija");
      }

      const data = await res.json();

      // odmah logiraj usera nakon uspješne registracije
      login({ user: data.user, token: data.token });

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Greška pri registraciji");
    } finally {
      setLoading(false);
    }
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
              Ime
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-jack-border bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-jack-red focus:ring-1 focus:ring-jack-red"
              placeholder="Ime"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Prezime
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-jack-border bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-jack-red focus:ring-1 focus:ring-jack-red"
              placeholder="Prezime"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Korisničko ime
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
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
            {loading ? "Registriram..." : "Kreiraj račun"}
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
