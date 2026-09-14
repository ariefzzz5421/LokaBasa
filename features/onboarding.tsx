"use client";
import { RegionImage } from "@/components/region-image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Compass } from "lucide-react";
import { courses, getCourse } from "@/courses/catalog";
import { useProgress } from "@/lib/store";
import { Brand } from "@/components/shell";
import { Mascot } from "@/components/illustrations";
import { ProgressBar } from "./learning";
export function Onboarding() {
  const router = useRouter(),
    params = useSearchParams(),
    { update } = useProgress();
  const [step, setStep] = useState(0),
    [selected, setSelected] = useState(params.get("course") || "jawa"),
    [motivation, setMotivation] = useState("Budaya"),
    [minutes, setMinutes] = useState(10);
  const c = getCourse(selected);
  function begin() {
    update((p) => ({
      ...p,
      onboarded: true,
      currentCourse: c.id,
      motivation,
      dailyGoal: minutes,
    }));
    router.push(`/lesson/${c.id}/${c.units[0].lessons[0].id}`);
  }
  return (
    <div className="onboarding">
      <header>
        <Brand />
        <a href="/belajar" className="text-link">
          Jelajahi dulu ↗
        </a>
      </header>
      <main id="main-content">
        <div className="onboarding-progress">
          <button
            className="icon-button"
            onClick={() => (step ? setStep(step - 1) : router.push("/"))}
            aria-label="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
          <ProgressBar value={(step + 1) * 25} label="Tahap perkenalan" />
          <span>{step + 1}/4</span>
        </div>
        <div className="onboarding-heading">
          <span className="eyebrow">PASPOR PERJALANANMU</span>
          <h1>
            {
              [
                "Mau belajar bahasa apa?",
                "Kenapa kamu ingin belajar?",
                "Berapa lama setiap hari?",
                "Siap memulai perjalanan?",
              ][step]
            }
          </h1>
          <p>
            {
              [
                "Pilih satu tujuan. Nanti kamu bisa menjelajahi yang lain.",
                "Kita mulai dari alasan yang dekat denganmu.",
                "Sedikit, tapi rutin. Kamu bisa mengubahnya kapan saja.",
                "Satu sapaan pertamamu sudah menunggu.",
              ][step]
            }
          </p>
        </div>
        {step === 0 && (
          <div className="onboard-courses">
            {courses.map((x) => (
              <button
                key={x.id}
                className={x.id === selected ? "selected" : ""}
                onClick={() => setSelected(x.id)}
                aria-pressed={x.id === selected}
              >
                <RegionImage variant={x.id} />
                <div>
                  <strong>{x.name}</strong>
                  <small>{x.dialect}</small>
                </div>
                {x.id === selected && <Check size={20} />}
              </button>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="option-grid">
            {[
              "Keluarga",
              "Teman",
              "Travel",
              "Budaya",
              "Seru-seruan",
              "Lainnya",
            ].map((m, i) => (
              <button
                className={motivation === m ? "selected" : ""}
                key={m}
                onClick={() => setMotivation(m)}
                aria-pressed={motivation === m}
              >
                <span>{["⌂", "☺", "↗", "✳", "✦", "◎"][i]}</span>
                {m}
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="time-options">
            {[5, 10, 15, 20].map((t, i) => (
              <button
                key={t}
                className={minutes === t ? "selected" : ""}
                onClick={() => setMinutes(t)}
                aria-pressed={minutes === t}
              >
                <strong>{t} menit</strong>
                <span>
                  {
                    [
                      "Santai",
                      "Pas untuk rutinitas",
                      "Makin mendalami",
                      "Semangat menjelajah",
                    ][i]
                  }
                </span>
                {t === 10 && <small>REKOMENDASI</small>}
              </button>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="passport">
            <RegionImage variant={c.id} />
            <Mascot />
            <div>
              <span className="eyebrow">DESTINASI PERTAMA</span>
              <h2>{c.name}</h2>
              <p>{c.region}</p>
              <span className="tag">
                {minutes} menit / hari · {motivation}
              </span>
            </div>
            <p className="muted">
              Materi perintis. Belajar sambil menghargai variasi penutur dan
              konteks.
            </p>
          </div>
        )}
        <div className="onboarding-bottom">
          <p>
            <Compass size={17} /> Progres disimpan di perangkat ini.
          </p>
          <button
            className="button"
            onClick={() => (step < 3 ? setStep(step + 1) : begin())}
          >
            {step === 3 ? "Mulai" : "Lanjut"}
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
