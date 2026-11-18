"use client";

import { useState, useEffect, useRef } from "react";
import {
  CURRENCIES,
  getCurrencyFromStorage,
  saveCurrencyToStorage,
  type Currency,
} from "@/lib/currency";

interface CurrencySelectorProps {
  onChange?: (currency: Currency) => void;
  className?: string;
}

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);

  useEffect(() => {
    setCurrency(getCurrencyFromStorage());
  }, []);

  const updateCurrency = (code: string) => {
    const found = CURRENCIES.find((c) => c.code === code);
    if (found) {
      setCurrency(found);
      saveCurrencyToStorage(code);
    }
  };

  return { currency, updateCurrency };
}

export default function CurrencySelector({
  onChange,
  className = "",
}: CurrencySelectorProps) {
  const { currency, updateCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.includes(search)
  );

  const handleSelect = (c: Currency) => {
    updateCurrency(c.code);
    if (onChange) onChange(c);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={`flex items-center gap-2 ${className}`} ref={wrapperRef}>
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        Currency
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="input-field py-1.5 px-3 text-sm min-w-[180px] text-left flex items-center justify-between gap-2 cursor-pointer"
          style={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
        >
          <span>{currency.symbol} {currency.code} — {currency.name}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform ${open ? "rotate-180" : ""}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg border overflow-hidden z-50"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            {/* Search input */}
            <div className="p-2 border-b" style={{ borderColor: "var(--card-border)" }}>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full px-3 py-2 text-sm rounded-lg border outline-none focus:border-[var(--primary)]"
                style={{ background: "var(--muted-bg)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
                autoComplete="off"
              />
            </div>

            {/* Currency list */}
            <div className="max-h-60 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm" style={{ color: "var(--muted)" }}>No results</div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                      c.code === currency.code ? "font-semibold" : ""
                    }`}
                    style={{
                      color: c.code === currency.code ? "var(--primary)" : "var(--foreground)",
                      background: c.code === currency.code ? "var(--primary-light)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (c.code !== currency.code) e.currentTarget.style.background = "var(--muted-bg)"; }}
                    onMouseLeave={(e) => { if (c.code !== currency.code) e.currentTarget.style.background = "transparent"; }}
                  >
                    {c.symbol} {c.code} — {c.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
