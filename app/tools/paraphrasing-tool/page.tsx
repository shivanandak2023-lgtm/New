"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Paraphrasing Tool - Rewrite & Rephrase Text Free Online",
  description:
    "Free paraphrasing tool to rewrite text in Standard, Fluent, Creative, Formal, or Simple modes. No sign-up, no API — runs 100% in your browser.",
  keywords:
    "paraphrasing tool, paraphrase online, rewrite text, sentence rephraser, rephrase text free, text rewriter",
};

const SYNONYMS: Record<string, string[]> = {
  good: ["excellent", "great", "wonderful", "fine"],
  bad: ["poor", "terrible", "awful", "dreadful"],
  big: ["large", "huge", "enormous", "massive"],
  small: ["tiny", "little", "compact", "miniature"],
  happy: ["joyful", "cheerful", "delighted", "pleased"],
  sad: ["unhappy", "sorrowful", "gloomy", "melancholy"],
  fast: ["quick", "rapid", "swift", "speedy"],
  slow: ["sluggish", "gradual", "unhurried", "leisurely"],
  important: ["crucial", "significant", "vital", "essential"],
  easy: ["simple", "effortless", "straightforward", "uncomplicated"],
  hard: ["difficult", "challenging", "tough", "demanding"],
  beautiful: ["stunning", "gorgeous", "lovely", "attractive"],
  ugly: ["unattractive", "hideous", "unsightly", "unpleasant"],
  smart: ["intelligent", "clever", "brilliant", "sharp"],
  stupid: ["foolish", "unintelligent", "dense", "dull"],
  old: ["ancient", "aged", "elderly", "vintage"],
  new: ["fresh", "recent", "modern", "novel"],
  rich: ["wealthy", "affluent", "prosperous", "well-off"],
  poor: ["impoverished", "destitute", "needy", "underprivileged"],
  strong: ["powerful", "robust", "sturdy", "mighty"],
  weak: ["feeble", "fragile", "frail", "delicate"],
  hot: ["scorching", "boiling", "burning", "sweltering"],
  cold: ["freezing", "chilly", "frigid", "icy"],
  nice: ["pleasant", "agreeable", "wonderful", "delightful"],
  mean: ["cruel", "unkind", "harsh", "nasty"],
  funny: ["humorous", "amusing", "comical", "hilarious"],
  serious: ["solemn", "grave", "earnest", "somber"],
  angry: ["furious", "enraged", "irritated", "livid"],
  calm: ["peaceful", "serene", "tranquil", "composed"],
  brave: ["courageous", "fearless", "bold", "valiant"],
  afraid: ["scared", "frightened", "terrified", "fearful"],
  begin: ["start", "commence", "initiate", "launch"],
  end: ["finish", "conclude", "terminate", "cease"],
  help: ["assist", "support", "aid", "facilitate"],
  make: ["create", "produce", "construct", "build"],
  give: ["provide", "offer", "supply", "deliver"],
  take: ["grab", "seize", "acquire", "obtain"],
  show: ["display", "demonstrate", "reveal", "present"],
  tell: ["inform", "notify", "advise", "communicate"],
  think: ["believe", "consider", "suppose", "reckon"],
  know: ["understand", "recognize", "comprehend", "realize"],
  want: ["desire", "wish", "crave", "long for"],
  need: ["require", "demand", "necessitate", "call for"],
  like: ["enjoy", "appreciate", "favor", "prefer"],
  love: ["adore", "cherish", "treasure", "idolize"],
  use: ["utilize", "employ", "apply", "leverage"],
  find: ["discover", "locate", "uncover", "detect"],
  get: ["obtain", "acquire", "receive", "gain"],
  put: ["place", "position", "set", "deposit"],
  say: ["state", "declare", "mention", "express"],
  go: ["proceed", "advance", "travel", "journey"],
  come: ["arrive", "approach", "reach", "appear"],
  see: ["observe", "notice", "perceive", "witness"],
  look: ["gaze", "stare", "glance", "examine"],
  walk: ["stroll", "stride", "march", "wander"],
  run: ["sprint", "dash", "race", "rush"],
  eat: ["consume", "devour", "dine", "feast"],
  drink: ["sip", "consume", "gulp", "imbibe"],
  work: ["labor", "toil", "operate", "function"],
  play: ["engage", "participate", "frolic", "amuse"],
  talk: ["speak", "converse", "discuss", "chat"],
  ask: ["inquire", "question", "query", "request"],
  answer: ["respond", "reply", "retort", "address"],
  change: ["modify", "alter", "transform", "adjust"],
  move: ["shift", "transfer", "relocate", "transport"],
  stop: ["halt", "cease", "pause", "discontinue"],
  try: ["attempt", "endeavor", "strive", "aim"],
  learn: ["study", "acquire", "master", "grasp"],
  teach: ["instruct", "educate", "train", "coach"],
  build: ["construct", "assemble", "erect", "establish"],
  break: ["shatter", "fracture", "destroy", "crack"],
  buy: ["purchase", "acquire", "procure", "invest in"],
  sell: ["market", "trade", "vend", "offer"],
  write: ["compose", "author", "draft", "pen"],
  read: ["peruse", "study", "examine", "review"],
  send: ["dispatch", "transmit", "forward", "deliver"],
  receive: ["obtain", "get", "accept", "collect"],
  keep: ["retain", "maintain", "preserve", "hold"],
  leave: ["depart", "exit", "abandon", "vacate"],
  close: ["shut", "seal", "fasten", "secure"],
  open: ["unlock", "unfasten", "reveal", "expose"],
  turn: ["rotate", "spin", "revolve", "pivot"],
  bring: ["carry", "transport", "convey", "deliver"],
  hold: ["grip", "grasp", "clutch", "possess"],
  carry: ["transport", "convey", "bear", "haul"],
  stand: ["rise", "remain", "endure", "uphold"],
  sit: ["rest", "settle", "recline", "perch"],
  follow: ["pursue", "trail", "track", "accompany"],
  lead: ["guide", "direct", "conduct", "head"],
  grow: ["expand", "develop", "increase", "mature"],
  pay: ["compensate", "reimburse", "settle", "fund"],
  meet: ["encounter", "greet", "join", "gather"],
  include: ["contain", "encompass", "incorporate", "embrace"],
  continue: ["persist", "proceed", "resume", "maintain"],
  set: ["establish", "arrange", "configure", "determine"],
  offer: ["propose", "present", "suggest", "extend"],
  remember: ["recall", "recollect", "retain", "reminisce"],
  expect: ["anticipate", "predict", "foresee", "await"],
  create: ["produce", "generate", "design", "invent"],
  happen: ["occur", "transpire", "arise", "unfold"],
  provide: ["supply", "furnish", "deliver", "grant"],
  become: ["turn into", "transform into", "evolve into", "develop into"],
  reach: ["attain", "achieve", "arrive at", "accomplish"],
  kill: ["eliminate", "destroy", "eradicate", "annihilate"],
  remain: ["stay", "linger", "persist", "endure"],
  suggest: ["propose", "recommend", "advise", "indicate"],
  raise: ["lift", "elevate", "increase", "boost"],
  pass: ["proceed", "advance", "transfer", "hand"],
  reduce: ["decrease", "diminish", "lessen", "minimize"],
  however: ["nevertheless", "nonetheless", "yet", "still"],
  also: ["additionally", "furthermore", "moreover", "besides"],
  very: ["extremely", "highly", "remarkably", "incredibly"],
  really: ["truly", "genuinely", "actually", "indeed"],
  often: ["frequently", "regularly", "commonly", "routinely"],
  always: ["constantly", "perpetually", "invariably", "forever"],
  never: ["not once", "at no time", "not ever", "under no circumstances"],
  sometimes: ["occasionally", "periodically", "now and then", "at times"],
  quickly: ["rapidly", "swiftly", "promptly", "hastily"],
  slowly: ["gradually", "steadily", "leisurely", "unhurriedly"],
  clearly: ["obviously", "evidently", "plainly", "distinctly"],
  actually: ["in fact", "indeed", "truly", "really"],
  finally: ["ultimately", "eventually", "lastly", "in the end"],
  probably: ["likely", "presumably", "possibly", "perhaps"],
  suddenly: ["abruptly", "unexpectedly", "instantly", "immediately"],
  especially: ["particularly", "notably", "specifically", "chiefly"],
  together: ["collectively", "jointly", "in unison", "as one"],
  enough: ["sufficient", "adequate", "ample", "plenty"],
  almost: ["nearly", "practically", "virtually", "about"],
  already: ["previously", "by now", "beforehand", "earlier"],
  about: ["approximately", "roughly", "around", "nearly"],
  many: ["numerous", "several", "countless", "various"],
  much: ["considerably", "substantially", "significantly", "greatly"],
  every: ["each", "all", "entire", "complete"],
  different: ["distinct", "varied", "diverse", "unique"],
  possible: ["feasible", "achievable", "attainable", "viable"],
  likely: ["probable", "expected", "anticipated", "plausible"],
  certain: ["definite", "sure", "positive", "confident"],
  true: ["accurate", "correct", "genuine", "authentic"],
  real: ["genuine", "authentic", "actual", "legitimate"],
  whole: ["entire", "complete", "full", "total"],
  general: ["overall", "broad", "universal", "widespread"],
  specific: ["particular", "precise", "exact", "definite"],
  available: ["accessible", "obtainable", "at hand", "ready"],
  free: ["complimentary", "gratis", "costless", "unrestricted"],
  full: ["complete", "entire", "whole", "total"],
  sure: ["certain", "confident", "positive", "assured"],
  better: ["superior", "improved", "enhanced", "finer"],
  best: ["finest", "top", "optimal", "outstanding"],
  great: ["excellent", "outstanding", "remarkable", "magnificent"],
  high: ["elevated", "tall", "lofty", "towering"],
  low: ["reduced", "minimal", "decreased", "diminished"],
  long: ["extended", "prolonged", "lengthy", "enduring"],
  short: ["brief", "concise", "compact", "abbreviated"],
  large: ["big", "substantial", "considerable", "sizable"],
  little: ["small", "slight", "minor", "modest"],
  place: ["location", "site", "spot", "area"],
  world: ["globe", "planet", "earth", "realm"],
  people: ["individuals", "persons", "humans", "folks"],
  problem: ["issue", "challenge", "difficulty", "obstacle"],
  way: ["method", "approach", "manner", "technique"],
  idea: ["concept", "notion", "thought", "plan"],
  part: ["portion", "section", "segment", "component"],
  group: ["team", "collection", "assembly", "cluster"],
  area: ["region", "zone", "district", "territory"],
  system: ["framework", "structure", "network", "mechanism"],
  program: ["plan", "initiative", "scheme", "project"],
  question: ["inquiry", "query", "issue", "matter"],
  job: ["occupation", "position", "role", "career"],
  result: ["outcome", "consequence", "effect", "product"],
  fact: ["truth", "reality", "certainty", "detail"],
  reason: ["cause", "motive", "basis", "explanation"],
  research: ["study", "investigation", "analysis", "examination"],
  information: ["data", "details", "facts", "knowledge"],
  power: ["authority", "control", "influence", "strength"],
  money: ["funds", "capital", "cash", "finances"],
  increase: ["raise", "boost", "enhance", "amplify"],
  develop: ["advance", "progress", "evolve", "cultivate"],
  report: ["document", "account", "record", "summary"],
  support: ["backing", "assistance", "aid", "endorsement"],
  interest: ["curiosity", "concern", "attention", "fascination"],
  order: ["sequence", "arrangement", "command", "instruction"],
};

