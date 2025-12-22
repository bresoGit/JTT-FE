// src/pages/UserPage.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getPreferredHome } from "../utils/preferredHome";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  "http://localhost:8080";

interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
  createdAt: string | null;
  lastLoginAt: string | null;
}

const UserPage: React.FC = () => {
  const { user, token, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const preferredHome = getPreferredHome();
  const isLottoTheme = preferredHome === "/loto";

  const [profile, setProfile] = React.useState<UserProfileResponse | null>(
    user
      ? {
          id: (user as any).id ?? 0,
          username: user.username,
          email: (user as any).email ?? "",
          firstName: (user as any).firstName ?? "",
          lastName: (user as any).lastName ?? "",
          role: user.role,
          createdAt: (user as any).createdAt ?? null,
          lastLoginAt: (user as any).lastLoginAt ?? null,
        }
      : null
  );

  const [isPwModalOpen, setIsPwModalOpen] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [pwError, setPwError] = React.useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = React.useState<string | null>(null);
  const [pwLoading, setPwLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) navigate("/prijava");
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    const storedToken =
      token || localStorage.getItem("jtt_auth_token") || undefined;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          headers: {
            "Content-Type": "application/json",
            ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
          },
        });

        if (!res.ok) return;

        const data: UserProfileResponse = await res.json();
        setProfile(data);
      } catch {}
    };

    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openPasswordModal = () => {
    setPwError(null);
    setPwSuccess(null);
    setOldPassword("");
    setNewPassword("");
    setRepeatPassword("");
    setIsPwModalOpen(true);
  };

  const closePasswordModal = () => setIsPwModalOpen(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (!oldPassword || !newPassword) {
      setPwError("Ispuni staru i novu lozinku.");
      return;
    }
    if (newPassword !== repeatPassword) {
      setPwError("Nove lozinke se ne podudaraju.");
      return;
    }

    const storedToken =
      token || localStorage.getItem("jtt_auth_token") || undefined;
    if (!storedToken) {
      setPwError("Nisi prijavljen. Prijavi se ponovno.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          text || "Promjena lozinke nije uspjela. Provjeri staru lozinku."
        );
      }

      setPwSuccess("Lozinka uspješno promijenjena.");
      setOldPassword("");
      setNewPassword("");
      setRepeatPassword("");

      setTimeout(() => {
        setIsPwModalOpen(false);
        setPwSuccess(null);
      }, 800);
    } catch (err: any) {
      setPwError(err.message || "Greška pri promjeni lozinke.");
    } finally {
      setPwLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center py-6 text-sm text-slate-300">
        Učitavam profil...
      </div>
    );
  }

  const cardBorder = isLottoTheme
    ? "border-amber-500/25"
    : "border-jack-border";
  const cardBg = "bg-black/70";
  const linkColor = isLottoTheme
    ? "text-amber-300 hover:text-amber-200"
    : "text-red-300 hover:text-red-200";
  const primaryBtn = isLottoTheme
    ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-[0_0_24px_rgba(251,191,36,0.55)] hover:brightness-110"
    : "bg-jack-red text-red-50 shadow-[0_0_24px_rgba(248,113,113,0.85)] hover:bg-red-600";

  const inputFocus = isLottoTheme
    ? "focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
    : "focus:border-jack-red focus:ring-1 focus:ring-jack-red";

  return (
    <div className="flex flex-1 flex-col items-center py-6">
      <div className="w-full max-w-2xl space-y-4">
        <div
          className={`rounded-2xl border ${cardBorder} ${cardBg} p-6 shadow-jack-soft`}
        >
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">
            {isLottoTheme ? "Tvoj Loto profil" : "Tvoj Jack profil"}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Pregled osnovnih podataka o korisniku.
          </p>

          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-500">
                Korisničko ime
              </div>
              <div className="text-slate-100">{profile.username}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-500">
                Email
              </div>
              <div className="break-all text-slate-100">{profile.email}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-500">
                Ime i prezime
              </div>
              <div className="text-slate-100">
                {profile.firstName} {profile.lastName}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-500">
                Uloga
              </div>
              <div className="text-slate-100">
                {profile.role === "ADMIN" ? "ADMIN" : "KORISNIK"}
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-500">
            <Link to={preferredHome} className={linkColor}>
              ← Natrag
            </Link>
          </div>
        </div>

        <div
          className={`rounded-2xl border ${cardBorder} ${cardBg} p-6 shadow-jack-soft`}
        >
          <h3 className="text-sm font-semibold tracking-tight text-slate-100">
            Sigurnost računa
          </h3>
          <p className="mt-1 text-[11px] text-slate-400">
            Želiš promijeniti lozinku za svoj račun?
          </p>

          <button
            type="button"
            onClick={openPasswordModal}
            className={`mt-4 rounded-2xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition ${primaryBtn}`}
          >
            Promijeni lozinku
          </button>
        </div>
      </div>

      {isPwModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-2xl border ${cardBorder} bg-black/90 p-6 shadow-[0_0_40px_rgba(0,0,0,0.9)]`}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold tracking-tight text-slate-100">
                Promjena lozinke
              </h3>
              <button
                type="button"
                onClick={closePasswordModal}
                className={`text-xs ${
                  isLottoTheme
                    ? "text-slate-400 hover:text-amber-200"
                    : "text-slate-400 hover:text-red-300"
                }`}
              >
                Zatvori ✕
              </button>
            </div>

            <p className="mt-1 text-[11px] text-slate-400">
              Unesi staru lozinku i novu lozinku. Pazi da novu upišeš dva puta
              isto.
            </p>

            <form
              onSubmit={handleChangePassword}
              className="mt-4 space-y-3 text-sm"
            >
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Stara lozinka
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`w-full rounded-xl border ${cardBorder} bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none ${inputFocus}`}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Nova lozinka
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full rounded-xl border ${cardBorder} bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none ${inputFocus}`}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  Ponovi novu lozinku
                </label>
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className={`w-full rounded-xl border ${cardBorder} bg-black/70 px-3 py-2 text-sm text-slate-100 outline-none ${inputFocus}`}
                  placeholder="••••••••"
                />
              </div>

              {pwError && (
                <div className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-200">
                  {pwSuccess}
                </div>
              )}

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className={[
                    "rounded-2xl border bg-black/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition",
                    isLottoTheme
                      ? "border-amber-500/25 text-slate-200 hover:border-amber-400 hover:text-amber-100 hover:bg-black/90"
                      : "border-jack-border text-slate-200 hover:border-red-400 hover:bg-black/90 hover:text-red-200",
                  ].join(" ")}
                >
                  Odustani
                </button>

                <button
                  type="submit"
                  disabled={pwLoading}
                  className={[
                    "rounded-2xl px-4 py-2 text-[11px] font-semibold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60",
                    primaryBtn,
                  ].join(" ")}
                >
                  {pwLoading ? "Mijenjam..." : "Spremi novu lozinku"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
