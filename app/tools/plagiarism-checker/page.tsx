"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "AI Content Detector & Plagiarism Checker - Free Online Tool",
  description:
    "Free AI content detector and plagiarism checker. Detect if text was written by ChatGPT, Claude, or other AI. Check for plagiarism with Google search verification.",
  keywords:
    "ai content detector, plagiarism checker, ai detector, chatgpt detector, ai writing checker, plagiarism checker free, ai text detector, content originality checker",
};

// Common AI phrases that indicate AI-generated content
const AI_PHRASES = [
  "it's important to note", "it is important to note", "it's worth noting",
  "in conclusion", "in summary", "to summarize",
  "delve into", "delve deeper", "let's delve",
  "it's crucial", "it is crucial", "it's essential", "it is essential",
  "in today's world", "in today's digital", "in today's fast-paced",
  "whether you're a", "whether you are a",
  "here's the thing", "at the end of the day",
  "it's worth mentioning", "it is worth mentioning",
  "on the other hand", "having said that",
  "in this article", "in this blog post", "in this guide",
  "without further ado", "buckle up",
  "game-changer", "game changer",
  "navigate the", "navigating the",
  "landscape of", "ever-evolving", "ever evolving",
  "tapestry of", "myriad of",
  "shed light on", "sheds light on",
  "plays a crucial role", "plays a vital role", "plays an important role",
  "remains to be seen", "stands as a testament",
  "foster a sense of", "cultivate a",
  "embark on", "embarking on",
  "paramount importance", "of utmost importance",
  "holistic approach", "comprehensive approach",
  "leverage the power", "harness the power",
  "multifaceted", "nuanced understanding",
  "a testament to", "underscore the importance",
  "seamlessly integrate", "seamless integration",
  "robust framework", "robust solution",
  "cutting-edge", "state-of-the-art",
  "revolutionize", "revolutionizing",
  "empower individuals", "empower users",
  "dive into", "deep dive",
  "realm of", "in the realm",
  "plethora of", "a myriad",
  "pivotal role", "pivotal moment",
  "resonate with", "resonates with",
  "not only but also", "not only...but also",
  "furthermore", "moreover", "additionally",
  "consequently", "subsequently", "henceforth",
];

// Transition words heavily used by AI
const AI_TRANSITIONS = [
  "furthermore", "moreover", "additionally", "consequently",
  "subsequently", "nevertheless", "nonetheless", "conversely",
  "henceforth", "thereby", "wherein", "whereby", "thereof",
  "notwithstanding", "aforementioned", "whilst",
];

interface AnalysisResult {
  aiScore: number;
  humanScore: number;
  verdict: string;
  verdictColor: string;
  details: {
    label: string;
    score: number;
    maxScore: number;
    description: string;
  }[];
  aiPhrasesFound: string[];
  sentenceLengthVariance: number;
  avgSentenceLength: number;
  vocabularyDiversity: number;
  readabilityScore: number;
  sentences: { text: string; aiProbability: number }[];
}

