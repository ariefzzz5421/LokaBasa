"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Bookmark, BookOpen, ArrowRight } from "lucide-react";
import { allPhrases, categories, courses } from "@/courses/catalog";
import { useProgress } from "@/lib/store";
import { AudioButton, SavePhrase } from "@/components/audio";
export function Phrasebook() {
  const { progress } = useProgress();
  const [q, setQ] = useState(""),
    [course, setCourse] = useState("all"),
    [category, setCategory] = useState("all"),
    [saved, setSaved] = useState(false),
    [limit, setLimit] = useState(12);
  const filtered = allPhrases.filter(
    (p) =>
      (course === "all" || p.courseId === course) &&
      (category === "all" || p.category === category) &&
      (!saved || progress.savedPhrases.includes(p.id)) &&
      `${p.text} ${p.meaning}`
        .toLocaleLowerCase("id")
        .includes(q.toLocaleLowerCase("id")),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">BEKAL UNTUK SETIAP PERTEMUAN</span>
          <h1>Buku Ungkapan</h1>
          <p>Simpan kata yang dekat. Temukan ungkapan saat kamu perlu.</p>
        </div>
        <button
          className={`button secondary ${saved ? "selected" : ""}`}
          onClick={() => {
            setSaved(!saved);
            setLimit(12);
          }}
          aria-pressed={saved}
        >
          <Bookmark size={18} />
          {saved
            ? "Tampilkan semua"
            : `Tersimpan (${progress.savedPhrases.length})`}
        </button>
      </div>
      <div className="phrase-filters">
        <label className="search-field">
          <Search size={20} />
          <input
            aria-label="Cari ungkapan atau arti"
            placeholder="Cari ungkapan atau arti…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(12);
            }}
          />
        </label>
        <label>
          <span className="sr-only">Bahasa</span>
          <select
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              setLimit(12);
            }}
          >
            <option value="all">Semua bahasa</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Kategori</span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setLimit(12);
            }}
          >
            <option value="all">Semua kategori</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="result-count">
        {filtered.length} ungkapan · Materi perintis, gunakan dengan
        memperhatikan konteks.
      </p>
      <div className="phrase-grid">
        {filtered.slice(0, limit).map((p) => (
          <article className="phrase-card panel" key={p.id}>
            <div className="row">
              <span className="tag">
                {courses.find((c) => c.id === p.courseId)?.name} · {p.category}
              </span>
              <SavePhrase phrase={p} />
            </div>
            <h2>{p.text}</h2>
            <p>{p.meaning}</p>
            <span className="pronunciation">{p.pronunciation}</span>
            <AudioButton phrase={p} />
            <details>
              <summary>Kenapa orang ngomong begini?</summary>
              <p>{p.context}</p>
              <p>
                {p.formality} ·{" "}
                {courses.find((c) => c.id === p.courseId)?.dialect}
              </p>
            </details>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <BookOpen size={40} />
          <h2>
            {saved
              ? "Buku simpananmu masih kosong."
              : "Belum ada ungkapan di sini."}
          </h2>
          <p>
            {saved
              ? "Ketuk ikon simpan pada ungkapan yang ingin kamu ingat."
              : "Coba kata lain atau kategori berbeda. Materi akan bertambah setelah peninjauan."}
          </p>
          <button
            className="button secondary"
            onClick={() => {
              setQ("");
              setCategory("all");
              setCourse("all");
              setSaved(false);
            }}
          >
            Lihat semua ungkapan <ArrowRight size={16} />
          </button>
        </div>
      )}
      {filtered.length > limit && (
        <button
          className="button secondary load-more"
          onClick={() => setLimit((n) => n + 12)}
        >
          Muat 12 berikutnya
        </button>
      )}
      <Link href="/tentang" className="text-link content-link">
        Tentang sumber & peninjauan materi ↗
      </Link>
    </>
  );
}
