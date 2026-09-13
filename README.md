# LokaBasa

**Belajar bahasa daerah. Lebih dekat dengan Indonesia.**

A functional, mobile-first Indonesian regional language learning app. Original Komo mascot and SVG landscape artwork; Next.js App Router, React, TypeScript, Framer Motion, self-hosted Plus Jakarta Sans, and CSS design tokens. No account or API key needed.

## Run

Requires Node.js 22+.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production: `npm run build` then `npm start`. Checks: `npm test` and `npm run typecheck`.

## Included

- Landing page and four-step onboarding leading directly to the first lesson.
- Seven explicitly scoped courses: Jawa (Ngoko), Sunda (Priangan introduction), Batak (Toba), Ngapak (Banyumasan), Manado (Melayu Manado), Papua (Melayu Papua), and Medan (regional Indonesian).
- 3 units × 3 lessons in each course, 63 seed phrases overall, and six exercises per lesson.
- Eight discriminated exercise types: translation, listening, arrangement, matching, speaking, conversation, quick response, and culture.
- Visual path with locked, current, and completed nodes; 60 XP once per lesson, derived levels, streaks, badges, daily/weekly quests, and one daily practice reward.
- Adaptive eight-exercise daily review, phrase search/category/language filters, favorites, and 12 guided conversation settings.
- Clickable illustrated Indonesia map, real profile statistics, editable name/goal, and JSON progress download.
- Browser TTS when an Indonesian system voice is available, native recording provider interface, and microphone recording/playback with explicit permission/error states.
- Versioned local progress repository, offline messaging, reduced-motion support, keyboard navigation, and mobile bottom navigation.

## Content and speech limitations

**All starter content is `needs_native_review`. This is not a linguistically validated curriculum.** Reference links are review resources, not sentence-level verification. The seed dataset separates text, pronunciation, formality, dialect scope, context, and review status from UI. Papua and Batak do not describe one uniform language; each course names its actual scope. Categories with no seed phrases show an honest empty state.

Audio is synthetic Indonesian approximation when a suitable browser voice is present; there are no supplied native-speaker audio assets. Missing audio exposes text guidance. Speaking is local recording/playback, never a fake pronunciation score or automatic transcription. Browser audio engines may use OS/cloud services. Recordings are discarded after leaving the activity; only attempt metadata persists.

Ngobrol is a deterministic guided conversation with Indonesian bridge dialogue and regional response choices, not an LLM or speech recognition chatbot. Scenario categories with no matching course content explicitly fall back to foundation phrases. The 100-phrase badge is expansion-ready; the current seed dataset has 63 phrases.

Progress is local to one browser. There is no backend, authentication, analytics, cross-device sync, or full offline/PWA caching. The JSON download is a backup/export, not a sync feature. Clearing site data clears progress. No application secrets are required.

## Architecture

- `app/`: prerendered route entry points, shared root, errors, and loading states.
- `courses/catalog.ts`: independent seed curriculum and exercise construction; see `docs/CONTENT.md`.
- `types/`: course/dialect/unit/lesson/phrase/exercise/progress interfaces.
- `features/`: onboarding, dashboard/path, lesson engine, phrasebook, conversation, and profile.
- `components/`: shell, map, original illustrations, audio, and microphone UI.
- `lib/progress.ts`: deterministic progression, reward deduplication, local-date streaks, and spaced review scheduling.
- `lib/repository.ts` / `lib/store.tsx`: persistence contract and reactive state. Swap the repository to add a backend.
- `lib/audio.ts`: BrowserTTSProvider, RecordedAudioProvider, CloudTTSProvider, and a future SpeechProvider contract. Cloud endpoint is not configured; implement a server route and keep provider keys server-side.
- `data/scenarios.ts`: guided scenario metadata.
- `tokens.css`: portable visual tokens; `app/globals.css`: responsive system.
- `tests/`: content integrity and progress invariants. GitHub Actions runs tests and production build.

## Deployment

Import the GitHub repository into Vercel with the Next.js preset and Node.js 22+. No environment variables are required. Microphone capture requires HTTPS or localhost. Security headers restrict framing, camera, geolocation, and cross-origin microphone use.

## Next editorial milestone

Recruit native reviewers for one dialect at a time, attach per-phrase evidence and recorded audio, then expand scenario-specific dialogue and vocabulary. Do not mark a phrase verified without real reviewer approval and provenance.
