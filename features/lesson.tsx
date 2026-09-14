"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  X,
  Volume2,
  Lightbulb,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import type { Course, Exercise, Lesson, Phrase } from "@/types";
import { allPhrases, getCourse, lessonsOf } from "@/courses/catalog";
import {
  dailyExercises,
  finishLesson,
  finishPractice,
  isUnlocked,
  review,
  dayKey,
} from "@/lib/progress";
import { useProgress } from "@/lib/store";
import { AudioButton, Recorder, SavePhrase } from "@/components/audio";
import { Mascot } from "@/components/illustrations";
import { ProgressBar } from "./learning";
const labels = {
  translation: "Terjemahkan",
  listening: "Dengar & pilih",
  arrange: "Susun kata",
  matching: "Pasangkan",
  speaking: "Giliran bicara",
  conversation: "Percakapan",
  culture: "Kenali konteks",
  "quick-response": "Respons cepat",
};
function ExerciseCard({
  exercise: e,
  phrase: p,
  onAnswer,
}: {
  exercise: Exercise;
  phrase: Phrase;
  onAnswer: (correct: boolean, assessed: boolean) => void;
}) {
  const [selected, setSelected] = useState(""),
    [arranged, setArranged] = useState<number[]>([]),
    [checked, setChecked] = useState(false),
    [correct, setCorrect] = useState(false),
    [reveal, setReveal] = useState(false),
    [left, setLeft] = useState(""),
    [matched, setMatched] = useState<string[]>([]),
    [pairError, setPairError] = useState(""),
    [recorded, setRecorded] = useState(false),
    [skipped, setSkipped] = useState(false),
    [advancing, setAdvancing] = useState(false);
  const anyMismatch = useRef(false),
    advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
    continued = useRef(false),
    answerResult = useRef({ correct: true, assessed: true });
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );
  function continueNow() {
    if (continued.current) return;
    continued.current = true;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
    onAnswer(answerResult.current.correct, answerResult.current.assessed);
  }
  function check() {
    let result = true;
    if ("options" in e) result = selected === e.answer;
    else if (e.type === "arrange")
      result = arranged.map((i) => e.words[i]).join(" ") === e.answer;
    else if (e.type === "matching") result = !anyMismatch.current;
    const assessed = !(e.type === "speaking" || reveal);
    answerResult.current = { correct: result, assessed };
    setCorrect(result);
    setChecked(true);
    setAdvancing(true);
    advanceTimer.current = setTimeout(continueNow, result ? 1250 : 1900);
  }
  const canCheck =
    e.type === "speaking"
      ? recorded || skipped
      : e.type === "matching"
        ? matched.length === e.pairs.length
        : e.type === "arrange"
          ? arranged.length === e.words.length
          : !!selected;
  return (
    <>
      <div className="exercise-heading">
        <span className="eyebrow">{labels[e.type]}</span>
        <h1>
          {e.type === "matching" ? "Temukan pasangan yang pas." : e.prompt}
        </h1>
      </div>
      {e.type !== "matching" && (
        <div className="lesson-phrase">
          <div className="row">
            <span className="tag">
              {getCourse(p.courseId).name} · {p.formality}
            </span>
            <SavePhrase phrase={p} />
          </div>
          {e.type === "listening" ? (
            <>
              <div className="listening-symbol">
                <Volume2 size={43} />
              </div>
              <AudioButton phrase={p} />
              <button className="text-link" onClick={() => setReveal(!reveal)}>
                {reveal
                  ? "Sembunyikan transkrip"
                  : "Audio tidak tersedia? Lihat transkrip"}
              </button>
              {reveal && (
                <p className="transcript">
                  {p.text}{" "}
                  <small>Mode membaca; bukan penilaian menyimak.</small>
                </p>
              )}
            </>
          ) : (
            <>
              <h2>
                {e.type === "arrange" ? "Susun dari kata di bawah" : p.text}
              </h2>
              {e.type !== "arrange" && (
                <>
                  <p className="pronunciation">{p.pronunciation}</p>
                  <AudioButton phrase={p} />
                </>
              )}
              {e.type === "speaking" && <p>{p.meaning}</p>}
              {e.type === "translation" && (
                <>
                  <button
                    className="text-link"
                    onClick={() => setReveal(!reveal)}
                  >
                    {reveal ? "Tutup bantuan" : "Lihat arti & konteks"}
                  </button>
                  {reveal && (
                    <p className="transcript">
                      {p.meaning} · {p.context}
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
      {"options" in e && (
        <div className="answer-options">
          {e.options.map((option, i) => (
            <motion.button
              key={option}
              disabled={checked}
              className={`${selected === option ? "selected" : ""} ${checked && option === e.answer ? "correct" : ""} ${checked && selected === option && !correct ? "incorrect" : ""}`}
              onClick={() => setSelected(option)}
              aria-pressed={selected === option}
              whileTap={{ scale: 0.98 }}
              animate={
                checked && option === e.answer
                  ? { scale: [1, 1.035, 1] }
                  : checked && selected === option && !correct
                    ? { x: [0, -5, 5, -3, 3, 0] }
                    : { scale: 1, x: 0 }
              }
              transition={{ duration: 0.38 }}
            >
              <span className="answer-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{option}</span>
              {checked && option === e.answer && <Check size={21} />}
            </motion.button>
          ))}
        </div>
      )}
      {e.type === "arrange" && (
        <div className="arrangement">
          <div className="sentence-slot" aria-label="Kalimat tersusun">
            {arranged.length ? (
              arranged.map((index, i) => (
                <button
                  key={index}
                  className="word"
                  disabled={checked}
                  onClick={() =>
                    setArranged((a) => a.filter((_, j) => j !== i))
                  }
                >
                  {e.words[index]} <X size={13} />
                </button>
              ))
            ) : (
              <span>Ketuk kata untuk menyusun kalimat…</span>
            )}
          </div>
          <div className="word-bank">
            {e.words.map((w, i) => (
              <button
                key={i}
                className="word"
                disabled={checked || arranged.includes(i)}
                onClick={() => setArranged((a) => [...a, i])}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}
      {e.type === "matching" && (
        <div className="matching">
          <div>
            {e.pairs.map((pair) => (
              <button
                key={pair.text}
                disabled={matched.includes(pair.text) || checked}
                className={`${left === pair.text ? "selected" : ""} ${matched.includes(pair.text) ? "correct" : ""}`}
                onClick={() => {
                  setLeft(pair.text);
                  setPairError("");
                }}
              >
                {pair.text}
                {matched.includes(pair.text) && <Check size={17} />}
              </button>
            ))}
          </div>
          <div>
            {[...e.pairs].reverse().map((pair) => (
              <button
                key={pair.meaning}
                disabled={matched.includes(pair.text) || !left || checked}
                className={matched.includes(pair.text) ? "correct" : ""}
                onClick={() => {
                  if (left === pair.text) {
                    setMatched((a) => [...a, left]);
                    setLeft("");
                    setPairError("");
                  } else {
                    anyMismatch.current = true;
                    setPairError("Belum pas. Coba pasangan lain.");
                  }
                }}
              >
                {pair.meaning}
                {matched.includes(pair.text) && <Check size={17} />}
              </button>
            ))}
          </div>
          {pairError && (
            <p className="notice" role="status">
              {pairError}
            </p>
          )}
        </div>
      )}
      {e.type === "speaking" && (
        <>
          <Recorder phrase={p} onRecorded={() => setRecorded(true)} />
          {!recorded && (
            <button
              className="text-link skip-speech"
              onClick={() => setSkipped(true)}
            >
              {skipped
                ? "Dilewati — tidak dicatat sebagai latihan suara"
                : "Belum bisa merekam? Lewati latihan suara"}
            </button>
          )}
        </>
      )}
      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`answer-feedback ${correct ? "good" : "bad"}`}
          role="status"
        >
          <span>{correct ? <Check /> : <Lightbulb />}</span>
          <div>
            <h3>
              {e.type === "speaking"
                ? "Terima kasih sudah mencoba."
                : correct
                  ? "Pas sekali!"
                  : "Belum pas, tapi sekarang kamu tahu."}
            </h3>
            <p>
              {"explanation" in e
                ? e.explanation
                : e.type === "arrange"
                  ? `Ungkapan yang tepat: ${e.answer}`
                  : e.type === "speaking"
                    ? "Bandingkan rekamanmu dengan panduan. Tidak ada penilaian pelafalan otomatis."
                    : "Pasangan selesai. Ulangi nanti agar makin melekat."}
            </p>
          </div>
        </motion.div>
      )}
      <div className="lesson-action">
        <span>
          {checked
            ? "Satu langkah lebih dekat."
            : "Pelan-pelan saja, kamu bisa."}
        </span>
        <motion.button
          className={`button ${advancing ? "advancing" : ""}`}
          disabled={!canCheck}
          onClick={() => (checked ? continueNow() : check())}
          aria-label={
            checked
              ? "Lanjut sekarang, otomatis dalam sesaat"
              : "Periksa jawaban"
          }
          animate={advancing ? { scale: [1, 0.97, 1.02, 1] } : { scale: 1 }}
          transition={{ duration: 0.42 }}
        >
          {checked ? "Lanjut sekarang" : "Periksa"}
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </>
  );
}
export function LessonRunner({
  course,
  lesson,
  practice = false,
}: {
  course: Course;
  lesson: Lesson;
  practice?: boolean;
}) {
  const { progress, ready, update } = useProgress();
  const [index, setIndex] = useState(0),
    [done, setDone] = useState(false),
    [right, setRight] = useState(0),
    [assessed, setAssessed] = useState(0),
    [reward, setReward] = useState(0);
  const [exercises] = useState<Exercise[]>(() =>
    practice ? dailyExercises(progress, course) : lesson.exercises,
  );
  const guard = useRef(false);
  useEffect(() => {
    if (ready && isUnlocked(progress, course, lesson.id))
      update((p) =>
        p.currentCourse === course.id ? p : { ...p, currentCourse: course.id },
      ); /* only initialize course selection */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, course.id, lesson.id]);
  if (!ready)
    return (
      <main id="main-content" className="lesson-shell">
        <div className="skeleton" />
      </main>
    );
  if (!practice && !isUnlocked(progress, course, lesson.id))
    return (
      <main id="main-content" className="empty-state">
        <h1>Tahap ini belum terbuka.</h1>
        <p>Selesaikan pelajaran sebelumnya untuk melanjutkan perjalanan.</p>
        <Link className="button" href={`/belajar/${course.id}`}>
          Kembali ke jalur
        </Link>
      </main>
    );
  function answer(correct: boolean, count: boolean) {
    if (count) {
      setAssessed((n) => n + 1);
      if (correct) setRight((n) => n + 1);
      update((p) => {
        const current = exercises[index];
        if (current.type === "matching") {
          return current.pairs.reduce((state, pair) => {
            const phrase = course.phrases.find((p) => p.text === pair.text);
            return phrase ? review(state, phrase.id, correct) : state;
          }, p);
        }
        return review(p, current.phraseId, correct);
      });
    }
    if (index < exercises.length - 1) {
      setIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (!guard.current) {
      guard.current = true;
      const earned = practice
        ? progress.practiceDates.includes(dayKey())
          ? 0
          : 30
        : progress.completedLessons.includes(lesson.id)
          ? 0
          : 60;
      setReward(earned);
      update((p) =>
        practice ? finishPractice(p) : finishLesson(p, course, lesson.id),
      );
      setDone(true);
    }
  }
  const next =
    lessonsOf(course)[
      lessonsOf(course).findIndex((l) => l.id === lesson.id) + 1
    ];
  if (done)
    return (
      <MotionConfig reducedMotion="user">
        <main id="main-content" className="lesson-complete">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="completion-art">
              <Mascot mood="celebrate" />
              <span>✦</span>
              <span>✧</span>
            </div>
            <span className="eyebrow">SATU LANGKAH, BANYAK MAKNA</span>
            <h1>
              {practice ? "Ingatan makin kuat!" : "Perjalananmu bertambah!"}
            </h1>
            <p>
              {reward
                ? "Progres tersimpan. Bawa ungkapan barumu ke percakapan."
                : "Ulasan selesai. Hadiah untuk sesi ini sudah pernah diterima."}
            </p>
            <div className="completion-stats">
              <article>
                <Trophy />
                <strong>+{reward} XP</strong>
                <span>Pengalaman</span>
              </article>
              <article>
                <Check />
                <strong>
                  {right}/{assessed}
                </strong>
                <span>Jawaban mandiri benar</span>
              </article>
            </div>
            {next && !practice && (
              <p className="notice">Terbuka: {next.title}</p>
            )}
            <Link className="button" href={`/belajar/${course.id}`}>
              Lihat perjalanan <ArrowRight size={18} />
            </Link>
            <Link className="text-link" href="/beranda">
              Kembali ke beranda
            </Link>
          </motion.div>
        </main>
      </MotionConfig>
    );
  const e = exercises[index],
    p = allPhrases.find((p) => p.id === e.phraseId)!;
  return (
    <MotionConfig reducedMotion="user">
      <main id="main-content" className="lesson-shell">
        <header className="lesson-header">
          <Link
            href={`/belajar/${course.id}`}
            className="icon-button"
            aria-label="Keluar latihan, progres jawaban yang sudah diperiksa tetap tersimpan"
          >
            <X />
          </Link>
          <ProgressBar
            value={(index / exercises.length) * 100}
            label="Progres latihan"
          />
          <span>
            {index + 1}/{exercises.length}
          </span>
        </header>
        <div className="lesson-meta">
          <Link href={`/belajar/${course.id}`}>{course.name}</Link>
          <span> / {practice ? "Latihan Hari Ini" : lesson.title}</span>
        </div>
        <ExerciseCard key={e.id} exercise={e} phrase={p} onAnswer={answer} />
      </main>
    </MotionConfig>
  );
}
export function DailyPractice() {
  const { progress, ready } = useProgress();
  const c = getCourse(progress.currentCourse);
  return ready ? (
    <LessonRunner key={c.id} course={c} lesson={lessonsOf(c)[0]} practice />
  ) : (
    <div className="skeleton" />
  );
}
