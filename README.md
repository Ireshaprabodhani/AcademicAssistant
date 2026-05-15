# AcademicAI — AI Academic Assistant

An AI-powered web app that helps university students with lecture notes Q&A, essay feedback, research paper summarization, concept explanations, and assignment planning.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Claude API · Vercel AI SDK

---

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for dev |

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run `supabase/migrations/001_initial_schema.sql`
3. Then run `supabase/migrations/002_rls_policies.sql`
4. In Storage → New Bucket: create a bucket named `documents` (set to **private**)
5. In Authentication → URL Configuration → add `http://localhost:3000/callback` to Redirect URLs

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

```bash
npx vercel --prod
```

Set all environment variables in the Vercel Dashboard. Add your production URL to Supabase Auth → Redirect URLs.

---

## Features

| Feature | Route | API |
|---|---|---|
| Document Q&A | `/documents/[id]` | `POST /api/chat` |
| Essay Helper | `/essay-helper` | `POST /api/essay` |
| Paper Summarizer | `/summarizer` | `POST /api/summarize` |
| Concept Explainer | `/explainer` | `POST /api/explainer` |
| Assignment Planner | `/planner` | `POST /api/planner` |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/            # login, signup, callback
│   ├── (dashboard)/       # all protected pages
│   └── api/               # API routes (upload, chat, essay, etc.)
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Sidebar, TopNav, Providers
│   ├── chat/              # ChatWindow, ChatMessage, ChatInput
│   └── documents/         # DocumentUpload, DocumentCard
├── lib/
│   ├── supabase/          # client.ts, server.ts
│   ├── anthropic/         # client.ts, prompts.ts
│   └── pdf/               # extractor.ts
├── hooks/                 # useDocuments, use-toast
└── types/                 # database.types.ts, index.ts
supabase/migrations/       # SQL schema + RLS policies
```
