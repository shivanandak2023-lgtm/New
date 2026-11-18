const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Try models in order: fastest first, fallback to others
const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.5-flash",
];

export async function getAIInsight(
  toolName: string,
  calculationSummary: string,
  question?: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "AI insights are not configured. Add GEMINI_API_KEY to enable.";
  }

  const prompt = question
    ? `You are a helpful assistant on CalcTools. The user used "${toolName}" and got:\n\n${calculationSummary}\n\nUser asks: "${question}"\n\nGive a helpful, concise answer in 2-3 sentences. Be specific with numbers. No markdown.`
    : `You are a helpful assistant on CalcTools. The user used "${toolName}" and got:\n\n${calculationSummary}\n\nGive 3 brief, practical insights. Each 1 sentence. Format:\n1. [insight]\n2. [insight]\n3. [insight]\n\nBe specific with numbers. Actionable tips. No markdown, no bold.`;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.9,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`Gemini ${model} error:`, err);
        continue; // try next model
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (error) {
      console.error(`Gemini ${model} failed:`, error);
      continue;
    }
  }

  return "AI insight temporarily unavailable. Please try again later.";
}
