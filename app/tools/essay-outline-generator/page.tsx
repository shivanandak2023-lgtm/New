"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Essay Outline Generator - Create Essay Outlines Free",
  description:
    "Free online Essay Outline Generator. Create structured essay outlines with introduction, body paragraphs, and conclusion for argumentative, expository, narrative, and persuasive essays.",
  keywords:
    "essay outline generator, essay outline maker, essay structure, argumentative essay outline, essay planner, essay organizer",
};

const ESSAY_TYPES = ["argumentative", "expository", "narrative", "persuasive"] as const;
type EssayType = (typeof ESSAY_TYPES)[number];

function generateOutline(topic: string, type: EssayType, paragraphs: number): string {
  const t = topic.trim() || "Your Topic";

  const introHooks: Record<EssayType, string> = {
    argumentative: `Start with a provocative question or surprising statistic about ${t}`,
    expository: `Begin with a clear definition or interesting fact about ${t}`,
    narrative: `Open with a vivid scene or personal anecdote related to ${t}`,
    persuasive: `Hook the reader with a compelling statement or scenario about ${t}`,
  };

  const thesisTemplates: Record<EssayType, string> = {
    argumentative: `State your clear position on ${t}, acknowledging the opposing view`,
    expository: `Present your thesis explaining the key aspects of ${t}`,
    narrative: `Introduce the central theme or lesson connected to ${t}`,
    persuasive: `Make a strong, debatable claim about ${t} that you will defend`,
  };

  const bodyPoints: Record<EssayType, string[][]> = {
    argumentative: [
      [
        `Present your strongest argument supporting your position on ${t}`,
        "Provide evidence: statistics, expert opinions, or research findings",
        "Explain how this evidence supports your thesis",
        "Address a potential counterargument and refute it",
      ],
      [
        `Present your second supporting argument about ${t}`,
        "Include specific examples or case studies",
        "Analyze how this point strengthens your overall argument",
        "Connect back to your thesis statement",
      ],
      [
        `Address the strongest opposing viewpoint on ${t}`,
        "Acknowledge the validity of the counterargument fairly",
        "Provide a rebuttal with evidence and reasoning",
        "Explain why your position is stronger overall",
      ],
      [
        `Present additional supporting evidence for your position on ${t}`,
        "Use a different type of evidence (historical, scientific, anecdotal)",
        "Show the broader implications of your argument",
        "Reinforce the connection between evidence and thesis",
      ],
      [
        `Discuss the real-world implications of ${t}`,
        "Provide current examples or recent developments",
        "Analyze the impact on relevant stakeholders",
        "Tie this analysis back to your central argument",
      ],
    ],
    expository: [
      [
        `Explain the first key aspect or component of ${t}`,
        "Define important terms and concepts",
        "Provide factual information and examples",
        "Ensure clarity and objectivity in your explanation",
      ],
      [
        `Describe the second major element of ${t}`,
        "Use specific details and data to inform the reader",
        "Include comparisons or analogies for clarity",
        "Maintain a neutral, informative tone",
      ],
      [
        `Explore the causes, effects, or processes related to ${t}`,
        "Present information in a logical sequence",
        "Support explanations with credible sources",
        "Help the reader understand significance and context",
      ],
      [
        `Analyze the relationship between different aspects of ${t}`,
        "Compare and contrast relevant elements",
        "Provide expert perspectives or research findings",
        "Synthesize information to deepen understanding",
      ],
      [
        `Discuss current developments or future outlook for ${t}`,
        "Present the latest information available",
        "Explain trends and their implications",
        "Connect to the broader significance of the topic",
      ],
    ],
    narrative: [
      [
        `Set the scene: describe the setting and context related to ${t}`,
        "Introduce the main character(s) and their situation",
        "Establish the mood and atmosphere",
        "Build toward the central conflict or challenge",
      ],
      [
        `Develop the rising action around ${t}`,
        "Describe the challenges or obstacles encountered",
        "Include sensory details and dialogue",
        "Show character development and emotional responses",
      ],
      [
        `Present the climax or turning point related to ${t}`,
        "Build tension to the highest point of the narrative",
        "Describe the decisive moment or realization",
        "Use vivid, descriptive language for emotional impact",
      ],
      [
        `Describe the falling action after the climax`,
        "Show how the situation begins to resolve",
        "Reveal the consequences of the turning point",
        "Continue character development and reflection",
      ],
      [
        `Explore the deeper meaning and resolution of ${t}`,
        "Connect the narrative events to a broader theme",
        "Show personal growth or changed perspective",
        "Bring the story to a satisfying resolution",
      ],
    ],
    persuasive: [
      [
        `Present your most compelling argument about ${t}`,
        "Appeal to logic with strong evidence and data",
        "Use specific examples that resonate with your audience",
        "Explain why this point is critical to your position",
      ],
      [
        `Build on your case with emotional appeal related to ${t}`,
        "Share a story or scenario that evokes empathy",
        "Connect the issue to the reader's values and experiences",
        "Strengthen the emotional connection to your argument",
      ],
      [
        `Establish credibility and authority on ${t}`,
        "Cite expert opinions, studies, or authoritative sources",
        "Present your own relevant experience or qualifications",
        "Build trust with the reader through reliable evidence",
      ],
      [
        `Address and dismantle opposing arguments about ${t}`,
        "Fairly present the strongest counterargument",
        "Systematically refute it with evidence and logic",
        "Show why your position is more sound and beneficial",
      ],
      [
        `Present the call to action regarding ${t}`,
        "Describe specific steps the reader can take",
        "Explain the positive outcomes of taking action",
        "Create urgency and motivation for the reader",
      ],
    ],
  };

  const conclusionTemplates: Record<EssayType, string[]> = {
    argumentative: [
      "Restate your thesis in light of the evidence presented",
      "Summarize the key arguments that support your position",
      "Acknowledge the complexity of the issue while affirming your stance",
      "End with a thought-provoking statement or call to further inquiry",
    ],
    expository: [
      "Restate the thesis and summarize key information covered",
      "Highlight the most important takeaways for the reader",
      "Explain the broader significance of the topic",
      "End with a forward-looking statement or question for reflection",
    ],
    narrative: [
      "Reflect on the journey and how the experience changed you",
      "Connect the story back to the central theme or lesson",
      "Share the lasting impact or insight gained",
      "End with a memorable final image or thought",
    ],
    persuasive: [
      "Restate your position with renewed conviction",
      "Summarize the strongest points of your argument",
      "Reinforce the call to action with urgency",
      "End with a powerful closing statement that inspires action",
    ],
  };

  const bodyCount = Math.max(1, Math.min(5, paragraphs));
  const selectedBody = bodyPoints[type].slice(0, bodyCount);

  let outline = `ESSAY OUTLINE: ${t.toUpperCase()}\nType: ${type.charAt(0).toUpperCase() + type.slice(1)} Essay\n\n`;
  outline += `I. INTRODUCTION\n`;
  outline += `   A. Hook: ${introHooks[type]}\n`;
  outline += `   B. Background: Provide context and relevant background information on ${t}\n`;
  outline += `   C. Thesis: ${thesisTemplates[type]}\n\n`;

  selectedBody.forEach((points, i) => {
    const numeral = ["II", "III", "IV", "V", "VI"][i];
    outline += `${numeral}. BODY PARAGRAPH ${i + 1}\n`;
    points.forEach((point, j) => {
      const letter = String.fromCharCode(65 + j);
      outline += `   ${letter}. ${point}\n`;
    });
    outline += "\n";
  });

  const conclusionNumeral = ["II", "III", "IV", "V", "VI"][bodyCount];
  outline += `${conclusionNumeral}. CONCLUSION\n`;
  conclusionTemplates[type].forEach((point, j) => {
    const letter = String.fromCharCode(65 + j);
    outline += `   ${letter}. ${point}\n`;
  });

  return outline;
}

