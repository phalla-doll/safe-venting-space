import Link from "next/link";
import { trackEvent, GA_EVENTS } from "@/lib/analytics";

export function Footer() {
    return (
        <footer className="border-t bg-background py-6">
            <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
                Made by this guy{" "}
                <Link
                    href="https://mantha.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:underline"
                    onClick={() => {
                        trackEvent(GA_EVENTS.LINK_CLICK, {
                            link_url: "https://mantha.vercel.app/",
                            link_text: "mantha",
                            link_location: "footer",
                        });
                    }}
                >
                    mantha
                </Link>
            </div>
        </footer>
    );
}
