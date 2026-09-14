import type { UserProgress } from "@/types";
import { initialProgress } from "./progress";
export interface ProgressRepository {
  load(): UserProgress;
  save(progress: UserProgress): void;
}
export function validProgress(p: UserProgress) {
  return (
    p.version === 1 &&
    typeof p.name === "string" &&
    typeof p.onboarded === "boolean" &&
    typeof p.currentCourse === "string" &&
    Number.isFinite(p.xp) &&
    p.xp >= 0 &&
    Number.isFinite(p.dailyGoal) &&
    Array.isArray(p.completedLessons) &&
    p.completedLessons.every((x) => typeof x === "string") &&
    Array.isArray(p.activityDates) &&
    Array.isArray(p.savedPhrases) &&
    Array.isArray(p.speakingHistory) &&
    Array.isArray(p.practiceDates) &&
    Array.isArray(p.questRewards) &&
    p.vocabulary &&
    typeof p.vocabulary === "object" &&
    p.courseXp &&
    typeof p.courseXp === "object"
  );
}
export class LocalProgressRepository implements ProgressRepository {
  key = "lokabasa.progress.v1";
  load() {
    const raw = localStorage.getItem(this.key);
    if (!raw) return structuredClone(initialProgress);
    try {
      const p = JSON.parse(raw);
      if (!validProgress(p)) throw new Error();
      return p;
    } catch {
      throw new Error(
        "Data progres tidak dapat dibaca. Unduh cadangan data melalui profil sebelum mengatur ulang.",
      );
    }
  }
  save(p: UserProgress) {
    localStorage.setItem(this.key, JSON.stringify(p));
  }
}
export const progressRepository = new LocalProgressRepository();
