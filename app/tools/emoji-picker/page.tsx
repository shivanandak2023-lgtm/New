"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Emoji Picker - Copy and Paste Emojis Online",
  description:
    "Free Emoji Picker with 500+ emojis organized by category. Search, click to copy, recently used history, and skin tone selector. Copy and paste emojis anywhere.",
  keywords: "emoji picker, emoji copy paste, emoji keyboard online, emoji list, copy emoji, emoji search",
};

interface EmojiItem {
  emoji: string;
  name: string;
  category: string;
  skinTone?: boolean;
}

const SKIN_TONES = [
  { label: "Default", modifier: "" },
  { label: "Light", modifier: "\u{1F3FB}" },
  { label: "Medium-Light", modifier: "\u{1F3FC}" },
  { label: "Medium", modifier: "\u{1F3FD}" },
  { label: "Medium-Dark", modifier: "\u{1F3FE}" },
  { label: "Dark", modifier: "\u{1F3FF}" },
];

const CATEGORIES = [
  "Smileys",
  "People",
  "Animals",
  "Food",
  "Travel",
  "Activities",
  "Objects",
  "Symbols",
  "Flags",
];

const EMOJIS: EmojiItem[] = [
  // Smileys (60+)
  { emoji: "\u{1F600}", name: "grinning face", category: "Smileys" },
  { emoji: "\u{1F601}", name: "beaming face", category: "Smileys" },
  { emoji: "\u{1F602}", name: "face with tears of joy", category: "Smileys" },
  { emoji: "\u{1F923}", name: "rolling on the floor laughing", category: "Smileys" },
  { emoji: "\u{1F603}", name: "smiley face with open mouth", category: "Smileys" },
  { emoji: "\u{1F604}", name: "smiling face with open mouth and eyes", category: "Smileys" },
  { emoji: "\u{1F605}", name: "smiling face with sweat", category: "Smileys" },
  { emoji: "\u{1F606}", name: "laughing squinting face", category: "Smileys" },
  { emoji: "\u{1F609}", name: "winking face", category: "Smileys" },
  { emoji: "\u{1F60A}", name: "smiling face with smiling eyes", category: "Smileys" },
  { emoji: "\u{1F60B}", name: "face savoring food", category: "Smileys" },
  { emoji: "\u{1F60E}", name: "smiling face with sunglasses", category: "Smileys" },
  { emoji: "\u{1F60D}", name: "heart eyes", category: "Smileys" },
  { emoji: "\u{1F618}", name: "face blowing a kiss", category: "Smileys" },
  { emoji: "\u{1F617}", name: "kissing face", category: "Smileys" },
  { emoji: "\u{1F619}", name: "kissing face with smiling eyes", category: "Smileys" },
  { emoji: "\u{1F61A}", name: "kissing face with closed eyes", category: "Smileys" },
  { emoji: "\u{263A}\u{FE0F}", name: "smiling face", category: "Smileys" },
  { emoji: "\u{1F642}", name: "slightly smiling face", category: "Smileys" },
  { emoji: "\u{1F917}", name: "hugging face", category: "Smileys" },
  { emoji: "\u{1F929}", name: "star struck", category: "Smileys" },
  { emoji: "\u{1F914}", name: "thinking face", category: "Smileys" },
  { emoji: "\u{1F928}", name: "face with raised eyebrow", category: "Smileys" },
  { emoji: "\u{1F610}", name: "neutral face", category: "Smileys" },
  { emoji: "\u{1F611}", name: "expressionless face", category: "Smileys" },
  { emoji: "\u{1F636}", name: "face without mouth", category: "Smileys" },
  { emoji: "\u{1F60F}", name: "smirking face", category: "Smileys" },
  { emoji: "\u{1F612}", name: "unamused face", category: "Smileys" },
  { emoji: "\u{1F644}", name: "face with rolling eyes", category: "Smileys" },
  { emoji: "\u{1F62C}", name: "grimacing face", category: "Smileys" },
  { emoji: "\u{1F925}", name: "lying face", category: "Smileys" },
  { emoji: "\u{1F60C}", name: "relieved face", category: "Smileys" },
  { emoji: "\u{1F614}", name: "pensive face", category: "Smileys" },
  { emoji: "\u{1F62A}", name: "sleepy face", category: "Smileys" },
  { emoji: "\u{1F924}", name: "drooling face", category: "Smileys" },
  { emoji: "\u{1F634}", name: "sleeping face", category: "Smileys" },
  { emoji: "\u{1F637}", name: "face with medical mask", category: "Smileys" },
  { emoji: "\u{1F912}", name: "face with thermometer", category: "Smileys" },
  { emoji: "\u{1F915}", name: "face with head bandage", category: "Smileys" },
  { emoji: "\u{1F922}", name: "nauseated face", category: "Smileys" },
  { emoji: "\u{1F92E}", name: "vomiting face", category: "Smileys" },
  { emoji: "\u{1F927}", name: "sneezing face", category: "Smileys" },
  { emoji: "\u{1F975}", name: "hot face", category: "Smileys" },
  { emoji: "\u{1F976}", name: "cold face", category: "Smileys" },
  { emoji: "\u{1F974}", name: "woozy face", category: "Smileys" },
  { emoji: "\u{1F635}", name: "dizzy face", category: "Smileys" },
  { emoji: "\u{1F621}", name: "pouting face", category: "Smileys" },
  { emoji: "\u{1F620}", name: "angry face", category: "Smileys" },
  { emoji: "\u{1F92C}", name: "face with symbols on mouth", category: "Smileys" },
  { emoji: "\u{1F608}", name: "smiling face with horns", category: "Smileys" },
  { emoji: "\u{1F47F}", name: "angry face with horns", category: "Smileys" },
  { emoji: "\u{1F480}", name: "skull", category: "Smileys" },
  { emoji: "\u{2620}\u{FE0F}", name: "skull and crossbones", category: "Smileys" },
  { emoji: "\u{1F4A9}", name: "pile of poo", category: "Smileys" },
  { emoji: "\u{1F921}", name: "clown face", category: "Smileys" },
  { emoji: "\u{1F479}", name: "ogre", category: "Smileys" },
  { emoji: "\u{1F47A}", name: "goblin", category: "Smileys" },
  { emoji: "\u{1F47B}", name: "ghost", category: "Smileys" },
  { emoji: "\u{1F47D}", name: "alien", category: "Smileys" },
  { emoji: "\u{1F916}", name: "robot", category: "Smileys" },
  { emoji: "\u{1F63A}", name: "grinning cat", category: "Smileys" },
  { emoji: "\u{1F63B}", name: "heart eyes cat", category: "Smileys" },
  { emoji: "\u{1F63C}", name: "cat with wry smile", category: "Smileys" },
  { emoji: "\u{1F63D}", name: "kissing cat", category: "Smileys" },
  { emoji: "\u{1F640}", name: "weary cat", category: "Smileys" },
  { emoji: "\u{1F63F}", name: "crying cat", category: "Smileys" },
  { emoji: "\u{1F63E}", name: "pouting cat", category: "Smileys" },
  { emoji: "\u{1F648}", name: "see no evil monkey", category: "Smileys" },
  { emoji: "\u{1F649}", name: "hear no evil monkey", category: "Smileys" },
  { emoji: "\u{1F64A}", name: "speak no evil monkey", category: "Smileys" },
  // People (60+)
  { emoji: "\u{1F44B}", name: "waving hand", category: "People", skinTone: true },
  { emoji: "\u{1F91A}", name: "raised back of hand", category: "People", skinTone: true },
  { emoji: "\u{1F590}\u{FE0F}", name: "hand with fingers splayed", category: "People", skinTone: true },
  { emoji: "\u{270B}", name: "raised hand", category: "People", skinTone: true },
  { emoji: "\u{1F596}", name: "vulcan salute", category: "People", skinTone: true },
  { emoji: "\u{1F44C}", name: "ok hand", category: "People", skinTone: true },
  { emoji: "\u{1F90F}", name: "pinching hand", category: "People", skinTone: true },
  { emoji: "\u{270C}\u{FE0F}", name: "victory hand", category: "People", skinTone: true },
  { emoji: "\u{1F91E}", name: "crossed fingers", category: "People", skinTone: true },
  { emoji: "\u{1F91F}", name: "love you gesture", category: "People", skinTone: true },
  { emoji: "\u{1F918}", name: "sign of the horns", category: "People", skinTone: true },
  { emoji: "\u{1F919}", name: "call me hand", category: "People", skinTone: true },
  { emoji: "\u{1F448}", name: "backhand pointing left", category: "People", skinTone: true },
  { emoji: "\u{1F449}", name: "backhand pointing right", category: "People", skinTone: true },
  { emoji: "\u{1F446}", name: "backhand pointing up", category: "People", skinTone: true },
  { emoji: "\u{1F595}", name: "middle finger", category: "People", skinTone: true },
  { emoji: "\u{1F447}", name: "backhand pointing down", category: "People", skinTone: true },
  { emoji: "\u{261D}\u{FE0F}", name: "index pointing up", category: "People", skinTone: true },
  { emoji: "\u{1F44D}", name: "thumbs up", category: "People", skinTone: true },
  { emoji: "\u{1F44E}", name: "thumbs down", category: "People", skinTone: true },
  { emoji: "\u{270A}", name: "raised fist", category: "People", skinTone: true },
  { emoji: "\u{1F44A}", name: "oncoming fist", category: "People", skinTone: true },
  { emoji: "\u{1F91B}", name: "left facing fist", category: "People", skinTone: true },
  { emoji: "\u{1F91C}", name: "right facing fist", category: "People", skinTone: true },
  { emoji: "\u{1F44F}", name: "clapping hands", category: "People", skinTone: true },
  { emoji: "\u{1F64C}", name: "raising hands", category: "People", skinTone: true },
  { emoji: "\u{1F450}", name: "open hands", category: "People", skinTone: true },
  { emoji: "\u{1F932}", name: "palms up together", category: "People", skinTone: true },
  { emoji: "\u{1F91D}", name: "handshake", category: "People" },
  { emoji: "\u{1F64F}", name: "folded hands", category: "People", skinTone: true },
  { emoji: "\u{270D}\u{FE0F}", name: "writing hand", category: "People", skinTone: true },
  { emoji: "\u{1F485}", name: "nail polish", category: "People", skinTone: true },
  { emoji: "\u{1F933}", name: "selfie", category: "People", skinTone: true },
  { emoji: "\u{1F4AA}", name: "flexed biceps", category: "People", skinTone: true },
  { emoji: "\u{1F9B5}", name: "leg", category: "People", skinTone: true },
  { emoji: "\u{1F9B6}", name: "foot", category: "People", skinTone: true },
  { emoji: "\u{1F442}", name: "ear", category: "People", skinTone: true },
  { emoji: "\u{1F443}", name: "nose", category: "People", skinTone: true },
  { emoji: "\u{1F9E0}", name: "brain", category: "People" },
  { emoji: "\u{1F441}\u{FE0F}", name: "eye", category: "People" },
  { emoji: "\u{1F440}", name: "eyes", category: "People" },
  { emoji: "\u{1F445}", name: "tongue", category: "People" },
  { emoji: "\u{1F444}", name: "mouth", category: "People" },
  { emoji: "\u{1F476}", name: "baby", category: "People", skinTone: true },
  { emoji: "\u{1F9D2}", name: "child", category: "People", skinTone: true },
  { emoji: "\u{1F466}", name: "boy", category: "People", skinTone: true },
  { emoji: "\u{1F467}", name: "girl", category: "People", skinTone: true },
  { emoji: "\u{1F9D1}", name: "person", category: "People", skinTone: true },
  { emoji: "\u{1F468}", name: "man", category: "People", skinTone: true },
  { emoji: "\u{1F469}", name: "woman", category: "People", skinTone: true },
  { emoji: "\u{1F9D3}", name: "older person", category: "People", skinTone: true },
  { emoji: "\u{1F474}", name: "old man", category: "People", skinTone: true },
  { emoji: "\u{1F475}", name: "old woman", category: "People", skinTone: true },
  { emoji: "\u{1F46E}", name: "police officer", category: "People", skinTone: true },
  { emoji: "\u{1F477}", name: "construction worker", category: "People", skinTone: true },
  { emoji: "\u{1F478}", name: "princess", category: "People", skinTone: true },
  { emoji: "\u{1F934}", name: "prince", category: "People", skinTone: true },
  { emoji: "\u{1F470}", name: "person with veil", category: "People", skinTone: true },
  { emoji: "\u{1F935}", name: "person in tuxedo", category: "People", skinTone: true },
  { emoji: "\u{1F936}", name: "Mrs Claus", category: "People", skinTone: true },
  { emoji: "\u{1F385}", name: "Santa Claus", category: "People", skinTone: true },
  { emoji: "\u{1F9B8}", name: "superhero", category: "People", skinTone: true },
  { emoji: "\u{1F9B9}", name: "supervillain", category: "People", skinTone: true },
  // Animals (60+)
  { emoji: "\u{1F436}", name: "dog face", category: "Animals" },
  { emoji: "\u{1F431}", name: "cat face", category: "Animals" },
  { emoji: "\u{1F42D}", name: "mouse face", category: "Animals" },
  { emoji: "\u{1F439}", name: "hamster", category: "Animals" },
  { emoji: "\u{1F430}", name: "rabbit face", category: "Animals" },
  { emoji: "\u{1F98A}", name: "fox", category: "Animals" },
  { emoji: "\u{1F43B}", name: "bear", category: "Animals" },
  { emoji: "\u{1F43C}", name: "panda", category: "Animals" },
  { emoji: "\u{1F428}", name: "koala", category: "Animals" },
  { emoji: "\u{1F42F}", name: "tiger face", category: "Animals" },
  { emoji: "\u{1F981}", name: "lion", category: "Animals" },
  { emoji: "\u{1F42E}", name: "cow face", category: "Animals" },
  { emoji: "\u{1F437}", name: "pig face", category: "Animals" },
  { emoji: "\u{1F43D}", name: "pig nose", category: "Animals" },
  { emoji: "\u{1F438}", name: "frog", category: "Animals" },
  { emoji: "\u{1F435}", name: "monkey face", category: "Animals" },
  { emoji: "\u{1F412}", name: "monkey", category: "Animals" },
  { emoji: "\u{1F414}", name: "chicken", category: "Animals" },
  { emoji: "\u{1F427}", name: "penguin", category: "Animals" },
  { emoji: "\u{1F426}", name: "bird", category: "Animals" },
  { emoji: "\u{1F424}", name: "baby chick", category: "Animals" },
  { emoji: "\u{1F986}", name: "duck", category: "Animals" },
  { emoji: "\u{1F985}", name: "eagle", category: "Animals" },
  { emoji: "\u{1F989}", name: "owl", category: "Animals" },
  { emoji: "\u{1F987}", name: "bat", category: "Animals" },
  { emoji: "\u{1F43A}", name: "wolf", category: "Animals" },
  { emoji: "\u{1F417}", name: "boar", category: "Animals" },
  { emoji: "\u{1F434}", name: "horse face", category: "Animals" },
  { emoji: "\u{1F984}", name: "unicorn", category: "Animals" },
  { emoji: "\u{1F41D}", name: "honeybee", category: "Animals" },
  { emoji: "\u{1F41B}", name: "bug", category: "Animals" },
  { emoji: "\u{1F98B}", name: "butterfly", category: "Animals" },
  { emoji: "\u{1F40C}", name: "snail", category: "Animals" },
  { emoji: "\u{1F41A}", name: "spiral shell", category: "Animals" },
  { emoji: "\u{1F41E}", name: "lady beetle", category: "Animals" },
  { emoji: "\u{1F41C}", name: "ant", category: "Animals" },
  { emoji: "\u{1F997}", name: "cricket", category: "Animals" },
  { emoji: "\u{1F577}\u{FE0F}", name: "spider", category: "Animals" },
  { emoji: "\u{1F578}\u{FE0F}", name: "spider web", category: "Animals" },
  { emoji: "\u{1F422}", name: "turtle", category: "Animals" },
  { emoji: "\u{1F40D}", name: "snake", category: "Animals" },
  { emoji: "\u{1F98E}", name: "lizard", category: "Animals" },
  { emoji: "\u{1F982}", name: "scorpion", category: "Animals" },
  { emoji: "\u{1F980}", name: "crab", category: "Animals" },
  { emoji: "\u{1F990}", name: "shrimp", category: "Animals" },
  { emoji: "\u{1F991}", name: "squid", category: "Animals" },
  { emoji: "\u{1F419}", name: "octopus", category: "Animals" },
  { emoji: "\u{1F420}", name: "tropical fish", category: "Animals" },
  { emoji: "\u{1F41F}", name: "fish", category: "Animals" },
  { emoji: "\u{1F421}", name: "blowfish", category: "Animals" },
  { emoji: "\u{1F42C}", name: "dolphin", category: "Animals" },
  { emoji: "\u{1F433}", name: "spouting whale", category: "Animals" },
  { emoji: "\u{1F40B}", name: "whale", category: "Animals" },
  { emoji: "\u{1F988}", name: "shark", category: "Animals" },
  { emoji: "\u{1F40A}", name: "crocodile", category: "Animals" },
  { emoji: "\u{1F405}", name: "leopard", category: "Animals" },
  { emoji: "\u{1F993}", name: "zebra", category: "Animals" },
  { emoji: "\u{1F98D}", name: "gorilla", category: "Animals" },
  { emoji: "\u{1F418}", name: "elephant", category: "Animals" },
  { emoji: "\u{1F98F}", name: "rhinoceros", category: "Animals" },
  { emoji: "\u{1F42A}", name: "camel", category: "Animals" },
  { emoji: "\u{1F992}", name: "giraffe", category: "Animals" },
  { emoji: "\u{1F998}", name: "kangaroo", category: "Animals" },
  // Food (60+)
  { emoji: "\u{1F347}", name: "grapes", category: "Food" },
  { emoji: "\u{1F348}", name: "melon", category: "Food" },
  { emoji: "\u{1F349}", name: "watermelon", category: "Food" },
  { emoji: "\u{1F34A}", name: "tangerine", category: "Food" },
  { emoji: "\u{1F34B}", name: "lemon", category: "Food" },
  { emoji: "\u{1F34C}", name: "banana", category: "Food" },
  { emoji: "\u{1F34D}", name: "pineapple", category: "Food" },
  { emoji: "\u{1F96D}", name: "mango", category: "Food" },
  { emoji: "\u{1F34E}", name: "red apple", category: "Food" },
  { emoji: "\u{1F34F}", name: "green apple", category: "Food" },
  { emoji: "\u{1F350}", name: "pear", category: "Food" },
  { emoji: "\u{1F351}", name: "peach", category: "Food" },
  { emoji: "\u{1F352}", name: "cherries", category: "Food" },
  { emoji: "\u{1F353}", name: "strawberry", category: "Food" },
  { emoji: "\u{1F95D}", name: "kiwi fruit", category: "Food" },
  { emoji: "\u{1F345}", name: "tomato", category: "Food" },
  { emoji: "\u{1F965}", name: "coconut", category: "Food" },
  { emoji: "\u{1F951}", name: "avocado", category: "Food" },
  { emoji: "\u{1F346}", name: "eggplant", category: "Food" },
  { emoji: "\u{1F954}", name: "potato", category: "Food" },
  { emoji: "\u{1F955}", name: "carrot", category: "Food" },
  { emoji: "\u{1F33D}", name: "ear of corn", category: "Food" },
  { emoji: "\u{1F336}\u{FE0F}", name: "hot pepper", category: "Food" },
  { emoji: "\u{1F952}", name: "cucumber", category: "Food" },
  { emoji: "\u{1F966}", name: "broccoli", category: "Food" },
  { emoji: "\u{1F344}", name: "mushroom", category: "Food" },
  { emoji: "\u{1F95C}", name: "peanuts", category: "Food" },
  { emoji: "\u{1F35E}", name: "bread", category: "Food" },
  { emoji: "\u{1F950}", name: "croissant", category: "Food" },
  { emoji: "\u{1F956}", name: "baguette bread", category: "Food" },
  { emoji: "\u{1F968}", name: "pretzel", category: "Food" },
  { emoji: "\u{1F95E}", name: "pancakes", category: "Food" },
  { emoji: "\u{1F9C0}", name: "cheese wedge", category: "Food" },
  { emoji: "\u{1F356}", name: "meat on bone", category: "Food" },
  { emoji: "\u{1F357}", name: "poultry leg", category: "Food" },
  { emoji: "\u{1F969}", name: "cut of meat", category: "Food" },
  { emoji: "\u{1F953}", name: "bacon", category: "Food" },
  { emoji: "\u{1F354}", name: "hamburger", category: "Food" },
  { emoji: "\u{1F35F}", name: "french fries", category: "Food" },
  { emoji: "\u{1F355}", name: "pizza", category: "Food" },
  { emoji: "\u{1F32D}", name: "hot dog", category: "Food" },
  { emoji: "\u{1F96A}", name: "sandwich", category: "Food" },
  { emoji: "\u{1F32E}", name: "taco", category: "Food" },
  { emoji: "\u{1F32F}", name: "burrito", category: "Food" },
  { emoji: "\u{1F959}", name: "stuffed flatbread", category: "Food" },
  { emoji: "\u{1F95A}", name: "egg", category: "Food" },
  { emoji: "\u{1F373}", name: "cooking", category: "Food" },
  { emoji: "\u{1F372}", name: "pot of food", category: "Food" },
  { emoji: "\u{1F35D}", name: "spaghetti", category: "Food" },
  { emoji: "\u{1F35C}", name: "steaming bowl", category: "Food" },
  { emoji: "\u{1F363}", name: "sushi", category: "Food" },
  { emoji: "\u{1F364}", name: "fried shrimp", category: "Food" },
  { emoji: "\u{1F371}", name: "bento box", category: "Food" },
  { emoji: "\u{1F35B}", name: "curry rice", category: "Food" },
  { emoji: "\u{1F359}", name: "rice ball", category: "Food" },
  { emoji: "\u{1F358}", name: "rice cracker", category: "Food" },
  { emoji: "\u{1F370}", name: "shortcake", category: "Food" },
  { emoji: "\u{1F382}", name: "birthday cake", category: "Food" },
  { emoji: "\u{1F36E}", name: "custard", category: "Food" },
  { emoji: "\u{1F36D}", name: "lollipop", category: "Food" },
  { emoji: "\u{1F36C}", name: "candy", category: "Food" },
  { emoji: "\u{1F36B}", name: "chocolate bar", category: "Food" },
  { emoji: "\u{1F369}", name: "doughnut", category: "Food" },
  { emoji: "\u{1F36A}", name: "cookie", category: "Food" },
  { emoji: "\u{2615}", name: "hot beverage", category: "Food" },
  { emoji: "\u{1F375}", name: "teacup", category: "Food" },
  // Travel (55+)
  { emoji: "\u{1F30D}", name: "globe europe africa", category: "Travel" },
  { emoji: "\u{1F30E}", name: "globe americas", category: "Travel" },
  { emoji: "\u{1F30F}", name: "globe asia australia", category: "Travel" },
  { emoji: "\u{1F30C}", name: "milky way", category: "Travel" },
  { emoji: "\u{2B50}", name: "star", category: "Travel" },
  { emoji: "\u{1F31F}", name: "glowing star", category: "Travel" },
  { emoji: "\u{26A1}", name: "high voltage", category: "Travel" },
  { emoji: "\u{1F525}", name: "fire", category: "Travel" },
  { emoji: "\u{1F4A5}", name: "collision", category: "Travel" },
  { emoji: "\u{1F308}", name: "rainbow", category: "Travel" },
  { emoji: "\u{2600}\u{FE0F}", name: "sun", category: "Travel" },
  { emoji: "\u{1F324}\u{FE0F}", name: "sun behind small cloud", category: "Travel" },
  { emoji: "\u{26C5}", name: "sun behind cloud", category: "Travel" },
  { emoji: "\u{1F325}\u{FE0F}", name: "sun behind large cloud", category: "Travel" },
  { emoji: "\u{2601}\u{FE0F}", name: "cloud", category: "Travel" },
  { emoji: "\u{1F327}\u{FE0F}", name: "cloud with rain", category: "Travel" },
  { emoji: "\u{26C8}\u{FE0F}", name: "cloud with lightning and rain", category: "Travel" },
  { emoji: "\u{1F329}\u{FE0F}", name: "cloud with lightning", category: "Travel" },
  { emoji: "\u{2744}\u{FE0F}", name: "snowflake", category: "Travel" },
  { emoji: "\u{1F3D4}\u{FE0F}", name: "snow capped mountain", category: "Travel" },
  { emoji: "\u{1F3D6}\u{FE0F}", name: "beach with umbrella", category: "Travel" },
  { emoji: "\u{1F3DC}\u{FE0F}", name: "desert", category: "Travel" },
  { emoji: "\u{1F3DD}\u{FE0F}", name: "desert island", category: "Travel" },
  { emoji: "\u{1F3DE}\u{FE0F}", name: "national park", category: "Travel" },
  { emoji: "\u{1F3DF}\u{FE0F}", name: "stadium", category: "Travel" },
  { emoji: "\u{1F3E0}", name: "house", category: "Travel" },
  { emoji: "\u{1F3E2}", name: "office building", category: "Travel" },
  { emoji: "\u{1F3E5}", name: "hospital", category: "Travel" },
  { emoji: "\u{1F3E8}", name: "hotel", category: "Travel" },
  { emoji: "\u{1F3EB}", name: "school", category: "Travel" },
  { emoji: "\u{1F3ED}", name: "factory", category: "Travel" },
  { emoji: "\u{1F3F0}", name: "castle", category: "Travel" },
  { emoji: "\u{1F5FC}", name: "tokyo tower", category: "Travel" },
  { emoji: "\u{1F5FD}", name: "statue of liberty", category: "Travel" },
  { emoji: "\u{26EA}", name: "church", category: "Travel" },
  { emoji: "\u{1F54C}", name: "mosque", category: "Travel" },
  { emoji: "\u{1F697}", name: "automobile", category: "Travel" },
  { emoji: "\u{1F695}", name: "taxi", category: "Travel" },
  { emoji: "\u{1F68C}", name: "bus", category: "Travel" },
  { emoji: "\u{1F682}", name: "locomotive", category: "Travel" },
  { emoji: "\u{2708}\u{FE0F}", name: "airplane", category: "Travel" },
  { emoji: "\u{1F680}", name: "rocket", category: "Travel" },
  { emoji: "\u{1F6F8}", name: "flying saucer", category: "Travel" },
  { emoji: "\u{1F6A2}", name: "ship", category: "Travel" },
  { emoji: "\u{26F5}", name: "sailboat", category: "Travel" },
  { emoji: "\u{1F6B2}", name: "bicycle", category: "Travel" },
  { emoji: "\u{1F6F4}", name: "kick scooter", category: "Travel" },
  { emoji: "\u{1F6F5}", name: "motor scooter", category: "Travel" },
  { emoji: "\u{1F3CE}\u{FE0F}", name: "racing car", category: "Travel" },
  { emoji: "\u{1F69C}", name: "tractor", category: "Travel" },
  { emoji: "\u{1F6A8}", name: "police car light", category: "Travel" },
  { emoji: "\u{1F691}", name: "ambulance", category: "Travel" },
  { emoji: "\u{1F692}", name: "fire engine", category: "Travel" },
  // Activities (50+)
  { emoji: "\u{26BD}", name: "soccer ball", category: "Activities" },
  { emoji: "\u{1F3C0}", name: "basketball", category: "Activities" },
  { emoji: "\u{1F3C8}", name: "american football", category: "Activities" },
  { emoji: "\u{26BE}", name: "baseball", category: "Activities" },
  { emoji: "\u{1F94E}", name: "softball", category: "Activities" },
  { emoji: "\u{1F3BE}", name: "tennis", category: "Activities" },
  { emoji: "\u{1F3D0}", name: "volleyball", category: "Activities" },
  { emoji: "\u{1F3C9}", name: "rugby football", category: "Activities" },
  { emoji: "\u{1F94F}", name: "flying disc", category: "Activities" },
  { emoji: "\u{1F3B1}", name: "pool 8 ball", category: "Activities" },
  { emoji: "\u{1F3D3}", name: "ping pong", category: "Activities" },
  { emoji: "\u{1F3F8}", name: "badminton", category: "Activities" },
  { emoji: "\u{1F3D2}", name: "ice hockey", category: "Activities" },
  { emoji: "\u{1F3D1}", name: "field hockey", category: "Activities" },
  { emoji: "\u{1F94D}", name: "lacrosse", category: "Activities" },
  { emoji: "\u{26F3}", name: "flag in hole", category: "Activities" },
  { emoji: "\u{1F3CB}\u{FE0F}", name: "person lifting weights", category: "Activities" },
  { emoji: "\u{1F3C4}", name: "person surfing", category: "Activities" },
  { emoji: "\u{1F3CA}", name: "person swimming", category: "Activities" },
  { emoji: "\u{1F93D}", name: "person playing water polo", category: "Activities" },
  { emoji: "\u{1F93E}", name: "person playing handball", category: "Activities" },
  { emoji: "\u{1F3C7}", name: "horse racing", category: "Activities" },
  { emoji: "\u{26F7}\u{FE0F}", name: "skier", category: "Activities" },
  { emoji: "\u{1F3C2}", name: "snowboarder", category: "Activities" },
  { emoji: "\u{1F3AF}", name: "direct hit", category: "Activities" },
  { emoji: "\u{1F3B3}", name: "bowling", category: "Activities" },
  { emoji: "\u{1F3AE}", name: "video game", category: "Activities" },
  { emoji: "\u{1F3B2}", name: "game die", category: "Activities" },
  { emoji: "\u{1F9E9}", name: "puzzle piece", category: "Activities" },
  { emoji: "\u{1F3AD}", name: "performing arts", category: "Activities" },
  { emoji: "\u{1F3A8}", name: "artist palette", category: "Activities" },
  { emoji: "\u{1F3B5}", name: "musical note", category: "Activities" },
  { emoji: "\u{1F3B6}", name: "musical notes", category: "Activities" },
  { emoji: "\u{1F3A4}", name: "microphone", category: "Activities" },
  { emoji: "\u{1F3A7}", name: "headphone", category: "Activities" },
  { emoji: "\u{1F3B8}", name: "guitar", category: "Activities" },
  { emoji: "\u{1F3B9}", name: "musical keyboard", category: "Activities" },
  { emoji: "\u{1F3BA}", name: "trumpet", category: "Activities" },
  { emoji: "\u{1F3BB}", name: "violin", category: "Activities" },
  { emoji: "\u{1F941}", name: "drum", category: "Activities" },
  { emoji: "\u{1F3AC}", name: "clapper board", category: "Activities" },
  { emoji: "\u{1F3A0}", name: "carousel horse", category: "Activities" },
  { emoji: "\u{1F3A1}", name: "ferris wheel", category: "Activities" },
  { emoji: "\u{1F3A2}", name: "roller coaster", category: "Activities" },
  { emoji: "\u{1F3AA}", name: "circus tent", category: "Activities" },
  { emoji: "\u{1F3AB}", name: "ticket", category: "Activities" },
  { emoji: "\u{1F3C6}", name: "trophy", category: "Activities" },
  { emoji: "\u{1F3C5}", name: "sports medal", category: "Activities" },
  { emoji: "\u{1F947}", name: "1st place medal", category: "Activities" },
  { emoji: "\u{1F948}", name: "2nd place medal", category: "Activities" },
  { emoji: "\u{1F949}", name: "3rd place medal", category: "Activities" },
  // Objects (60+)
  { emoji: "\u{231A}", name: "watch", category: "Objects" },
  { emoji: "\u{1F4F1}", name: "mobile phone", category: "Objects" },
  { emoji: "\u{1F4F2}", name: "mobile phone with arrow", category: "Objects" },
  { emoji: "\u{1F4BB}", name: "laptop", category: "Objects" },
  { emoji: "\u{2328}\u{FE0F}", name: "keyboard", category: "Objects" },
  { emoji: "\u{1F5A5}\u{FE0F}", name: "desktop computer", category: "Objects" },
  { emoji: "\u{1F5A8}\u{FE0F}", name: "printer", category: "Objects" },
  { emoji: "\u{1F4F7}", name: "camera", category: "Objects" },
  { emoji: "\u{1F4F9}", name: "video camera", category: "Objects" },
  { emoji: "\u{1F4FA}", name: "television", category: "Objects" },
  { emoji: "\u{1F4FB}", name: "radio", category: "Objects" },
  { emoji: "\u{1F50B}", name: "battery", category: "Objects" },
  { emoji: "\u{1F50C}", name: "electric plug", category: "Objects" },
  { emoji: "\u{1F4A1}", name: "light bulb", category: "Objects" },
  { emoji: "\u{1F526}", name: "flashlight", category: "Objects" },
  { emoji: "\u{1F56F}\u{FE0F}", name: "candle", category: "Objects" },
  { emoji: "\u{1F4D5}", name: "closed book", category: "Objects" },
  { emoji: "\u{1F4D6}", name: "open book", category: "Objects" },
  { emoji: "\u{1F4D3}", name: "notebook", category: "Objects" },
  { emoji: "\u{1F4D2}", name: "ledger", category: "Objects" },
  { emoji: "\u{1F4C3}", name: "page with curl", category: "Objects" },
  { emoji: "\u{1F4DC}", name: "scroll", category: "Objects" },
  { emoji: "\u{1F4CE}", name: "paperclip", category: "Objects" },
  { emoji: "\u{1F4CC}", name: "pushpin", category: "Objects" },
  { emoji: "\u{1F4CF}", name: "straight ruler", category: "Objects" },
  { emoji: "\u{1F4D0}", name: "triangular ruler", category: "Objects" },
  { emoji: "\u{2702}\u{FE0F}", name: "scissors", category: "Objects" },
  { emoji: "\u{1F4E6}", name: "package", category: "Objects" },
  { emoji: "\u{1F4E7}", name: "email", category: "Objects" },
  { emoji: "\u{1F4E8}", name: "incoming envelope", category: "Objects" },
  { emoji: "\u{1F4E9}", name: "envelope with arrow", category: "Objects" },
  { emoji: "\u{1F4EA}", name: "mailbox closed flag down", category: "Objects" },
  { emoji: "\u{1F511}", name: "key", category: "Objects" },
  { emoji: "\u{1F512}", name: "locked", category: "Objects" },
  { emoji: "\u{1F513}", name: "unlocked", category: "Objects" },
  { emoji: "\u{1F528}", name: "hammer", category: "Objects" },
  { emoji: "\u{1F527}", name: "wrench", category: "Objects" },
  { emoji: "\u{1F529}", name: "nut and bolt", category: "Objects" },
  { emoji: "\u{2699}\u{FE0F}", name: "gear", category: "Objects" },
  { emoji: "\u{1F4B0}", name: "money bag", category: "Objects" },
  { emoji: "\u{1F4B5}", name: "dollar banknote", category: "Objects" },
  { emoji: "\u{1F4B3}", name: "credit card", category: "Objects" },
  { emoji: "\u{1F48E}", name: "gem stone", category: "Objects" },
  { emoji: "\u{1F9F2}", name: "magnet", category: "Objects" },
  { emoji: "\u{1F489}", name: "syringe", category: "Objects" },
  { emoji: "\u{1F48A}", name: "pill", category: "Objects" },
  { emoji: "\u{1F9EA}", name: "test tube", category: "Objects" },
  { emoji: "\u{1F9EB}", name: "petri dish", category: "Objects" },
  { emoji: "\u{1F9EC}", name: "dna", category: "Objects" },
  { emoji: "\u{1F52C}", name: "microscope", category: "Objects" },
  { emoji: "\u{1F52D}", name: "telescope", category: "Objects" },
  { emoji: "\u{1F4E1}", name: "satellite antenna", category: "Objects" },
  { emoji: "\u{1F9F0}", name: "toolbox", category: "Objects" },
  { emoji: "\u{1F50D}", name: "magnifying glass left", category: "Objects" },
  { emoji: "\u{1F50E}", name: "magnifying glass right", category: "Objects" },
  { emoji: "\u{1F4DA}", name: "books", category: "Objects" },
  { emoji: "\u{1F9ED}", name: "compass", category: "Objects" },
  { emoji: "\u{1F570}\u{FE0F}", name: "mantelpiece clock", category: "Objects" },
  { emoji: "\u{23F0}", name: "alarm clock", category: "Objects" },
  { emoji: "\u{23F1}\u{FE0F}", name: "stopwatch", category: "Objects" },
  // Symbols (60+)
  { emoji: "\u{2764}\u{FE0F}", name: "red heart", category: "Symbols" },
  { emoji: "\u{1F9E1}", name: "orange heart", category: "Symbols" },
  { emoji: "\u{1F49B}", name: "yellow heart", category: "Symbols" },
  { emoji: "\u{1F49A}", name: "green heart", category: "Symbols" },
  { emoji: "\u{1F499}", name: "blue heart", category: "Symbols" },
  { emoji: "\u{1F49C}", name: "purple heart", category: "Symbols" },
  { emoji: "\u{1F5A4}", name: "black heart", category: "Symbols" },
  { emoji: "\u{1F90D}", name: "white heart", category: "Symbols" },
  { emoji: "\u{1F90E}", name: "brown heart", category: "Symbols" },
  { emoji: "\u{1F494}", name: "broken heart", category: "Symbols" },
  { emoji: "\u{2763}\u{FE0F}", name: "heart exclamation", category: "Symbols" },
  { emoji: "\u{1F495}", name: "two hearts", category: "Symbols" },
  { emoji: "\u{1F49E}", name: "revolving hearts", category: "Symbols" },
  { emoji: "\u{1F493}", name: "beating heart", category: "Symbols" },
  { emoji: "\u{1F497}", name: "growing heart", category: "Symbols" },
  { emoji: "\u{1F496}", name: "sparkling heart", category: "Symbols" },
  { emoji: "\u{1F498}", name: "heart with arrow", category: "Symbols" },
  { emoji: "\u{1F49D}", name: "heart with ribbon", category: "Symbols" },
  { emoji: "\u{1F4AF}", name: "hundred points", category: "Symbols" },
  { emoji: "\u{1F4A2}", name: "anger symbol", category: "Symbols" },
  { emoji: "\u{1F4AC}", name: "speech balloon", category: "Symbols" },
  { emoji: "\u{1F4AD}", name: "thought balloon", category: "Symbols" },
  { emoji: "\u{1F4A4}", name: "zzz", category: "Symbols" },
  { emoji: "\u{1F4A8}", name: "dashing away", category: "Symbols" },
  { emoji: "\u{1F4AB}", name: "dizzy", category: "Symbols" },
  { emoji: "\u{2714}\u{FE0F}", name: "check mark", category: "Symbols" },
  { emoji: "\u{274C}", name: "cross mark", category: "Symbols" },
  { emoji: "\u{274E}", name: "cross mark button", category: "Symbols" },
  { emoji: "\u{2795}", name: "plus", category: "Symbols" },
  { emoji: "\u{2796}", name: "minus", category: "Symbols" },
  { emoji: "\u{2797}", name: "divide", category: "Symbols" },
  { emoji: "\u{27B0}", name: "curly loop", category: "Symbols" },
  { emoji: "\u{27BF}", name: "double curly loop", category: "Symbols" },
  { emoji: "\u{2733}\u{FE0F}", name: "eight spoked asterisk", category: "Symbols" },
  { emoji: "\u{2734}\u{FE0F}", name: "eight pointed star", category: "Symbols" },
  { emoji: "\u{2747}\u{FE0F}", name: "sparkle", category: "Symbols" },
  { emoji: "\u{203C}\u{FE0F}", name: "double exclamation mark", category: "Symbols" },
  { emoji: "\u{2049}\u{FE0F}", name: "exclamation question mark", category: "Symbols" },
  { emoji: "\u{2753}", name: "question mark", category: "Symbols" },
  { emoji: "\u{2757}", name: "exclamation mark", category: "Symbols" },
  { emoji: "\u{3030}\u{FE0F}", name: "wavy dash", category: "Symbols" },
  { emoji: "\u{00A9}\u{FE0F}", name: "copyright", category: "Symbols" },
  { emoji: "\u{00AE}\u{FE0F}", name: "registered", category: "Symbols" },
  { emoji: "\u{2122}\u{FE0F}", name: "trade mark", category: "Symbols" },
  { emoji: "\u{1F51F}", name: "keycap 10", category: "Symbols" },
  { emoji: "\u{1F520}", name: "input latin uppercase", category: "Symbols" },
  { emoji: "\u{1F521}", name: "input latin lowercase", category: "Symbols" },
  { emoji: "\u{1F522}", name: "input numbers", category: "Symbols" },
  { emoji: "\u{1F523}", name: "input symbols", category: "Symbols" },
  { emoji: "\u{1F524}", name: "input latin letters", category: "Symbols" },
  { emoji: "\u{1F170}\u{FE0F}", name: "a button blood type", category: "Symbols" },
  { emoji: "\u{1F18E}", name: "ab button blood type", category: "Symbols" },
  { emoji: "\u{1F171}\u{FE0F}", name: "b button blood type", category: "Symbols" },
  { emoji: "\u{1F191}", name: "cl button", category: "Symbols" },
  { emoji: "\u{1F192}", name: "cool button", category: "Symbols" },
  { emoji: "\u{1F193}", name: "free button", category: "Symbols" },
  { emoji: "\u{1F194}", name: "id button", category: "Symbols" },
  { emoji: "\u{1F195}", name: "new button", category: "Symbols" },
  { emoji: "\u{1F196}", name: "ng button", category: "Symbols" },
  { emoji: "\u{1F197}", name: "ok button", category: "Symbols" },
  { emoji: "\u{1F198}", name: "sos button", category: "Symbols" },
  // Flags (55+)
  { emoji: "\u{1F1FA}\u{1F1F8}", name: "flag united states", category: "Flags" },
  { emoji: "\u{1F1EC}\u{1F1E7}", name: "flag united kingdom", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1E6}", name: "flag canada", category: "Flags" },
  { emoji: "\u{1F1E6}\u{1F1FA}", name: "flag australia", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1F3}", name: "flag india", category: "Flags" },
  { emoji: "\u{1F1E9}\u{1F1EA}", name: "flag germany", category: "Flags" },
  { emoji: "\u{1F1EB}\u{1F1F7}", name: "flag france", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1F9}", name: "flag italy", category: "Flags" },
  { emoji: "\u{1F1EA}\u{1F1F8}", name: "flag spain", category: "Flags" },
  { emoji: "\u{1F1E7}\u{1F1F7}", name: "flag brazil", category: "Flags" },
  { emoji: "\u{1F1F2}\u{1F1FD}", name: "flag mexico", category: "Flags" },
  { emoji: "\u{1F1EF}\u{1F1F5}", name: "flag japan", category: "Flags" },
  { emoji: "\u{1F1F0}\u{1F1F7}", name: "flag south korea", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1F3}", name: "flag china", category: "Flags" },
  { emoji: "\u{1F1F7}\u{1F1FA}", name: "flag russia", category: "Flags" },
  { emoji: "\u{1F1F3}\u{1F1FF}", name: "flag new zealand", category: "Flags" },
  { emoji: "\u{1F1F8}\u{1F1E6}", name: "flag saudi arabia", category: "Flags" },
  { emoji: "\u{1F1F8}\u{1F1EC}", name: "flag singapore", category: "Flags" },
  { emoji: "\u{1F1F9}\u{1F1ED}", name: "flag thailand", category: "Flags" },
  { emoji: "\u{1F1FB}\u{1F1F3}", name: "flag vietnam", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1E9}", name: "flag indonesia", category: "Flags" },
  { emoji: "\u{1F1F5}\u{1F1ED}", name: "flag philippines", category: "Flags" },
  { emoji: "\u{1F1F5}\u{1F1F0}", name: "flag pakistan", category: "Flags" },
  { emoji: "\u{1F1E7}\u{1F1E9}", name: "flag bangladesh", category: "Flags" },
  { emoji: "\u{1F1F9}\u{1F1F7}", name: "flag turkey", category: "Flags" },
  { emoji: "\u{1F1EA}\u{1F1EC}", name: "flag egypt", category: "Flags" },
  { emoji: "\u{1F1F3}\u{1F1EC}", name: "flag nigeria", category: "Flags" },
  { emoji: "\u{1F1FF}\u{1F1E6}", name: "flag south africa", category: "Flags" },
  { emoji: "\u{1F1F5}\u{1F1F1}", name: "flag poland", category: "Flags" },
  { emoji: "\u{1F1F3}\u{1F1F1}", name: "flag netherlands", category: "Flags" },
  { emoji: "\u{1F1E7}\u{1F1EA}", name: "flag belgium", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1ED}", name: "flag switzerland", category: "Flags" },
  { emoji: "\u{1F1E6}\u{1F1F9}", name: "flag austria", category: "Flags" },
  { emoji: "\u{1F1F8}\u{1F1EA}", name: "flag sweden", category: "Flags" },
  { emoji: "\u{1F1F3}\u{1F1F4}", name: "flag norway", category: "Flags" },
  { emoji: "\u{1F1E9}\u{1F1F0}", name: "flag denmark", category: "Flags" },
  { emoji: "\u{1F1EB}\u{1F1EE}", name: "flag finland", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1EA}", name: "flag ireland", category: "Flags" },
  { emoji: "\u{1F1F5}\u{1F1F9}", name: "flag portugal", category: "Flags" },
  { emoji: "\u{1F1EC}\u{1F1F7}", name: "flag greece", category: "Flags" },
  { emoji: "\u{1F1FA}\u{1F1E6}", name: "flag ukraine", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1F1}", name: "flag israel", category: "Flags" },
  { emoji: "\u{1F1E6}\u{1F1EA}", name: "flag united arab emirates", category: "Flags" },
  { emoji: "\u{1F1E6}\u{1F1F7}", name: "flag argentina", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1F4}", name: "flag colombia", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1F1}", name: "flag chile", category: "Flags" },
  { emoji: "\u{1F1F5}\u{1F1EA}", name: "flag peru", category: "Flags" },
  { emoji: "\u{1F1F2}\u{1F1FE}", name: "flag malaysia", category: "Flags" },
  { emoji: "\u{1F1ED}\u{1F1F0}", name: "flag hong kong", category: "Flags" },
  { emoji: "\u{1F1F9}\u{1F1FC}", name: "flag taiwan", category: "Flags" },
  { emoji: "\u{1F3C1}", name: "chequered flag", category: "Flags" },
  { emoji: "\u{1F6A9}", name: "triangular flag", category: "Flags" },
  { emoji: "\u{1F3F3}\u{FE0F}", name: "white flag", category: "Flags" },
  { emoji: "\u{1F3F4}", name: "black flag", category: "Flags" },
  { emoji: "\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}", name: "rainbow flag", category: "Flags" },
];

