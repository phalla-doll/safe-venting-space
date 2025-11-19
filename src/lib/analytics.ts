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
    // Navigation
} as const;
