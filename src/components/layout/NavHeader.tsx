// src/components/layout/NavHeader.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import JttLogo from "../../assets/jtt_logo.png";
import { useUser } from "../../context/UserContext";
import UserBadge from "../ui/UserBadge";

export default function NavHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUser();

  const isHome = location.pathname === "/";
  const isLotto = location.pathname === "/loto";
  const isLogin = location.pathname === "/prijava";
  const isRegister = location.pathname === "/registracija";
  const isPlanner = location.pathname === "/plan-liga";

  const initials =
    user && (user.firstName || user.lastName)
      ? `${(user.firstName || "").charAt(0)}${(user.lastName || "")
          .charAt(0)
          .toUpperCase()}`.toUpperCase()
      : user?.username?.charAt(0).toUpperCase() ?? "J";

  return (
    <header
      className="flex items-center justify-between rounded-2xl border border-jack-border bg-gradient-to-r from-jack-card via-jack-redMuted/20 to-jack-card px-4 py-3 shadow-jack-soft
             max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-3"
    >
      {/* LEFT: logo + auth / user info */}
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

        {/* Auth zone / user zone */}
        {!isAuthenticated || !user ? (
          <div className="flex items-center gap-2">
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
        ) : (
          <UserBadge
            user={user}
            initials={initials}
            onLogout={logout}
            onProfileClick={() => navigate("/profil")}
          />
        )}
      </div>

      {/* RIGHT: giljotina status + planner link */}
      <div className="flex items-center justify-end gap-3">
        {isAuthenticated && !isLotto && (
          <button
            type="button"
            onClick={() => navigate("/plan-liga")}
            className={`hidden sm:inline-flex items-center gap-1 rounded-2xl border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition
              ${
                isPlanner
                  ? "border-red-400 bg-red-900/40 text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.9)]"
                  : "border-jack-border bg-black/70 text-slate-200 hover:border-red-400 hover:text-red-100"
              }`}
          >
            Plan liga
          </button>
        )}

        <div className="flex items-center gap-2 rounded-2xl border border-jack-border bg-jack-card px-3 py-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-slate-300">Giljotina spremna</span>
        </div>
      </div>
    </header>
  );
}
