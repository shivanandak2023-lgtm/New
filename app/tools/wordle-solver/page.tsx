"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Wordle Solver - Find 5-Letter Words & Get Hints",
  description:
    "Free Wordle solver tool to find possible 5-letter words. Mark letters as green, yellow, or gray to filter matching words. Includes a random word generator.",
  keywords:
    "wordle solver, wordle helper, wordle hint, 5 letter words, wordle word finder, wordle cheat, wordle answer today, word game solver",
};

const WORD_LIST = [
  "about","above","abuse","actor","acute","admit","adopt","adult","after","again",
  "agent","agree","ahead","alarm","album","alert","alien","align","alive","allow",
  "alone","along","alter","among","anger","angle","angry","anime","apart","apple",
  "apply","arena","argue","arise","armor","array","aside","asset","avoid","award",
  "aware","badly","baker","bases","basic","batch","beach","beard","beast","began",
  "begin","being","below","bench","berry","birth","black","blade","blame","blank",
  "blast","blaze","bleed","blend","blind","block","blood","blown","board","bonus",
  "boost","booth","bound","brain","brand","brave","bread","break","breed","brick",
  "brief","bring","broad","broke","brush","build","bunch","burst","buyer","cabin",
  "candy","cargo","carry","catch","cause","chain","chair","chaos","charm","chart",
  "chase","cheap","check","chess","chest","chief","child","china","chunk","civic",
  "claim","clash","class","clean","clear","clerk","click","cliff","climb","cling",
  "clock","clone","close","cloth","cloud","coach","coast","could","count","court",
  "cover","crack","craft","crane","crash","crazy","cream","crime","crisp","cross",
  "crowd","crown","crush","curve","cycle","daily","dance","death","debug","debut",
  "delay","delta","dense","depth","derby","devil","diary","dirty","donor","doubt",
  "dozen","draft","drain","drama","drank","drawn","dream","dress","dried","drift",
  "drill","drink","drive","droit","drone","drops","drove","drunk","dryer","dwell",
  "eager","early","earth","eight","elect","elite","email","empty","enemy","enjoy",
  "enter","entry","equal","error","essay","event","every","exact","exist","extra",
  "faint","faith","false","fancy","fatal","fault","feast","fever","fiber","field",
  "fifth","fifty","fight","final","first","fixed","flame","flash","flesh","float",
  "flood","floor","flour","fluid","flush","focus","force","forge","forth","forum",
  "found","frame","fraud","fresh","front","frost","fruit","fully","funny","giant",
  "given","glass","globe","gloom","glory","glove","going","grace","grade","grain",
  "grand","grant","graph","grasp","grass","grave","great","green","greet","grief",
  "grind","groan","gross","group","grove","grown","guard","guess","guest","guide",
  "guild","happy","harsh","heart","heavy","hence","honor","horse","hotel","house",
  "human","humor","hurry","ideal","image","imply","index","inner","input","irony",
  "issue","ivory","jewel","joint","judge","juice","known","label","labor","large",
  "laser","later","laugh","layer","learn","lease","least","leave","legal","level",
  "light","limit","linen","liver","local","logic","loose","lover","lower","lucky",
  "lunch","lying","magic","major","maker","manor","maple","march","match","mayor",
  "media","mercy","metal","meter","might","minor","minus","model","money","month",
  "moral","motor","mount","mouse","mouth","movie","music","naive","nerve","never",
  "night","noble","noise","north","noted","novel","nurse","occur","ocean","offer",
  "often","opera","orbit","order","organ","other","ought","outer","owned","owner",
  "oxide","paint","panel","panic","paper","party","paste","patch","pause","peace",
  "penny","phase","phone","photo","piano","piece","pilot","pitch","pixel","place",
  "plain","plane","plant","plate","plaza","plaza","plead","plumb","plume","point",
  "polar","poppy","porch","pound","power","press","price","pride","prime","print",
  "prior","prize","probe","prone","proof","proud","prove","proxy","pulse","punch",
  "pupil","queen","query","quest","queue","quick","quiet","quota","quote","radar",
  "radio","raise","rally","ranch","range","rapid","ratio","reach","react","ready",
  "realm","rebel","refer","reign","relax","reply","rider","ridge","rifle","right",
  "rigid","river","robot","rocky","rouge","rough","round","route","royal","ruler",
  "rural","saint","salad","sauce","scale","scene","scope","score","sense","serve",
  "seven","shade","shake","shall","shame","shape","share","shark","sharp","sheep",
  "sheer","sheet","shelf","shell","shift","shine","shirt","shock","shoot","shore",
  "short","shout","shown","sight","silly","since","sixth","sixty","skill","skull",
  "slate","sleep","slice","slide","slope","smart","smell","smile","smoke","snake",
  "solar","solid","solve","sorry","sound","south","space","spare","speak","speed",
  "spend","spent","spill","spine","spite","split","spoke","spoon","sport","spray",
  "squad","stack","staff","stage","stain","stake","stall","stamp","stand","stark",
  "start","state","steak","steal","steam","steel","steep","steer","stems","stick",
  "stiff","still","stock","stone","stood","store","storm","story","stove","strip",
  "stuck","study","stuff","style","sugar","suite","super","surge","swamp","swear",
  "sweep","sweet","swift","swing","sword","taste","teach","teeth","tempo","tends",
  "tenth","thank","theft","their","theme","there","these","thick","thing","think",
  "third","thorn","those","three","threw","throw","thumb","tight","timer","tired",
  "title","today","token","total","touch","tough","tower","toxic","trace","track",
  "trade","trail","train","trait","trash","treat","trend","trial","tribe","trick",
  "troop","truck","truly","trunk","trust","truth","tumor","twice","twist","ultra",
  "uncle","under","union","unite","unity","until","upper","upset","urban","usage",
  "usual","utter","valid","value","valve","venue","verse","video","vigor","viral",
  "virus","visit","vital","vivid","vocal","vodka","voice","voter","wagon","waste",
  "watch","water","weary","weave","wedge","weigh","weird","wheat","wheel","where",
  "which","while","white","whole","whose","width","witch","woman","world","worry",
  "worse","worst","worth","would","wound","wrath","write","wrong","wrote","yield",
  "young","youth",
];