function analyzeText(text: string): AnalysisResult | null {
  if (!text || text.trim().length < 100) return null;

  const cleanText = text.trim();
  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  const sentences = cleanText
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  if (words.length < 30 || sentences.length < 3) return null;

  const lowerText = cleanText.toLowerCase();
  const details: AnalysisResult["details"] = [];
  let totalAiSignal = 0;

  // 1. AI Phrase Detection (0-30 points)
  const aiPhrasesFound: string[] = [];
  for (const phrase of AI_PHRASES) {
    if (lowerText.includes(phrase) && !aiPhrasesFound.includes(phrase)) {
      aiPhrasesFound.push(phrase);
    }
  }
  const phraseScore = Math.min(30, aiPhrasesFound.length * 5);
  totalAiSignal += phraseScore;
  details.push({
    label: "AI Phrases Detected",
    score: phraseScore,
    maxScore: 30,
    description: `Found ${aiPhrasesFound.length} common AI phrases`,
  });

  // 2. Sentence Length Uniformity (0-20 points)
  // AI writes uniform sentences; humans vary more
  const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance =
    sentenceLengths.reduce((sum, l) => sum + Math.pow(l - avgLen, 2), 0) /
    sentenceLengths.length;
  const stdDev = Math.sqrt(variance);
  const coeffOfVariation = stdDev / avgLen;
  // Low CoV = uniform (AI-like), High CoV = varied (human-like)
  const uniformityScore = coeffOfVariation < 0.3 ? 20 : coeffOfVariation < 0.4 ? 15 : coeffOfVariation < 0.5 ? 10 : coeffOfVariation < 0.6 ? 5 : 0;
  totalAiSignal += uniformityScore;
  details.push({
    label: "Sentence Uniformity",
    score: uniformityScore,
    maxScore: 20,
    description: coeffOfVariation < 0.4 ? "Very uniform sentence lengths (AI-like)" : coeffOfVariation < 0.6 ? "Moderately uniform sentences" : "Natural variation in sentence length (human-like)",
  });

  // 3. Vocabulary Diversity (0-15 points)
  // AI tends to use more diverse vocabulary uniformly
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, "")).filter((w) => w.length > 3));
  const vocabularyDiversity = uniqueWords.size / words.length;
  // Very high diversity with formal words = AI
  const diversityScore = vocabularyDiversity > 0.65 ? 15 : vocabularyDiversity > 0.55 ? 10 : vocabularyDiversity > 0.45 ? 5 : 0;
  totalAiSignal += diversityScore;
  details.push({
    label: "Vocabulary Pattern",
    score: diversityScore,
    maxScore: 15,
    description: vocabularyDiversity > 0.6 ? "High formal vocabulary diversity (AI-like)" : "Natural vocabulary pattern",
  });

  // 4. Transition Word Overuse (0-15 points)
  const transitionCount = AI_TRANSITIONS.filter((t) =>
    lowerText.includes(t)
  ).length;
  const transitionScore = Math.min(15, transitionCount * 3);
  totalAiSignal += transitionScore;
  details.push({
    label: "Formal Transitions",
    score: transitionScore,
    maxScore: 15,
    description: `Found ${transitionCount} formal transition words`,
  });

  // 5. Paragraph Structure (0-10 points)
  // AI often writes well-structured paragraphs of similar length
  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 20);
  let structureScore = 0;
  if (paragraphs.length >= 3) {
    const paraLengths = paragraphs.map((p) => p.split(/\s+/).length);
    const paraAvg = paraLengths.reduce((a, b) => a + b, 0) / paraLengths.length;
    const paraVariance = paraLengths.reduce((sum, l) => sum + Math.pow(l - paraAvg, 2), 0) / paraLengths.length;
    const paraCoV = Math.sqrt(paraVariance) / paraAvg;
    structureScore = paraCoV < 0.3 ? 10 : paraCoV < 0.5 ? 5 : 0;
  }
  totalAiSignal += structureScore;
  details.push({
    label: "Paragraph Structure",
    score: structureScore,
    maxScore: 10,
    description: structureScore > 5 ? "Very uniform paragraph lengths (AI-like)" : "Natural paragraph variation",
  });

  // 6. Readability / Formality (0-10 points)
  // AI text tends to be more formal and readable
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  const longWords = words.filter((w) => w.length > 8).length;
  const longWordRatio = longWords / words.length;
  const formalityScore = longWordRatio > 0.15 && avgWordLength > 5.5 ? 10 : longWordRatio > 0.1 ? 5 : 0;
  totalAiSignal += formalityScore;
  details.push({
    label: "Formality Level",
    score: formalityScore,
    maxScore: 10,
    description: formalityScore > 5 ? "Highly formal language (AI-like)" : "Natural formality level",
  });

  // Calculate final scores
  const maxPossible = 100;
  const aiScore = Math.min(100, Math.round((totalAiSignal / maxPossible) * 100));
  const humanScore = 100 - aiScore;

  let verdict: string;
  let verdictColor: string;
  if (aiScore >= 75) {
    verdict = "Likely AI-Generated";
    verdictColor = "text-red-600";
  } else if (aiScore >= 50) {
    verdict = "Mixed — Possibly AI-Assisted";
    verdictColor = "text-amber-600";
  } else if (aiScore >= 25) {
    verdict = "Mostly Human-Written";
    verdictColor = "text-blue-600";
  } else {
    verdict = "Likely Human-Written";
    verdictColor = "text-green-600";
  }

  // Per-sentence analysis
  const sentenceAnalysis = sentences.slice(0, 20).map((s) => {
    let prob = 0;
    const sLower = s.toLowerCase();
    // Check for AI phrases in sentence
    for (const phrase of AI_PHRASES) {
      if (sLower.includes(phrase)) { prob += 25; break; }
    }
    // Check sentence length (very average = AI-like)
    const sWords = s.split(/\s+/).length;
    if (sWords >= 15 && sWords <= 25) prob += 15;
    // Check for formal transitions
    for (const t of AI_TRANSITIONS) {
      if (sLower.startsWith(t) || sLower.includes(`, ${t}`)) { prob += 20; break; }
    }
    // Long formal words
    const formalWords = s.split(/\s+/).filter((w) => w.length > 10).length;
    if (formalWords >= 2) prob += 15;

    return { text: s, aiProbability: Math.min(100, prob) };
  });

  return {
    aiScore,
    humanScore,
    verdict,
    verdictColor,
    details,
    aiPhrasesFound,
    sentenceLengthVariance: coeffOfVariation,
    avgSentenceLength: avgLen,
    vocabularyDiversity,
    readabilityScore: avgWordLength,
    sentences: sentenceAnalysis,
  };
}

