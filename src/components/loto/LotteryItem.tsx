// src/components/lotto/LotteryItem.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

type LotteryEntity = {
  id: number;
  provider: string;
  gameCode: string;

  name: string | null;
  country: string | null;
  state: string | null;

  mainMin: number | null;
  mainMax: number | null;
  mainDrawn: number | null;

  bonusMin: number | null;
  bonusMax: number | null;
  bonusDrawn: number | null;

  sameBalls: string | null;
  digits: number | null;
  drawn: number | null;

  isOption: string | null;
  optionDesc: string | null;

  lastFetchAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type Props = {
  lottery: LotteryEntity;
};

type Theme = {
  border: string;
  bg: string;
  chipBg: string;
  chipText: string;
  glow: string;
  hoverBorder: string;
  hoverGlow: string;
};

const THEMES_BY_COUNTRY: Record<string, Theme> = {
  Croatia: {
    border: "border-sky-400/40",
    bg: "bg-gradient-to-br from-black/70 via-sky-950/35 to-black/70",
    chipBg: "bg-sky-500/15",
    chipText: "text-sky-200",
    glow: "shadow-[0_0_24px_rgba(56,189,248,0.18)]",
    hoverBorder: "hover:border-sky-300/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(56,189,248,0.28)]",
  },
  Finland: {
    border: "border-blue-300/35",
    bg: "bg-gradient-to-br from-black/70 via-blue-950/30 to-black/70",
    chipBg: "bg-blue-400/15",
    chipText: "text-blue-200",
    glow: "shadow-[0_0_24px_rgba(147,197,253,0.16)]",
    hoverBorder: "hover:border-blue-200/60",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(147,197,253,0.24)]",
  },
  Poland: {
    border: "border-rose-400/40",
    bg: "bg-gradient-to-br from-black/70 via-rose-950/25 to-black/70",
    chipBg: "bg-rose-400/15",
    chipText: "text-rose-200",
    glow: "shadow-[0_0_24px_rgba(251,113,133,0.16)]",
    hoverBorder: "hover:border-rose-300/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(251,113,133,0.22)]",
  },
  Serbia: {
    border: "border-indigo-400/35",
    bg: "bg-gradient-to-br from-black/70 via-indigo-950/30 to-black/70",
    chipBg: "bg-indigo-400/15",
    chipText: "text-indigo-200",
    glow: "shadow-[0_0_24px_rgba(129,140,248,0.16)]",
    hoverBorder: "hover:border-indigo-300/65",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(129,140,248,0.22)]",
  },
  "Bosnia and Herzegovina": {
    border: "border-yellow-400/45",
    bg: "bg-gradient-to-br from-black/70 via-yellow-950/20 to-black/70",
    chipBg: "bg-yellow-400/15",
    chipText: "text-yellow-200",
    glow: "shadow-[0_0_24px_rgba(250,204,21,0.14)]",
    hoverBorder: "hover:border-yellow-300/70",
    hoverGlow: "hover:shadow-[0_0_34px_rgba(250,204,21,0.22)]",
  },
};

const DEFAULT_THEME: Theme = {
  border: "border-jack-border/70",
  bg: "bg-black/60",
  chipBg: "bg-white/10",
  chipText: "text-slate-200",
  glow: "shadow-[0_0_18px_rgba(0,0,0,0.4)]",
  hoverBorder: "hover:border-white/25",
  hoverGlow: "hover:shadow-[0_0_28px_rgba(255,255,255,0.08)]",
};

const normalizeCountryKey = (country?: string | null) => (country ?? "").trim();

const LotteryItem: React.FC<Props> = ({ lottery }) => {
  const navigate = useNavigate();
  const countryKey = normalizeCountryKey(lottery.country);
  const theme = THEMES_BY_COUNTRY[countryKey] ?? DEFAULT_THEME;

  const title = lottery.name ?? lottery.gameCode;
  const subtitle = `${lottery.country ?? "—"}${
    lottery.state ? ` • ${lottery.state}` : ""
  }`;

  const mainText = `Main: ${lottery.mainDrawn ?? "?"} / ${
    lottery.mainMax ?? "?"
  }`;
  const bonusText =
    lottery.bonusDrawn && lottery.bonusDrawn > 0
      ? `Bonus: ${lottery.bonusDrawn} / ${lottery.bonusMax ?? "?"}`
      : null;

  const optionText =
    lottery.optionDesc && lottery.optionDesc !== "-"
      ? lottery.optionDesc
      : null;

  const goToDetails = () => {
    navigate(`/loto/${lottery.id}`);
  };

  return (
    <button
      type="button"
      onClick={goToDetails}
      className={[
        "w-full text-left rounded-2xl border p-3 transition",
        "cursor-pointer select-none",
        "active:scale-[0.99]",
        "hover:-translate-y-[1px]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/15",
        theme.border,
        theme.bg,
        theme.glow,
        theme.hoverBorder,
        theme.hoverGlow,
      ].join(" ")}
      aria-label={`Otvori detalje: ${title}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-100">{title}</div>
          <div className="mt-1 text-[11px] text-slate-300">{subtitle}</div>
        </div>

        <div
          className={[
            "shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wide",
            theme.chipBg,
            theme.chipText,
          ].join(" ")}
          title="Provider i game code"
        >
          {lottery.provider} • {lottery.gameCode}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-200">
        <span className="rounded-full bg-black/40 px-3 py-1">{mainText}</span>

        {bonusText ? (
          <span className="rounded-full bg-black/40 px-3 py-1">
            {bonusText}
          </span>
        ) : null}

        {optionText ? (
          <span className="rounded-full bg-black/40 px-3 py-1">
            Opcija: {optionText}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-end">
        <span className="text-[10px] uppercase tracking-wide text-slate-400 hover:text-slate-300">
          Detalji →
        </span>
      </div>
    </button>
  );
};

export default LotteryItem;
