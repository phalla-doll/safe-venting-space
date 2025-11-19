# Emotional Vent Space (Safe Venting Space)

A simple, calming, forum-style web application where users can anonymously share thoughts or feelings. This project provides a safe, inclusive digital space that encourages expression and empathy.

## Project Overview

This application is designed to create a minimal yet thoughtful web experience that captures anonymous submissions and displays them in a live feed. The focus is on product sense, accessibility, and care for user safety.

## Role Description

As an applicant project, this implementation showcases:
- **Product Sense**: Thoughtful design decisions that prioritize user experience
- **Accessibility**: Inclusive design that works for all users
- **User Safety**: Features and considerations that protect users' emotional well-being

## Minimum Requirements

✅ **A form to submit messages anonymously** (no login required)
✅ **A visible feed showing submitted messages**

## Optional Enhancements (Bonus)

- [x] Timestamps for messages (implemented)
- [x] Character limit (1000 characters) with live counter (implemented)
- [x] Toast notifications for submission feedback (implemented)
- [ ] Basic moderation (e.g., detect and block abusive or harmful language)
- [ ] Emoji support for messages
- [ ] Animated transitions, submission confirmations, or other UX polish
- [x] Soothing UI theme, accessible design, and responsive layout (implemented)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Toast Notifications**: Sonner
- **Linting/Formatting**: Biome
- **Database**: [Notion API](https://developers.notion.com/) for storing messages

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Notion account and workspace

### Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Configure Notion API:**

   - Create a `.env.local` file in the root directory
   - Set up a Notion integration:
     - Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
     - Click "New integration"
     - Choose "Internal" integration type
     - Give it a name (e.g., "Safe Venting Space")
     - Copy the "Internal Integration Token" → set as `NOTION_API_KEY` in `.env.local`
   - Create a Notion database:
     - Create a new database in your Notion workspace
     - Add the following properties:
       - `content` with type "Rich Text"
       - `username` with type "Rich Text" (optional, but recommended)
       - `fingerprint` with type "Rich Text" (optional, but recommended)
       - `created_date` with type "Date" (optional, but recommended for better sorting)
     - Share the database with your integration (click "..." → "Connections" → select your integration)
     - Copy the database ID from the URL (the part after the last `/` and before `?`) → set as `NOTION_DATABASE_ID` in `.env.local`

   Example `.env.local`:
   ```
   NOTION_API_KEY=secret_xxxxxxxxxxxxx
   NOTION_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit files in the `src/app` directory.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run fix` - Run linter and auto-fix issues

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components
│   └── ui/          # Reusable UI components (Radix UI based)
├── hooks/           # Custom React hooks
└── lib/             # Utility functions and helpers
```

## Notion API Integration

This project uses the Notion API to persist and retrieve anonymous messages. The application:

1. **Fetches existing messages** on page load via GET request
2. **Displays messages** in a feed sorted by creation time (newest first)
3. **Allows users to submit new messages** via POST request
4. **Shows loading states** with skeleton loaders while fetching
5. **Provides feedback** via toast notifications for success/error states

### Database Schema Requirements

Your Notion database must have the following properties:
- **`content`** property (Rich Text type) - stores the message content
- **`username`** property (Rich Text type) - stores the generated username (optional)
- **`fingerprint`** property (Rich Text type) - stores the browser fingerprint for tracking (optional)
- **`created_date`** property (Date type) - stores the creation timestamp (optional, but recommended)

If your schema differs, update the property names in `src/app/api/notion/route.ts`.

### API Endpoints

**Location:** `/api/notion`

#### GET - Fetch Messages

**Method:** `GET`  
**Request:** No body required

**Response:**
- Success (200): 
```json
{
  "messages": [
    {
      "id": "string",
      "content": "string",
      "timestamp": "ISO date string",
      "username": "string (optional)"
    }
  ]
}
```
- Error (500): `{ "error": "error message" }`

Messages are sorted by creation time in descending order (newest first).

#### POST - Create Message

**Method:** `POST`  
**Request Body:**
```json
{
  "content": "string (required, max 1000 characters)",
  "fingerprint": "string (required)",
  "username": "string (required)",
  "created_date": "string (optional, ISO date string)"
}
```

**Response:**
- Success (201): `{ "id": "...", "url": "..." }`
- Error (400/500): `{ "error": "error message" }`

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Notion API Documentation](https://developers.notion.com/) - learn about Notion API integration
- [Radix UI](https://www.radix-ui.com/) - accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - utility-first CSS framework
- [React Hook Form](https://react-hook-form.com/) - performant form library

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