function generateGoogleSearchUrl(sentence: string): string {
  const query = encodeURIComponent(`"${sentence.slice(0, 100)}"`);
  return `https://www.google.com/search?q=${query}`;
}

export default function PlagiarismCheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"ai" | "plagiarism">("ai");
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (text.trim().length < 100) return;
    setAnalyzing(true);
    // Simulate analysis delay for UX
    setTimeout(() => {
      setResult(analyzeText(text));
      setAnalyzing(false);
    }, 1500);
  };

  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 10);

  return (
    <>
      
        <title>{`${META.title} | ${SITE_NAME}`}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/plagiarism-checker`} />
      

      <div className="max-w-5xl mx-auto px-4 py-8">
        <a href="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">← All Tools</a>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Content Detector & Plagiarism Checker
        </h1>
        <p className="text-gray-600 mb-6">
          Detect AI-generated content (ChatGPT, Claude, Gemini) and check for plagiarism — completely free.
        </p>

        {/* Ad placeholder */}
        <div className="ad-placeholder mb-6">Ad Space</div>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "ai"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🤖 AI Content Detector
          </button>
          <button
            onClick={() => setActiveTab("plagiarism")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "plagiarism"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🔍 Plagiarism Checker
          </button>
        </div>

        {/* Text Input */}
        <div className="tool-card mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Paste your text below (minimum 100 characters)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-y"
            placeholder="Paste the text you want to check here..."
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {wordCount} words • {text.length} characters • {sentences.length} sentences
            </span>
            <button
              onClick={handleAnalyze}
              disabled={text.trim().length < 100 || analyzing}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                `${activeTab === "ai" ? "🤖 Detect AI Content" : "🔍 Check Plagiarism"}`
              )}
            </button>
          </div>
        </div>

        {/* AI Detection Results */}
        {result && activeTab === "ai" && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="tool-card">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-gray-900 mb-1">{result.aiScore}%</div>
                <div className={`text-xl font-bold ${result.verdictColor}`}>
                  {result.verdict}
                </div>
              </div>

              {/* Score Bar */}
              <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 transition-all duration-1000"
                  style={{ width: "100%" }}
                />
                <div
                  className="absolute top-0 h-full w-1 bg-white border-2 border-gray-800 rounded-full transition-all duration-1000"
                  style={{ left: `${result.aiScore}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold text-white">
                  <span>Human</span>
                  <span>AI</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">{result.humanScore}%</div>
                  <div className="text-sm text-green-600">Human-Written</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">{result.aiScore}%</div>
                  <div className="text-sm text-red-600">AI-Generated</div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="tool-card">
              <h3 className="font-bold text-gray-900 mb-4">Detailed Analysis</h3>
              <div className="space-y-3">
                {result.details.map((d, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{d.label}</span>
                      <span className="text-sm text-gray-500">{d.score}/{d.maxScore}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          d.score / d.maxScore > 0.6 ? "bg-red-500" : d.score / d.maxScore > 0.3 ? "bg-amber-500" : "bg-green-500"
                        }`}
                        style={{ width: `${(d.score / d.maxScore) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Phrases Found */}
            {result.aiPhrasesFound.length > 0 && (
              <div className="tool-card">
                <h3 className="font-bold text-gray-900 mb-3">
                  AI Phrases Found ({result.aiPhrasesFound.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.aiPhrasesFound.map((phrase, i) => (
                    <span
                      key={i}
                      className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      &ldquo;{phrase}&rdquo;
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sentence-by-Sentence Analysis */}
            <div className="tool-card">
              <h3 className="font-bold text-gray-900 mb-3">Sentence Analysis</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {result.sentences.map((s, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-sm ${
                      s.aiProbability >= 50
                        ? "bg-red-50 border-red-200"
                        : s.aiProbability >= 25
                          ? "bg-amber-50 border-amber-200"
                          : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${
                        s.aiProbability >= 50 ? "text-red-600" : s.aiProbability >= 25 ? "text-amber-600" : "text-green-600"
                      }`}>
                        {s.aiProbability >= 50 ? "🤖 Likely AI" : s.aiProbability >= 25 ? "⚠️ Possibly AI" : "✅ Likely Human"}
                      </span>
                      <span className="text-xs text-gray-400">{s.aiProbability}% AI</span>
                    </div>
                    <p className="text-gray-700">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Stats */}
            <div className="tool-card">
              <h3 className="font-bold text-gray-900 mb-3">Text Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">{result.avgSentenceLength.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Avg Words/Sentence</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">{(result.sentenceLengthVariance * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">Sentence Variation</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">{(result.vocabularyDiversity * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">Vocabulary Diversity</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">{result.readabilityScore.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Avg Word Length</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plagiarism Check Results */}
        {result && activeTab === "plagiarism" && (
          <div className="tool-card">
            <h3 className="font-bold text-gray-900 mb-2">Plagiarism Check — Google Verification</h3>
            <p className="text-sm text-gray-500 mb-4">
              Click on any sentence to search Google for exact matches. Sentences found online may be plagiarized.
            </p>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {sentences.slice(0, 30).map((sentence, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <span className="text-xs font-bold text-gray-400 mt-1 shrink-0 w-6">
                    {i + 1}.
                  </span>
                  <p className="text-sm text-gray-700 flex-1">{sentence}</p>
                  <a
                    href={generateGoogleSearchUrl(sentence)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    🔍 Check
                  </a>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Each &ldquo;Check&rdquo; button searches Google for the exact sentence in quotes.
              If Google finds matches, the content may be plagiarized from those sources.
            </p>
          </div>
        )}

        {/* Ad placeholder */}
        <div className="ad-placeholder my-8">Ad Space</div>

        {/* SEO Content */}
        <div className="seo-content">
          <h2>Free AI Content Detector & Plagiarism Checker</h2>
          <p>
            Our AI content detector uses advanced text analysis to identify content written by
            ChatGPT, Claude, Gemini, and other AI language models. The tool analyzes multiple
            signals including sentence structure patterns, vocabulary diversity, common AI phrases,
            and writing formality to determine if text is AI-generated or human-written.
          </p>

          <h3>How Does AI Detection Work?</h3>
          <p>
            AI-generated text has distinctive patterns that differ from human writing. Our detector
            analyzes six key signals:
          </p>
          <ul>
            <li><strong>AI Phrase Detection</strong> — Identifies over 60 phrases commonly used by AI models like &ldquo;it&apos;s important to note&rdquo; and &ldquo;delve into&rdquo;</li>
            <li><strong>Sentence Uniformity</strong> — AI tends to write sentences of similar length, while humans naturally vary</li>
            <li><strong>Vocabulary Diversity</strong> — Analyzes the ratio of unique words to total words</li>
            <li><strong>Formal Transitions</strong> — Detects overuse of formal transition words like &ldquo;furthermore&rdquo; and &ldquo;moreover&rdquo;</li>
            <li><strong>Paragraph Structure</strong> — Checks if paragraphs are unnaturally uniform in length</li>
            <li><strong>Formality Level</strong> — Measures overall text formality and word complexity</li>
          </ul>

          <h3>Plagiarism Checker</h3>
          <p>
            The plagiarism checker breaks your text into individual sentences and lets you verify
            each one against Google Search. Click the &ldquo;Check&rdquo; button next to any sentence to search
            for exact matches online. This helps you identify content that may have been copied
            from other websites.
          </p>

          <h3>Who Should Use This Tool?</h3>
          <ul>
            <li><strong>Teachers & Professors</strong> — Check student submissions for AI-generated content</li>
            <li><strong>Content Editors</strong> — Verify that freelance articles are original and human-written</li>
            <li><strong>Students</strong> — Self-check your work before submission</li>
            <li><strong>SEO Professionals</strong> — Ensure content quality and originality</li>
            <li><strong>Publishers</strong> — Screen submissions for AI content and plagiarism</li>
          </ul>

          <h3>Accuracy Disclaimer</h3>
          <p>
            This tool uses heuristic analysis and pattern matching. While it provides a good
            indication of AI content, no detector is 100% accurate. Use the results as a guide
            alongside your own judgment. Heavily edited AI content may score lower, and some
            formal human writing may score higher.
          </p>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: META.title,
              description: META.description,
              url: `${SITE_URL}/tools/plagiarism-checker`,
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </div>
    </>
  );
}
