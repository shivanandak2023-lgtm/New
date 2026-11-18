"use client";

import { useState, useEffect } from "react";

export type LangCode = "en" | "de" | "ja" | "pt" | "fr" | "es" | "hi";

interface LangOption {
  code: LangCode;
  flag: string;
  name: string;
  nativeName: string;
}

const LANGUAGES: LangOption[] = [
  { code: "en", flag: "🇬🇧", name: "English", nativeName: "English" },
  { code: "de", flag: "🇩🇪", name: "German", nativeName: "Deutsch" },
  { code: "ja", flag: "🇯🇵", name: "Japanese", nativeName: "日本語" },
  { code: "pt", flag: "🇧🇷", name: "Portuguese", nativeName: "Português" },
  { code: "fr", flag: "🇫🇷", name: "French", nativeName: "Français" },
  { code: "es", flag: "🇪🇸", name: "Spanish", nativeName: "Español" },
  { code: "hi", flag: "🇮🇳", name: "Hindi", nativeName: "हिन्दी" },
];

interface LanguageSwitcherProps {
  supportedLangs: LangCode[];
  onLanguageChange: (lang: LangCode) => void;
  defaultLang?: LangCode;
}

export function useTranslation(translations: Record<LangCode, Record<string, string>>, defaultLang: LangCode = "en") {
  const [lang, setLang] = useState<LangCode>(defaultLang);

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return { lang, setLang, t };
}

export default function LanguageSwitcher({ supportedLangs, onLanguageChange, defaultLang = "en" }: LanguageSwitcherProps) {
  const [lang, setLang] = useState<LangCode>(defaultLang);

  const filtered = LANGUAGES.filter(l => supportedLangs.includes(l.code));

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Language:</span>
      <div className="flex gap-1">
        {filtered.map(l => (
          <button
            key={l.code}
            onClick={() => { setLang(l.code); onLanguageChange(l.code); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              lang === l.code
                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                : "border-[var(--card-border)] hover:border-[var(--primary)]"
            }`}
            style={lang !== l.code ? { color: "var(--foreground)" } : {}}
            title={l.name}
          >
            {l.flag} {l.nativeName}
          </button>
        ))}
      </div>
    </div>
  );
}