const LS_KEY = "emoji-picker-recent";

export default function EmojiPickerPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Smileys");
  const [skinTone, setSkinTone] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const filtered = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return EMOJIS.filter((e) => e.name.toLowerCase().includes(q));
    }
    return EMOJIS.filter((e) => e.category === activeCategory);
  }, [search, activeCategory]);

  const getEmoji = useCallback((item: EmojiItem) => {
    if (item.skinTone && skinTone) {
      return item.emoji + skinTone;
    }
    return item.emoji;
  }, [skinTone]);

  function copyEmoji(item: EmojiItem) {
    const emoji = getEmoji(item);
    navigator.clipboard.writeText(emoji).then(() => {
      setCopied(emoji);
      setTimeout(() => setCopied(null), 1500);
      // Update recent
      const updated = [emoji, ...recent.filter((e) => e !== emoji)].slice(0, 30);
      setRecent(updated);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      } catch { /* ignore */ }
    });
  }

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/emoji-picker`} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`/tools/emoji-picker`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Emoji Picker</h1>
        <p className="text-[var(--muted)] mb-8">
          Browse 500+ emojis by category, search by name, and click to copy. Supports skin tones and tracks recently used.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Toast */}
        {copied && (
          <div className="fixed top-4 right-4 z-50 bg-[var(--primary)] text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce">
            Copied {copied}
          </div>
        )}

        <div className="tool-card mb-8">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emojis..."
              className="w-full p-2 border rounded-lg bg-[var(--muted-bg)]"
            />
          </div>

          {/* Skin tone selector */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-[var(--muted)]">Skin tone:</span>
            {SKIN_TONES.map((st) => (
              <button
                key={st.label}
                onClick={() => setSkinTone(st.modifier)}
                className={`w-8 h-8 rounded-full text-lg flex items-center justify-center border-2 transition-colors ${
                  skinTone === st.modifier ? "border-[var(--primary)]" : "border-transparent"
                }`}
                title={st.label}
              >
                {st.modifier ? `\u{270B}${st.modifier}` : "\u{270B}"}
              </button>
            ))}
          </div>

          {/* Category tabs */}
          {!search.trim() && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted-bg)] text-[var(--foreground)] hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Recently used */}
          {!search.trim() && recent.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-[var(--muted)] mb-2">Recently Used</p>
              <div className="flex flex-wrap gap-1">
                {recent.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigator.clipboard.writeText(emoji).then(() => {
                        setCopied(emoji);
                        setTimeout(() => setCopied(null), 1500);
                      });
                    }}
                    className="w-10 h-10 text-2xl flex items-center justify-center rounded hover:bg-[var(--muted-bg)] transition-colors"
                    title="Click to copy"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Emoji grid */}
          <div className="flex flex-wrap gap-1">
            {filtered.map((item, i) => (
              <button
                key={i}
                onClick={() => copyEmoji(item)}
                className="w-10 h-10 text-2xl flex items-center justify-center rounded hover:bg-[var(--muted-bg)] transition-colors"
                title={item.name}
              >
                {getEmoji(item)}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-[var(--muted)] py-8">No emojis found matching your search.</p>
          )}
        </div>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>About the Emoji Picker</h2>
          <p>
            Our free online Emoji Picker makes it easy to find and copy any emoji you need. With over 500
            emojis organized into 9 categories, you can quickly browse or search for the perfect emoji and
            copy it to your clipboard with a single click. Whether you are composing a social media post,
            writing an email, updating a document, or chatting with friends, this tool gives you instant
            access to the full range of popular Unicode emojis.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>500+ Emojis:</strong> A comprehensive collection covering smileys, people, animals, food, travel, activities, objects, symbols, and flags</li>
            <li><strong>Category Browsing:</strong> Quickly jump between 9 organized categories to find what you need</li>
            <li><strong>Search by Name:</strong> Type any keyword to filter emojis instantly — search for &quot;heart&quot;, &quot;dog&quot;, &quot;flag&quot;, or any other term</li>
            <li><strong>One-Click Copy:</strong> Click any emoji to copy it to your clipboard with a visual confirmation toast</li>
            <li><strong>Skin Tone Selector:</strong> Choose from 6 skin tone options for people emojis by appending Unicode skin tone modifiers</li>
            <li><strong>Recently Used:</strong> Your last 30 copied emojis are saved in localStorage for quick re-use</li>
          </ul>

          <h2>How to Use</h2>
          <ol>
            <li>Browse emojis by clicking category tabs or use the search bar to find specific emojis</li>
            <li>Select a skin tone using the tone selector for people and hand gesture emojis</li>
            <li>Click any emoji to copy it to your clipboard</li>
            <li>Paste the emoji anywhere — social media, messages, documents, or any text field</li>
            <li>Recently used emojis appear at the top for quick access</li>
          </ol>

          <h2>Emoji Categories Explained</h2>
          <p>
            The Smileys category contains facial expressions, emotions, and reaction faces. People includes
            hand gestures, body parts, and person emojis with skin tone support. Animals has pets, wildlife,
            birds, fish, and insects. Food covers fruits, vegetables, meals, drinks, and desserts. Travel
            features weather, buildings, vehicles, and landmarks. Activities includes sports, music, arts,
            and entertainment. Objects contains everyday items from technology to tools. Symbols has hearts,
            marks, arrows, and indicators. Flags includes national flags from 50+ countries plus special
            flags.
          </p>

          <h2>About Skin Tone Modifiers</h2>
          <p>
            Unicode supports 5 skin tone modifiers based on the Fitzpatrick scale, plus a default yellow.
            When you select a skin tone, our picker appends the appropriate Unicode modifier character to
            compatible emojis (people and hand gesture emojis). Not all emojis support skin tones — only
            those depicting human body parts or people. The modifier works by adding a special invisible
            character after the base emoji that changes its appearance. This is part of the Unicode standard
            and is supported on all modern operating systems, browsers, and messaging platforms.
          </p>

          <h2>Privacy</h2>
          <p>
            This emoji picker runs entirely in your browser. Your recently used emojis are stored only in
            your browser&apos;s localStorage — no data is sent to any server. Clear your browser data at any
            time to reset your recent history. No tracking, no accounts, no sign-up required.
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
            name: "Emoji Picker",
            description: META.description,
            url: `${SITE_URL}/tools/emoji-picker`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
