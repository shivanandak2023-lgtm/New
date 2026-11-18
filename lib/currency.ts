export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", locale: "ar-SA" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
  { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", locale: "ko-KR" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", locale: "en-NG" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", locale: "en-PK" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", locale: "bn-BD" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", locale: "en-PH" },
];

export function getCurrencyFromStorage(): Currency {
  if (typeof window === "undefined") return CURRENCIES[0];
  const saved = localStorage.getItem("calctools_currency");
  if (saved) {
    const found = CURRENCIES.find((c) => c.code === saved);
    if (found) return found;
  }
  return CURRENCIES[0];
}

export function saveCurrencyToStorage(code: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("calctools_currency", code);
  }
}

export function formatCurrency(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.code === "JPY" || currency.code === "KRW" ? 0 : 2,
      maximumFractionDigits: currency.code === "JPY" || currency.code === "KRW" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency.symbol}${amount.toLocaleString()}`;
  }
}

export function formatCompact(amount: number, currency: Currency): string {
  if (amount >= 10000000) return `${currency.symbol}${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `${currency.symbol}${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000000) return `${currency.symbol}${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `${currency.symbol}${(amount / 1000).toFixed(1)}K`;
  return `${currency.symbol}${amount.toFixed(2)}`;
}
