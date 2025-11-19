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

- [ ] Basic moderation (e.g., detect and block abusive or harmful language)
- [ ] Timestamps and/or emoji support for messages
- [ ] Animated transitions, submission confirmations, or other UX polish
- [ ] Soothing UI theme, accessible design, and responsive layout

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Linting/Formatting**: Biome

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

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

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Radix UI](https://www.radix-ui.com/) - accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - utility-first CSS framework
- [React Hook Form](https://react-hook-form.com/) - performant form library

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
