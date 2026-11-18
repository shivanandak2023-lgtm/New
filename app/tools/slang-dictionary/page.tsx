"use client";

import { useState, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Slang Dictionary - Internet & Gen-Z Slang Meanings",
  description:
    "Look up 200+ internet and Gen-Z slang terms with meanings, examples, and categories. Searchable slang dictionary for social media, gaming, and texting.",
  keywords: "slang dictionary, gen z slang, internet slang, slang meanings, social media slang, texting slang",
};

type Category = "All" | "Social Media" | "Gaming" | "Texting" | "Emotion" | "Culture";

interface SlangEntry {
  term: string;
  meaning: string;
  example: string;
  category: Category;
}

const CATEGORIES: Category[] = ["All", "Social Media", "Gaming", "Texting", "Emotion", "Culture"];

const SLANG_DATA: SlangEntry[] = [
  { term: "Bussin", meaning: "Extremely good, usually referring to food but can describe anything amazing", example: "This pizza is bussin, you gotta try it!", category: "Culture" },
  { term: "No Cap", meaning: "No lie, for real, telling the truth", example: "No cap, that was the best movie I've ever seen.", category: "Texting" },
  { term: "Slay", meaning: "To do something exceptionally well, to kill it", example: "She slayed that presentation, everyone was impressed.", category: "Culture" },
  { term: "Mid", meaning: "Average, mediocre, nothing special", example: "The new album? It was mid, honestly.", category: "Culture" },
  { term: "Bet", meaning: "Agreement, like saying 'okay' or 'sounds good'", example: "Wanna grab lunch? Bet!", category: "Texting" },
  { term: "Rizz", meaning: "Charisma or charm, especially in flirting", example: "He's got so much rizz, everyone's falling for him.", category: "Culture" },
  { term: "Skibidi", meaning: "A viral meme term, often used humorously or nonsensically", example: "He walked in doing the skibidi dance.", category: "Social Media" },
  { term: "Gyatt", meaning: "Exclamation of surprise or admiration, often about physical appearance", example: "Gyatt! Did you see that outfit?", category: "Social Media" },
  { term: "Sigma", meaning: "An independent, self-reliant person who doesn't follow the crowd", example: "He turned down the party invite, total sigma move.", category: "Culture" },
  { term: "Based", meaning: "Having a bold opinion without caring what others think, authentic", example: "She said exactly what everyone was thinking. So based.", category: "Culture" },
  { term: "Cope", meaning: "To deal with something, often used dismissively about denial", example: "You think that team will win? Cope harder.", category: "Gaming" },
  { term: "Seethe", meaning: "To be extremely angry or upset", example: "He's just seething because he lost the argument.", category: "Emotion" },
  { term: "Ratio", meaning: "When a reply gets more likes than the original post, indicating disagreement", example: "That terrible take got ratio'd instantly.", category: "Social Media" },
  { term: "L", meaning: "A loss or failure", example: "Dropping your phone in the toilet is a massive L.", category: "Texting" },
  { term: "W", meaning: "A win or success", example: "Got a promotion today, big W!", category: "Texting" },
  { term: "Fam", meaning: "Close friends, like family", example: "What's up fam, we still meeting tonight?", category: "Texting" },
  { term: "Lowkey", meaning: "Somewhat, secretly, on the down-low", example: "I lowkey want to skip the party.", category: "Texting" },
  { term: "Highkey", meaning: "Very much, openly, without hiding it", example: "I highkey love that song, it's on repeat.", category: "Texting" },
  { term: "Vibe Check", meaning: "Assessing someone's mood or the atmosphere of a situation", example: "Vibe check! How's everyone feeling tonight?", category: "Culture" },
  { term: "Main Character", meaning: "Acting like you're the protagonist of a story; living life boldly", example: "She walked in like the main character of a movie.", category: "Social Media" },
  { term: "Touch Grass", meaning: "Go outside, stop being chronically online", example: "You've been arguing on Twitter for 6 hours. Touch grass.", category: "Social Media" },
  { term: "NPC", meaning: "Someone who seems to have no original thoughts, like a video game character", example: "He just agrees with everything, total NPC behavior.", category: "Gaming" },
  { term: "Rent Free", meaning: "When something or someone is constantly on your mind", example: "That embarrassing moment is living rent free in my head.", category: "Emotion" },
  { term: "Understood the Assignment", meaning: "Did exactly what was needed, nailed it perfectly", example: "Her outfit for the gala? She understood the assignment.", category: "Culture" },
  { term: "It's Giving", meaning: "It reminds me of, it has the vibe of", example: "That outfit is giving 90s supermodel.", category: "Culture" },
  { term: "Periodt", meaning: "Emphatic version of 'period', end of discussion", example: "She's the best singer of our generation, periodt.", category: "Texting" },
  { term: "Ate and Left No Crumbs", meaning: "Did something perfectly, left nothing to criticize", example: "Her performance? She ate and left no crumbs.", category: "Culture" },
  { term: "Dead", meaning: "Finding something extremely funny", example: "That meme has me dead, I can't stop laughing!", category: "Emotion" },
  { term: "I Can't Even", meaning: "Being so overwhelmed you can't form a response", example: "He said WHAT? I can't even.", category: "Emotion" },
  { term: "Sus", meaning: "Suspicious or shady, from Among Us", example: "Why are you acting so sus right now?", category: "Gaming" },
  { term: "Simp", meaning: "Someone who does too much for a person they like", example: "He bought her flowers every day for a month, total simp.", category: "Social Media" },
  { term: "Stan", meaning: "An extremely devoted fan, or to be a superfan of someone", example: "I stan that artist so hard, I have all their merch.", category: "Social Media" },
  { term: "Ghosting", meaning: "Suddenly cutting off all communication without explanation", example: "We were texting every day and then he ghosted me.", category: "Texting" },
  { term: "Breadcrumbing", meaning: "Sending occasional messages to keep someone interested without committing", example: "She only texts me once a week, classic breadcrumbing.", category: "Texting" },
  { term: "Flex", meaning: "To show off, boast about something", example: "Nice car, but you don't have to flex so hard.", category: "Culture" },
  { term: "Salty", meaning: "Being upset or bitter about something minor", example: "Don't be salty just because you lost the game.", category: "Emotion" },
  { term: "Shook", meaning: "Shocked, surprised, taken aback", example: "I'm shook, I didn't see that plot twist coming.", category: "Emotion" },
  { term: "Tea", meaning: "Gossip, juicy information", example: "Spill the tea! What happened at the party?", category: "Social Media" },
  { term: "Woke", meaning: "Being aware of social and political issues", example: "She's very woke, always advocating for change.", category: "Culture" },
  { term: "Yeet", meaning: "To throw something with force, or an exclamation of excitement", example: "He yeeted his phone across the room in frustration.", category: "Culture" },
  { term: "GOAT", meaning: "Greatest Of All Time", example: "Messi is the GOAT, no debate.", category: "Culture" },
  { term: "FOMO", meaning: "Fear Of Missing Out", example: "I have major FOMO seeing everyone at the concert.", category: "Emotion" },
  { term: "YOLO", meaning: "You Only Live Once, used to justify doing something risky", example: "Should I skydive? YOLO!", category: "Culture" },
  { term: "Bruh", meaning: "Expression of disbelief, disappointment, or used as 'bro'", example: "Bruh, you really just said that out loud?", category: "Texting" },
  { term: "Dank", meaning: "Excellent quality, often used for memes", example: "That meme is dank, post it in the group chat.", category: "Social Media" },
  { term: "Lit", meaning: "Amazing, exciting, fun", example: "The party last night was absolutely lit!", category: "Culture" },
  { term: "Fire", meaning: "Extremely good, hot, impressive", example: "Your new track is fire, keep making music!", category: "Culture" },
  { term: "Drip", meaning: "Fashionable style, cool outfit", example: "Check out his drip, those sneakers are insane.", category: "Culture" },
  { term: "Cap", meaning: "A lie, not true", example: "He said he ran a 4-second 40? That's cap.", category: "Texting" },
  { term: "Bop", meaning: "A really catchy song", example: "This new track is such a bop, I've had it on repeat.", category: "Culture" },
  { term: "Hits Different", meaning: "Something that is uniquely enjoyable in a specific context", example: "Water at 3am just hits different.", category: "Emotion" },
  { term: "Living Rent Free", meaning: "Can't stop thinking about something", example: "That song is living rent free in my head.", category: "Emotion" },
  { term: "Sending Me", meaning: "Making me laugh uncontrollably", example: "That video of the cat is sending me!", category: "Emotion" },
  { term: "Unhinged", meaning: "Wildly chaotic or unpredictable in a funny way", example: "Her tweets are completely unhinged and I love it.", category: "Social Media" },
  { term: "Era", meaning: "A phase or period in someone's life", example: "I'm in my gym era, working out every day.", category: "Culture" },
  { term: "Ick", meaning: "A sudden feeling of disgust toward someone you were attracted to", example: "He chewed with his mouth open. Instant ick.", category: "Emotion" },
  { term: "Beige Flag", meaning: "Something odd or quirky about someone that's not necessarily bad", example: "His beige flag is that he narrates everything he cooks.", category: "Social Media" },
  { term: "Red Flag", meaning: "A warning sign in a person or situation", example: "They got mad when you talked to your friends? Red flag.", category: "Social Media" },
  { term: "Green Flag", meaning: "A positive trait that shows someone is a good partner or person", example: "He remembers small details about your day? Green flag.", category: "Social Media" },
  { term: "Delulu", meaning: "Delusional, usually about romantic expectations", example: "She thinks he'll propose after one date. Totally delulu.", category: "Emotion" },
  { term: "Caught in 4K", meaning: "Caught red-handed with undeniable evidence", example: "He said he was sick but got caught in 4K at the party.", category: "Social Media" },
  { term: "Snatched", meaning: "Looking extremely good, perfectly styled", example: "That waist is snatched, the outfit fits perfectly.", category: "Culture" },
  { term: "Glow Up", meaning: "A major positive transformation in appearance or life", example: "She had the biggest glow up since high school.", category: "Culture" },
  { term: "Cheugy", meaning: "Outdated or trying too hard to be trendy", example: "Live Laugh Love signs are so cheugy now.", category: "Culture" },
  { term: "Boujee", meaning: "Fancy, luxurious, high-class", example: "She only drinks oat milk lattes, so boujee.", category: "Culture" },
  { term: "Vibe", meaning: "A feeling or atmosphere, or to chill and enjoy", example: "The cafe had such a good vibe, we stayed for hours.", category: "Culture" },
  { term: "No Thoughts Head Empty", meaning: "Not thinking about anything, mind is blank", example: "Me during the exam: no thoughts, head empty.", category: "Emotion" },
  { term: "Cringe", meaning: "Something embarrassing or awkward that makes you uncomfortable", example: "That dance was so cringe, I had to look away.", category: "Emotion" },
  { term: "Clout", meaning: "Influence or fame, especially on social media", example: "He's only doing it for clout, not because he cares.", category: "Social Media" },
  { term: "Karen", meaning: "Someone who is entitled and demands to speak to the manager", example: "She went full Karen at the restaurant over a cold fry.", category: "Culture" },
  { term: "Boomer", meaning: "Older person or someone out of touch with current trends", example: "OK boomer, we don't use Facebook anymore.", category: "Culture" },
  { term: "Pick Me", meaning: "Someone who seeks attention by putting down their own group", example: "She's such a pick me, always saying she's not like other girls.", category: "Social Media" },
  { term: "CEO Of", meaning: "Being the best at something", example: "She's the CEO of procrastination, never starts on time.", category: "Social Media" },
  { term: "Hits the Spot", meaning: "Exactly what was needed, perfectly satisfying", example: "That cold drink really hits the spot on a hot day.", category: "Emotion" },
  { term: "Sleeping On", meaning: "Underestimating or not paying attention to something great", example: "You're sleeping on this show, it's incredible.", category: "Culture" },
  { term: "Receipts", meaning: "Proof or evidence, often screenshots", example: "Don't deny it, I have the receipts right here.", category: "Social Media" },
  { term: "Shade", meaning: "Disrespect or criticism, often subtle", example: "Did she just throw shade at my outfit? Rude.", category: "Social Media" },
  { term: "Sipping Tea", meaning: "Enjoying gossip without getting involved", example: "I'm just sitting here sipping tea while they argue.", category: "Social Media" },
  { term: "Secure the Bag", meaning: "Make money, achieve financial success", example: "Got the job offer, time to secure the bag!", category: "Culture" },
  { term: "Big Yikes", meaning: "Something extremely embarrassing or bad", example: "He texted the wrong person. Big yikes.", category: "Emotion" },
  { term: "And I Oop", meaning: "Exclamation when something unexpected happens", example: "She tripped on stage and I oop!", category: "Emotion" },
  { term: "Bestie", meaning: "Best friend, also used casually for anyone you like", example: "Hey bestie, love your outfit today!", category: "Texting" },
  { term: "Iconic", meaning: "Memorable, legendary, worthy of admiration", example: "That comeback was absolutely iconic.", category: "Culture" },
  { term: "IYKYK", meaning: "If You Know, You Know - for inside jokes or shared knowledge", example: "The bathroom on the third floor... IYKYK.", category: "Texting" },
  { term: "Catch Hands", meaning: "To get into a fight, throw punches", example: "Talk about my friend again and you'll catch hands.", category: "Culture" },
  { term: "Clapped", meaning: "Very unattractive or defeated badly", example: "Their team got clapped 10-0 in the finals.", category: "Gaming" },
  { term: "Clutch", meaning: "Coming through at the last moment, crucial save", example: "He scored in the last second, that was so clutch!", category: "Gaming" },
  { term: "GG", meaning: "Good Game, said at the end of a match, sometimes sarcastically", example: "We got destroyed in that round. GG.", category: "Gaming" },
  { term: "Noob", meaning: "A new or inexperienced player", example: "Stop calling me a noob, I just started playing yesterday!", category: "Gaming" },
  { term: "Sweaty", meaning: "Trying extremely hard, often in games, being overly competitive", example: "Why is everyone so sweaty in this lobby?", category: "Gaming" },
  { term: "Nerf", meaning: "To weaken or reduce the power of something", example: "They nerfed my favorite character, he's useless now.", category: "Gaming" },
  { term: "Buff", meaning: "To strengthen or improve something", example: "They need to buff the healing items, they're too weak.", category: "Gaming" },
  { term: "AFK", meaning: "Away From Keyboard, not present or paying attention", example: "Sorry I missed your message, I was AFK.", category: "Gaming" },
  { term: "Respawn", meaning: "To come back after being eliminated", example: "Don't worry, you'll respawn in 10 seconds.", category: "Gaming" },
  { term: "Grind", meaning: "Working hard and persistently toward a goal", example: "I've been on the grind all week studying for exams.", category: "Culture" },
  { term: "GG EZ", meaning: "Good Game, Easy - used to taunt opponents after winning", example: "We won 3-0, GG EZ.", category: "Gaming" },
  { term: "Triggered", meaning: "Being upset or emotionally activated by something", example: "He gets triggered every time someone mentions pineapple on pizza.", category: "Emotion" },
  { term: "Savage", meaning: "Brutally honest or bold without caring", example: "She told him the truth right to his face, absolute savage.", category: "Culture" },
  { term: "Extra", meaning: "Over the top, dramatic, doing too much", example: "She wore a ballgown to a casual dinner, so extra.", category: "Culture" },
  { term: "GOATED", meaning: "Being the greatest, legendary status", example: "That play was goated, nobody's topping that.", category: "Gaming" },
  { term: "Pressed", meaning: "Upset or bothered about something", example: "Why are you so pressed about a game?", category: "Emotion" },
  { term: "No Printer", meaning: "All facts, no lies (extension of 'no cap/fax')", example: "She's the best on the team, no printer.", category: "Texting" },
  { term: "Dub", meaning: "A win (from the W sound)", example: "Getting Friday off is a major dub.", category: "Texting" },
  { term: "On God", meaning: "I swear, seriously, for real", example: "On God, I didn't eat your leftovers.", category: "Texting" },
  { term: "Bussin Bussin", meaning: "Even more emphatic version of bussin, extremely good", example: "Grandma's cooking is bussin bussin, no debate.", category: "Culture" },
  { term: "Caught a Body", meaning: "Destroyed someone in an argument or competition", example: "She caught a body in that debate, nobody could respond.", category: "Culture" },
  { term: "Put On Blast", meaning: "To publicly expose or call someone out", example: "She put him on blast for lying about his age.", category: "Social Media" },
  { term: "Finna", meaning: "Going to, about to", example: "I'm finna head out, see you tomorrow.", category: "Texting" },
  { term: "Bustin", meaning: "Doing something with energy and enthusiasm", example: "He was bustin moves on the dance floor all night.", category: "Culture" },
  { term: "Pog", meaning: "Exciting, impressive (from PogChamp Twitch emote)", example: "That last-second save was so pog!", category: "Gaming" },
  { term: "Malding", meaning: "Being mad and balding from stress (mad + balding)", example: "He's malding over losing three games in a row.", category: "Gaming" },
  { term: "Copium", meaning: "Coping mechanism, often delusional optimism after a loss", example: "He says they'll win next year, pure copium.", category: "Gaming" },
  { term: "Ratioed", meaning: "When your reply gets more engagement than the original post", example: "The company's tweet got ratioed after their bad take.", category: "Social Media" },
  { term: "Main Character Energy", meaning: "Acting with confidence as if the world revolves around you", example: "Walking into the office like that? Main character energy.", category: "Culture" },
  { term: "Roman Empire", meaning: "Something you think about constantly", example: "The Roman Empire for me is what I'd do in a zombie apocalypse.", category: "Social Media" },
  { term: "Ate That", meaning: "Did something perfectly, nailed it", example: "She ate that performance, standing ovation!", category: "Culture" },
  { term: "Mother", meaning: "A term of admiration for someone who is iconic or flawless", example: "Beyonce walked out on stage and she is mother.", category: "Culture" },
  { term: "Serve", meaning: "To impress, especially with fashion or attitude", example: "She served looks at the red carpet event.", category: "Culture" },
  { term: "Giving Nothing", meaning: "Boring, unimpressive, not delivering", example: "His speech was giving nothing, everyone fell asleep.", category: "Culture" },
  { term: "Brain Rot", meaning: "When too much internet consumption affects your thinking", example: "I've been scrolling TikTok so long I have brain rot.", category: "Social Media" },
  { term: "Aura", meaning: "Someone's vibe or energy that people can sense", example: "He walked in and his aura was immaculate.", category: "Culture" },
  { term: "Lore", meaning: "Someone's backstory or personal history", example: "Wait, what's your lore? How did you end up here?", category: "Social Media" },
  { term: "Canon Event", meaning: "An unavoidable life experience that shapes who you become", example: "Getting your heart broken is a canon event, everyone goes through it.", category: "Culture" },
  { term: "Plot Armor", meaning: "Being inexplicably lucky, as if protected by a storyline", example: "He tripped, fell, and still scored. That's plot armor.", category: "Gaming" },
  { term: "NPC Energy", meaning: "Acting mindlessly or without independent thought", example: "He just stands there smiling. Pure NPC energy.", category: "Gaming" },
  { term: "Opp", meaning: "Opposition, enemy, someone you have beef with", example: "Watch out, the opps are in the building.", category: "Culture" },
  { term: "Beef", meaning: "A conflict, disagreement, or grudge", example: "Those two have had beef since middle school.", category: "Culture" },
  { term: "Snatched My Wig", meaning: "Something so impressive it shocked you", example: "That plot twist snatched my wig!", category: "Emotion" },
  { term: "Understood the Read", meaning: "Knew exactly what was meant without it being spelled out", example: "She gave one look and he understood the read.", category: "Culture" },
  { term: "Take Several Seats", meaning: "Sit down and stop talking, calm down", example: "You're wrong and you need to take several seats.", category: "Culture" },
  { term: "SMH", meaning: "Shaking My Head, expressing disappointment", example: "He forgot our anniversary again, SMH.", category: "Texting" },
  { term: "TBH", meaning: "To Be Honest", example: "TBH, I didn't really like the movie.", category: "Texting" },
  { term: "IMO", meaning: "In My Opinion", example: "IMO, pineapple does belong on pizza.", category: "Texting" },
  { term: "LMAO", meaning: "Laughing My A** Off", example: "He tripped over nothing, LMAO!", category: "Texting" },
  { term: "ROFL", meaning: "Rolling On the Floor Laughing", example: "That prank video had me ROFL.", category: "Texting" },
  { term: "FTW", meaning: "For The Win", example: "Free pizza at the office FTW!", category: "Texting" },
  { term: "IRL", meaning: "In Real Life", example: "She's even funnier IRL than online.", category: "Texting" },
  { term: "IIRC", meaning: "If I Remember Correctly", example: "IIRC, the meeting was moved to Thursday.", category: "Texting" },
  { term: "TLDR", meaning: "Too Long, Didn't Read - a summary", example: "TLDR: the update broke everything and they're fixing it.", category: "Texting" },
  { term: "Banger", meaning: "An excellent song, post, or thing", example: "Every track on this album is a banger.", category: "Culture" },
  { term: "Chef's Kiss", meaning: "Something is absolutely perfect", example: "The seasoning on this steak? Chef's kiss.", category: "Culture" },
  { term: "Vibe Check Failed", meaning: "Bad energy, negative atmosphere", example: "He showed up angry to the party. Vibe check failed.", category: "Emotion" },
  { term: "Soft Launch", meaning: "Subtly revealing a new relationship on social media", example: "She posted a hand in her photo, classic soft launch.", category: "Social Media" },
  { term: "Hard Launch", meaning: "Officially revealing a relationship publicly", example: "They did a hard launch with matching photos.", category: "Social Media" },
  { term: "Situationship", meaning: "A romantic relationship that isn't officially defined", example: "We're not dating but we're not just friends... it's a situationship.", category: "Culture" },
  { term: "Gatekeep", meaning: "To keep something exclusive, not sharing with others", example: "Stop gatekeeping that restaurant, tell me where it is!", category: "Social Media" },
  { term: "Gaslight", meaning: "To manipulate someone into questioning their reality", example: "Don't try to gaslight me, I know what happened.", category: "Culture" },
  { term: "Girlboss", meaning: "An ambitious woman, sometimes used sarcastically", example: "She quit her job and started a business, total girlboss.", category: "Culture" },
  { term: "Girly Pop", meaning: "Term of endearment for a friend, often used playfully", example: "Hey girly pop, love the new haircut!", category: "Texting" },
  { term: "Chefs Table", meaning: "Top tier, premium experience", example: "VIP tickets to the concert? That's the chef's table.", category: "Culture" },
  { term: "Its the... for me", meaning: "Highlighting something notable about a person or thing", example: "It's the confidence for me.", category: "Social Media" },
  { term: "Say Less", meaning: "I understand, no need to explain further", example: "Free food at your place? Say less, I'm on my way.", category: "Texting" },
  { term: "Bussin' No Cap", meaning: "Really good, and I'm not lying about it", example: "These tacos are bussin' no cap.", category: "Culture" },
  { term: "Rent Free Living", meaning: "Constantly thinking about something you can't forget", example: "That embarrassing thing from 5 years ago? Rent free living.", category: "Emotion" },
  { term: "Main Quest", meaning: "Your primary focus or purpose right now", example: "School is the main quest, everything else is a side quest.", category: "Gaming" },
  { term: "Side Quest", meaning: "A distraction or secondary activity", example: "Going to the gym is my current side quest.", category: "Gaming" },
  { term: "Loot", meaning: "Goods, items, or rewards, often used about shopping", example: "Look at all the loot I got from the sale!", category: "Gaming" },
  { term: "Spawn Point", meaning: "Where you start or where you're from", example: "My spawn point was a small town in Ohio.", category: "Gaming" },
  { term: "Glitch in the Matrix", meaning: "Something eerily coincidental or unexplainable", example: "I saw the same car three times today, glitch in the matrix.", category: "Culture" },
  { term: "POV", meaning: "Point of View, used to set up a scenario", example: "POV: you just realized tomorrow is Monday.", category: "Social Media" },
  { term: "FYP", meaning: "For You Page on TikTok", example: "This video showed up on my FYP and I can't stop watching.", category: "Social Media" },
  { term: "Moots", meaning: "Mutual followers on social media", example: "Any moots want to meet up at the event?", category: "Social Media" },
  { term: "Chefs Kiss Emoji Level", meaning: "Absolutely perfection, top-tier quality", example: "The sunset tonight was chef's kiss emoji level.", category: "Culture" },
  { term: "Ate", meaning: "Did something really well, killed it", example: "She ate that dance routine, nobody could keep up.", category: "Culture" },
  { term: "Devious Lick", meaning: "Stealing something, originally a TikTok trend", example: "Someone took a devious lick on the classroom supplies.", category: "Social Media" },
  { term: "Bussin' on God", meaning: "Extremely good, I swear on everything", example: "These wings are bussin' on God.", category: "Culture" },
  { term: "Ohio", meaning: "Used to describe bizarre, cursed, or unhinged situations", example: "Only in Ohio would you see that kind of chaos.", category: "Social Media" },
  { term: "W Rizz", meaning: "Very good charisma, winning charm", example: "He got her number in 5 seconds, that's W rizz.", category: "Culture" },
  { term: "L Rizz", meaning: "Terrible charisma, failing at flirting", example: "He tripped and spilled coffee on her. L rizz.", category: "Culture" },
  { term: "Gyat Dayum", meaning: "Exaggerated exclamation of surprise and admiration", example: "Gyat dayum, that car is gorgeous!", category: "Social Media" },
  { term: "Skibidi Toilet", meaning: "A popular absurdist YouTube series/meme", example: "My little brother won't stop watching Skibidi Toilet.", category: "Social Media" },
  { term: "Hawk Tuah", meaning: "A viral meme phrase that went massively viral in 2024", example: "Everyone kept referencing hawk tuah for weeks.", category: "Social Media" },
  { term: "Demure", meaning: "Modest, reserved, and mindful (often used playfully)", example: "Very demure, very mindful, very cutesy.", category: "Culture" },
  { term: "Brat", meaning: "Embracing a fun, rebellious, carefree attitude", example: "It's brat summer, we're not following any rules.", category: "Culture" },
  { term: "Mewing", meaning: "A tongue posture technique for jawline improvement, also a meme", example: "He's been mewing for 3 months trying to get a jawline.", category: "Social Media" },
  { term: "Mogging", meaning: "Being so attractive you overshadow everyone around you", example: "He walked into the room and mogged everyone.", category: "Culture" },
  { term: "Fanum Tax", meaning: "Taking a portion of someone's food", example: "He took a fanum tax on my fries without asking!", category: "Social Media" },
  { term: "Crashout", meaning: "To completely lose control or have a breakdown", example: "She had a full crashout after seeing the exam results.", category: "Emotion" },
  { term: "Yap", meaning: "To talk excessively or for too long", example: "He was yapping for 20 minutes about nothing.", category: "Texting" },
  { term: "Glazing", meaning: "Excessively praising or flattering someone", example: "Stop glazing, he's not that good at basketball.", category: "Social Media" },
  { term: "Lock In", meaning: "To focus intensely, get serious about a task", example: "Finals are next week, time to lock in.", category: "Culture" },
  { term: "Its Joever", meaning: "It's over, things have gone badly (Joe + over)", example: "Failed the exam... it's joever.", category: "Emotion" },
  { term: "We're So Back", meaning: "Things have improved, optimism is restored", example: "They announced a new season! We're so back!", category: "Emotion" },
  { term: "Cooked", meaning: "In big trouble, or completely done for", example: "I haven't studied and the test is tomorrow. I'm cooked.", category: "Emotion" },
  { term: "Ong", meaning: "On God, meaning seriously or truthfully", example: "Ong that was the best burger I've ever had.", category: "Texting" },
  { term: "FR FR", meaning: "For Real For Real, emphasizing truthfulness", example: "That show is good FR FR, not just saying it.", category: "Texting" },
  { term: "Pookie", meaning: "A cute nickname for a loved one or friend", example: "Hey pookie, want to grab coffee?", category: "Texting" },
  { term: "Valid", meaning: "Acceptable, reasonable, makes sense", example: "Not wanting to go out tonight? That's valid.", category: "Culture" },
  { term: "Hits", meaning: "Is really good, satisfying", example: "This coffee hits in the morning.", category: "Culture" },
  { term: "Slaps", meaning: "Is excellent, especially music", example: "This song absolutely slaps, turn it up!", category: "Culture" },
  { term: "Chief Called", meaning: "This ain't it, chief - something is bad", example: "That outfit? Chief called, this ain't it.", category: "Culture" },
  { term: "Goofy", meaning: "Being silly, acting foolish", example: "Stop being goofy and take this seriously.", category: "Emotion" },
  { term: "Tweaking", meaning: "Acting strange, overreacting, or being ridiculous", example: "You're tweaking if you think that's a good idea.", category: "Emotion" },
  { term: "Its Giving Boss", meaning: "Radiating confidence and authority", example: "Walking into the meeting in that suit? It's giving boss.", category: "Culture" },
  { term: "Understood the Vibe", meaning: "Perfectly matched the mood or situation", example: "The DJ understood the vibe perfectly, everyone was dancing.", category: "Culture" },
  { term: "Chief", meaning: "Used to address someone, often in 'this ain't it chief'", example: "This ain't it, chief. Try again.", category: "Texting" },
  { term: "Big Brain", meaning: "Very smart or clever move", example: "Using the coupon before it expired was such a big brain move.", category: "Gaming" },
  { term: "Galaxy Brain", meaning: "An idea so advanced it's either genius or absurd", example: "His plan to solve traffic by making cars fly is galaxy brain.", category: "Gaming" },
  { term: "Skill Issue", meaning: "The problem is your lack of ability, not the game/situation", example: "You keep losing? Sounds like a skill issue.", category: "Gaming" },
  { term: "GGs Only", meaning: "Only good vibes and good sportsmanship", example: "Win or lose, it's GGs only tonight.", category: "Gaming" },
  { term: "Touch Some Grass", meaning: "Go outside, you've been online too long", example: "You've posted 50 times today, go touch some grass.", category: "Social Media" },
  { term: "Chronically Online", meaning: "Spending too much time on the internet", example: "If you get that reference, you might be chronically online.", category: "Social Media" },
  { term: "Real", meaning: "Authentic, true, agreeing with someone", example: "That's so real, I feel the same way.", category: "Texting" },
  { term: "Its Not That Deep", meaning: "You're overthinking it, don't take it so seriously", example: "It's just a meme, it's not that deep.", category: "Texting" },
  { term: "Naur", meaning: "Exaggerated way of saying 'no' (Australian accent)", example: "Do I want to go outside? Naur.", category: "Texting" },
  { term: "Purr", meaning: "Expression of approval, like 'yes queen'", example: "That outfit? Purr, you look amazing!", category: "Culture" },
  { term: "Sike", meaning: "Just kidding, gotcha!", example: "I'm buying everyone dinner... sike!", category: "Texting" },
  { term: "No Body No Crime", meaning: "If there's no evidence, it didn't happen", example: "I ate the last cookie but no body no crime.", category: "Culture" },
  { term: "Take the L", meaning: "Accept the loss and move on", example: "You lost the bet, just take the L gracefully.", category: "Texting" },
  { term: "Its Giving Vibes", meaning: "It has a certain feeling or atmosphere", example: "This coffee shop is giving cozy vibes.", category: "Culture" },
  { term: "Caught Lackin", meaning: "Caught off guard or unprepared", example: "She got caught lackin' without her makeup on.", category: "Culture" },
  { term: "Gassed", meaning: "Overly hyped up or flattered", example: "Don't get too gassed, it was just one good game.", category: "Emotion" },
  { term: "Bodied", meaning: "Completely destroyed or dominated", example: "She bodied that exam, got the highest score.", category: "Culture" },
  { term: "IJBOL", meaning: "I Just Burst Out Laughing", example: "He fell off his chair in class, IJBOL!", category: "Texting" },
  { term: "Ate That Up", meaning: "Did something impressively well", example: "She ate that job interview up!", category: "Culture" },
  { term: "Era Check", meaning: "What phase of life are you in right now?", example: "Era check: I'm in my productive era.", category: "Culture" },
];

