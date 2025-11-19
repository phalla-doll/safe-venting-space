import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// Expected environment variables:
// - NOTION_API_KEY: a Notion internal integration token
// - NOTION_DATABASE_ID: the database where submissions should be inserted

const notionApiKey = process.env.NOTION_API_KEY;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

if (!notionApiKey) {
    // eslint-disable-next-line no-console
    console.warn("NOTION_API_KEY is not set. /api/notion will return 500.");
}

if (!notionDatabaseId) {
    // eslint-disable-next-line no-console
    console.warn("NOTION_DATABASE_ID is not set. /api/notion will return 500.");
}

const notion = new Client({ auth: notionApiKey });

type CreateSubmissionBody = {
    content?: string;
    fingerprint?: string;
    username?: string; // Required but optional in type for validation
};

export async function POST(request: Request) {
    if (!notionApiKey || !notionDatabaseId) {
        return NextResponse.json(
            { error: "Server is misconfigured: missing Notion env vars" },
            { status: 500 },
        );
    }

    let body: CreateSubmissionBody;

    try {
        body = (await request.json()) as CreateSubmissionBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const content = (body.content || "").trim();
    const fingerprint = body.fingerprint || "";
    const username = (body.username || "").trim();

    if (!content) {
        return NextResponse.json(
            { error: "'content' is required" },
            { status: 400 },
        );
    }

    if (!fingerprint) {
        return NextResponse.json(
            { error: "'fingerprint' is required" },
            { status: 400 },
        );
    }

    if (!username) {
        return NextResponse.json(
            { error: "'username' is required" },
            { status: 400 },
        );
    }

    try {
        // Adjust property names and types to match your Notion database schema
        const properties = {
            content: {
                rich_text: [
                    {
                        text: { content },
                    },
                ],
            },
            fingerprint: {
                rich_text: [
                    {
                        text: { content: fingerprint },
                    },
                ],
            },
            username: {
                rich_text: [
                    {
                        text: { content: username },
                    },
                ],
            },
        };

        const created = await notion.pages.create({
            parent: { database_id: notionDatabaseId },
            properties,
        });

        return NextResponse.json(
            {
                id: created.id,
                url: "url" in created ? created.url : undefined,
            },
            { status: 201 },
        );
    } catch (error) {
        // Capture detailed Notion error info for easier debugging locally
        const err = error as unknown as {
            status?: number;
            code?: string;
            message?: string;
            body?: unknown;
        };
        // eslint-disable-next-line no-console
        console.error("Failed to create Notion page", {
            status: err?.status,
            code: err?.code,
            message: err?.message,
            body: err?.body,
        });

        const isProd = process.env.NODE_ENV === "production";
        const clientMessage = isProd
            ? { error: "Failed to create Notion page" }
            : {
                  error: "Failed to create Notion page",
                  details: {
                      status: err?.status,
                      code: err?.code,
                      message: err?.message,
                  },
              };

        return NextResponse.json(clientMessage, { status: 500 });
    }
}
