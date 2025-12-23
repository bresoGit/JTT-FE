// src/components/lotto/LottoCalendar.tsx
import React from "react";

type Props = {
  max: number; // e.g. 39
  picked: number[]; // prediction numbers
  actual?: number[]; // draw numbers
};

const chunk = (arr: number[], size: number) => {
  const out: number[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const LottoCalendar: React.FC<Props> = ({ max, picked, actual }) => {
  const pickedSet = React.useMemo(() => new Set(picked), [picked]);
  const actualSet = React.useMemo(() => new Set(actual ?? []), [actual]);

  const nums = React.useMemo(
    () => Array.from({ length: max }, (_, i) => i + 1),
    [max]
  );

  // nice grid: ~10 per row (works well for 35/39/40)
  const rows = chunk(nums, 10);

  return (
    <div className="space-y-1.5">
      {rows.map((r, idx) => (
        <div key={idx} className="flex flex-wrap justify-center gap-1.5">
          {r.map((n) => {
            const isPicked = pickedSet.has(n);
            const isActual = actualSet.has(n);
            const isHit = isPicked && isActual;

            const base =
              "inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border px-2 text-[11px] font-semibold transition";

            const cls = isHit
              ? "border-emerald-300/60 bg-emerald-500/20 text-emerald-100 shadow-[0_0_14px_rgba(16,185,129,0.35)]"
              : isActual
              ? "border-yellow-300/60 bg-yellow-400/15 text-yellow-100 shadow-[0_0_14px_rgba(250,204,21,0.25)]"
              : isPicked
              ? "border-sky-300/50 bg-sky-500/10 text-sky-100"
              : "border-jack-border/60 bg-black/40 text-slate-300";

            return (
              <span key={n} className={`${base} ${cls}`}>
                {n}
              </span>
            );
          })}
        </div>
      ))}

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400/60" />
          Odigrano
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/60" />
          Izvučeno
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          Pogodak
        </span>
      </div>
    </div>
  );
};

export default LottoCalendar;
