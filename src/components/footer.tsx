import Link from "next/link";

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
                >
                    mantha
                </Link>
            </div>
        </footer>
    );
}