type LetterState = "gray" | "yellow" | "green";

export default function WordleSolverPage() {
  const [letters, setLetters] = useState<string[]>(["", "", "", "", ""]);
  const [states, setStates] = useState<LetterState[]>(["gray", "gray", "gray", "gray", "gray"]);
  const [possibleWords, setPossibleWords] = useState<string[]>([]);
  const [randomWord, setRandomWord] = useState<string>("");
  const [showRandom, setShowRandom] = useState(false);

  function updateLetter(index: number, value: string) {
    const newLetters = [...letters];
    newLetters[index] = value.toLowerCase().slice(0, 1);
    setLetters(newLetters);
  }

  function cycleState(index: number) {
    const newStates = [...states];
    const order: LetterState[] = ["gray", "yellow", "green"];
    const currentIdx = order.indexOf(newStates[index]);
    newStates[index] = order[(currentIdx + 1) % 3];
    setStates(newStates);
  }

  function solve() {
    const greenLetters: { letter: string; position: number }[] = [];
    const yellowLetters: { letter: string; position: number }[] = [];
    const grayLetters: string[] = [];

    for (let i = 0; i < 5; i++) {
      const letter = letters[i].toLowerCase();
      if (!letter) continue;

      if (states[i] === "green") {
        greenLetters.push({ letter, position: i });
      } else if (states[i] === "yellow") {
        yellowLetters.push({ letter, position: i });
      } else {
        grayLetters.push(letter);
      }
    }

    const filtered = WORD_LIST.filter((word) => {
      for (const { letter, position } of greenLetters) {
        if (word[position] !== letter) return false;
      }

      for (const { letter, position } of yellowLetters) {
        if (!word.includes(letter)) return false;
        if (word[position] === letter) return false;
      }

      for (const letter of grayLetters) {
        const isGreenOrYellow =
          greenLetters.some((g) => g.letter === letter) ||
          yellowLetters.some((y) => y.letter === letter);
        if (!isGreenOrYellow && word.includes(letter)) return false;
      }

      return true;
    });

    const unique = Array.from(new Set(filtered));
    setPossibleWords(unique);
  }

  function generateRandomWord() {
    const idx = Math.floor(Math.random() * WORD_LIST.length);
    setRandomWord(WORD_LIST[idx].toUpperCase());
    setShowRandom(true);
  }

  function resetAll() {
    setLetters(["", "", "", "", ""]);
    setStates(["gray", "gray", "gray", "gray", "gray"]);
    setPossibleWords([]);
  }

  const stateColors: Record<LetterState, string> = {
    gray: "bg-gray-300 text-gray-800 border-gray-400",
    yellow: "bg-yellow-400 text-yellow-900 border-yellow-500",
    green: "bg-green-500 text-white border-green-600",
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/wordle-solver`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/wordle-solver`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Wordle Solver</h1>
        <p className="text-[var(--muted)] mb-8">
          Enter your Wordle guesses and mark each letter as green, yellow, or gray. The solver will filter
          possible words from a built-in word list to help you find the answer.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Enter Your Guess</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Type a letter in each box, then click the box to cycle its color: <span className="font-semibold text-gray-600">gray</span> (not in word), <span className="font-semibold text-yellow-600">yellow</span> (wrong position), <span className="font-semibold text-green-600">green</span> (correct position).
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {letters.map((letter, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <input
                  type="text"
                  maxLength={1}
                  value={letter.toUpperCase()}
                  onChange={(e) => updateLetter(i, e.target.value)}
                  className={`w-14 h-14 text-center text-2xl font-bold uppercase border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${stateColors[states[i]]}`}
                />
                <button
                  onClick={() => cycleState(i)}
                  className={`text-xs px-2 py-1 rounded border ${stateColors[states[i]]}`}
                >
                  {states[i]}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={solve} className="btn-primary">
              Find Words
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-2 border border-[var(--card-border)] rounded-lg hover:bg-[var(--muted-bg)] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {possibleWords.length > 0 && (
          <div className="tool-card mb-8">
            <h2 className="text-lg font-bold mb-4">
              Possible Words ({possibleWords.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {possibleWords.slice(0, 100).map((word) => (
                <span
                  key={word}
                  className="px-3 py-1 bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg text-sm font-mono uppercase font-semibold"
                >
                  {word}
                </span>
              ))}
            </div>
            {possibleWords.length > 100 && (
              <p className="text-sm text-[var(--muted)] mt-3 text-center">
                Showing first 100 of {possibleWords.length} matches. Add more clues to narrow down results.
              </p>
            )}
            {possibleWords.length === 0 && (
              <p className="text-sm text-[var(--muted)] text-center py-4">
                No matching words found. Try adjusting your letter clues.
              </p>
            )}
          </div>
        )}

        <div className="tool-card mb-8">
          <h2 className="text-lg font-bold mb-4">Random Word Generator</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Need a random 5-letter word to play Wordle with friends? Generate one here.
          </p>
          <button onClick={generateRandomWord} className="btn-primary">
            Generate Random Word
          </button>
          {showRandom && (
            <div className="result-card text-center mt-4">
              <p className="text-sm text-[var(--muted)] mb-1">Your Random Word</p>
              <p className="text-3xl font-bold text-[var(--primary)] tracking-widest font-mono">
                {randomWord}
              </p>
            </div>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>How to Use the Wordle Solver</h2>
          <p>
            This Wordle solver helps you find possible answers based on the clues you have. Enter the letters
            from your guess into the five boxes, then click each box to mark it with the correct color:
            green for correct position, yellow for wrong position, and gray for letters not in the word.
          </p>

          <h2>Wordle Strategy Tips</h2>
          <ul>
            <li><strong>Start with vowel-rich words</strong> - Words like AUDIO, ADIEU, or ARISE cover multiple vowels</li>
            <li><strong>Use common consonants early</strong> - R, S, T, L, N are the most frequent consonants in English</li>
            <li><strong>Avoid repeating letters</strong> in early guesses to maximize information</li>
            <li><strong>Pay attention to letter frequency</strong> - E, A, R, O, T, L, I, S, N are the most common letters</li>
          </ul>

          <h3>Best Starting Words for Wordle</h3>
          <p>
            Statistical analysis suggests that words like CRANE, SLATE, TRACE, and CRATE are among
            the best starting words. They contain common letters and help eliminate a large number
            of possibilities early in the game.
          </p>

          <h3>How Wordle Works</h3>
          <p>
            Wordle gives you six attempts to guess a five-letter word. After each guess, letters are
            colored green (correct position), yellow (in the word but wrong position), or gray (not
            in the word). Use these clues strategically to narrow down the answer.
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
            name: "Wordle Solver",
            description: META.description,
            url: `${SITE_URL}/tools/wordle-solver`,
            applicationCategory: "GameApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
