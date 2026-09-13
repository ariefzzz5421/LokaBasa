import type { Phrase } from "@/types";
export interface AudioProvider {
  play(phrase: Phrase): Promise<void>;
  stop(): void;
  label: string;
}
export class BrowserTTSProvider implements AudioProvider {
  label = "Suara sintetis · pendekatan bahasa Indonesia";
  play(p: Phrase) {
    return new Promise<void>((resolve, reject) => {
      if (!("speechSynthesis" in window)) {
        reject(
          new Error(
            "Suara sintetis tidak didukung browser ini. Gunakan panduan teks.",
          ),
        );
        return;
      }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(p.text);
      const voice = speechSynthesis
        .getVoices()
        .find((v) => v.lang.toLowerCase().startsWith("id"));
      if (!voice) {
        reject(
          new Error(
            "Suara bahasa Indonesia belum tersedia di perangkat ini. Gunakan panduan teks atau pasang suara Indonesia di pengaturan perangkat.",
          ),
        );
        return;
      }
      u.voice = voice;
      u.lang = "id-ID";
      u.rate = 0.8;
      u.onend = () => resolve();
      u.onerror = (e) =>
        e.error === "interrupted" || e.error === "canceled"
          ? resolve()
          : reject(new Error("Audio gagal diputar. Coba lagi."));
      speechSynthesis.speak(u);
    });
  }
  stop() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
}
export class RecordedAudioProvider implements AudioProvider {
  label = "Rekaman penutur";
  private audio: HTMLAudioElement | null = null;
  play(p: Phrase) {
    return new Promise<void>((resolve, reject) => {
      if (!p.audioUrl)
        return reject(new Error("Rekaman penutur belum tersedia."));
      this.audio = new Audio(p.audioUrl);
      this.audio.onended = () => resolve();
      this.audio.onerror = () => reject(new Error("Rekaman gagal dimuat."));
      this.audio.play().catch(reject);
    });
  }
  stop() {
    this.audio?.pause();
  }
}
export class CloudTTSProvider implements AudioProvider {
  label = "Suara cloud";
  constructor(private endpoint: string) {}
  private recorded = new RecordedAudioProvider();
  async play(p: Phrase) {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phraseId: p.id }),
    });
    if (!response.ok) throw new Error("Penyedia audio tidak tersedia.");
    const data = await response.json();
    await this.recorded.play({ ...p, audioUrl: data.url });
  }
  stop() {
    this.recorded.stop();
  }
}
export interface SpeechProvider {
  transcribe(
    blob: Blob,
    language: string,
  ): Promise<{ text: string; approximate: boolean }>;
}
// No regional pronunciation scoring provider is configured. Recording is local only.
export function audioFor(p: Phrase): AudioProvider {
  return p.audioUrl ? new RecordedAudioProvider() : new BrowserTTSProvider();
}