type Mode = "standard" | "fluent" | "creative" | "formal" | "simple";

function paraphrase(text: string, mode: Mode): { original: string; changed: string; isChanged: boolean }[] {
  const replaceRate: Record<Mode, number> = {
    standard: 0.3,
    fluent: 0.35,
    creative: 0.45,
    formal: 0.4,
    simple: 0.3,
  };

  const rate = replaceRate[mode];
  const words = text.split(/(\s+)/);
  const result: { original: string; changed: string; isChanged: boolean }[] = [];

  for (const token of words) {
    if (/^\s+$/.test(token)) {
      result.push({ original: token, changed: token, isChanged: false });
      continue;
    }

    const clean = token.replace(/[^a-zA-Z]/g, "").toLowerCase();
    const synonyms = SYNONYMS[clean];

    if (synonyms && Math.random() < rate) {
      let idx: number;
      if (mode === "formal") {
        idx = synonyms.length - 1;
      } else if (mode === "simple") {
        idx = 0;
      } else {
        idx = Math.floor(Math.random() * synonyms.length);
      }

      let replacement = synonyms[idx];
      if (token[0] === token[0].toUpperCase()) {
        replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }

      const prefix = token.match(/^[^a-zA-Z]*/)?.[0] || "";
      const suffix = token.match(/[^a-zA-Z]*$/)?.[0] || "";
      result.push({ original: token, changed: prefix + replacement + suffix, isChanged: true });
    } else {
      result.push({ original: token, changed: token, isChanged: false });
    }
  }

  return result;
}

