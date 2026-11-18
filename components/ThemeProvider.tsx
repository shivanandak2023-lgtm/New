"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start as "light" on both server and client to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("calctools_theme") as Theme | null;
      if (stored === "dark") {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      } else if (stored === "light") {
        // already light
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          setTheme("dark");
          document.documentElement.classList.add("dark");
        }
      }
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      try { localStorage.setItem("calctools_theme", next); } catch {}
      return next;
    });
  }, []);

  // Pass mounted flag so children can avoid rendering theme-dependent content before mount
  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : "light", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
