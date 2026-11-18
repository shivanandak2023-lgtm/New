"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Translation Helper - Translate Text Online Free",
  description:
    "Free Translation Helper tool. Quick links to Google Translate, DeepL, and Bing Translate with your text pre-filled. Plus a common phrases reference table.",
  keywords: "translate text, translation helper, google translate, deepl, bing translate, common phrases, language translation",
};

const PHRASES: { english: string; spanish: string; french: string; hindi: string; japanese: string }[] = [
  { english: "Hello", spanish: "Hola", french: "Bonjour", hindi: "\u0928\u092E\u0938\u094D\u0924\u0947", japanese: "\u3053\u3093\u306B\u3061\u306F" },
  { english: "Good morning", spanish: "Buenos d\u00EDas", french: "Bonjour", hindi: "\u0938\u0941\u092A\u094D\u0930\u092D\u093E\u0924", japanese: "\u304A\u306F\u3088\u3046\u3054\u3056\u3044\u307E\u3059" },
  { english: "Good night", spanish: "Buenas noches", french: "Bonne nuit", hindi: "\u0936\u0941\u092D \u0930\u093E\u0924\u094D\u0930\u093F", japanese: "\u304A\u3084\u3059\u307F\u306A\u3055\u3044" },
  { english: "Thank you", spanish: "Gracias", french: "Merci", hindi: "\u0927\u0928\u094D\u092F\u0935\u093E\u0926", japanese: "\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059" },
  { english: "Please", spanish: "Por favor", french: "S'il vous pla\u00EEt", hindi: "\u0915\u0943\u092A\u092F\u093E", japanese: "\u304A\u306D\u304C\u3044\u3057\u307E\u3059" },
  { english: "Yes", spanish: "S\u00ED", french: "Oui", hindi: "\u0939\u093E\u0901", japanese: "\u306F\u3044" },
  { english: "No", spanish: "No", french: "Non", hindi: "\u0928\u0939\u0940\u0902", japanese: "\u3044\u3044\u3048" },
  { english: "Excuse me", spanish: "Perd\u00F3n", french: "Excusez-moi", hindi: "\u092E\u093E\u092B\u093C \u0915\u0940\u091C\u093F\u090F", japanese: "\u3059\u307F\u307E\u305B\u3093" },
  { english: "I'm sorry", spanish: "Lo siento", french: "Je suis d\u00E9sol\u00E9", hindi: "\u092E\u0941\u091D\u0947 \u0916\u0947\u0926 \u0939\u0948", japanese: "\u3054\u3081\u3093\u306A\u3055\u3044" },
  { english: "How are you?", spanish: "\u00BFC\u00F3mo est\u00E1s?", french: "Comment allez-vous?", hindi: "\u0906\u092A \u0915\u0948\u0938\u0947 \u0939\u0948\u0902?", japanese: "\u304A\u5143\u6C17\u3067\u3059\u304B?" },
  { english: "My name is...", spanish: "Me llamo...", french: "Je m'appelle...", hindi: "\u092E\u0947\u0930\u093E \u0928\u093E\u092E ... \u0939\u0948", japanese: "\u79C1\u306E\u540D\u524D\u306F..." },
  { english: "I don't understand", spanish: "No entiendo", french: "Je ne comprends pas", hindi: "\u092E\u0941\u091D\u0947 \u0938\u092E\u091D \u0928\u0939\u0940\u0902 \u0906\u092F\u093E", japanese: "\u308F\u304B\u308A\u307E\u305B\u3093" },
  { english: "Where is...?", spanish: "\u00BFD\u00F3nde est\u00E1...?", french: "O\u00F9 est...?", hindi: "...\u0915\u0939\u093E\u0901 \u0939\u0948?", japanese: "...\u306F\u3069\u3053\u3067\u3059\u304B?" },
  { english: "How much?", spanish: "\u00BFCu\u00E1nto cuesta?", french: "Combien?", hindi: "\u0915\u093F\u0924\u0928\u093E?", japanese: "\u3044\u304F\u3089\u3067\u3059\u304B?" },
  { english: "Help!", spanish: "\u00A1Ayuda!", french: "Au secours!", hindi: "\u092E\u0926\u0926!", japanese: "\u52A9\u3051\u3066!" },
  { english: "Goodbye", spanish: "Adi\u00F3s", french: "Au revoir", hindi: "\u0905\u0932\u0935\u093F\u0926\u093E", japanese: "\u3055\u3088\u3046\u306A\u3089" },
  { english: "I love you", spanish: "Te quiero", french: "Je t'aime", hindi: "\u092E\u0948\u0902 \u0924\u0941\u092E\u0938\u0947 \u092A\u094D\u092F\u093E\u0930 \u0915\u0930\u0924\u093E/\u0915\u0930\u0924\u0940 \u0939\u0942\u0901", japanese: "\u611B\u3057\u3066\u3044\u307E\u3059" },
  { english: "Water", spanish: "Agua", french: "Eau", hindi: "\u092A\u093E\u0928\u0940", japanese: "\u6C34" },
  { english: "Food", spanish: "Comida", french: "Nourriture", hindi: "\u0916\u093E\u0928\u093E", japanese: "\u98DF\u3079\u7269" },
  { english: "Bathroom", spanish: "Ba\u00F1o", french: "Toilettes", hindi: "\u0936\u094C\u091A\u093E\u0932\u092F", japanese: "\u30C8\u30A4\u30EC" },
];

