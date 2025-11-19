/**
 * Generates a random username using adjective + noun combinations
 */
const adjectives = [
    "calm",
    "gentle",
    "peaceful",
    "serene",
    "quiet",
    "kind",
    "warm",
    "bright",
    "soft",
    "brave",
    "wise",
    "hopeful",
    "caring",
    "strong",
    "gentle",
    "honest",
    "loyal",
    "patient",
    "creative",
    "curious",
];

const nouns = [
    "cloud",
    "star",
    "wave",
    "breeze",
    "sunset",
    "moon",
    "river",
    "forest",
    "ocean",
    "mountain",
    "valley",
    "meadow",
    "butterfly",
    "bird",
    "tree",
    "flower",
    "stone",
    "crystal",
    "light",
    "shadow",
];

/**
 * Generates a random username in the format: adjective-noun-number
 * Example: "calm-cloud-42"
 */
export function generateRandomUsername(): string {
    const adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)] || "calm";
    const noun = nouns[Math.floor(Math.random() * nouns.length)] || "friend";
    const number = Math.floor(Math.random() * 9999) + 1;

    return `${adjective}-${noun}-${number}`;
}