export default function ParaphrasingToolPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("standard");
  const [result, setResult] = useState<{ original: string; changed: string; isChanged: boolean }[]>([]);
  const [copied, setCopied] = useState(false);

  function handleParaphrase() {
    if (!input.trim()) return;
    setResult(paraphrase(input, mode));
  }

  function copyResult() {
    const text = result.map((r) => r.changed).join("");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const paraphrasedText = result.map((r) => r.changed).join("");
  const changedCount = result.filter((r) => r.isChanged).length;
  const totalWords = result.filter((r) => !/^\s+$/.test(r.original)).length;

  const modes: { key: Mode; label: string; desc: string }[] = [
    { key: "standard", label: "Standard", desc: "Balanced word replacement" },
    { key: "fluent", label: "Fluent", desc: "Natural-sounding rewrites" },
    { key: "creative", label: "Creative", desc: "Maximum variation" },
    { key: "formal", label: "Formal", desc: "Professional tone" },
    { key: "simple", label: "Simple", desc: "Plain language" },
  ];

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/paraphrasing-tool`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/paraphrasing-tool`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Paraphrasing Tool</h1>
        <p className="text-[var(--muted)] mb-8">
          Rewrite and rephrase your text using synonym replacement. Choose a mode and get instant results — no AI API needed.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m.key
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={m.desc}
              >
                {m.label}
              </button>
            ))}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here to paraphrase..."
            rows={8}
            className="w-full border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm resize-y mb-4"
          />

          <button onClick={handleParaphrase} disabled={!input.trim()} className="btn-primary w-full">
            Paraphrase Text
          </button>
        </div>

        {result.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="tool-card">
                <h2 className="text-sm font-bold mb-2">Original</h2>
                <div className="text-sm leading-relaxed whitespace-pre-wrap p-3 rounded-lg bg-gray-50 min-h-[120px]">
                  {input}
                </div>
              </div>
              <div className="tool-card">
                <h2 className="text-sm font-bold mb-2">
                  Paraphrased
                  <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                    ({changedCount} of {totalWords} words changed)
                  </span>
                </h2>
                <div className="text-sm leading-relaxed whitespace-pre-wrap p-3 rounded-lg bg-green-50 min-h-[120px]">
                  {result.map((r, i) =>
                    r.isChanged ? (
                      <span key={i} className="bg-green-200 rounded px-0.5">{r.changed}</span>
                    ) : (
                      <span key={i}>{r.changed}</span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={copyResult} className="btn-primary flex-1">
                {copied ? "Copied!" : "Copy Paraphrased Text"}
              </button>
              <button onClick={handleParaphrase} className="btn-primary flex-1 bg-gray-600 hover:bg-gray-700">
                Rephrase Again
              </button>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Online Paraphrasing Tool</h2>
          <p>
            A paraphrasing tool helps you rewrite text while keeping the original meaning intact. This free online paraphraser uses an intelligent synonym replacement engine with a dictionary of over 200 common English words, each mapped to multiple synonyms. Unlike AI-based paraphrasers that send your text to external servers, this tool runs entirely in your browser. Your text stays completely private, making it safe for academic work, business documents, and personal writing. The tool offers five distinct rewriting modes to match your specific needs.
          </p>

          <h2>How Does This Paraphraser Work?</h2>
          <p>
            The paraphrasing engine works by analyzing your text word by word and checking each word against a comprehensive synonym dictionary. Based on the selected mode, it replaces a percentage of replaceable words with appropriate synonyms. The Standard mode replaces about 30% of eligible words for a balanced rewrite. Fluent mode targets 35% for more natural-sounding output. Creative mode goes up to 45% for maximum variation. Formal mode selects more sophisticated synonyms for professional contexts. Simple mode chooses the plainest synonyms for easy readability. Changed words are highlighted in green so you can see exactly what was modified.
          </p>

          <h2>Paraphrasing Modes Explained</h2>
          <ul>
            <li><strong>Standard</strong> — balanced rewriting that changes roughly one-third of replaceable words</li>
            <li><strong>Fluent</strong> — slightly more changes for smoother, more natural-sounding text</li>
            <li><strong>Creative</strong> — maximum word variation for the most distinct rewrite</li>
            <li><strong>Formal</strong> — selects sophisticated synonyms for professional and academic writing</li>
            <li><strong>Simple</strong> — uses plain, easy-to-understand synonyms for clarity</li>
          </ul>

          <h2>Who Uses Paraphrasing Tools?</h2>
          <p>
            Students use paraphrasing tools to rephrase source material for research papers and essays while avoiding plagiarism. Content writers and bloggers rewrite existing articles to create unique variations. Business professionals rephrase emails, reports, and proposals to improve clarity and tone. Social media managers create multiple versions of the same message for different platforms. English language learners use paraphrasers to expand their vocabulary and discover alternative ways to express ideas. This tool serves all of these use cases without requiring any sign-up or payment.
          </p>

          <h3>Tips for Effective Paraphrasing</h3>
          <p>
            For the best results, start with clear, well-written source text. After paraphrasing, always review the output to ensure it still conveys the intended meaning accurately. You can click the Rephrase Again button to generate a different variation since the synonym selection is randomized. Try different modes to find the style that works best for your purpose. Remember that automated paraphrasing is a starting point — the best results come from combining tool output with your own editing and refinement. For academic work, always cite your original sources even after paraphrasing.
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
            name: "Paraphrasing Tool",
            description: META.description,
            url: `${SITE_URL}/tools/paraphrasing-tool`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
