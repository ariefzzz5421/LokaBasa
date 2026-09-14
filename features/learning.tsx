"use client";
import { RegionImage } from "@/components/region-image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  Zap,
  Target,
  Clock,
  BookOpen,
  Headphones,
  Mic,
  Check,
  Lock,
  Star,
  MessageCircle,
  Trophy,
  Compass,
} from "lucide-react";
import { courses, getCourse, lessonsOf } from "@/courses/catalog";
import { useProgress } from "@/lib/store";
import {
  achievements,
  dayKey,
  level,
  percentage,
  streaks,
  isUnlocked,
} from "@/lib/progress";
import { Mascot } from "@/components/illustrations";
import { AudioButton, SavePhrase } from "@/components/audio";
import type { Course } from "@/types";
export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={Math.min(100, value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
export function CourseCard({ course }: { course: Course }) {
  const { progress } = useProgress();
  const percent = percentage(progress, course);
  return (
    <article className={`course-card accent-${course.accent}`}>
      <Link
        href={`/belajar/${course.id}`}
        className="course-image"
        aria-label={`Jelajahi bahasa ${course.name}`}
      >
        <RegionImage variant={course.id} />
        <span className="course-region">{course.region}</span>
        <span className="course-arrow">
          <ArrowUpRight size={20} />
        </span>
      </Link>
      <div className="course-info">
        <div className="row">
          <h3>{course.name}</h3>
          <span className="course-level">
            Level {level(progress.courseXp[course.id] || 0)}
          </span>
        </div>
        <p>{course.tagline}</p>
        <div className="course-progress">
          <span>{percent ? `${percent}% perjalanan` : "Petualangan baru"}</span>
          <span>{progress.courseXp[course.id] || 0} XP</span>
        </div>
        <ProgressBar value={percent} label={`Progres ${course.name}`} />
        <Link className="course-link" href={`/belajar/${course.id}`}>
          {percent ? "Lanjut Belajar" : "Mulai perjalanan"}{" "}
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
export function QuestCard() {
  const { progress, update } = useProgress();
  const today = dayKey();
  const reviewed = Object.values(progress.vocabulary).filter(
    (v) => dayKey(new Date(v.lastReviewed)) === today,
  ).length;
  const spoken = progress.speakingHistory.filter(
    (a) => dayKey(new Date(a.date)) === today,
  ).length;
  const quests = [
    {
      id: "practice",
      title: "Selesaikan latihan harian",
      n: Number(progress.practiceDates.includes(today)),
      target: 1,
    },
    { id: "speak", title: "Latihan suara 5 kali", n: spoken, target: 5 },
    { id: "words", title: "Ulas 10 ungkapan", n: reviewed, target: 10 },
  ];
  const complete = quests.every((q) => q.n >= q.target),
    claimed = progress.questRewards.includes(today);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const week = progress.activityDates.filter(
    (d) => d >= dayKey(weekStart),
  ).length;
  return (
    <article className="panel quests">
      <div className="row">
        <h3>Misi hari ini</h3>
        <Target size={21} />
      </div>
      <p className="muted">Langkah kecil, kemajuan nyata.</p>
      {quests.map((q) => (
        <div className="quest" key={q.id}>
          <span className={`quest-icon ${q.n >= q.target ? "done" : ""}`}>
            {q.n >= q.target ? <Check size={18} /> : <Star size={17} />}
          </span>
          <div>
            <div className="row">
              <strong>{q.title}</strong>
              <small>
                {Math.min(q.n, q.target)}/{q.target}
              </small>
            </div>
            <ProgressBar value={(q.n / q.target) * 100} label={q.title} />
          </div>
        </div>
      ))}
      <button
        className="button quest-reward secondary"
        disabled={!complete || claimed}
        onClick={() =>
          update((p) =>
            p.questRewards.includes(today)
              ? p
              : {
                  ...p,
                  xp: p.xp + 100,
                  questRewards: [...p.questRewards, today],
                },
          )
        }
      >
        <Zap size={17} />
        {claimed
          ? "100 XP sudah diterima"
          : complete
            ? "Ambil 100 XP"
            : "Hadiah 100 XP"}
      </button>
      <div className="weekly">
        <strong>Misi mingguan</strong>
        <p>Belajar di 5 hari dalam 7 hari terakhir · {Math.min(5, week)}/5</p>
        <ProgressBar value={(week / 5) * 100} label="Misi mingguan" />
      </div>
    </article>
  );
}
export function Dashboard() {
  const { progress } = useProgress();
  const c = getCourse(progress.currentCourse);
  const next =
    lessonsOf(c).find((l) => !progress.completedLessons.includes(l.id)) ||
    lessonsOf(c)[0];
  const recent = Object.values(progress.vocabulary)
    .sort((a, b) => b.lastReviewed.localeCompare(a.lastReviewed))
    .slice(0, 3);
  const phrases = recent
    .map((v) =>
      courses.flatMap((c) => c.phrases).find((p) => p.id === v.phraseId),
    )
    .filter((p) => !!p);
  const due = Object.values(progress.vocabulary).filter(
    (v) => v.confidence < 0.7 || new Date(v.nextReview) <= new Date(),
  ).length;
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">SETIAP KATA MEMBAWA KITA LEBIH DEKAT</span>
          <h1>
            Halo, {progress.name} <span className="hello">☀</span>
          </h1>
          <p>Siap menambah cerita baru hari ini?</p>
        </div>
        <span className="date-label">
          <Compass size={16} /> Penjelajah level {level(progress.xp)}
        </span>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="continue-card">
            <div className="continue-copy">
              <span className="pill light">
                PERJALANAN AKTIF <span>•</span> {c.name.toUpperCase()}
              </span>
              <h2>
                Satu sapaan.
                <br />
                Banyak cerita.
              </h2>
              <p>
                {next.title} · {c.dialect}
              </p>
              <Link
                className="button cream"
                href={
                  progress.onboarded
                    ? `/lesson/${c.id}/${next.id}`
                    : "/onboarding"
                }
              >
                {progress.completedLessons.length
                  ? "Lanjut Belajar"
                  : "Mulai Belajar"}{" "}
                <ArrowRight size={18} />
              </Link>
              <div className="continue-progress">
                <ProgressBar
                  value={percentage(progress, c)}
                  label="Progres kursus aktif"
                />
                <span>{percentage(progress, c)}% perjalanan</span>
              </div>
            </div>
            <div className="continue-landscape">
              <RegionImage variant={c.id} />
              <Mascot />
              <span className="mini-bubble">Ayo, kita mulai!</span>
            </div>
          </section>
          <div className="stat-grid">
            <article>
              <span className="stat-icon peach">
                <Flame />
              </span>
              <div>
                <strong>
                  {streaks(progress.activityDates).current} <small>hari</small>
                </strong>
                <p>Streak belajar</p>
              </div>
            </article>
            <article>
              <span className="stat-icon yellow">
                <Zap />
              </span>
              <div>
                <strong>
                  {progress.xp} <small>XP</small>
                </strong>
                <p>Total pengalaman</p>
              </div>
            </article>
            <article>
              <span className="stat-icon mint">
                <Target />
              </span>
              <div>
                <strong>
                  {progress.dailyGoal} <small>menit</small>
                </strong>
                <p>Target harian</p>
              </div>
            </article>
          </div>
          <div className="section-heading compact-head">
            <div>
              <h2>Ke mana selanjutnya?</h2>
              <p>Satu negeri, banyak cara bercerita.</p>
            </div>
            <Link className="text-link" href="/belajar">
              Lihat semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="course-grid dashboard-courses">
            {[c, ...courses.filter((x) => x.id !== c.id)]
              .slice(0, 2)
              .map((x) => (
                <CourseCard key={x.id} course={x} />
              ))}
          </div>
          <div className="practice-banner">
            <span className="practice-icon">
              <Headphones size={28} />
            </span>
            <div>
              <span className="eyebrow">LATIHAN HARI INI</span>
              <h3>Ingat lagi, makin melekat.</h3>
              <p>
                {due
                  ? `${due} ungkapan siap kamu ulas.`
                  : "8 latihan singkat untuk menguatkan ingatan."}{" "}
                · 5–10 menit
              </p>
            </div>
            <Link
              href="/latihan"
              className="icon-button"
              aria-label="Mulai latihan harian"
            >
              <ArrowRight />
            </Link>
          </div>
          <div className="section-heading compact-head">
            <h2>Ungkapan terakhirmu</h2>
            <Link href="/kamus" className="text-link">
              Buka buku <BookOpen size={17} />
            </Link>
          </div>
          {phrases.length ? (
            <div className="recent-phrases">
              {phrases.map((p) => (
                <article key={p.id}>
                  <div>
                    <strong>{p.text}</strong>
                    <p>{p.meaning}</p>
                  </div>
                  <SavePhrase phrase={p} />
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-inline">
              <BookOpen />
              <p>
                Belum ada ungkapan yang dipelajari. Selesaikan pelajaran pertama
                untuk mengisi buku perjalananmu.
              </p>
            </div>
          )}
        </div>
        <aside className="dashboard-side">
          <QuestCard />
          <article className="daily-phrase panel">
            <span className="eyebrow">SATU UNGKAPAN HARI INI</span>
            <div className="phrase-flower">✳</div>
            <span className="tag">
              {c.name} · {c.phrases[0].formality}
            </span>
            <h3>“{c.phrases[0].text}”</h3>
            <p>{c.phrases[0].meaning}</p>
            <AudioButton phrase={c.phrases[0]} />
            <Link href="/kamus" className="text-link">
              Kenali konteksnya <ArrowUpRight size={15} />
            </Link>
          </article>
          <article className="achievement-teaser">
            <div className="badge-mark">
              <Trophy size={29} />
            </div>
            <h3>
              {progress.completedLessons.length
                ? "Langkah Pertama"
                : "Lencana pertamamu menunggu"}
            </h3>
            <p>
              {progress.completedLessons.length
                ? "Satu pelajaran selesai. Perjalanan baru saja dimulai."
                : "Selesaikan satu pelajaran dan mulai koleksi pencapaianmu."}
            </p>
            <Link href="/profil" className="text-link">
              Lihat pencapaian <ArrowRight size={15} />
            </Link>
          </article>
        </aside>
      </div>
    </>
  );
}
export function CoursesPage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">PILIH DESTINASIMU</span>
          <h1>
            Bahasa baru.
            <br />
            Cerita baru.
          </h1>
          <p>
            Tak perlu jauh untuk merasa lebih dekat. Mulai dari satu sapaan.
          </p>
        </div>
        <Link href="/peta" className="button secondary">
          <Compass size={18} /> Jelajahi peta
        </Link>
      </div>
      <div className="course-grid">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
      <div className="content-note">
        <strong>Kenali ragamnya, hargai perbedaannya.</strong>
        <p>
          Tiap kategori memiliki cakupan sendiri. Buka kursus untuk melihat
          dialek, konteks budaya, dan rujukan materi perintis.
        </p>
      </div>
    </>
  );
}
const icons = {
  lesson: Star,
  listening: Headphones,
  speaking: Mic,
  vocabulary: BookOpen,
  conversation: MessageCircle,
  culture: Compass,
  checkpoint: Check,
  boss: Trophy,
};
export function CoursePath({ course: c }: { course: Course }) {
  const { progress, update } = useProgress();
  return (
    <>
      <Link href="/belajar" className="back-link">
        ← Semua bahasa
      </Link>
      <div className={`course-hero accent-${c.id}`}>
        <div>
          <span className="eyebrow">{c.region}</span>
          <h1>Jelajah {c.name}</h1>
          <p>{c.tagline}</p>
          <span className="tag">{c.dialect}</span>
          <div className="course-hero-progress">
            <ProgressBar
              value={percentage(progress, c)}
              label="Penyelesaian kursus"
            />
            <strong>{percentage(progress, c)}%</strong>
          </div>
        </div>
        <RegionImage variant={c.id} />
      </div>
      <div className="path-layout">
        <div className="learning-path">
          {c.units.map((u, ui) => (
            <section key={u.id} className="path-unit">
              <header>
                <span>UNIT {ui + 1}</span>
                <h2>{u.title}</h2>
                <p>{u.description}</p>
              </header>
              <div className="path-nodes">
                {u.lessons.map((l, i) => {
                  const done = progress.completedLessons.includes(l.id),
                    unlocked = isUnlocked(progress, c, l.id),
                    Icon = icons[l.kind];
                  return (
                    <div
                      key={l.id}
                      className={`node-wrap offset-${i} ${done ? "completed" : unlocked ? "current" : "locked"}`}
                    >
                      <div className="node-caption">
                        {unlocked && !done && (
                          <span className="start-label">MULAI DI SINI</span>
                        )}
                        {unlocked ? (
                          <Link
                            className="lesson-node"
                            aria-label={`${done ? "Ulangi" : "Mulai"} ${l.title}`}
                            href={`/lesson/${c.id}/${l.id}`}
                            onClick={() =>
                              update((p) => ({ ...p, currentCourse: c.id }))
                            }
                          >
                            {done ? <Check size={29} /> : <Icon size={29} />}
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="lesson-node"
                            aria-label={`${l.title} terkunci. Selesaikan pelajaran sebelumnya.`}
                          >
                            <Lock size={25} />
                          </button>
                        )}
                        <strong>{l.title}</strong>
                        <small>
                          {done
                            ? "Selesai · +60 XP"
                            : unlocked
                              ? "6 latihan · ±5 menit"
                              : "Selesaikan tahap sebelumnya"}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <aside className="path-aside">
          <article className="panel">
            <Mascot />
            <h3>Ora isin, terus sinau!</h3>
            <p>
              Tak apa mengulang. Belajar bahasa itu soal berani mencoba, sedikit
              demi sedikit.
            </p>
            <Link href="/latihan" className="button secondary">
              Ulas ungkapan <ArrowRight size={16} />
            </Link>
          </article>
          <article className="panel cultural-card">
            <span className="eyebrow">KENAPA ORANG NGOMONG BEGINI?</span>
            <h3>Bahasa punya rasa.</h3>
            <p>{c.culturalNotes}</p>
            <details>
              <summary>Tentang materi & sumber</summary>
              <p>
                {c.language} · {c.nativeName}
              </p>
              <p>{c.writingConventions}</p>
              <p>{c.pronunciationRules}</p>
              <p>
                Materi perintis — belum ditinjau penutur. Rujukan berikut untuk
                proses peninjauan, bukan verifikasi setiap kalimat.
              </p>
              {c.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                  {s.title} ↗
                </a>
              ))}
            </details>
          </article>
          <Link href="/kamus" className="panel text-link">
            Bawa buku ungkapan <BookOpen size={20} />
          </Link>
        </aside>
      </div>
    </>
  );
}
