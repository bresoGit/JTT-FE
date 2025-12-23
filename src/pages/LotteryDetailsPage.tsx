// src/pages/LotteryDetailsPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import LottoCalendar from "../components/loto/LottoCalendar";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  "http://localhost:8080";

type PredictionRow = {
  id: number;
  lotteryId: number;
  drawDate: string;

  combo1: string | null;
  combo2: string | null;
  combo3: string | null;
  combo4: string | null;
  combo5: string | null;
  combo6: string | null;
  combo7: string | null;
  combo8: string | null;
  combo9: string | null;
  combo10: string | null;

  drawn?: boolean;
};

type LotteryInfo = {
  id: number;
  name: string | null;
  country: string | null;
  state: string | null;

  mainMax: number | null;
  mainDrawn: number | null;

  bonusDrawn: number | null;
  bonusMax: number | null;
};

type DrawRow = {
  id: number;
  lotteryId: number;
  predictionId: number;
  drawDate: string;
  numbersJson: string; // JSON array like [1,2,3...]
};

const parseJsonArrayOfNumbers = (raw?: string | null): number[] => {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) {
      return v
        .map((x) => Number(x))
        .filter((n) => Number.isFinite(n))
        .map((n) => Math.trunc(n));
    }
    return [];
  } catch {
    return [];
  }
};

const intersectionCount = (a: number[], b: number[]) => {
  const setB = new Set(b);
  let cnt = 0;
  for (const n of a) if (setB.has(n)) cnt++;
  return cnt;
};

const LotteryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const lotteryId = Number(id);

  const [lottery, setLottery] = React.useState<LotteryInfo | null>(null);
  const [rows, setRows] = React.useState<PredictionRow[]>([]);
  const [drawsByPredictionId, setDrawsByPredictionId] = React.useState<
    Record<number, DrawRow>
  >({});

  const [openId, setOpenId] = React.useState<number | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!Number.isFinite(lotteryId)) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = BACKEND_URL.replace(/\/+$/, "");

        // 1) lottery info
        const lotRes = await fetch(`${base}/api/loto/lotteries/${lotteryId}`, {
          signal: controller.signal,
        });
        if (!lotRes.ok) {
          const text = await lotRes.text();
          throw new Error(
            text || `Greška pri dohvaćanju lota: ${lotRes.status}`
          );
        }
        const lot: LotteryInfo = await lotRes.json();
        setLottery(lot);

        // 2) predictions
        const predRes = await fetch(
          `${base}/api/loto/lotteries/${lotteryId}/predictions`,
          { signal: controller.signal }
        );
        if (!predRes.ok) {
          const text = await predRes.text();
          throw new Error(
            text || `Greška pri dohvaćanju detalja: ${predRes.status}`
          );
        }
        const data: PredictionRow[] = await predRes.json();
        const normalized = Array.isArray(data) ? data : [];
        setRows(normalized);

        // open the first row by default (most recent)
        if (normalized.length > 0) setOpenId(normalized[0].id);

        // 3) draws for those predictions
        const predictionIds = normalized.map((r) => r.id);
        if (predictionIds.length > 0) {
          const drawsRes = await fetch(
            `${base}/api/loto/draws/by-predictions`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(predictionIds),
              signal: controller.signal,
            }
          );

          if (!drawsRes.ok) {
            const text = await drawsRes.text();
            throw new Error(
              text || `Greška pri dohvaćanju izvlačenja: ${drawsRes.status}`
            );
          }

          const draws: DrawRow[] = await drawsRes.json();
          const map: Record<number, DrawRow> = {};
          (Array.isArray(draws) ? draws : []).forEach((d) => {
            if (typeof d.predictionId === "number") map[d.predictionId] = d;
          });
          setDrawsByPredictionId(map);
        } else {
          setDrawsByPredictionId({});
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message ?? "Došlo je do greške pri dohvaćanju detalja.");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [lotteryId]);

  const max = lottery?.mainMax ?? 39;
  const mainDrawn = lottery?.mainDrawn ?? 0;

  const combosFor = (r: PredictionRow): Array<[string, string | null]> => [
    ["Kombinacija 1", r.combo1],
    ["Kombinacija 2", r.combo2],
    ["Kombinacija 3", r.combo3],
    ["Kombinacija 4", r.combo4],
    ["Kombinacija 5", r.combo5],
    ["Kombinacija 6", r.combo6],
    ["Kombinacija 7", r.combo7],
    ["Kombinacija 8", r.combo8],
    ["Kombinacija 9", r.combo9],
    ["Kombinacija 10", r.combo10],
  ];

  const computeBestSummary = (r: PredictionRow) => {
    const draw = drawsByPredictionId[r.id];
    if (!draw) return null;

    const actualNums = parseJsonArrayOfNumbers(draw.numbersJson);
    const denom =
      mainDrawn && mainDrawn > 0 ? mainDrawn : actualNums.length || 0;

    if (denom <= 0) return null;

    let bestHits = 0;

    combosFor(r).forEach(([, raw]) => {
      const picked = parseJsonArrayOfNumbers(raw);
      if (picked.length === 0) return;
      bestHits = Math.max(bestHits, intersectionCount(picked, actualNums));
    });

    const pct = bestHits / denom;
    return { bestHits, denom, pct };
  };

  return (
    <div className="flex flex-1 justify-center py-6">
      <div className="w-full max-w-6xl space-y-4">
        <div className="rounded-2xl border border-jack-border bg-black/50 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-300">
            Loto detalji (kombinacije)
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-100">
            {lottery?.name ?? "Loto"}{" "}
            <span className="text-slate-400 text-sm font-semibold">
              #{lotteryId}
            </span>
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            {lottery?.country ?? "—"}
            {lottery?.state ? ` • ${lottery.state}` : ""} • Grid 1–{max}
            {mainDrawn ? ` • Izvlači se: ${mainDrawn}` : ""}
          </p>

          <p className="mt-2 text-sm text-slate-300">
            “Odigrano” = brojevi u kombinaciji, “Izvučeno” = stvarni brojevi,
            “Pogodak” = preklapanje. Postotak računamo na frontendu po
            kombinaciji.
          </p>
        </div>

        <div className="rounded-2xl border border-jack-border bg-black/40 p-4 lg:p-6">
          {loading ? (
            <div className="text-sm text-slate-300">Učitavam...</div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
              {error}
            </div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-slate-300">
              Nema spremljenih kombinacija za ovu igru.
            </div>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => {
                const isOpen = openId === r.id;
                const draw = drawsByPredictionId[r.id];
                const summary = computeBestSummary(r);

                return (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-jack-border/70 bg-black/60 overflow-hidden"
                  >
                    {/* Accordion header */}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenId((prev) => (prev === r.id ? null : r.id))
                      }
                      className={[
                        "w-full text-left px-4 py-3 transition flex flex-wrap items-center justify-between gap-2",
                        "hover:bg-black/50",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/10",
                      ].join(" ")}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-100">
                          Datum izvlačenja:{" "}
                          <span className="text-slate-200">{r.drawDate}</span>
                        </span>

                        <span className="mt-1 text-[11px] text-slate-400">
                          {draw
                            ? "Izvučeno ✓ (klikni za kombinacije)"
                            : "Čeka se izvlačenje (klikni za kombinacije)"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {draw ? (
                          summary ? (
                            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-200">
                              Najbolje: {summary.bestHits}/{summary.denom} •{" "}
                              {(summary.pct * 100).toFixed(0)}%
                            </span>
                          ) : (
                            <span className="rounded-full border border-yellow-300/50 bg-yellow-400/10 px-3 py-1 text-[10px] font-semibold text-yellow-100">
                              Izvučeno ✓
                            </span>
                          )
                        ) : (
                          <span className="rounded-full border border-jack-border bg-black/40 px-3 py-1 text-[10px] font-semibold text-slate-400">
                            Čeka se
                          </span>
                        )}

                        <span
                          className={[
                            "ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-jack-border bg-black/40 text-slate-200 transition",
                            isOpen
                              ? "rotate-180 border-red-400/40 text-red-200"
                              : "hover:border-red-400/40 hover:text-red-200",
                          ].join(" ")}
                          aria-hidden
                        >
                          ▾
                        </span>
                      </div>
                    </button>

                    {/* Accordion body */}
                    {isOpen ? (
                      <div className="border-t border-jack-border/60 p-4 bg-black/30">
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                          {combosFor(r).map(([label, raw]) => {
                            const pickedNums = parseJsonArrayOfNumbers(raw);
                            const actualNums = draw
                              ? parseJsonArrayOfNumbers(draw.numbersJson)
                              : [];

                            const denom =
                              mainDrawn && mainDrawn > 0
                                ? mainDrawn
                                : pickedNums.length > 0
                                ? pickedNums.length
                                : 0;

                            const hits =
                              draw && denom > 0
                                ? intersectionCount(pickedNums, actualNums)
                                : null;

                            const pct =
                              draw && hits != null && denom > 0
                                ? hits / denom
                                : null;

                            return (
                              <div
                                key={label}
                                className="rounded-2xl border border-jack-border/60 bg-black/40 p-3"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    {label}
                                  </div>

                                  {draw && pct != null ? (
                                    <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-200">
                                      Pogodak: {hits}/{denom} •{" "}
                                      {(pct * 100).toFixed(0)}%
                                    </span>
                                  ) : (
                                    <span className="text-[10px] uppercase tracking-wide text-slate-500">
                                      —
                                    </span>
                                  )}
                                </div>

                                <div className="mt-3">
                                  <LottoCalendar
                                    max={max}
                                    picked={pickedNums}
                                    actual={draw ? actualNums : undefined}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotteryDetailsPage;