export default function SlangDictionaryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = SLANG_DATA;
    if (category !== "All") {
      results = results.filter((s) => s.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (s) =>
          s.term.toLowerCase().includes(q) ||
          s.meaning.toLowerCase().includes(q)
      );
    }
    return results;
  }, [search, category]);

  function randomSlang() {
    const item = SLANG_DATA[Math.floor(Math.random() * SLANG_DATA.length)];
    setSearch("");
    setCategory("All");
    setExpanded(item.term);
    const el = document.getElementById(`slang-${item.term.replace(/\s+/g, "-").toLowerCase()}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SLANG_DATA.length };
    SLANG_DATA.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/slang-dictionary`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Slang Dictionary</h1>
        <p className="text-[var(--muted)] mb-8">
          Look up {SLANG_DATA.length}+ internet and Gen-Z slang terms with meanings, examples, and categories.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
                placeholder="Search slang terms..."
              />
            </div>
            <button onClick={randomSlang} className="btn-primary whitespace-nowrap">
              Random Slang
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted-bg)] text-[var(--foreground)] border border-[var(--card-border)] hover:bg-[var(--card-border)]"
                }`}
              >
                {cat} ({categoryCounts[cat] || 0})
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-[var(--muted)] mb-4">
          Showing {filtered.length} of {SLANG_DATA.length} terms
        </p>

        <div className="space-y-2 mb-8">
          {filtered.map((entry) => {
            const isOpen = expanded === entry.term;
            const id = `slang-${entry.term.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <div
                key={entry.term}
                id={id}
                className="tool-card cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : entry.term)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{entry.term}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted-bg)] text-[var(--muted)] border border-[var(--card-border)]">
                      {entry.category}
                    </span>
                  </div>
                  <span className="text-[var(--muted)] text-sm">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
                    <p className="text-[var(--foreground)] mb-2">
                      <span className="font-medium">Meaning:</span> {entry.meaning}
                    </p>
                    <p className="text-[var(--muted)] italic text-sm">
                      <span className="font-medium not-italic text-[var(--foreground)]">Example:</span> &ldquo;{entry.example}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="tool-card text-center py-8">
              <p className="text-[var(--muted)]">No slang terms found. Try a different search or category.</p>
            </div>
          )}
        </div>

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is Internet Slang?</h2>
          <p>
            Internet slang consists of informal words and phrases that originate from online communities, social media
            platforms, and digital communication. These terms evolve rapidly and are often popularized by younger
            generations, especially Gen-Z users on platforms like TikTok, Twitter, and Discord.
          </p>

          <h2>Why Learn Internet Slang?</h2>
          <ul>
            <li>Stay current with how young people communicate online</li>
            <li>Understand social media posts, memes, and comments</li>
            <li>Communicate more naturally in digital spaces</li>
            <li>Keep up with pop culture references and trends</li>
            <li>Bridge generational communication gaps</li>
          </ul>

          <h2>Slang Categories Explained</h2>
          <ul>
            <li><strong>Social Media:</strong> Terms originating from platforms like TikTok, Twitter, and Instagram</li>
            <li><strong>Gaming:</strong> Language used in video games and streaming communities</li>
            <li><strong>Texting:</strong> Abbreviations and shorthand for messaging</li>
            <li><strong>Emotion:</strong> Words describing feelings and reactions</li>
            <li><strong>Culture:</strong> Broader cultural terms and lifestyle expressions</li>
          </ul>

          <h2>How Slang Evolves</h2>
          <p>
            Internet slang evolves at a rapid pace. What was trendy last year might be considered outdated today. Social
            media platforms accelerate this evolution, with new terms going viral overnight. Many slang terms originate
            from AAVE (African American Vernacular English), gaming communities, and international internet culture.
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
            name: "Slang Dictionary",
            description: META.description,
            url: `${SITE_URL}/tools/slang-dictionary`,
            applicationCategory: "ReferenceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
