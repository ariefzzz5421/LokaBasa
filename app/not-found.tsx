import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="empty-state">
      <h1>Sepertinya kita salah jalan.</h1>
      <p>Halaman ini belum ada. Masih banyak cerita yang bisa dijelajahi.</p>
      <Link href="/belajar" className="button">
        Kembali ke pilihan bahasa
      </Link>
    </main>
  );
}
