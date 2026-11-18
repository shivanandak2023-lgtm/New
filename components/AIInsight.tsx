"use client";

import { useState } from "react";

interface AIInsightProps {
  toolName: string;
  getCalculationSummary: () => string | null;
}

export default function AIInsight({ toolName, getCalculationSummary }: AIInsightProps) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: "ai" | "user"; text: string }[]>([]);

  const fetchInsight = async () => {
    const summary = getCalculationSummary();
    if (!summary) return;

    setLoading(true);
    setInsight("");
    setConversation([]);

    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolName, summary }),
      });
      const data = await res.json();
      const text = data.insight || "Could not generate insight.";
      setInsight(text);
      setConversation([{ role: "ai", text }]);
    } catch {
      setInsight("Failed to get AI insight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    const summary = getCalculationSummary();
    if (!summary) return;

    const userQ = question.trim();
    setQuestion("");
    setAskLoading(true);
    setConversation((prev) => [...prev, { role: "user", text: userQ }]);

    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName,
          summary: `${summary}\n\nPrevious conversation:\n${conversation.map((c) => `${c.role}: ${c.text}`).join("\n")}`,
          question: userQ,
        }),
      });
      const data = await res.json();
      setConversation((prev) => [...prev, { role: "ai", text: data.insight || "No response." }]);
    } catch {
      setConversation((prev) => [...prev, { role: "ai", text: "Failed to respond. Try again." }]);
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {/* Get Insight Button */}
      {!insight && (
        <button
          onClick={fetchInsight}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <span className="text-lg">🤖</span>
              Get AI Insights
            </>
          )}
        </button>
      )}

      {/* Conversation */}
      {conversation.length > 0 && (
        <div className="mt-4 rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 overflow-hidden"
          style={{ background: "var(--card)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="text-white font-semibold text-sm">AI Assistant</span>
            <span className="text-violet-200 text-xs ml-auto">Powered by Gemini</span>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "border rounded-bl-md"
                  }`}
                  style={msg.role === "ai" ? { background: "var(--muted-bg)", color: "var(--foreground)", borderColor: "var(--card-border)" } : {}}
                >
                  {msg.text.split("\n").map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {askLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 rounded-bl-md border" style={{ background: "var(--muted-bg)", borderColor: "var(--card-border)" }}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ask Input */}
          <div className="border-t p-3 flex gap-2" style={{ borderColor: "var(--card-border)" }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !askLoading && askQuestion()}
              placeholder="Ask a follow-up question..."
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              style={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--card-border)" }}
              disabled={askLoading}
            />
            <button
              onClick={askQuestion}
              disabled={askLoading || !question.trim()}
              className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
