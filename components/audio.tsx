"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2, Square, Mic, Bookmark, Check } from "lucide-react";
import type { Phrase } from "@/types";
import { audioFor, type AudioProvider } from "@/lib/audio";
import { useProgress } from "@/lib/store";
export function AudioButton({ phrase }: { phrase: Phrase }) {
  const [playing, setPlaying] = useState(false),
    [error, setError] = useState("");
  const provider = useRef<AudioProvider | null>(null);
  const playbackId = useRef(0);
  useEffect(
    () => () => {
      playbackId.current++;
      provider.current?.stop();
    },
    [phrase.id],
  );
  async function play() {
    const id = ++playbackId.current;
    if (playing) {
      provider.current?.stop();
      setPlaying(false);
      return;
    }
    setError("");
    setPlaying(true);
    provider.current = audioFor(phrase);
    try {
      await provider.current.play(phrase);
    } catch (e) {
      if (id === playbackId.current) setError((e as Error).message);
    } finally {
      if (id === playbackId.current) setPlaying(false);
    }
  }
  return (
    <div className="audio-control">
      <button
        className={`audio-button ${playing ? "playing" : ""}`}
        onClick={play}
        aria-label={playing ? "Hentikan audio" : `Dengarkan ${phrase.text}`}
      >
        {playing ? <Square size={19} /> : <Volume2 size={21} />}{" "}
        {playing ? (
          <span className="wave">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : (
          <span>Dengarkan</span>
        )}
      </button>
      <small>
        {phrase.audioUrl
          ? "Rekaman penutur"
          : "Suara sintetis, bukan acuan aksen"}
      </small>
      {error && (
        <p className="notice" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
export function SavePhrase({ phrase }: { phrase: Phrase }) {
  const { progress, update } = useProgress();
  const saved = progress.savedPhrases.includes(phrase.id);
  return (
    <button
      className={`icon-button ${saved ? "saved" : ""}`}
      aria-pressed={saved}
      aria-label={saved ? "Hapus dari tersimpan" : "Simpan ungkapan"}
      onClick={() =>
        update((p) => ({
          ...p,
          savedPhrases: saved
            ? p.savedPhrases.filter((id) => id !== phrase.id)
            : [...p.savedPhrases, phrase.id],
        }))
      }
    >
      {saved ? <Check size={19} /> : <Bookmark size={19} />}
    </button>
  );
}
export function Recorder({
  phrase,
  onRecorded,
}: {
  phrase: Phrase;
  onRecorded?: () => void;
}) {
  const { update } = useProgress();
  const [state, setState] = useState<
      "idle" | "requesting" | "recording" | "ready" | "error"
    >("idle"),
    [error, setError] = useState(""),
    [url, setUrl] = useState("");
  const recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    active = useRef(true),
    urlRef = useRef(""),
    requestId = useRef(0);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      requestId.current++;
      if (timer.current) clearTimeout(timer.current);
      recorder.current?.state === "recording" && recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
      URL.revokeObjectURL(urlRef.current);
    };
  }, []);
  async function start() {
    const attempt = ++requestId.current;
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setState("error");
      setError(
        "Rekaman tidak didukung. Coba Chrome/Safari terbaru melalui HTTPS, atau ucapkan sendiri sambil membaca.",
      );
      return;
    }
    setState("requesting");
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!active.current || attempt !== requestId.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      const rec = new MediaRecorder(media);
      recorder.current = rec;
      const chunks: BlobPart[] = [];
      const started = Date.now();
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      let failed = false;
      rec.onerror = () => {
        failed = true;
        media.getTracks().forEach((t) => t.stop());
        if (timer.current) clearTimeout(timer.current);
        if (active.current) {
          setState("error");
          setError("Rekaman terputus. Periksa mikrofon lalu coba lagi.");
        }
      };
      rec.onstop = () => {
        media.getTracks().forEach((t) => t.stop());
        if (timer.current) clearTimeout(timer.current);
        if (!active.current || failed) return;
        const duration = (Date.now() - started) / 1000;
        if (duration < 0.5 || !chunks.length) {
          setState("error");
          setError("Rekaman terlalu singkat. Coba lagi setidaknya satu detik.");
          return;
        }
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = URL.createObjectURL(
          new Blob(chunks, { type: rec.mimeType }),
        );
        setUrl(urlRef.current);
        setState("ready");
        update((p) => ({
          ...p,
          speakingHistory: [
            ...p.speakingHistory,
            {
              id: crypto.randomUUID(),
              phraseId: phrase.id,
              date: new Date().toISOString(),
              mode: "recording_playback",
              duration,
            },
          ],
        }));
        onRecorded?.();
      };
      rec.start();
      setState("recording");
      timer.current = setTimeout(
        () => rec.state === "recording" && rec.stop(),
        30000,
      );
    } catch (e) {
      if (!active.current || attempt !== requestId.current) return;
      stream.current?.getTracks().forEach((t) => t.stop());
      setState("error");
      setError(
        (e as Error).name === "NotAllowedError"
          ? "Izin mikrofon ditolak. Izinkan mikrofon di pengaturan situs lalu coba lagi."
          : "Mikrofon tidak tersedia atau sedang digunakan aplikasi lain. Coba lagi.",
      );
    }
  }
  return (
    <div className="recorder">
      <button
        className={`button ${state === "recording" ? "danger" : "secondary"}`}
        disabled={state === "requesting"}
        onClick={() =>
          state === "recording" ? recorder.current?.stop() : start()
        }
      >
        {state === "recording" ? <Square size={20} /> : <Mic size={20} />}{" "}
        {state === "requesting"
          ? "Meminta izin…"
          : state === "recording"
            ? "Selesai merekam"
            : url
              ? "Rekam ulang"
              : "Mulai rekam"}
      </button>
      {state === "requesting" && (
        <button
          className="text-link"
          onClick={() => {
            requestId.current++;
            setState("idle");
          }}
        >
          Batalkan permintaan mikrofon
        </button>
      )}
      <p className="muted">Ketuk untuk mulai / berhenti · maksimal 30 detik</p>
      {url && <audio aria-label="Putar rekaman suaramu" controls src={url} />}
      <small>
        Latihan rekam & dengar. Tanpa skor otomatis. Audio hanya di perangkat
        dan hilang saat meninggalkan halaman.
      </small>
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