export default function TranslateTextPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const encodedText = encodeURIComponent(text);

  const translationLinks = [
    { name: "Google Translate", url: `https://translate.google.com/?sl=auto&tl=en&text=${encodedText}`, color: "bg-blue-600" },
    { name: "DeepL Translate", url: `https://www.deepl.com/translator#auto/en/${encodedText}`, color: "bg-indigo-600" },
    { name: "Bing Translate", url: `https://www.bing.com/translator?from=&to=en&text=${encodedText}`, color: "bg-teal-600" },
  ];

  const handleCopy = (t: string) => {
    navigator.clipboard.writeText(t).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/translate-text`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Translation Helper</h1>
        <p className="text-[var(--muted)] mb-8">
          Enter your text below and quickly open it in Google Translate, DeepL, or Bing Translate. Plus, browse common phrases in 5 languages.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-medium mb-2">Enter Text to Translate</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field min-h-[120px] resize-y text-sm"
            placeholder="Type or paste the text you want to translate..."
          />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-[var(--muted)]">{text.length} characters</span>
            {text && (
              <button onClick={() => handleCopy(text)} className="text-xs text-[var(--primary)] hover:underline">
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
        </div>

        {text.trim() && (
          <div className="tool-card mb-8">
            <label className="block text-sm font-medium mb-3">Open in Translation Service</label>
            <div className="flex flex-wrap gap-3">
              {translationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${link.color} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
                >
                  {link.name} &rarr;
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="tool-card mb-8">
          <h2 className="text-xl font-bold mb-4">Common Phrases Reference</h2>
          <p className="text-sm text-[var(--muted)] mb-4">Quick reference for essential phrases in 5 languages.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3 font-semibold">English</th>
                  <th className="text-left py-2 px-3 font-semibold">Spanish</th>
                  <th className="text-left py-2 px-3 font-semibold">French</th>
                  <th className="text-left py-2 px-3 font-semibold">Hindi</th>
                  <th className="text-left py-2 px-3 font-semibold">Japanese</th>
                </tr>
              </thead>
              <tbody>
                {PHRASES.map((p, i) => (
                  <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)]">
                    <td className="py-2 px-3">{p.english}</td>
                    <td className="py-2 px-3">{p.spanish}</td>
                    <td className="py-2 px-3">{p.french}</td>
                    <td className="py-2 px-3">{p.hindi}</td>
                    <td className="py-2 px-3">{p.japanese}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Translation Helper Tool</h2>
          <p>
            This tool helps you translate text by providing quick links to the best free translation services:
            Google Translate, DeepL, and Bing Translate. Your text is pre-filled in the URL so you can translate instantly.
          </p>

          <h2>Common Phrases Reference</h2>
          <p>
            The phrases table above includes 20 essential phrases translated into Spanish, French, Hindi, and Japanese.
            These cover greetings, politeness, directions, emergencies, and everyday conversation.
          </p>

          <h2>Tips for Better Translations</h2>
          <ul>
            <li><strong>Use simple sentences:</strong> Short, clear sentences translate more accurately</li>
            <li><strong>Check multiple services:</strong> Compare results from Google, DeepL, and Bing for best accuracy</li>
            <li><strong>Context matters:</strong> Provide full sentences rather than isolated words when possible</li>
            <li><strong>DeepL for European languages:</strong> DeepL often provides more natural-sounding translations for European languages</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Translation Helper",
            description: META.description,
            url: `${SITE_URL}/tools/translate-text`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
