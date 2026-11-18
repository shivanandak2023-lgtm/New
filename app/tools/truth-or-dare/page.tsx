"use client";

import { useState, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Truth or Dare - Party Game with 200+ Truths & Dares",
  description:
    "Free Truth or Dare game with 100+ truths and 100+ dares! Choose categories like Funny, Embarrassing, Romantic, and Adventurous. Perfect for parties and game nights with multiplayer mode.",
  keywords: "truth or dare, truth or dare game, party game, truth questions, dare challenges, fun party games",
};

type Category = "Funny" | "Embarrassing" | "Romantic" | "Adventurous";

interface TruthOrDare {
  text: string;
  category: Category;
}

const TRUTHS: TruthOrDare[] = [
  // Funny
  { text: "What's the most embarrassing song on your playlist?", category: "Funny" },
  { text: "What's the weirdest thing you've ever Googled?", category: "Funny" },
  { text: "If you could swap lives with anyone for a day, who would it be?", category: "Funny" },
  { text: "What's the funniest nickname you've ever had?", category: "Funny" },
  { text: "What's the most ridiculous lie you've ever told?", category: "Funny" },
  { text: "What's the silliest reason you've ever cried?", category: "Funny" },
  { text: "What's your most embarrassing childhood memory?", category: "Funny" },
  { text: "If you were a superhero, what would your terrible superpower be?", category: "Funny" },
  { text: "What's the worst fashion choice you've ever made?", category: "Funny" },
  { text: "What's the weirdest food combination you secretly enjoy?", category: "Funny" },
  { text: "What cartoon character do you relate to the most?", category: "Funny" },
  { text: "What's the most childish thing you still do?", category: "Funny" },
  { text: "If animals could talk, which one would be the rudest?", category: "Funny" },
  { text: "What's the most useless talent you have?", category: "Funny" },
  { text: "What's the worst joke you've ever told that you thought was hilarious?", category: "Funny" },
  { text: "If you had a theme song that played every time you entered a room, what would it be?", category: "Funny" },
  { text: "What's the most ridiculous thing you've done to avoid talking to someone?", category: "Funny" },
  { text: "What's the strangest dream you've ever had?", category: "Funny" },
  { text: "What movie do you secretly love but would never admit to?", category: "Funny" },
  { text: "What's the dumbest argument you've ever gotten into?", category: "Funny" },
  { text: "If you could only eat one food for the rest of your life, what would it be?", category: "Funny" },
  { text: "What's the worst haircut you've ever gotten?", category: "Funny" },
  { text: "What's your most irrational fear?", category: "Funny" },
  { text: "What celebrity do people say you look like (and do you agree)?", category: "Funny" },
  { text: "What's the longest you've ever binge-watched a show?", category: "Funny" },
  // Embarrassing
  { text: "What's the most embarrassing text you've sent to the wrong person?", category: "Embarrassing" },
  { text: "Have you ever been caught talking to yourself?", category: "Embarrassing" },
  { text: "What's the most embarrassing thing in your search history?", category: "Embarrassing" },
  { text: "Have you ever walked into a glass door?", category: "Embarrassing" },
  { text: "What's the most awkward date you've ever been on?", category: "Embarrassing" },
  { text: "Have you ever waved at someone who wasn't waving at you?", category: "Embarrassing" },
  { text: "What's the most embarrassing thing you've done in public?", category: "Embarrassing" },
  { text: "Have you ever tripped and tried to play it off?", category: "Embarrassing" },
  { text: "What's the most embarrassing autocorrect fail you've had?", category: "Embarrassing" },
  { text: "Have you ever accidentally liked an old photo while stalking someone online?", category: "Embarrassing" },
  { text: "What's something you did as a kid that still makes you cringe?", category: "Embarrassing" },
  { text: "Have you ever laughed at a completely inappropriate moment?", category: "Embarrassing" },
  { text: "What's the most embarrassing thing a family member has done in front of your friends?", category: "Embarrassing" },
  { text: "Have you ever pretended to know someone you didn't recognize?", category: "Embarrassing" },
  { text: "What's the most embarrassing voicemail you've left?", category: "Embarrassing" },
  { text: "Have you ever been caught singing in the shower?", category: "Embarrassing" },
  { text: "What's the most embarrassing thing your parents have caught you doing?", category: "Embarrassing" },
  { text: "Have you ever accidentally sent a message meant for someone else?", category: "Embarrassing" },
  { text: "What's the most embarrassing thing you've cried about?", category: "Embarrassing" },
  { text: "Have you ever been caught staring at someone?", category: "Embarrassing" },
  { text: "What's the worst thing you've ever said in a job interview?", category: "Embarrassing" },
  { text: "Have you ever forgotten someone's name right after they told you?", category: "Embarrassing" },
  { text: "What's the most embarrassing photo of you that exists?", category: "Embarrassing" },
  { text: "Have you ever accidentally called a teacher 'mom' or 'dad'?", category: "Embarrassing" },
  { text: "What's the most embarrassing ringtone you've ever had?", category: "Embarrassing" },
  // Romantic
  { text: "Who was your first crush and do you still think about them?", category: "Romantic" },
  { text: "What's the most romantic thing you've ever done for someone?", category: "Romantic" },
  { text: "What's your love language?", category: "Romantic" },
  { text: "What's the most romantic movie that made you cry?", category: "Romantic" },
  { text: "What quality do you find most attractive in a person?", category: "Romantic" },
  { text: "Have you ever written a love letter?", category: "Romantic" },
  { text: "What's your idea of a perfect date?", category: "Romantic" },
  { text: "What's the sweetest compliment you've ever received?", category: "Romantic" },
  { text: "Do you believe in love at first sight?", category: "Romantic" },
  { text: "What's a relationship deal-breaker for you?", category: "Romantic" },
  { text: "What's the cheesiest pickup line that would actually work on you?", category: "Romantic" },
  { text: "Have you ever had a secret admirer?", category: "Romantic" },
  { text: "What's the most thoughtful gift you've ever received?", category: "Romantic" },
  { text: "What song reminds you of someone special?", category: "Romantic" },
  { text: "What's the most spontaneous romantic thing you've done?", category: "Romantic" },
  { text: "Do you believe in soulmates?", category: "Romantic" },
  { text: "What's the most important thing in a relationship for you?", category: "Romantic" },
  { text: "What's your go-to love song?", category: "Romantic" },
  { text: "Have you ever been in love? How did you know?", category: "Romantic" },
  { text: "What's the bravest thing you've done for love?", category: "Romantic" },
  { text: "What's your dream proposal scenario?", category: "Romantic" },
  { text: "What celebrity would you want to go on a date with?", category: "Romantic" },
  { text: "What's the cutest thing someone has done for you?", category: "Romantic" },
  { text: "Do you have a type? Describe them.", category: "Romantic" },
  { text: "What's the most romantic place you've ever visited?", category: "Romantic" },
  // Adventurous
  { text: "What's the most spontaneous thing you've ever done?", category: "Adventurous" },
  { text: "What's on your bucket list that most people would find crazy?", category: "Adventurous" },
  { text: "What's the scariest thing you've ever done willingly?", category: "Adventurous" },
  { text: "If you could live anywhere in the world, where would it be?", category: "Adventurous" },
  { text: "What's the most adventurous food you've ever tried?", category: "Adventurous" },
  { text: "Have you ever done something your parents told you not to?", category: "Adventurous" },
  { text: "What's the craziest dare you've ever completed?", category: "Adventurous" },
  { text: "If you could have dinner with any historical figure, who would it be?", category: "Adventurous" },
  { text: "What's the most rebellious thing you did as a teenager?", category: "Adventurous" },
  { text: "Would you rather skydive or bungee jump?", category: "Adventurous" },
  { text: "What's the farthest you've ever traveled from home?", category: "Adventurous" },
  { text: "What's the most impulsive purchase you've ever made?", category: "Adventurous" },
  { text: "If you had to survive in the wild for a week, what three items would you bring?", category: "Adventurous" },
  { text: "What extreme sport would you love to try?", category: "Adventurous" },
  { text: "What's the biggest risk you've ever taken?", category: "Adventurous" },
  { text: "If you could time travel, what era would you visit?", category: "Adventurous" },
  { text: "What's the most daring outfit you've ever worn?", category: "Adventurous" },
  { text: "Have you ever snuck out of the house?", category: "Adventurous" },
  { text: "What's something wild you want to do before you turn 50?", category: "Adventurous" },
  { text: "If you won the lottery tomorrow, what's the first crazy thing you'd do?", category: "Adventurous" },
  { text: "What's the most adventurous date idea you can think of?", category: "Adventurous" },
  { text: "Would you ever go on a road trip with no planned destination?", category: "Adventurous" },
  { text: "What's the boldest thing you've ever said to a stranger?", category: "Adventurous" },
  { text: "If you could learn any skill overnight, what would it be?", category: "Adventurous" },
  { text: "What's the most unusual place you've ever slept?", category: "Adventurous" },
];

