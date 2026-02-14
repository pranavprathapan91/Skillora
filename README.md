# Skillora

**Your skills, brilliantly told.**

Skillora is an AI-powered resume and cover letter builder. Create professional, ATS-friendly resumes and cover letters in minutes. Run it locally for you and your family.

## Features

- **Resume builder** — Contact, summary, experience, education, skills. Multiple templates (Modern, Classic, Minimal). Live preview and PDF export.
- **Cover letter builder** — Job details, optional link to a resume, and AI to generate or improve your letter. PDF export.
- **AI (OpenAI)** — "Generate with AI" for cover letters from job description + resume; "Improve with AI" for any text.
- **Local storage** — All data stays in your browser. No account or server storage required.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Optional: AI features**

   Create a file `.env.local` in the project root:

   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

   Get an API key from [OpenAI](https://platform.openai.com/api-keys). Without it, resume and cover letter building and PDF export still work; only "Generate with AI" and "Improve with AI" will fail.

3. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server (after `npm run build`)
- `npm run lint` — Run ESLint

## Tech stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS
- OpenAI API (gpt-4o-mini) for AI
- @react-pdf/renderer for PDF export

---

Build locally. Use with family.
