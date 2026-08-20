# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Reels — Instagram Reel transcriber

The "Reels" tab lets you paste a public Instagram Reel link and get a text transcript of its audio, saved to a local database so you can build up a document of everything you've transcribed and export it (or an individual transcript) as Markdown to read later.

It's two parts:

- **Frontend** — the "Reels" tab in this app (already wired up).
- **Backend** — a small Express server (`server/`) that downloads the reel with [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) and transcribes the audio with the OpenAI Whisper API, storing results in a local SQLite database (`server/transcripts.db`).

### Setup

1. Copy `.env.example` to `.env` and add your OpenAI API key:
   ```
   cp .env.example .env
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run both the frontend and the API together:
   ```
   npm run dev:all
   ```
   or run them separately in two terminals: `npm run dev` (frontend) and `npm run server` (backend).
4. Open the app, go to the Reels tab, and paste a public Instagram Reel link.

### Notes

- Only works with **public** Instagram posts/Reels that have audio — private accounts or posts will fail to download.
- Whisper's API caps uploads at 25MB, which covers essentially all Reels (they're usually well under a minute).
- This is meant for personal use. Automated downloading isn't officially sanctioned by Instagram's terms of service, and the backend has no auth — don't deploy it publicly without adding some.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
