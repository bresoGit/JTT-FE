// src/components/common/JackDropdown.tsx
import React from "react";

export interface JackOption {
  value: string;
  label: string;
  description?: string;
  iconUrl?: string | null; // single icon (country flag / league logo)
  iconUrls?: (string | null)[]; // multiple icons (e.g. home + away logos)
  rightTag?: string; // e.g. season "2024" or kickoff time
}

interface JackDropdownProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: JackOption[];
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;

  // 🔎 SEARCH
  searchable?: boolean;
  searchPlaceholder?: string;

  // special layout for match dropdown
  variant?: "default" | "match";
}

/**
 * Generic glossy dropdown used for:
 * - country (flag + name)
 * - league (logo + name + season)
 * - match (two team logos + league + time) → variant="match"
 */
const JackDropdown: React.FC<JackDropdownProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
  loading = false,
  error,
  searchable = false,
  searchPlaceholder = "Pretraži…",
  variant = "default",
}) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const selected = options.find((o) => o.value === value) || null;

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  const isDisabled = disabled || loading;

  // close when clicking outside
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // 🔎 filter options by query
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((opt) => {
      const inLabel = opt.label.toLowerCase().includes(q);
      const inDesc = opt.description
        ? opt.description.toLowerCase().includes(q)
        : false;
      const inTag = opt.rightTag
        ? opt.rightTag.toLowerCase().includes(q)
        : false;
      return inLabel || inDesc || inTag;
    });
  }, [options, query, searchable]);

  const renderIcons = (opt: JackOption) => {
    const multi = (opt.iconUrls || []).filter(
      (u): u is string =>
        !!u && (u.startsWith("http://") || u.startsWith("https://"))
    );

    // two team logos (match)
    if (multi.length >= 2) {
      return (
        <div className="flex items-center -space-x-2">
          {multi.slice(0, 2).map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full bg-white object-contain ring-1 ring-black/40"
            />
          ))}
        </div>
      );
    }

    // single logo (country / league / fallback)
    const single =
      opt.iconUrl &&
      (opt.iconUrl.startsWith("http://") || opt.iconUrl.startsWith("https://"))
        ? opt.iconUrl
        : multi[0];

    if (single) {
      return (
        <img
          src={single}
          alt={opt.label}
          className="h-5 w-5 shrink-0 rounded-full bg-white object-contain ring-1 ring-black/40"
        />
      );
    }

    return null;
  };

  const splitTeams = (label: string): { home: string; away: string } => {
    // we expect "Home – Away" (with en dash), but fall back
    const parts = label.split("–");
    if (parts.length >= 2) {
      return {
        home: parts[0].trim(),
        away: parts.slice(1).join("–").trim(),
      };
    }
    const hyphenParts = label.split("-");
    if (hyphenParts.length >= 2) {
      return {
        home: hyphenParts[0].trim(),
        away: hyphenParts.slice(1).join("-").trim(),
      };
    }
    return { home: label, away: "" };
  };

  const renderTriggerContent = () => {
    if (variant === "match" && selected) {
      const { home, away } = splitTeams(selected.label);
      return (
        <div className="flex items-center gap-2 min-w-0">
          {renderIcons(selected)}
          <div className="flex flex-col min-w-0">
            <span className="truncate text-[11px] sm:text-xs text-slate-100 leading-tight">
              {away ? (
                <>
                  <span className="font-semibold">{home}</span>
                  <span className="mx-1 text-slate-500">vs</span>
                  <span className="font-semibold">{away}</span>
                </>
              ) : (
                selected.label
              )}
            </span>
            {selected.description && (
              <span className="truncate text-[10px] text-slate-400">
                {selected.description}
              </span>
            )}
          </div>
        </div>
      );
    }

    // default trigger
    return (
      <div className="flex items-center gap-2 min-w-0">
        {selected && renderIcons(selected)}
        <div className="flex flex-col min-w-0">
          <span
            className={`truncate ${
              selected ? "text-slate-100" : "text-slate-500"
            }`}
          >
            {selected
              ? selected.label
              : loading
              ? "Učitavanje..."
              : placeholder}
          </span>
          {selected?.description && (
            <span className="truncate text-[10px] text-slate-400">
              {selected.description}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderOptionBody = (opt: JackOption) => {
    if (variant === "match") {
      const { home, away } = splitTeams(opt.label);
      return (
        <div className="flex items-center gap-2 min-w-0">
          {renderIcons(opt)}
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] sm:text-xs text-slate-100 leading-tight">
              {away ? (
                <>
                  <span className="font-semibold">{home}</span>
                  <span className="mx-1 text-slate-500">vs</span>
                  <span className="font-semibold">{away}</span>
                </>
              ) : (
                opt.label
              )}
            </span>
            {opt.description && (
              <span className="truncate text-[10px] text-slate-400">
                {opt.description}
              </span>
            )}
          </div>
        </div>
      );
    }

    // default option body
    return (
      <div className="flex items-center gap-2 min-w-0">
        {renderIcons(opt)}
        <div className="flex flex-col min-w-0">
          <span className="truncate text-slate-100">{opt.label}</span>
          {opt.description && (
            <span className="truncate text-[10px] text-slate-400">
              {opt.description}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 w-full" ref={containerRef}>
      <label className="text-[11px] text-slate-400">{label}</label>

      <button
        type="button"
        disabled={isDisabled}
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs
          ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
          ${
            error
              ? "border-red-500 bg-black/80 text-slate-100"
              : "border-jack-border bg-black/80 text-slate-100 hover:border-red-400"
          }`}
      >
        {renderTriggerContent()}

        <div className="flex items-center gap-1 shrink-0">
          {selected?.rightTag && (
            <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700/60">
              {selected.rightTag}
            </span>
          )}
          <span className="text-[10px] text-slate-400">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {error && (
        <span className="mt-0.5 text-[11px] text-red-300">{error}</span>
      )}

      {open && (
        <div
          className={`mt-1 max-h-72 w-full overflow-hidden rounded-xl border border-jack-border bg-black/95 text-xs shadow-[0_0_22px_rgba(0,0,0,0.9)]
            ${variant === "match" ? "sm:text-[13px]" : ""}`}
        >
          {/* 🔎 search input */}
          {searchable && (
            <div className="border-b border-jack-border/60 bg-black/70 px-2 py-1.5">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg bg-black/70 px-2 py-1 text-[11px] text-slate-100 outline-none placeholder:text-slate-500"
              />
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-[11px] text-slate-500">
                Nema rezultata.
              </div>
            ) : (
              filteredOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-red-900/30 ${
                    opt.value === value ? "bg-red-900/40" : ""
                  }`}
                >
                  {renderOptionBody(opt)}
                  {opt.rightTag && (
                    <span className="shrink-0 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700/60">
                      {opt.rightTag}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JackDropdown;
