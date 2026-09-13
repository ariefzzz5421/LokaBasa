import type { Achievement, Course, Exercise, UserProgress } from "@/types";
import { lessonsOf } from "@/courses/catalog";
export const initialProgress: UserProgress = {
  version: 1,
  name: "Penjelajah",
  onboarded: false,
  currentCourse: "jawa",
  motivation: "Budaya",
  dailyGoal: 10,
  completedLessons: [],
  xp: 0,
  courseXp: {},
  activityDates: [],
  savedPhrases: [],
  vocabulary: {},
  speakingHistory: [],
  practiceDates: [],
  questRewards: [],
};
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export function streaks(dates: string[], now = new Date()) {
  const set = new Set(dates);
  let longest = 0,
    run = 0,
    previous = "";
  for (const date of [...set].sort()) {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() - 1);
    run = dayKey(d) === previous ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  const cursor = new Date(now);
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let current = 0;
  while (set.has(dayKey(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, longest };
}
export const level = (xp: number) => Math.floor(xp / 200) + 1;
export const percentage = (p: UserProgress, c: Course) =>
  Math.round(
    (lessonsOf(c).filter((l) => p.completedLessons.includes(l.id)).length /
      lessonsOf(c).length) *
      100,
  );
export const isUnlocked = (p: UserProgress, c: Course, id: string) => {
  const ls = lessonsOf(c),
    i = ls.findIndex((l) => l.id === id);
  return i === 0 || (i > 0 && p.completedLessons.includes(ls[i - 1].id));
};
export function finishLesson(
  p: UserProgress,
  c: Course,
  id: string,
  now = new Date(),
): UserProgress {
  if (!isUnlocked(p, c, id) || p.completedLessons.includes(id)) return p;
  const day = dayKey(now);
  return {
    ...p,
    currentCourse: c.id,
    completedLessons: [...p.completedLessons, id],
    xp: p.xp + 60,
    courseXp: { ...p.courseXp, [c.id]: (p.courseXp[c.id] || 0) + 60 },
    activityDates: [...new Set([...p.activityDates, day])],
  };
}
export function review(
  p: UserProgress,
  id: string,
  correct: boolean,
  now = new Date(),
): UserProgress {
  const old = p.vocabulary[id] || {
    phraseId: id,
    lastReviewed: "",
    correctCount: 0,
    incorrectCount: 0,
    confidence: 0,
    difficulty: 0.5,
    nextReview: "",
  };
  const correctCount = old.correctCount + Number(correct),
    incorrectCount = old.incorrectCount + Number(!correct),
    next = new Date(now);
  next.setDate(
    next.getDate() +
      (correct ? Math.min(14, 2 ** Math.min(correctCount, 4)) : 1),
  );
  return {
    ...p,
    vocabulary: {
      ...p.vocabulary,
      [id]: {
        ...old,
        correctCount,
        incorrectCount,
        lastReviewed: now.toISOString(),
        confidence: correctCount / (correctCount + incorrectCount),
        difficulty: Math.min(
          1,
          Math.max(0.1, old.difficulty + (correct ? -0.08 : 0.15)),
        ),
        nextReview: next.toISOString(),
      },
    },
  };
}
export function dailyExercises(p: UserProgress, c: Course): Exercise[] {
  const seen = lessonsOf(c).filter((l) => p.completedLessons.includes(l.id));
  const pool = (seen.length ? seen : [lessonsOf(c)[0]])
    .flatMap((l) => l.exercises)
    .sort((a, b) => {
      const av = p.vocabulary[a.phraseId],
        bv = p.vocabulary[b.phraseId];
      return (
        (bv?.difficulty || 0.5) - (av?.difficulty || 0.5) ||
        (av?.nextReview || "").localeCompare(bv?.nextReview || "")
      );
    });
  return (
    [
      "matching",
      "arrange",
      "listening",
      "listening",
      "translation",
      "translation",
      "speaking",
      "conversation",
    ] as const
  ).map((type, i) => {
    const options = pool.filter((e) => e.type === type);
    const base =
      options[i % options.length] ||
      pool.find((e) => e.type === "translation")!;
    if (type === "conversation" && base.type !== "conversation") {
      const phrase = c.phrases.find((p) => p.id === base.phraseId)!;
      return {
        id: `daily-${i}-${base.id}`,
        phraseId: phrase.id,
        type: "conversation" as const,
        prompt: `Temanmu bertanya arti “${phrase.text}”. Apa jawabanmu?`,
        options: [
          phrase.meaning,
          ...c.phrases
            .filter((p) => p.id !== phrase.id)
            .slice(0, 2)
            .map((p) => p.meaning),
        ],
        answer: phrase.meaning,
        explanation: phrase.context,
      };
    }
    return { ...base, id: `daily-${i}-${base.id}` };
  });
}
export const achievements: Achievement[] = [
  {
    id: "first",
    title: "Langkah Pertama",
    description: "Selesaikan pelajaran pertamamu",
    icon: "footprints",
    achieved: (p) => p.completedLessons.length >= 1,
  },
  {
    id: "voice",
    title: "Ora Isin",
    description: "Selesaikan 10 latihan rekam suara",
    icon: "mic",
    achieved: (p) => p.speakingHistory.length >= 10,
  },
  {
    id: "poly",
    title: "Penjelajah Nusantara",
    description: "Belajar di 3 kategori bahasa",
    icon: "map",
    achieved: (p) => Object.keys(p.courseXp).length >= 3,
  },
  {
    id: "words",
    title: "100 Ungkapan",
    description: "Pelajari 100 ungkapan berbeda",
    icon: "book",
    achieved: (p) => Object.keys(p.vocabulary).length >= 100,
  },
  {
    id: "streak",
    title: "Sebulan Bersama",
    description: "Jaga streak selama 30 hari",
    icon: "flame",
    achieved: (p) => streaks(p.activityDates).longest >= 30,
  },
];
export function finishPractice(
  p: UserProgress,
  now = new Date(),
): UserProgress {
  const day = dayKey(now);
  if (p.practiceDates.includes(day)) return p;
  return {
    ...p,
    xp: p.xp + 30,
    practiceDates: [...p.practiceDates, day],
    activityDates: [...new Set([...p.activityDates, day])],
  };
}
