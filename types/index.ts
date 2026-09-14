export type VerificationStatus = "needs_native_review" | "verified";
export interface Dialect {
  language: string;
  dialect: string;
  region: string;
  nativeName: string;
  writingConventions: string;
  pronunciationRules: string;
  culturalNotes: string;
  verificationStatus: VerificationStatus;
  sources: { title: string; url: string }[];
}
export interface Phrase {
  id: string;
  courseId: string;
  text: string;
  meaning: string;
  pronunciation: string;
  category: string;
  formality: string;
  context: string;
  verificationStatus: VerificationStatus;
  audioUrl?: string;
}
export interface VocabularyItem {
  phraseId: string;
  lastReviewed: string;
  correctCount: number;
  incorrectCount: number;
  confidence: number;
  difficulty: number;
  nextReview: string;
}
export type Exercise = { id: string; phraseId: string } & (
  | {
      type: "translation" | "listening" | "quick-response" | "culture";
      prompt: string;
      options: string[];
      answer: string;
      explanation: string;
    }
  | { type: "arrange"; prompt: string; words: string[]; answer: string }
  | { type: "speaking"; prompt: string }
  | { type: "matching"; pairs: { text: string; meaning: string }[] }
  | {
      type: "conversation";
      prompt: string;
      options: string[];
      answer: string;
      explanation: string;
    }
);
export interface Lesson {
  id: string;
  title: string;
  kind:
    | "lesson"
    | "listening"
    | "speaking"
    | "vocabulary"
    | "conversation"
    | "culture"
    | "checkpoint"
    | "boss";
  phraseIds: string[];
  exercises: Exercise[];
}
export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}
export interface Course extends Dialect {
  id: string;
  name: string;
  accent: string;
  tagline: string;
  map: { x: number; y: number };
  units: Unit[];
  phrases: Phrase[];
}
export interface SpeakingAttempt {
  id: string;
  phraseId: string;
  date: string;
  mode: "recording_playback";
  duration: number;
}
export interface UserProgress {
  avatarId?: number;
  version: 1;
  name: string;
  onboarded: boolean;
  currentCourse: string;
  motivation: string;
  dailyGoal: number;
  completedLessons: string[];
  xp: number;
  courseXp: Record<string, number>;
  activityDates: string[];
  savedPhrases: string[];
  vocabulary: Record<string, VocabularyItem>;
  speakingHistory: SpeakingAttempt[];
  practiceDates: string[];
  questRewards: string[];
}
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: (p: UserProgress) => boolean;
}
export interface DailyQuest {
  id: string;
  title: string;
  target: number;
  current: number;
  reward: number;
}
