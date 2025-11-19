import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
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

type CreateSubmissionBody = {
    content?: string;
    fingerprint?: string;
    username?: string; // Required but optional in type for validation
    created_date?: string; // ISO date string
};

export async function GET() {
    if (!notionApiKey || !notionDatabaseId) {
        return NextResponse.json(
            { error: "Server is misconfigured: missing Notion env vars" },
            { status: 500 },
        );
    }

    try {
        // Initialize the Notion client with the API key
        const notion = new Client({ auth: notionApiKey });

        // First, retrieve the database to get the data source ID
        const database = await notion.databases.retrieve({
            database_id: notionDatabaseId,
        });

        // Check if we have a full database object with data sources
        if (
            !("data_sources" in database) ||
            !database.data_sources ||
            database.data_sources.length === 0
        ) {
            return NextResponse.json(
                { error: "Database does not have any data sources" },
                { status: 500 },
            );
        }

        // Get the first data source ID
        const dataSourceId = database.data_sources[0].id;

        // Query the data source using the correct method
        const response = await notion.dataSources.query({
            data_source_id: dataSourceId,
            sorts: [
                {
                    timestamp: "created_time",
                    direction: "descending",
                },
            ],
            result_type: "page", // Only return pages, not data sources
        });

        // Filter results to only include full page objects (not partial or data sources)
        const pages = response.results.filter(
            (result): result is PageObjectResponse =>
                result.object === "page" &&
                "properties" in result &&
                "created_time" in result,
        );

        const messages = pages.map((page) => {
            const props = page.properties;
            const contentProp = props.content;
            const usernameProp = props.username;
            const createdTime = page.created_time;

            // Extract content from rich_text property
            let content = "";
            if (
                contentProp &&
                "rich_text" in contentProp &&
                Array.isArray(contentProp.rich_text) &&
                contentProp.rich_text.length > 0
            ) {
                content =
                    "plain_text" in contentProp.rich_text[0]
                        ? contentProp.rich_text[0].plain_text
                        : "";
            }

            // Extract username from rich_text property
            let username = "";
            if (
                usernameProp &&
                "rich_text" in usernameProp &&
                Array.isArray(usernameProp.rich_text) &&
                usernameProp.rich_text.length > 0
            ) {
                username =
                    "plain_text" in usernameProp.rich_text[0]
                        ? usernameProp.rich_text[0].plain_text
                        : "";
            }

            return {
                id: page.id,
                content,
                timestamp: createdTime ? new Date(createdTime) : new Date(),
                username: username || undefined,
            };
        });

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        const err = error as unknown as {
            status?: number;
            code?: string;
            message?: string;
            body?: unknown;
        };
        // eslint-disable-next-line no-console
        console.error("Failed to fetch Notion pages", {
            status: err?.status,
            code: err?.code,
            message: err?.message,
            body: err?.body,
        });

        const isProd = process.env.NODE_ENV === "production";
        const clientMessage = isProd
            ? { error: "Failed to fetch messages" }
            : {
                  error: "Failed to fetch messages",
                  details: {
                      status: err?.status,
                      code: err?.code,
                      message: err?.message,
                  },
              };

        return NextResponse.json(clientMessage, { status: 500 });
    }
}

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
        // Initialize the Notion client with the API key
        const notion = new Client({ auth: notionApiKey });

        // Use provided created_date or default to current time
        const createdDate = body.created_date || new Date().toISOString();

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
            created_date: {
                date: {
                    start: createdDate,
                },
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
