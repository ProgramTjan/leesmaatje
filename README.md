# LeesmaatJE

Een interactieve leesapp voor kinderen met dyslexie, gebaseerd op wetenschappelijke inzichten over fonologisch bewustzijn, multisensorisch leren en gestructureerde geletterdheid.

## Kenmerken

- **7 oefenmodules**: Letters & Klanken, Lettergrepen, Woorden Bouwen, Zinnen Bouwen, Flitslezen, Spellingregels, Woorddelen
- **2 leeftijdsgroepen**: Groep 3-5 (6-9 jaar) en Groep 6-8 (9-12 jaar) met aangepaste oefeningen
- **8 kleurthema's**: 4 per leeftijdsgroep (licht/speels voor jongeren, donker/strak voor ouderen)
- **Gamificatie**: Sterren, XP, levels, streaks en badges
- **Meerdere profielen**: Elk kind heeft een eigen profiel met eigen voortgang
- **Dyslexie-lettertype**: OpenDyslexic font in te schakelen
- **Spraak**: Nederlandse tekst-naar-spraak voor letters, woorden en lettergrepen
- **Geen server nodig**: Alle data lokaal opgeslagen via localStorage

## Tech stack

- [Next.js](https://nextjs.org/) 16 + React 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management met persistentie)
- Web Speech API (tekst-naar-spraak)

## Starten

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Wetenschappelijke basis

- **Fonologisch bewustzijn** — letter-klank correspondentie (Orton-Gillingham)
- **Multisensorisch leren** — visueel, auditief, kinesthetisch combineren
- **Gestructureerde geletterdheid** — systematische, expliciete instructie
- **Morfologisch bewustzijn** — woorddelen herkennen (Goodwin & Ahn, 2013)
- **Leesvloeiendheid** — automatische woordherkenning via flitslezen
- **Gamificatie** — intrinsieke motivatie door beloningssysteem

## Licentie

MIT
