// src/components/layout/NavHeader.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import JttLogo from "../../assets/jtt_logo.png";
import { useUser } from "../../context/UserContext";
import UserBadge from "../ui/UserBadge";
import { getPreferredHome } from "../../utils/preferredHome";

export default function NavHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUser();

  const preferredHome = getPreferredHome();
  const isLottoTheme =
    location.pathname.startsWith("/loto") || preferredHome === "/loto";

  const isHome = location.pathname === "/";
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
      className={[
        "flex items-center justify-between rounded-2xl border px-4 py-3",
        "shadow-jack-soft max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-3",
        isLottoTheme
          ? "border-amber-500/25 bg-gradient-to-r from-zinc-950 via-amber-950/25 to-zinc-950"
          : "border-jack-border bg-gradient-to-r from-jack-card via-jack-redMuted/20 to-jack-card",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {/* Logo link -> preferred home */}
        <Link
          to={preferredHome}
          className={`flex items-center transition-transform duration-150 ${
            isHome ? "scale-105" : "hover:scale-105"
          }`}
        >
          <div
            className={[
              "flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-black/70 ring-1 transition-shadow duration-150",
              isLottoTheme ? "ring-amber-400/60" : "ring-red-500/60",
              isLottoTheme
                ? "shadow-[0_0_18px_rgba(251,191,36,0.55)] hover:shadow-[0_0_28px_rgba(251,191,36,0.7)]"
                : "shadow-[0_0_18px_rgba(248,113,113,0.7)] hover:shadow-[0_0_30px_rgba(248,113,113,1)]",
            ].join(" ")}
          >
            <img
              src={JttLogo}
              alt="Jack The Tipster"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {!isAuthenticated || !user ? (
          <div className="flex items-center gap-2">
            <Link
              to="/prijava"
              className={[
                "rounded-2xl border bg-gradient-to-r from-black to-black px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide ring-1 transition",
                isLottoTheme
                  ? "via-amber-900/20 text-amber-100 border-amber-400/70 ring-amber-500/70 shadow-[0_0_22px_rgba(251,191,36,0.55)] hover:brightness-110"
                  : "via-red-900/40 text-red-100 border-red-400/70 ring-red-500/70 shadow-[0_0_28px_rgba(248,113,113,0.95)] hover:brightness-125",
                isLogin ? "brightness-110" : "",
              ].join(" ")}
            >
              Prijava
            </Link>

            <Link
              to="/registracija"
              className={[
                "rounded-2xl px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition",
                isLottoTheme
                  ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.55)] hover:brightness-110"
                  : "bg-gradient-to-r from-jack-red to-red-600 text-red-50 shadow-[0_0_24px_rgba(248,113,113,0.95)] hover:brightness-110",
                isRegister ? "brightness-110" : "",
              ].join(" ")}
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
            variant={isLottoTheme ? "LOTTO" : "TICKETS"}
          />
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        {/* Hide Plan liga when preferred theme is lotto */}
        {isAuthenticated && !isLottoTheme && (
          <button
            type="button"
            onClick={() => navigate("/plan-liga")}
            className={`sm:inline-flex items-center gap-1 rounded-2xl border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition
              ${
                isPlanner
                  ? "border-red-400 bg-red-900/40 text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.9)]"
                  : "border-jack-border bg-black/70 text-slate-200 hover:border-red-400 hover:text-red-100"
              }`}
          >
            Plan liga
          </button>
        )}

        <div
          className={[
            "flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs",
            isLottoTheme
              ? "border-amber-500/25 bg-black/55"
              : "border-jack-border bg-jack-card",
          ].join(" ")}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isLottoTheme ? "bg-amber-300" : "bg-emerald-400"
            }`}
          />
          <span
            className={`${
              isLottoTheme ? "text-amber-100/90" : "text-slate-300"
            }`}
          >
            {isLottoTheme ? "Sreća na nišanu" : "Giljotina spremna"}
          </span>
        </div>
      </div>
    </header>
  );
}
