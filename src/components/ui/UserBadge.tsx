// src/components/layout/UserBadge.tsx
import React from "react";
import type { AppUser } from "../../types/user";

interface UserBadgeProps {
  user: AppUser;
  initials: string;
  onLogout: () => void;
}

const UserBadge: React.FC<UserBadgeProps> = ({ user, initials, onLogout }) => {
  return (
    <div className="flex items-center gap-2 max-[500px]:gap-1">
      {/* Badge with avatar + username */}
      <div
        className="
          inline-flex items-center gap-2 rounded-full border border-jack-border/70 bg-black/70 
          px-3 py-1.5 shadow-[0_0_20px_rgba(248,113,113,0.35)]
          max-[500px]:px-2 max-[500px]:py-1 max-[500px]:gap-1
        "
      >
        <div
          className="
            flex h-8 w-8 items-center justify-center rounded-full bg-black/80 
            ring-1 ring-red-500/80 text-[10px] font-semibold text-red-100 
            shadow-[0_0_14px_rgba(248,113,113,0.9)]
            max-[500px]:h-7 max-[500px]:w-7 max-[500px]:text-[9px]
          "
        >
          {initials}
        </div>
        <div className="flex flex-col leading-tight">
          <span
            className="
              text-xs font-semibold text-slate-100
              max-[500px]:text-[10px]
            "
          >
            {user.username}
          </span>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="
          ml-1 rounded-2xl border border-jack-border bg-black/70 px-3 py-1 
          text-[10px] font-semibold uppercase tracking-wide text-slate-200 
          hover:border-red-400 hover:text-red-200 hover:bg-black/90
          max-[500px]:px-2 max-[500px]:py-0.5 max-[500px]:text-[9px]
        "
      >
        Odjava
      </button>
    </div>
  );
};

export default UserBadge;
