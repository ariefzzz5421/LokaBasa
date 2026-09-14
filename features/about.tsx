import { courses } from "@/courses/catalog";
export default function About() {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">TRANSPARANSI LOKABASA</span>
          <h1>Belajar dengan konteks.</h1>
          <p>Tentang materi, audio, dan data perjalananmu.</p>
        </div>
      </div>
      <div className="prose panel">
        <h2>Materi perintis, bukan kurikulum tervalidasi</h2>
        <p>
          Semua materi awal berstatus needs_native_review. Terjemahan, panduan
          suku kata, dan konteks penggunaan belum ditinjau penutur atau ahli
          bahasa. Jangan menganggap satu ungkapan mewakili seluruh daerah.
          Referensi di bawah adalah bahan peninjauan, bukan klaim bahwa setiap
          kalimat telah diverifikasi.
        </p>
        <h2>Cakupan bahasa</h2>
        {courses.map((c) => (
          <section key={c.id}>
            <h3>
              {c.name}: {c.language} · {c.dialect}
            </h3>
            <p>{c.culturalNotes}</p>
            {c.sources.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                {s.title} ↗
              </a>
            ))}
          </section>
        ))}
        <h2>Audio dan latihan suara</h2>
        <p>
          Jika perangkat menyediakan suara bahasa Indonesia, aplikasi dapat
          membacakan teks secara sintetis. Pelafalan tersebut hanya pendekatan
          dan bukan contoh aksen daerah yang akurat. Browser dapat memproses
          suara sintetis menggunakan layanan sistemnya. Rekaman penutur asli
          akan menjadi sumber pilihan saat tersedia.
        </p>
        <p>
          Mikrofon baru diakses setelah kamu memilih Mulai rekam. Audio rekaman
          tidak diunggah atau disimpan permanen. Hanya waktu, durasi, dan
          identitas ungkapan latihan dicatat di progres akun. Tidak ada skor
          pelafalan atau pengenalan suara otomatis.
        </p>
        <h2>Privasi & penyimpanan</h2>
        <p>
          Akun memakai username dan password melalui Supabase Auth. Password
          ditangani oleh layanan autentikasi, bukan disimpan di tabel profil.
          Username dipetakan ke alamat internal yang tidak dipakai untuk
          berkirim email. Nama panggilan, avatar, progres, ulasan, dan favorit
          disimpan di akun; aturan database membatasi akses kepada pemiliknya.
          Token sesi dan salinan perubahan yang belum tersinkron disimpan di
          browser. Rekaman mikrofon tidak diunggah. Tidak ada pelacakan analitik
          tambahan. Keluar setelah memakai perangkat bersama. Gunakan fitur
          unduh di profil untuk menyimpan salinan.
        </p>
        <p>
          <a href="/kredit">Kredit foto daerah, peta & avatar ↗</a>
        </p>
        <h2>Perkembangan berikutnya</h2>
        <p>
          Prioritas editorial adalah peninjauan penutur per dialek, rujukan per
          ungkapan, rekaman asli, dan perluasan skenario. Kursus awal memuat 9
          ungkapan tiap kategori; pencapaian 100 ungkapan menunggu perluasan
          materi.
        </p>
      </div>
    </>
  );
}
