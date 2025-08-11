Personal portfolio with Next.js (App Router), Tailwind, Sanity CMS, Framer Motion, React Three Fiber, and an OpenRouter-powered chatbot.

## Setup

Create a `.env.local` file with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=openai/gpt-4o-mini
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Portfolio
```

## Develop

Install deps then run the dev server:

```bash
npm install
npm run dev
```

Site: `http://localhost:3000`

Sanity Studio: `http://localhost:3000/studio`