export default function EssayOutlineGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [essayType, setEssayType] = useState<EssayType>("argumentative");
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const result = generateOutline(topic, essayType, paragraphs);
    setOutput(result);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/essay-outline-generator`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/essay-outline-generator`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Essay Outline Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create structured essay outlines with introduction, body paragraphs, and conclusion.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-semibold mb-2">Essay Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input-field"
            placeholder="e.g. The impact of social media on mental health"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Essay Type</label>
              <select
                value={essayType}
                onChange={(e) => setEssayType(e.target.value as EssayType)}
                className="input-field"
              >
                {ESSAY_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Body Paragraphs ({paragraphs})</label>
              <input
                type="range"
                min={1}
                max={5}
                value={paragraphs}
                onChange={(e) => setParagraphs(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-[var(--muted)]">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleGenerate} disabled={!topic.trim()} className="btn-primary">
              Generate Outline
            </button>
            {output && (
              <button onClick={() => setOutput("")} className="btn-secondary text-sm">
                Clear
              </button>
            )}
          </div>
        </div>

        {output && (
          <div className="result-card mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Essay Outline</h3>
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)] overflow-x-auto">
              {output}
            </pre>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is an Essay Outline Generator?</h2>
          <p>
            An Essay Outline Generator creates structured outlines for essays, complete with introduction,
            body paragraphs, and conclusion sections. It helps organize your thoughts and ensures your
            essay follows a logical structure.
          </p>

          <h2>Supported Essay Types</h2>
          <ul>
            <li><strong>Argumentative:</strong> Take a position and defend it with evidence while addressing counterarguments</li>
            <li><strong>Expository:</strong> Explain a topic objectively with facts, definitions, and examples</li>
            <li><strong>Narrative:</strong> Tell a story with a beginning, middle, and end that conveys a theme</li>
            <li><strong>Persuasive:</strong> Convince the reader to adopt your viewpoint using logic, emotion, and credibility</li>
          </ul>

          <h2>Who Uses Essay Outline Generators?</h2>
          <ul>
            <li><strong>Students:</strong> Plan essays efficiently before writing</li>
            <li><strong>Teachers:</strong> Demonstrate proper essay structure to students</li>
            <li><strong>Writers:</strong> Organize complex topics into logical frameworks</li>
            <li><strong>Test Takers:</strong> Quickly structure timed essay responses</li>
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
            name: "Essay Outline Generator",
            description: META.description,
            url: `${SITE_URL}/tools/essay-outline-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
