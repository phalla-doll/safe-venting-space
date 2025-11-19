import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Safe Venting Space - Emotional Vent Space",
        template: "%s | Safe Venting Space",
    },
    description:
        "A simple, calming, forum-style web application where users can anonymously share thoughts or feelings. A safe, inclusive digital space that encourages expression and empathy.",
    keywords: [
        "anonymous venting",
        "emotional support",
        "safe space",
        "mental health",
        "anonymous sharing",
        "emotional expression",
        "inclusive community",
        "anonymous forum",
        "venting space",
        "emotional wellness",
    ],
    authors: [{ name: "Safe Venting Space" }],
    creator: "Safe Venting Space",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://safe-venting-space.vercel.app",
        title: "Safe Venting Space - Emotional Vent Space",
        description:
            "A safe, inclusive digital space where users can anonymously share thoughts or feelings. Encouraging expression and empathy.",
        siteName: "Safe Venting Space",
    },
    twitter: {
        card: "summary_large_image",
        title: "Safe Venting Space - Emotional Vent Space",
        description:
            "A safe, inclusive digital space where users can anonymously share thoughts or feelings.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ||
            "https://safe-venting-space.vercel.app",
    ),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
                <Footer />
                <Toaster />
            </body>
        </html>
    );
}
