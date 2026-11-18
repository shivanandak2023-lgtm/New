export interface HistoryEntry {
  input: string;
  result: string;
  timestamp: number;
}

const MAX_ENTRIES = 10;

function getKey(slug: string): string {
  return `calctools_history_${slug}`;
}

export function saveToHistory(slug: string, entry: { input: string; result: string }): void {
  if (typeof window === "undefined") return;
  try {
    const key = getKey(slug);
    const existing = getHistory(slug);
    const newEntry: HistoryEntry = {
      input: entry.input,
      result: entry.result,
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...existing].slice(0, MAX_ENTRIES);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // localStorage might be unavailable
  }
}

export function getHistory(slug: string): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getKey(slug);
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function clearHistory(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = getKey(slug);
    localStorage.removeItem(key);
  } catch {
    // localStorage might be unavailable
  }
}
