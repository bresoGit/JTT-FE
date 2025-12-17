// src/components/layout/Sidebar.tsx
import React from "react";

interface DayItem {
  id: string; // ISO string yyyy-mm-dd
  label: string;
  subtitle: string;
  isSpecial: "TOMORROW" | "TODAY" | "YESTERDAY" | null;
}

interface SidebarProps {
  selectedDates: string[];
  onChangeSelectedDates: (dates: string[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedDates,
  onChangeSelectedDates,
}) => {
  const { tomorrow, today, yesterday, pastDates } = React.useMemo(() => {
    const startOfToday = startOfDay(new Date());

    const makeDay = (offsetDays: number): Date =>
      new Date(startOfToday.getTime() + offsetDays * 24 * 60 * 60 * 1000);

    const formatDay = (date: Date, special: DayItem["isSpecial"]): DayItem => {
      // ❌ BUGGY: const id = date.toISOString().slice(0, 10);
      // ✅ Use LOCAL date parts for yyyy-MM-dd
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const dayNum = String(date.getDate()).padStart(2, "0");
      const id = `${year}-${month}-${dayNum}`;

      const dayName = date.toLocaleDateString("hr-HR", {
        weekday: "short",
      }); // npr. "sri"
      const dayMonth = date.toLocaleDateString("hr-HR", {
        day: "2-digit",
        month: "2-digit",
      }); // "03.12."

      let label = "";
      if (special === "TOMORROW") label = "Sutra";
      else if (special === "TODAY") label = "Danas";
      else if (special === "YESTERDAY") label = "Jučer";
      else label = `${capitalize(dayName)} ${dayMonth}`;

      const subtitle =
        special != null
          ? `${capitalize(dayName)}, ${dayMonth}`
          : "Prikaži tipove za ovaj dan";

      return {
        id,
        label,
        subtitle,
        isSpecial: special,
      };
    };

    const tomorrowDate = makeDay(1);
    const todayDate = makeDay(0);
    const yesterdayDate = makeDay(-1);

    const tomorrow = formatDay(tomorrowDate, "TOMORROW");
    const today = formatDay(todayDate, "TODAY");
    const yesterday = formatDay(yesterdayDate, "YESTERDAY");

    const pastDates: DayItem[] = [];
    // od prekjucer pa do cca 60 dana unazad
    for (let i = 2; i <= 60; i++) {
      const d = makeDay(-i);
      pastDates.push(formatDay(d, null));
    }

    return { tomorrow, today, yesterday, pastDates };
  }, []);

  const toggleDate = (id: string) => {
    let next: string[];
    if (selectedDates.includes(id)) {
      next = selectedDates.filter((x) => x !== id);
    } else {
      next = [...selectedDates, id];
    }
    onChangeSelectedDates(next);
  };

  const isSelected = (id: string) => selectedDates.includes(id);

  return (
    <div className="space-y-4">
      {/* Danas ukratko */}
      <div className="rounded-2xl border border-jack-border bg-jack-card/90 p-4">
        <h3 className="text-sm font-semibold tracking-tight">Danas ukratko</h3>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span>Ukupno tipova</span>
            <span className="font-semibold text-slate-100">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Niski rizik</span>
            <span className="font-semibold text-emerald-300">4</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Srednji rizik</span>
            <span className="font-semibold text-amber-300">4</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Visoki rizik</span>
            <span className="font-semibold text-red-300">4</span>
          </div>
        </div>
      </div>

      {/* Odabir datuma */}
      <div className="rounded-2xl border border-jack-border bg-black/70 p-4 text-xs text-slate-300">
        <h3 className="text-sm font-semibold tracking-tight text-slate-100">
          Odabir datuma
        </h3>
        <p className="mt-2 text-[11px] text-slate-400">
          Odaberi jedan ili više datuma za pregled tipova. Možeš klikati više
          dana zaredom i praktički birati raspon.
        </p>

        <div className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-1">
          {/* Sutra, danas, jučer */}
          {[tomorrow, today, yesterday].map((day) => (
            <DateRow
              key={day.id}
              day={day}
              selected={isSelected(day.id)}
              onClick={() => toggleDate(day.id)}
            />
          ))}

          <div className="mt-2 border-t border-jack-border/60 pt-2 text-[10px] uppercase tracking-wide text-slate-500">
            Prošli dani (do 2 mjeseca unazad)
          </div>

          {pastDates.map((day) => (
            <DateRow
              key={day.id}
              day={day}
              selected={isSelected(day.id)}
              onClick={() => toggleDate(day.id)}
            />
          ))}
        </div>

        {selectedDates.length > 0 && (
          <div className="mt-3 rounded-xl border border-jack-border bg-black/60 px-3 py-2 text-[11px] text-slate-300">
            Odabrano datuma:{" "}
            <span className="font-semibold text-red-200">
              {selectedDates.length}
            </span>
            <br />U budućnosti će ovdje ići rezime (npr. ukupno tipova, uspjeh
            itd.).
          </div>
        )}
      </div>

      {/* Jackova napomena */}
      <div className="rounded-2xl border border-jack-border bg-black/60 p-4 text-xs text-slate-300">
        <h3 className="text-sm font-semibold tracking-tight text-slate-100">
          Jackova napomena
        </h3>
        <p className="mt-2">
          Vikendom očekuj više tipova. Radnim danom manje, ali filtriranije.
          Giljotina najbolje radi kad listić ima{" "}
          <span className="font-semibold text-red-200">3–6 parova</span>.
        </p>
      </div>
    </div>
  );
};

interface DateRowProps {
  day: DayItem;
  selected: boolean;
  onClick: () => void;
}

const DateRow: React.FC<DateRowProps> = ({ day, selected, onClick }) => {
  const base =
    "flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 transition w-full";
  const active =
    "border-jack-red bg-jack-red/20 text-red-100 shadow-[0_0_16px_rgba(220,38,38,0.45)]";
  const inactive =
    "border-jack-border bg-black/50 hover:border-jack-red/60 hover:bg-black/70";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${selected ? active : inactive}`}
    >
      <div className="flex flex-col items-start">
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {day.label}
        </span>
        <span className="text-[11px] text-slate-400">{day.subtitle}</span>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-slate-400">
        {selected && <span className="text-red-200">Odabrano</span>}
        <span
          className={`h-2 w-2 rounded-full ${
            selected ? "bg-red-400" : "bg-slate-600"
          }`}
        />
      </div>
    </button>
  );
};

// helpers
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Sidebar;
