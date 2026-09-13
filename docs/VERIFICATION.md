# Verification report — 2026-09-13

Production build: Next.js 16.3.5, 83 generated pages including framework error/icon routes. `npm test`: six passing tests. `npm audit`: no vulnerabilities at install time.

## Browser evidence

- Chromium: onboarding → first Jawa lesson → all six exercise screens → completion → 60 XP → second lesson unlocked → reload preserves progression.
- Eight-question daily practice completed, grants 30 XP; reward idempotency additionally covered in unit tests.
- Phrase search, save/favorites after reload, profile rename after reload, and map course selection passed.
- Guided conversation incorrect response branches to retry; correct responses complete the scenario.
- Microphone denial displayed recoverable guidance. Recording/playback success tested with a generated AudioContext stream through the real MediaRecorder API; no real user microphone audio was captured. Attempt metadata persisted, playable audio remained a transient blob.
- Browser had no Indonesian TTS voice: confirmed explicit unavailable state and transcript fallback. Actual Indonesian voice quality remains device-dependent and is not claimed as verified.
- 96 route/viewport checks: 12 principal routes at 320, 375, 390, 414, 768, 1024, 1280, 1440 pixels; zero horizontal overflow and zero JavaScript page errors after fixes.
- axe-core WCAG 2 A/AA and WCAG 2.1 AA scan on nine principal routes at mobile width: zero violations after correcting secondary text contrast. Automated scans do not replace a manual assistive-technology audit.
- Original desktop/mobile screenshots saved locally under ignored output/playwright/.

## Meaningful remaining limits

All language seed data awaits native review. No native audio, dialect-accurate STT, automatic pronunciation scoring, cross-device accounts, or full offline caching is supplied. Guided chat uses Indonesian bridge text and honestly labels foundation-content fallback when scenario-specific vocabulary is missing. These boundaries are visible in the product and documented in README.
