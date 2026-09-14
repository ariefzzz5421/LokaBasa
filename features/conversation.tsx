"use client";
import { RegionImage } from "@/components/region-image";
import { useState } from "react";
import { MessageCircle, ArrowRight, RotateCcw, Check, Mic } from "lucide-react";
import { courses, getCourse } from "@/courses/catalog";
import { scenarios } from "@/data/scenarios";
import { useProgress } from "@/lib/store";
import { review } from "@/lib/progress";
import { Mascot } from "@/components/illustrations";
import { AudioButton, Recorder } from "@/components/audio";
export function Conversation() {
  const { progress, update } = useProgress();
  const [courseId, setCourseId] = useState(progress.currentCourse),
    [scenarioId, setScenarioId] = useState(""),
    [step, setStep] = useState(0),
    [voice, setVoice] = useState(false),
    [chat, setChat] = useState<{ role: "npc" | "user"; text: string }[]>([]),
    [done, setDone] = useState(false);
  const c = getCourse(courseId),
    scenario = scenarios.find((s) => s.id === scenarioId);
  const relevant = c.phrases.filter((p) => p.category === scenario?.category);
  const pool = [
    ...(relevant.length ? relevant : c.phrases.slice(0, 1)),
    ...c.phrases.filter((p) => !relevant.includes(p)),
  ].slice(0, 3);
  const phrase = pool[step];
  function start(id: string) {
    const s = scenarios.find((x) => x.id === id)!;
    setScenarioId(id);
    setChat([{ role: "npc", text: s.npc }]);
    setStep(0);
    setDone(false);
    setVoice(false);
  }
  function reply(correct: boolean) {
    const response = correct
      ? phrase.text
      : c.phrases.find((p) => p.id !== phrase.id)!.text;
    update((p) => review(p, phrase.id, correct));
    if (correct) {
      const next = step + 1;
      setChat((a) => [
        ...a,
        { role: "user", text: response },
        {
          role: "npc",
          text:
            next === 3
              ? "Pas! Sekarang kamu punya tiga bekal ungkapan. Perhatikan lawan bicara dan konteks saat menggunakannya."
              : `Ya, “${phrase.text}” berarti “${phrase.meaning}”. Yuk, lanjutkan obrolan.`,
        },
      ]);
      if (next === 3) setDone(true);
      else setStep(next);
    } else
      setChat((a) => [
        ...a,
        { role: "user", text: response },
        {
          role: "npc",
          text: `Belum sesuai maksud kita. Untuk “${phrase.meaning}”, coba pilih ungkapan lain. Tak apa, kita ulangi.`,
        },
      ]);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">BUKAN HAFALAN. PERCAKAPAN.</span>
          <h1>Ngobrol, yuk.</h1>
          <p>Latihan terpandu di situasi sehari-hari. Tanpa takut salah.</p>
        </div>
        <label>
          <span className="sr-only">Bahasa percakapan</span>
          <select
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              setScenarioId("");
            }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.dialect}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!scenario ? (
        <>
          <div className="conversation-intro">
            <Mascot />
            <div>
              <h2>Mau mulai cerita di mana?</h2>
              <p>Aku Komo, teman latihanmu. Pilih suasana dan kita mulai!</p>
              <small>
                Dialog pengantar berbahasa Indonesia; ungkapan daerah mengikuti
                materi perintis. Pilihan jawaban menentukan tanggapanku.
              </small>
            </div>
          </div>
          <div className="scenario-grid">
            {scenarios.map((s) => (
              <button
                className="scenario-card"
                key={s.id}
                onClick={() => start(s.id)}
              >
                <span className="scenario-icon">{s.icon}</span>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <span className="text-link">
                  Mulai ngobrol <ArrowRight size={16} />
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="conversation-layout">
          <aside className="conversation-scene">
            <RegionImage variant={c.id} />
            <Mascot />
            <div>
              <span className="eyebrow">
                {c.name} · {step + 1}/3 UNGKAPAN
              </span>
              <h2>{scenario.place}</h2>
              <p>{scenario.description}</p>
              <button className="text-link" onClick={() => setScenarioId("")}>
                ← Ganti suasana
              </button>
            </div>
          </aside>
          <section className="chat-panel">
            <header>
              <span className="avatar">
                <MessageCircle size={20} />
              </span>
              <div>
                <strong>Komo</strong>
                <small>Teman ngobrolmu · latihan terpandu</small>
              </div>
            </header>
            <div className="chat-messages" aria-live="polite">
              {chat.map((message, i) => (
                <div className={`chat-bubble ${message.role}`} key={i}>
                  {message.text}
                </div>
              ))}
            </div>
            {done ? (
              <div className="chat-replies">
                <h3>
                  <Check size={20} /> Percakapan selesai!
                </h3>
                <p>Jawabanmu sudah masuk catatan ulasan.</p>
                <button className="button" onClick={() => start(scenario.id)}>
                  <RotateCcw size={17} /> Ulangi percakapan
                </button>
                <button className="text-link" onClick={() => setScenarioId("")}>
                  Pilih cerita lain
                </button>
              </div>
            ) : (
              <div className="chat-replies">
                <span className="eyebrow">GILIRANMU</span>
                <p>
                  Sampaikan: <strong>“{phrase.meaning}”</strong>
                </p>
                {!relevant.length && (
                  <small>
                    Materi situasi ini belum tersedia untuk {c.name}; kita mulai
                    dengan bekal ungkapan dasar.
                  </small>
                )}
                <div className="reply-buttons">
                  <button onClick={() => reply(true)}>
                    {phrase.text}
                    <ArrowRight size={16} />
                  </button>
                  <button onClick={() => reply(false)}>
                    {c.phrases.find((p) => p.id !== phrase.id)!.text}
                    <ArrowRight size={16} />
                  </button>
                </div>
                <button className="text-link" onClick={() => setVoice(!voice)}>
                  <Mic size={16} />
                  {voice ? "Tutup latihan suara" : "Latih respons dengan suara"}
                </button>
                {voice && (
                  <div className="chat-voice">
                    <AudioButton phrase={phrase} />
                    <Recorder key={phrase.id} phrase={phrase} />
                    <p className="muted">
                      Rekaman tidak diterjemahkan otomatis. Pilih respons di
                      atas untuk melanjutkan dialog.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
