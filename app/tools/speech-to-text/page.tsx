"use client";

import { useState, useEffect, useRef } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Speech to Text - Voice to Text Converter Online Free",
  description:
    "Free online Speech to Text converter. Record your voice and get a real-time transcript. Supports multiple languages. Copy or download your transcript.",
  keywords: "speech to text, voice to text, speech recognition, dictation, voice typing, transcribe audio",
};

const LANGUAGES = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "hi-IN", name: "Hindi" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "it-IT", name: "Italian" },
  { code: "ru-RU", name: "Russian" },
  { code: "ar-SA", name: "Arabic" },
];

export default function SpeechToTextPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [supported, setSupported] = useState(true);
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createRecognition(): any {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    return new SR();
  }

  useEffect(() => {
    const r = createRecognition();
    if (!r) setSupported(false);
  }, []);

  const startRecording = () => {
    const recognition = createRecognition();
    if (!recognition) return;

    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t + " ";
        } else {
          interim += t;
        }
      }
      if (final) setTranscript((prev) => prev + final);
      setInterimText(interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setInterimText("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadAsText = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/speech-to-text`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Speech to Text</h1>
        <p className="text-[var(--muted)] mb-8">
          Record your voice and get a real-time transcript. Supports multiple languages.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {!supported ? (
          <div className="tool-card mb-8 text-center py-8">
            <p className="text-lg font-semibold mb-2">Speech Recognition Not Supported</p>
            <p className="text-sm text-[var(--muted)]">
              Your browser does not support the Web Speech API. Please try Chrome, Edge, or Safari.
            </p>
          </div>
        ) : (
          <>
            <div className="tool-card mb-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-field text-sm"
                    disabled={isRecording}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1" />
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={isRecording ? "btn-secondary text-sm" : "btn-primary text-sm"}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  Recording...
                </div>
              )}
            </div>

            <div className="tool-card mb-6">
              <label className="block text-sm font-medium mb-2">Transcript</label>
              <div className="input-field min-h-[200px] p-4 text-sm whitespace-pre-wrap">
                {transcript}
                {interimText && <span className="text-[var(--muted)] italic">{interimText}</span>}
                {!transcript && !interimText && (
                  <span className="text-[var(--muted)]">Your transcript will appear here...</span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={copyToClipboard}
                  className="btn-primary text-sm"
                  disabled={!transcript}
                >
                  {copied ? "Copied!" : "Copy Transcript"}
                </button>
                <button
                  onClick={downloadAsText}
                  className="btn-secondary text-sm"
                  disabled={!transcript}
                >
                  Download as .txt
                </button>
                <button
                  onClick={() => { setTranscript(""); setInterimText(""); }}
                  className="btn-secondary text-sm"
                  disabled={!transcript}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="tool-card mb-8">
              <p className="text-sm text-[var(--muted)]">
                Word count: <strong>{transcript.trim() ? transcript.trim().split(/\s+/).length : 0}</strong> |
                Character count: <strong>{transcript.length}</strong>
              </p>
            </div>
          </>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Speech to Text?</h2>
          <p>
            Speech to Text converts your spoken words into written text in real-time using the Web Speech API
            built into your browser. No files are uploaded to any server.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Real-time Transcription:</strong> See your words appear as you speak</li>
            <li><strong>Multiple Languages:</strong> Support for 13+ languages including English, Spanish, Hindi, and more</li>
            <li><strong>Copy &amp; Download:</strong> Copy your transcript to clipboard or download as a text file</li>
            <li><strong>Privacy:</strong> All processing happens locally in your browser</li>
          </ul>

          <h2>Tips for Best Results</h2>
          <p>
            Speak clearly and at a moderate pace. Use a quiet environment for best accuracy. Chrome and Edge
            typically provide the best speech recognition results.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Speech to Text",
            description: META.description,
            url: `${SITE_URL}/tools/speech-to-text`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
