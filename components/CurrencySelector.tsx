"use client";

import { useState, useEffect } from "react";
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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
        Currency
      </label>
      <select
        value={currency.code}
        onChange={(e) => {
          updateCurrency(e.target.value);
          const found = CURRENCIES.find((c) => c.code === e.target.value);
          if (found && onChange) onChange(found);
        }}
        className="input-field py-1.5 px-2 text-sm w-auto min-w-[140px]"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code} — {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
