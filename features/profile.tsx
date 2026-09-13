"use client";
import { useState } from "react";
import {
  Download,
  Check,
  Trophy,
  Flame,
  Zap,
  BookOpen,
  Mic,
  Compass,
} from "lucide-react";
import { useProgress } from "@/lib/store";
import { achievements, level, percentage, streaks } from "@/lib/progress";
import { courses } from "@/courses/catalog";
import { ProgressBar } from "./learning";
import Link from "next/link";
export function Profile() {
  const { progress, update } = useProgress();
  const [name, setName] = useState(progress.name),
    [saved, setSaved] = useState(false);
  const streak = streaks(progress.activityDates);
  function download() {
    let raw = JSON.stringify(progress, null, 2);
    try {
      raw = localStorage.getItem("lokabasa.progress.v1") || raw;
    } catch {}
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lokabasa-progres.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">PASPOR PENJELAJAH</span>
          <h1>Cerita perjalananmu.</h1>
          <p>Setiap kata baru layak dirayakan.</p>
        </div>
        <button className="button secondary" onClick={download}>
          <Download size={17} /> Unduh progres
        </button>
      </div>
      <div className="profile-banner">
        <span className="profile-avatar">
          {progress.name[0]?.toUpperCase()}
        </span>
        <div>
          <h2>{progress.name}</h2>
          <p>Penjelajah Nusantara · Level {level(progress.xp)}</p>
          <ProgressBar
            value={(progress.xp % 200) / 2}
            label="XP menuju level berikutnya"
          />
          <small>{progress.xp % 200}/200 XP ke level berikutnya</small>
        </div>
        <Compass size={76} />
      </div>
      <div className="profile-stats">
        {[
          { icon: Zap, value: progress.xp, label: "Total XP" },
          { icon: Flame, value: streak.current, label: "Streak saat ini" },
          { icon: Trophy, value: streak.longest, label: "Streak terpanjang" },
          {
            icon: Compass,
            value: Object.keys(progress.courseXp).length,
            label: "Bahasa dipelajari",
          },
          {
            icon: Check,
            value: progress.completedLessons.length,
            label: "Pelajaran selesai",
          },
          {
            icon: BookOpen,
            value: Object.keys(progress.vocabulary).length,
            label: "Ungkapan diulas",
          },
          {
            icon: Mic,
            value: progress.speakingHistory.length,
            label: "Latihan rekam suara",
          },
        ].map((s) => (
          <article className="panel" key={s.label}>
            <s.icon size={22} />
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </article>
        ))}
      </div>
      <div className="section-heading">
        <h2>Koleksi pencapaian</h2>
        <span className="muted">
          {achievements.filter((a) => a.achieved(progress)).length}/
          {achievements.length} terbuka
        </span>
      </div>
      <div className="achievements-grid">
        {achievements.map((a, i) => (
          <article
            key={a.id}
            className={`achievement-card ${a.achieved(progress) ? "earned" : ""}`}
          >
            <div className={`badge-mark badge-${i}`}>
              <Trophy size={28} />
              <span>{["✦", "◈", "✳", "❋", "✧"][i]}</span>
            </div>
            <h3>{a.title}</h3>
            <p>{a.description}</p>
            <small>
              {a.achieved(progress) ? "✓ TERBUKA" : "BELUM TERBUKA"}
            </small>
          </article>
        ))}
      </div>
      <div className="profile-bottom">
        <section className="panel">
          <h2>Jejak per bahasa</h2>
          {courses.map((c) => (
            <Link
              className="profile-course"
              key={c.id}
              href={`/belajar/${c.id}`}
            >
              <div className="row">
                <strong>{c.name}</strong>
                <span>{percentage(progress, c)}%</span>
              </div>
              <ProgressBar value={percentage(progress, c)} label={c.name} />
            </Link>
          ))}
        </section>
        <section className="panel">
          <h2>Atur perjalanan</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) {
                update((p) => ({ ...p, name: name.trim().slice(0, 30) }));
                setSaved(true);
              }
            }}
          >
            <label className="field">
              Nama panggilan
              <input
                required
                maxLength={30}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
            <label className="field">
              Target harian
              <select
                value={progress.dailyGoal}
                onChange={(e) =>
                  update((p) => ({ ...p, dailyGoal: Number(e.target.value) }))
                }
              >
                {[5, 10, 15, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} menit
                  </option>
                ))}
              </select>
            </label>
            <button className="button secondary" type="submit">
              {saved ? "✓ Tersimpan" : "Simpan nama"}
            </button>
          </form>
          <p className="muted">
            Progres tersimpan hanya di browser ini. Menghapus data situs akan
            menghapus progres. Unduh salinan untuk menyimpan catatanmu.
          </p>
          <Link href="/tentang" className="text-link">
            Materi, audio & privasi ↗
          </Link>
        </section>
      </div>
    </>
  );
}
