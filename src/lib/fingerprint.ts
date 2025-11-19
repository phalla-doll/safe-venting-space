/**
 * Generates a browser fingerprint for identifying users without revealing personal information.
 * This combines various browser and device characteristics to create a unique identifier.
 */
export function generateFingerprint(): string {
    if (typeof window === "undefined") {
        return "server-side";
    }

    const components: string[] = [];

    // Screen properties
    components.push(
        `screen:${screen.width}x${screen.height}`,
        `avail:${screen.availWidth}x${screen.availHeight}`,
        `colorDepth:${screen.colorDepth}`,
    );

    // Timezone
    try {
        components.push(
            `tz:${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
        );
    } catch {
        // Ignore if timezone detection fails
    }

    // Language
    components.push(`lang:${navigator.language}`);

    // Platform
    components.push(`platform:${navigator.platform}`);

    // User agent (hashed for privacy)
    if (navigator.userAgent) {
        components.push(`ua:${hashString(navigator.userAgent)}`);
    }

    // Hardware concurrency
    if (navigator.hardwareConcurrency) {
        components.push(`cores:${navigator.hardwareConcurrency}`);
    }

    // Canvas fingerprint (if available)
    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("Fingerprint", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("Fingerprint", 4, 17);
            const canvasHash = hashString(canvas.toDataURL());
            components.push(`canvas:${canvasHash}`);
        }
    } catch {
        // Ignore if canvas fingerprinting fails
    }

    // Combine all components and hash
    const fingerprintString = components.join("|");
    return hashString(fingerprintString);
}

/**
 * Simple hash function for string hashing
 */
function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
}