const DARES: TruthOrDare[] = [
  // Funny
  { text: "Do your best impression of a celebrity everyone would recognize.", category: "Funny" },
  { text: "Speak in an accent for the next 3 rounds.", category: "Funny" },
  { text: "Do a dramatic reading of the last text message you sent.", category: "Funny" },
  { text: "Try to make everyone laugh in 30 seconds without touching anyone.", category: "Funny" },
  { text: "Do your best robot dance for 30 seconds.", category: "Funny" },
  { text: "Sing the chorus of your favorite song right now.", category: "Funny" },
  { text: "Talk like a pirate for the next 2 rounds.", category: "Funny" },
  { text: "Do 10 jumping jacks while singing the alphabet.", category: "Funny" },
  { text: "Make up a short rap about the person to your left.", category: "Funny" },
  { text: "Act out your favorite movie scene without words.", category: "Funny" },
  { text: "Tell a joke. If nobody laughs, do 5 push-ups.", category: "Funny" },
  { text: "Do your best animal impression and let others guess what it is.", category: "Funny" },
  { text: "Speak in slow motion for the next minute.", category: "Funny" },
  { text: "Stand up and do a fashion show walk across the room.", category: "Funny" },
  { text: "Make a funny face and hold it for 30 seconds.", category: "Funny" },
  { text: "Pretend to be a news anchor and report on what's happening in this room.", category: "Funny" },
  { text: "Do your best dance move and teach it to everyone.", category: "Funny" },
  { text: "Tell a story using only sound effects.", category: "Funny" },
  { text: "Act like a waiter and take everyone's food order.", category: "Funny" },
  { text: "Do your best moonwalk across the room.", category: "Funny" },
  { text: "Make up a commercial for the nearest object to you.", category: "Funny" },
  { text: "Speak only in questions for the next 2 rounds.", category: "Funny" },
  { text: "Do an impression of someone in the room without saying who.", category: "Funny" },
  { text: "Make a dramatic exit and re-enter the room.", category: "Funny" },
  { text: "Invent a new dance move and name it after yourself.", category: "Funny" },
  // Embarrassing
  { text: "Let the group look at your most recent photo in your camera roll.", category: "Embarrassing" },
  { text: "Show the group your screen time report on your phone.", category: "Embarrassing" },
  { text: "Let someone post something on your social media.", category: "Embarrassing" },
  { text: "Read aloud the last 5 texts in your messaging app.", category: "Embarrassing" },
  { text: "Call a friend and sing happy birthday to them (even if it's not their birthday).", category: "Embarrassing" },
  { text: "Show everyone your most-used emoji.", category: "Embarrassing" },
  { text: "Do a dramatic reenactment of your most embarrassing moment.", category: "Embarrassing" },
  { text: "Let the person next to you send a text from your phone.", category: "Embarrassing" },
  { text: "Share the oldest photo on your phone.", category: "Embarrassing" },
  { text: "Show the last thing you searched for online.", category: "Embarrassing" },
  { text: "Do your most embarrassing dance and let someone film it.", category: "Embarrassing" },
  { text: "Let the group go through your Spotify/music history.", category: "Embarrassing" },
  { text: "Talk in a baby voice for the next 2 rounds.", category: "Embarrassing" },
  { text: "Wear your shirt inside out for the rest of the game.", category: "Embarrassing" },
  { text: "Let someone draw something on your hand with a pen.", category: "Embarrassing" },
  { text: "Post a silly selfie to your social media story.", category: "Embarrassing" },
  { text: "Share your most embarrassing autocorrect story.", category: "Embarrassing" },
  { text: "Let the group pick a funny contact name for yourself in your phone.", category: "Embarrassing" },
  { text: "Show everyone your saved memes or funny screenshots.", category: "Embarrassing" },
  { text: "Serenade the person across from you with any song.", category: "Embarrassing" },
  { text: "Walk around the room like a model on a runway.", category: "Embarrassing" },
  { text: "Do 20 seconds of interpretive dance to a song the group picks.", category: "Embarrassing" },
  { text: "Try to touch your nose with your tongue.", category: "Embarrassing" },
  { text: "Make your best ugly face and let someone take a photo.", category: "Embarrassing" },
  { text: "Stand on one foot for the entire next round.", category: "Embarrassing" },
  // Romantic
  { text: "Give a genuine compliment to everyone in the room.", category: "Romantic" },
  { text: "Describe your perfect partner in 3 words.", category: "Romantic" },
  { text: "Write a short love poem on the spot about anything.", category: "Romantic" },
  { text: "Slow dance by yourself for 30 seconds.", category: "Romantic" },
  { text: "Send a sweet message to someone you care about right now.", category: "Romantic" },
  { text: "Share the most romantic song on your playlist.", category: "Romantic" },
  { text: "Make eye contact with someone for 30 seconds without laughing.", category: "Romantic" },
  { text: "Describe what love means to you in one sentence.", category: "Romantic" },
  { text: "Say something you find attractive about 3 people in the room.", category: "Romantic" },
  { text: "Act out a romantic movie scene of the group's choosing.", category: "Romantic" },
  { text: "Whisper something nice to the person next to you.", category: "Romantic" },
  { text: "Share the last love song you listened to and explain why.", category: "Romantic" },
  { text: "Plan the perfect date out loud in 60 seconds.", category: "Romantic" },
  { text: "Read the sweetest text you've ever received out loud.", category: "Romantic" },
  { text: "Give the best hug you can to the person on your right.", category: "Romantic" },
  { text: "Write a haiku about love and read it out loud.", category: "Romantic" },
  { text: "Say the cheesiest pickup line you know with a straight face.", category: "Romantic" },
  { text: "Describe your celebrity crush and why.", category: "Romantic" },
  { text: "Hold hands with the person next to you for the next round.", category: "Romantic" },
  { text: "Draw a heart on the back of someone's hand.", category: "Romantic" },
  { text: "Blow a kiss to everyone in the room.", category: "Romantic" },
  { text: "Sing a love song to the person across from you.", category: "Romantic" },
  { text: "Tell the most romantic story you know (real or fictional).", category: "Romantic" },
  { text: "Wink at the next person who makes eye contact with you.", category: "Romantic" },
  { text: "Say 'I appreciate you' to everyone in the room and explain why.", category: "Romantic" },
  // Adventurous
  { text: "Do 20 push-ups right now.", category: "Adventurous" },
  { text: "Go outside and yell something motivational.", category: "Adventurous" },
  { text: "Eat a spoonful of a condiment of the group's choice.", category: "Adventurous" },
  { text: "Let someone style your hair however they want.", category: "Adventurous" },
  { text: "Do a handstand or attempt one against the wall.", category: "Adventurous" },
  { text: "Sprint around the outside of the building/house.", category: "Adventurous" },
  { text: "Let the group give you a makeover with whatever is available.", category: "Adventurous" },
  { text: "Hold a plank position for as long as you can.", category: "Adventurous" },
  { text: "Mix 3 random drinks together and take a sip.", category: "Adventurous" },
  { text: "Do a cartwheel (or your best attempt at one).", category: "Adventurous" },
  { text: "Let someone write something on your forehead with a washable marker.", category: "Adventurous" },
  { text: "Talk to a stranger and give them a compliment.", category: "Adventurous" },
  { text: "Do a wall sit for 60 seconds.", category: "Adventurous" },
  { text: "Eat something with your eyes closed that the group prepares.", category: "Adventurous" },
  { text: "Balance a book on your head and walk across the room.", category: "Adventurous" },
  { text: "Do your best backbend or attempt a yoga pose.", category: "Adventurous" },
  { text: "Go get ice or a cold glass of water and pour a bit on your face.", category: "Adventurous" },
  { text: "Let the group decide your phone wallpaper for a week.", category: "Adventurous" },
  { text: "Spin around 10 times and try to walk in a straight line.", category: "Adventurous" },
  { text: "Army crawl across the room.", category: "Adventurous" },
  { text: "Do 30 squats without stopping.", category: "Adventurous" },
  { text: "Stand outside for 60 seconds with your arms in the air.", category: "Adventurous" },
  { text: "Let someone throw a pillow at you from across the room.", category: "Adventurous" },
  { text: "Try to juggle 3 objects for 30 seconds.", category: "Adventurous" },
  { text: "Bear crawl from one end of the room to the other.", category: "Adventurous" },
];

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  Funny: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  Embarrassing: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300" },
  Romantic: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  Adventurous: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
};

