import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-Y5R6QW5MQ0";

export function GoogleAnalytics() {
    if (!GA_TRACKING_ID) {
        return null;
    }

    return <NextGoogleAnalytics gaId={GA_TRACKING_ID} />;
}
