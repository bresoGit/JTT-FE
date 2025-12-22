// src/components/layout/UserBadge.tsx
import React from "react";
import type { AppUser } from "../../types/user";

interface UserBadgeProps {
  user: AppUser;
  initials: string;
  onLogout: () => void;
  onProfileClick: () => void;
  variant?: "TICKETS" | "LOTTO";
}

const UserBadge: React.FC<UserBadgeProps> = ({
  user,
  initials,
  onLogout,
  onProfileClick,
  variant = "TICKETS",
}) => {
  const isLotto = variant === "LOTTO";

  return (
    <div className="flex items-center gap-2 max-[500px]:gap-1">
      <button
        type="button"
        onClick={onProfileClick}
        className={[
          "inline-flex items-center gap-2 rounded-full border bg-black/70 px-3 py-1.5",
          "max-[500px]:px-2 max-[500px]:py-1 max-[500px]:gap-1",
          "cursor-pointer transition",
          isLotto
            ? "border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.20)] hover:border-amber-400/70 hover:shadow-[0_0_26px_rgba(251,191,36,0.35)]"
            : "border-jack-border/70 shadow-[0_0_20px_rgba(248,113,113,0.35)] hover:border-red-500/70 hover:shadow-[0_0_26px_rgba(248,113,113,0.6)]",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full bg-black/80 ring-1 text-[10px] font-semibold",
            "max-[500px]:h-7 max-[500px]:w-7 max-[500px]:text-[9px]",
            isLotto
              ? "ring-amber-400/80 text-amber-50 shadow-[0_0_14px_rgba(251,191,36,0.55)]"
              : "ring-red-500/80 text-red-100 shadow-[0_0_14px_rgba(248,113,113,0.9)]",
          ].join(" ")}
        >
          {initials}
        </div>

        <div className="flex flex-col leading-tight text-left">
          <span className="text-xs font-semibold text-slate-100 max-[500px]:text-[10px]">
            {user.username}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={onLogout}
        className={[
          "ml-1 rounded-2xl border bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition",
          "max-[500px]:px-2 max-[500px]:py-0.5 max-[500px]:text-[9px]",
          isLotto
            ? "border-amber-500/30 text-slate-200 hover:border-amber-400 hover:text-amber-100 hover:bg-black/90"
            : "border-jack-border text-slate-200 hover:border-red-400 hover:text-red-200 hover:bg-black/90",
        ].join(" ")}
      >
        Odjava
      </button>
    </div>
  );
};

export default UserBadge;
