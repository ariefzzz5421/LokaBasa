import test from "node:test";
import assert from "node:assert/strict";
import { courses, lessonsOf } from "../courses/catalog";
import {
  initialProgress,
  finishLesson,
  finishPractice,
  isUnlocked,
  review,
  streaks,
  dailyExercises,
} from "../lib/progress";
const fresh = () => structuredClone(initialProgress);
test("all course content has explicit scope and review status with valid exercises", () => {
  const ids = new Set<string>();
  for (const c of courses) {
    assert.equal(c.units.length, 3);
    assert.ok(c.dialect && c.language && c.sources.length);
    for (const l of lessonsOf(c)) {
      assert.ok(!ids.has(l.id));
      ids.add(l.id);
      for (const e of l.exercises) {
        assert.ok(c.phrases.some((p) => p.id === e.phraseId));
        if ("options" in e) assert.ok(e.options.includes(e.answer));
        if (e.type === "arrange")
          assert.equal(
            [...e.words].sort().join("|"),
            e.answer.split(" ").sort().join("|"),
          );
      }
    }
    assert.ok(
      c.phrases.every((p) => p.verificationStatus === "needs_native_review"),
    );
  }
});
test("locked direct URLs cannot award XP; completion unlocks only next node; rewards idempotent", () => {
  const c = courses[0],
    ls = lessonsOf(c);
  let p = fresh();
  assert.equal(isUnlocked(p, c, ls[1].id), false);
  assert.deepEqual(finishLesson(p, c, ls[1].id), p);
  p = finishLesson(p, c, ls[0].id);
  assert.equal(p.xp, 60);
  assert.ok(isUnlocked(p, c, ls[1].id));
  assert.equal(isUnlocked(p, c, ls[2].id), false);
  assert.deepEqual(finishLesson(p, c, ls[0].id), p);
});
test("streak handles yesterday, gaps, duplicate activity and year boundary", () => {
  assert.deepEqual(
    streaks(
      ["2025-12-31", "2026-01-01", "2026-01-01"],
      new Date("2026-01-02T12:00:00"),
    ),
    { current: 2, longest: 2 },
  );
  assert.deepEqual(
    streaks(["2026-01-01", "2026-01-02"], new Date("2026-01-04T12:00:00")),
    { current: 0, longest: 2 },
  );
});
test("incorrect words become weaker and sooner due than correct words", () => {
  const now = new Date("2026-09-13T12:00:00");
  let p = review(fresh(), "jawa-p0", false, now);
  p = review(p, "jawa-p1", true, now);
  assert.ok(
    p.vocabulary["jawa-p0"].difficulty > p.vocabulary["jawa-p1"].difficulty,
  );
  assert.ok(
    p.vocabulary["jawa-p0"].nextReview < p.vocabulary["jawa-p1"].nextReview,
  );
  assert.equal(p.vocabulary["jawa-p0"].incorrectCount, 1);
});
test("daily practice reward is once per local calendar day", () => {
  const now = new Date("2026-09-13T12:00:00"),
    p = finishPractice(fresh(), now);
  assert.equal(p.xp, 30);
  assert.deepEqual(finishPractice(p, now), p);
  assert.equal(finishPractice(p, new Date("2026-09-14T12:00:00")).xp, 60);
});
test("daily practice always has eight questions and stable unique IDs", () => {
  const e = dailyExercises(fresh(), courses[0]);
  assert.equal(e.length, 8);
  assert.equal(new Set(e.map((e) => e.id)).size, 8);
  assert.equal(e.filter((e) => e.type === "listening").length, 2);
  assert.equal(e.filter((e) => e.type === "speaking").length, 1);
});
