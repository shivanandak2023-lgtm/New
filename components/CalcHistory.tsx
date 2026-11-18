"use client";

import { useState, useEffect, useCallback } from "react";
import { getHistory, clearHistory, type HistoryEntry } from "@/lib/history";

interface CalcHistoryProps {
  toolSlug: string;
}

export default function CalcHistory({ toolSlug }: CalcHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadHistory = useCallback(() => {
    setHistory(getHistory(toolSlug));
  }, [toolSlug]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Re-check history when section is opened
  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, loadHistory]);

  const handleClear = () => {
    clearHistory(toolSlug);
    setHistory([]);
  };

  function formatTimestamp(ts: number): string {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return "";
    }
  }

  if (history.length === 0 && !isOpen) return null;

  return (
    <div className="tool-card my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="font-semibold text-base">
          Recent Calculations {history.length > 0 && `(${history.length})`}
        </h3>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4">
          {history.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No calculations yet. Results will appear here after you calculate.</p>
          ) : (
            <>
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div
                    key={`${entry.timestamp}-${index}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-lg bg-[var(--muted-bg)] border border-[var(--card-border)]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{entry.input}</p>
                      <p className="text-sm text-[var(--primary)] font-semibold">{entry.result}</p>
                    </div>
                    <span className="text-xs text-[var(--muted)] whitespace-nowrap">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleClear}
                className="mt-4 text-sm text-[var(--danger,#dc2626)] hover:underline"
              >
                Clear History
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