const CATEGORY_EMOJI: Record<Category, string> = {
  Funny: "😂",
  Embarrassing: "😳",
  Romantic: "💕",
  Adventurous: "🤠",
};

export default function TruthOrDarePage() {
  const [mode, setMode] = useState<"truth" | "dare" | null>(null);
  const [currentItem, setCurrentItem] = useState<TruthOrDare | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    new Set(["Funny", "Embarrassing", "Romantic", "Adventurous"])
  );
  const [usedTruths, setUsedTruths] = useState<Set<number>>(new Set());
  const [usedDares, setUsedDares] = useState<Set<number>>(new Set());
  const [isRevealing, setIsRevealing] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [stats, setStats] = useState({ truths: 0, dares: 0 });

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const addPlayer = () => {
    const name = playerInput.trim();
    if (name && !players.includes(name)) {
      setPlayers((prev) => [...prev, name]);
      setPlayerInput("");
    }
  };

  const removePlayer = (name: string) => {
    setPlayers((prev) => prev.filter((p) => p !== name));
  };

  const getRandomItem = useCallback(
    (type: "truth" | "dare") => {
      setIsRevealing(true);
      setMode(type);
      setCurrentItem(null);

      setTimeout(() => {
        const pool = type === "truth" ? TRUTHS : DARES;
        const used = type === "truth" ? usedTruths : usedDares;
        const setUsed = type === "truth" ? setUsedTruths : setUsedDares;

        let filtered = pool
          .map((item, i) => ({ item, index: i }))
          .filter(({ item, index }) => selectedCategories.has(item.category) && !used.has(index));

        // Reset if all used
        if (filtered.length === 0) {
          setUsed(new Set());
          filtered = pool
            .map((item, i) => ({ item, index: i }))
            .filter(({ item }) => selectedCategories.has(item.category));
        }

        if (filtered.length === 0) {
          setIsRevealing(false);
          return;
        }

        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        const pick = filtered[arr[0] % filtered.length];

        setUsed((prev) => new Set([...prev, pick.index]));
        setCurrentItem(pick.item);
        setStats((prev) => ({
          ...prev,
          [type === "truth" ? "truths" : "dares"]: prev[type === "truth" ? "truths" : "dares"] + 1,
        }));

        if (players.length > 0) {
          setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
        }

        setIsRevealing(false);
      }, 600);
    },
    [selectedCategories, usedTruths, usedDares, players.length]
  );

  const resetGame = () => {
    setUsedTruths(new Set());
    setUsedDares(new Set());
    setCurrentItem(null);
    setMode(null);
    setStats({ truths: 0, dares: 0 });
    setCurrentPlayerIndex(0);
  };

  const currentPlayer = players.length > 0 ? players[currentPlayerIndex] : null;

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/truth-or-dare`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Truth or Dare</h1>
        <p className="text-[var(--muted)] mb-8">
          The classic party game! Choose Truth or Dare and get fun, party-appropriate challenges.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Player Setup */}
        <div className="tool-card mb-6">
          <h2 className="text-lg font-bold mb-3">Players (Optional)</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              placeholder="Add player name..."
              className="flex-1 p-2 border rounded-lg bg-[var(--muted-bg)]"
              maxLength={20}
            />
            <button
              onClick={addPlayer}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
          {players.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {players.map((p, i) => (
                <span
                  key={p}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                    currentPlayer === p
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted-bg)]"
                  }`}
                >
                  {p}
                  <button
                    onClick={() => removePlayer(p)}
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="tool-card mb-6">
          <h2 className="text-lg font-bold mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORY_COLORS) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                  selectedCategories.has(cat)
                    ? `${CATEGORY_COLORS[cat].bg} ${CATEGORY_COLORS[cat].text} ${CATEGORY_COLORS[cat].border} shadow-md scale-105`
                    : "bg-[var(--muted-bg)] border-transparent opacity-50"
                }`}
              >
                {CATEGORY_EMOJI[cat]} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Game */}
        <div className="tool-card mb-8">
          {/* Current Player */}
          {currentPlayer && (
            <div className="text-center mb-6">
              <p className="text-sm text-[var(--muted)]">It&apos;s your turn!</p>
              <p
                className="text-2xl font-black text-[var(--primary)]"
                style={{ animation: "pulseScale 2s ease-in-out infinite" }}
              >
                {currentPlayer}
              </p>
            </div>
          )}

          {/* Truth or Dare Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => getRandomItem("truth")}
              disabled={isRevealing}
              className="py-6 rounded-2xl text-xl font-black text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
              }}
            >
              {isRevealing && mode === "truth" ? (
                <span className="inline-block animate-spin">🔮</span>
              ) : (
                <>🔮 TRUTH</>
              )}
            </button>
            <button
              onClick={() => getRandomItem("dare")}
              disabled={isRevealing}
              className="py-6 rounded-2xl text-xl font-black text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #ef4444, #f97316)",
                boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
              }}
            >
              {isRevealing && mode === "dare" ? (
                <span className="inline-block animate-spin">🔥</span>
              ) : (
                <>🔥 DARE</>
              )}
            </button>
          </div>

          {/* Result Card */}
          {currentItem && !isRevealing && (
            <div
              className={`p-6 rounded-2xl border-2 text-center ${
                mode === "truth"
                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                  : "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
              }`}
              style={{ animation: "cardReveal 0.5s ease-out" }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    mode === "truth" ? "bg-blue-200 text-blue-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {mode === "truth" ? "🔮 TRUTH" : "🔥 DARE"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[currentItem.category].bg} ${CATEGORY_COLORS[currentItem.category].text}`}
                >
                  {CATEGORY_EMOJI[currentItem.category]} {currentItem.category}
                </span>
              </div>

              <p className="text-xl font-bold leading-relaxed mb-4">{currentItem.text}</p>

              <button
                onClick={() => getRandomItem(mode!)}
                className="px-6 py-2 rounded-xl bg-[var(--muted-bg)] hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Skip / Next
              </button>
            </div>
          )}

          {/* Empty State */}
          {!currentItem && !isRevealing && (
            <div className="text-center py-8 text-[var(--muted)]">
              <p className="text-5xl mb-3">🎲</p>
              <p className="text-lg">Choose Truth or Dare to start!</p>
            </div>
          )}
        </div>

        {/* Stats */}
        {(stats.truths > 0 || stats.dares > 0) && (
          <div className="result-card mb-8">
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-600">{stats.truths}</p>
                  <p className="text-xs text-[var(--muted)]">Truths</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-red-500">{stats.dares}</p>
                  <p className="text-xs text-[var(--muted)]">Dares</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-[var(--primary)]">{stats.truths + stats.dares}</p>
                  <p className="text-xs text-[var(--muted)]">Total Rounds</p>
                </div>
              </div>
              <button
                onClick={resetGame}
                className="px-4 py-2 rounded-lg bg-[var(--muted-bg)] hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Reset Game
              </button>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About Truth or Dare</h2>
          <p>
            Truth or Dare is the ultimate party game! Our digital version comes with over 100 truths and
            100 dares carefully curated for fun, party-appropriate gameplay. Each question is categorized
            so you can customize the experience to your group.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>200+ Questions:</strong> Over 100 truths and 100 dares to keep the game going</li>
            <li><strong>4 Categories:</strong> Funny, Embarrassing, Romantic, and Adventurous</li>
            <li><strong>No Repeats:</strong> The game tracks used questions so you never get the same one twice</li>
            <li><strong>Multiplayer Mode:</strong> Add player names and the game will rotate turns automatically</li>
            <li><strong>Category Filter:</strong> Choose which types of questions you want in the game</li>
          </ul>

          <h2>How to Play</h2>
          <ul>
            <li>Optionally add player names for turn rotation</li>
            <li>Select which categories you want to include</li>
            <li>Click &quot;Truth&quot; or &quot;Dare&quot; to get a random challenge</li>
            <li>Complete the truth or dare, then pass to the next player</li>
            <li>Use &quot;Skip&quot; if you want a different question</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes cardReveal {
          0% {
            opacity: 0;
            transform: scale(0.8) rotateX(20deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateX(0deg);
          }
        }
        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Truth or Dare",
            description: META.description,
            url: `${SITE_URL}/tools/truth-or-dare`,
            applicationCategory: "EntertainmentApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
