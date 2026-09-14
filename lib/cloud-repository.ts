import type { UserProgress } from "@/types";
import { supabase } from "./supabase";
import { validProgress } from "./repository";
export class CloudProgressRepository {
  revision = 0;
  constructor(readonly userId: string) {}
  async load(): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from("user_progress")
      .select("data,revision")
      .eq("user_id", this.userId)
      .maybeSingle();
    if (error)
      throw new Error(
        "Progres akun belum dapat dimuat. Periksa koneksi lalu coba lagi.",
      );
    if (!data) return null;
    if (!validProgress(data.data))
      throw new Error(
        "Format progres akun tidak dapat dibaca. Data belum diubah.",
      );
    this.revision = data.revision;
    return data.data;
  }
  async save(progress: UserProgress) {
    const query =
      this.revision === 0
        ? supabase
            .from("user_progress")
            .insert({ user_id: this.userId, data: progress })
        : supabase
            .from("user_progress")
            .update({ data: progress })
            .eq("user_id", this.userId)
            .eq("revision", this.revision);
    const { data, error } = await query.select("revision").maybeSingle();
    if (error) {
      if (error.code === "23505")
        throw new Error(
          "Progres berubah di perangkat lain. Unduh salinan sesi ini lalu muat ulang sebelum melanjutkan.",
        );
      throw new Error(
        "Progres belum tersinkron. Salinan sesi disimpan di perangkat; periksa koneksi lalu coba lagi.",
      );
    }
    if (!data)
      throw new Error(
        "Progres berubah di perangkat lain. Unduh salinan sesi ini lalu muat ulang sebelum melanjutkan.",
      );
    this.revision = data.revision;
  }
}
