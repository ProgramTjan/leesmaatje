# CLAUDE.md

## Project
Leesmaatje — interactive reading app for children with dyslexia.
Next.js 16 + React 19 + TypeScript + Zustand + Tailwind CSS + Framer Motion.

## Owner
GitHub: ProgramTjan

## Autonomy
- Make changes directly without asking for confirmation.
- Commit and push when a task is complete.
- When multiple things need fixing, just do them all.
- Only ask questions when requirements are genuinely unclear.

## Language conventions
- **Communication with user**: Nederlands
- **Git commits**: English
- **Code** (variables, functions, comments, types): English
- **App-facing text** (UI labels, user messages, speech phrases, data files): Nederlands

## Development
- Run `npm run build` to verify changes compile before committing.
- There are no tests configured yet.
- The app uses the Next.js App Router (`src/app/`).
- State management is in `src/store/useGameStore.ts` (Zustand with localStorage persistence).
- Static exercise data lives in `src/data/`.
- AI exercise generation goes through `src/app/api/generate/route.ts` (Anthropic Claude API).
