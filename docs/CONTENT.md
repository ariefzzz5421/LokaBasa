# Content stewardship

Each Course includes language, dialect, region, nativeName, writingConventions, pronunciationRules, culturalNotes, verificationStatus, and sources. Each Phrase has independent pronunciation, formality, context, optional audioUrl, and verificationStatus.

1. Choose a narrow dialect scope; do not equate a place label with every local language.
2. Review every seed phrase, gloss, register, and context with a competent native speaker.
3. Attach evidence to the phrase (extend the schema with source entries and reviewer attribution). Existing course-level references are starting points, not evidence of sentence-level review.
4. Obtain consent and usage rights for audio. Prefer native recordings; set audioUrl only to genuine available assets.
5. Only set verificationStatus to verified after completing and recording review. The UI must never invent score confidence or endorsements.
6. Add lessons through the typed Exercise union and verify all answer choices and phrase references with npm test.

Seed lessons deliberately begin with practical phrases. Single-word arrangement exercises are basic vocabulary reinforcement. The course can grow into multiword variants without replacing the exercise engine.

SpeakingAttempt stores recording_playback metadata only. An STT provider must declare supported dialect coverage and approximate transcription. Pronunciation scoring requires an independently validated model and should not be inferred from generic transcript similarity.
