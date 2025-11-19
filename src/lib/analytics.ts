/**
 * Google Analytics event tracking utility
 * Uses gtag from @next/third-parties/google
 */

declare global {
    interface Window {
        gtag?: (
            command: "event" | "config" | "set",
            targetId: string | Record<string, unknown>,
            config?: Record<string, unknown>,
        ) => void;
    }
}

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(
    eventName: string,
    eventParams?: Record<string, string | number | boolean>,
) {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, eventParams);
    }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "page_view", {
            page_path: path,
            page_title: title,
        });
    }
}

// Event name constants for consistency
export const GA_EVENTS = {
    // Page interactions
    PAGE_VIEW: "page_view",

    // Form interactions
    FORM_SUBMIT: "form_submit",
    FORM_SUBMIT_SUCCESS: "form_submit_success",
    FORM_SUBMIT_ERROR: "form_submit_error",
    FORM_PROFANITY_BLOCKED: "form_profanity_blocked",

    // Message interactions
    MESSAGE_VIEW: "message_view",
    MESSAGE_FETCH_SUCCESS: "message_fetch_success",
    MESSAGE_FETCH_ERROR: "message_fetch_error",
    MESSAGE_EMPTY_STATE: "message_empty_state",

    // Link clicks
    LINK_CLICK: "link_click",

    // Engagement
    CHARACTER_COUNT: "character_count",
} as const;
