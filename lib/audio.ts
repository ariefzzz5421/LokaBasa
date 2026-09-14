import type { Phrase } from "@/types";
export interface AudioProvider {
  play(phrase: Phrase): Promise<void>;
  stop(): void;
  label: string;
}
let active: AudioProvider | null = null;
function claim(provider: AudioProvider) {
  if (active !== provider) active?.stop();
  active = provider;
}
export class BrowserTTSProvider implements AudioProvider {
  label = "Suara sintetis · pendekatan bahasa Indonesia";
  private finish: ((error?: Error) => void) | null = null;
  play(p: Phrase): Promise<void> {
    this.stop();
    claim(this);
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        reject(
          new Error(
            "Suara sintetis tidak didukung browser ini. Gunakan panduan teks.",
          ),
        );
        return;
      }
      const synth = window.speechSynthesis;
      let utterance: SpeechSynthesisUtterance | null = null;
      let playbackTimer: ReturnType<typeof setTimeout> | undefined,
        retriedWithoutVoice = false;
      const done = (error?: Error) => {
        clearTimeout(playbackTimer);
        if (utterance) {
          utterance.onend = null;
          utterance.onerror = null;
        }
        this.finish = null;
        if (active === this) active = null;
        error ? reject(error) : resolve();
      };
      this.finish = done;
      const speak = (voice?: SpeechSynthesisVoice) => {
        if (!this.finish) return;
        utterance = new SpeechSynthesisUtterance(p.text);
        if (voice) utterance.voice = voice;
        utterance.lang = voice?.lang || "id-ID";
        utterance.rate = 0.8;
        utterance.onend = () => done();
        utterance.onerror = (e) => {
          if (
            voice &&
            !retriedWithoutVoice &&
            ["voice-unavailable", "language-unavailable"].includes(e.error)
          ) {
            retriedWithoutVoice = true;
            clearTimeout(playbackTimer);
            utterance = null;
            speak();
            return;
          }
          done(
            ["interrupted", "canceled"].includes(e.error)
              ? undefined
              : new Error(
                  e.error === "not-allowed"
                    ? "Browser memblokir suara. Ketuk Dengarkan sekali lagi."
                    : "Suara perangkat gagal diputar. Gunakan panduan teks atau coba browser lain.",
                ),
          );
        };
        playbackTimer = setTimeout(
          () => {
            done(new Error("Pemutaran suara tidak merespons. Coba lagi."));
            synth.cancel();
          },
          Math.max(20000, p.text.length * 400),
        );
        synth.speak(utterance);
      };
      const voices = synth.getVoices();
      const voice =
        voices.find((v) => /^(id|in)(-|_)id$/i.test(v.lang)) ||
        voices.find((v) => /^(id|in)(-|_|$)/i.test(v.lang));
      synth.cancel();
      synth.resume();
      // Speaking immediately keeps the user gesture valid on iOS/Safari.
      // If the voice list is still loading, lang=id-ID lets the browser choose.
      speak(voice);
    });
  }
  stop() {
    if (!this.finish) return;
    this.finish();
    if (typeof window !== "undefined" && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
  }
}
export class RecordedAudioProvider implements AudioProvider {
  label = "Rekaman penutur";
  private audio: HTMLAudioElement | null = null;
  private finish: ((e?: Error) => void) | null = null;
  play(p: Phrase): Promise<void> {
    this.stop();
    claim(this);
    return new Promise((resolve, reject) => {
      if (!p.audioUrl) {
        reject(new Error("Rekaman penutur belum tersedia."));
        return;
      }
      const audio = new Audio(p.audioUrl);
      this.audio = audio;
      let timer: ReturnType<typeof setTimeout>;
      const done = (error?: Error) => {
        clearTimeout(timer);
        audio.onended = null;
        audio.onerror = null;
        audio.onplaying = null;
        audio.pause();
        this.finish = null;
        if (active === this) active = null;
        error ? reject(error) : resolve();
      };
      timer = setTimeout(
        () =>
          done(
            new Error(
              "Rekaman terlalu lama dimuat. Periksa koneksi lalu coba lagi.",
            ),
          ),
        30000,
      );
      this.finish = done;
      audio.onended = () => done();
      audio.onerror = () =>
        done(
          new Error("Rekaman gagal dimuat. Periksa koneksi lalu coba lagi."),
        );
      audio.onplaying = () => clearTimeout(timer);
      audio
        .play()
        .catch(() =>
          done(new Error("Pemutaran diblokir browser. Ketuk Dengarkan lagi.")),
        );
    });
  }
  stop() {
    this.finish?.();
    this.audio?.pause();
    this.audio = null;
  }
}
export class CloudTTSProvider implements AudioProvider {
  label = "Suara cloud";
  constructor(private endpoint: string) {}
  private recorded = new RecordedAudioProvider();
  private controller: AbortController | null = null;
  async play(p: Phrase) {
    this.stop();
    claim(this);
    const controller = new AbortController();
    this.controller = controller;
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phraseId: p.id }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Penyedia audio tidak tersedia.");
      const data = await response.json();
      if (controller.signal.aborted) return;
      this.controller = null;
      await this.recorded.play({ ...p, audioUrl: data.url });
    } catch (e) {
      if (!controller.signal.aborted) throw e;
    } finally {
      clearTimeout(timer);
    }
  }
  stop() {
    this.controller?.abort();
    this.controller = null;
    this.recorded.stop();
  }
}
export interface SpeechProvider {
  transcribe(
    blob: Blob,
    language: string,
  ): Promise<{ text: string; approximate: boolean }>;
}
export function audioFor(p: Phrase): AudioProvider {
  return p.audioUrl ? new RecordedAudioProvider() : new BrowserTTSProvider();
}
