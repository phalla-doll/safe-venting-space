import { Filter } from "bad-words";

// Initialize the profanity filter
const filter = new Filter();

/**
 * Checks if the given text contains profanity or abusive language
 * @param text - The text to check for profanity
 * @returns true if profanity is detected, false otherwise
 */
export function containsProfanity(text: string): boolean {
    return filter.isProfane(text);
}

/**
 * Gets a cleaned version of the text with profanity replaced
 * @param text - The text to clean
 * @returns The cleaned text with profanity replaced
 */
export function cleanProfanity(text: string): string {
    return filter.clean(text);
}
