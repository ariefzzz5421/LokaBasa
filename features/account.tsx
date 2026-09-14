"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { supabase, usernameEmail, validUsername } from "@/lib/supabase";
import { Brand } from "@/components/shell";
import { Avatar, avatars } from "@/components/avatar";
export function AccountForm({ signup = false }: { signup?: boolean }) {
  const router = useRouter(),
    params = useSearchParams();
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [visible, setVisible] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [avatar, setAvatar] = useState(0);
  const next = params.get("next");
  const destination =
    next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
      ? next
      : "/beranda";
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const name = username.trim().toLowerCase();
    if (!validUsername(name)) {
      setError(
        "Username 3–20 karakter: mulai dengan huruf, lalu huruf, angka, atau garis bawah.",
      );
      return;
    }
    setBusy(true);
    try {
      const result = signup
        ? await supabase.auth.signUp({
            email: usernameEmail(name),
            password,
            options: { data: { username: name, avatar_id: avatar } },
          })
        : await supabase.auth.signInWithPassword({
            email: usernameEmail(name),
            password,
          });
      if (result.error) {
        const code = result.error.code;
        setError(
          code === "user_already_exists"
            ? "Username sudah dipakai. Pilih username lain."
            : code === "invalid_credentials"
              ? "Username atau password belum cocok. Coba lagi."
              : code === "weak_password"
                ? "Gunakan password yang lebih kuat, minimal 8 karakter."
                : result.error.status === 429
                  ? "Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi."
                  : "Akun belum bisa diproses. Periksa koneksi dan coba lagi.",
        );
        return;
      }
      if (!result.data.session) {
        setError(
          "Akun belum aktif. Konfigurasi pendaftaran sedang disiapkan; coba masuk kembali nanti.",
        );
        return;
      }
      router.replace(signup ? "/onboarding" : destination);
    } catch {
      setError("Tidak dapat terhubung. Periksa koneksi lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main-content" className="auth-page">
      <div className="auth-card">
        <Brand />
        <div className="auth-welcome">
          <Avatar id={avatar} large />
          <span className="eyebrow">PASPOR KE NUSANTARA</span>
          <h1>{signup ? "Cerita barumu dimulai." : "Senang kamu kembali."}</h1>
          <p>
            {signup
              ? "Buat username, pilih teman perjalanan, dan mulai belajar."
              : "Masuk untuk melanjutkan perjalanan bahasamu."}
          </p>
        </div>
        <form onSubmit={submit}>
          <label className="field">
            Username
            <input
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              minLength={3}
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="misalnya arief_jelajah"
              pattern="[a-z][a-z0-9_]{2,19}"
            />
            <small>3–20 karakter: huruf, angka, atau _</small>
          </label>
          <label className="field">
            Password
            <div className="password-field">
              <input
                autoComplete={signup ? "new-password" : "current-password"}
                type={visible ? "text" : "password"}
                required
                minLength={signup ? 8 : 1}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={signup ? "Minimal 8 karakter" : "Password kamu"}
              />
              <button
                type="button"
                className="icon-button"
                aria-label={
                  visible ? "Sembunyikan password" : "Tampilkan password"
                }
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>
          {signup && (
            <fieldset className="avatar-picker">
              <legend>Pilih teman perjalanan</legend>
              <div>
                {avatars.map((a, i) => (
                  <button
                    key={a}
                    type="button"
                    aria-label={a}
                    aria-pressed={avatar === i}
                    onClick={() => setAvatar(i)}
                  >
                    <Avatar id={i} />
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {error && (
            <p className="notice" role="alert">
              {error}
            </p>
          )}
          <button disabled={busy} className="button auth-submit" type="submit">
            {busy ? "Sebentar…" : signup ? "Buat akun & mulai" : "Masuk"}
            <ArrowRight size={18} />
          </button>
        </form>
        <p className="auth-switch">
          {signup ? "Sudah punya akun?" : "Baru di LokaBasa?"}{" "}
          <Link
            href={
              (signup ? "/masuk" : "/daftar") +
              (next ? "?next=" + encodeURIComponent(destination) : "")
            }
          >
            {signup ? "Masuk" : "Buat akun"}
          </Link>
        </p>
        <p className="auth-privacy">
          Cukup username dan password. Tidak perlu email.{" "}
          {signup &&
            "Simpan passwordmu dengan baik; pemulihan lewat email tidak tersedia."}{" "}
          <Link href="/tentang">Privasi</Link>
        </p>
      </div>
    </main>
  );
}
