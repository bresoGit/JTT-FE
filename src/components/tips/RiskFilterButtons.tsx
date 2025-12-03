// src/components/tips/RiskFilterButton.tsx
import React from "react";

interface RiskFilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}

const RiskFilterButton: React.FC<RiskFilterButtonProps> = ({
  label,
  active,
  onClick,
  color,
}) => {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 transition text-xs";
  const inactive =
    "border-jack-border bg-black/40 text-slate-300 hover:border-jack-red/80 hover:text-red-200";
  const activeClasses =
    color ??
    "border-jack-red bg-jack-red/20 text-red-100 shadow-[0_0_18px_rgba(220,38,38,0.5)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${active ? activeClasses : inactive}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-red-400" : "bg-slate-500"
        }`}
      />
      {label}
    </button>
  );
};

export default RiskFilterButton;
