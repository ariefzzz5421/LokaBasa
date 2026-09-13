import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  MapPin,
  MessageCircle,
  Compass,
  Check,
} from "lucide-react";
import { Brand } from "@/components/shell";
import { Landscape, Mascot } from "@/components/illustrations";
import { IndonesiaMap } from "@/components/indonesia-map";
export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Brand />
        <nav>
          <a href="#bahasa">Jelajahi Bahasa</a>
          <Link href="/kamus">Buku Ungkapan</Link>
          <Link href="/beranda" className="button secondary small">
            Perjalananku <ArrowRight size={16} />
          </Link>
        </nav>
      </header>
      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <span className="pill">
              <span className="live-dot" /> DARI SABANG, SAMPAI SALING PAHAM
            </span>
            <h1>
              Belajar bahasa daerah.
              <br />
              <span>Lebih dekat</span>
              <br />
              dengan Indonesia.
            </h1>
            <p>
              Belajar bahasa yang benar-benar dipakai sehari-hari, satu
              percakapan dalam satu waktu.
            </p>
            <div className="hero-actions">
              <Link href="/onboarding" className="button">
                Mulai Belajar <ArrowRight size={18} />
              </Link>
              <a href="#bahasa" className="text-link">
                Jelajahi Bahasa <Compass size={18} />
              </a>
            </div>
            <div className="hero-notes">
              <span>
                <Check size={15} /> Pelajaran singkat
              </span>
              <span>
                <Check size={15} /> Gratis untuk mulai
              </span>
              <span>
                <Check size={15} /> Belajar sesukamu
              </span>
            </div>
          </div>
          <div className="hero-art">
            <Landscape />
            <div className="hero-stamp">
              <MapPin size={15} /> LANGKAH PERTAMA DI NUSANTARA
            </div>
            <div className="greeting-bubble">
              <span>JAWA · SAPAAN</span>
              <strong>Piye kabare?</strong>
              <small>Apa kabar?</small>
              <Headphones size={20} />
            </div>
            <Mascot className="hero-mascot" />
            <div className="postcard-label">
              Banyak pulau.
              <br />
              <strong>Sejuta cara menyapa.</strong>
              <span>↗</span>
            </div>
          </div>
        </section>
        <div className="landing-strip">
          <span>BAHASA MEMBUKA CERITA</span>
          <strong>Sunda</strong>
          <i>✦</i>
          <strong>Batak</strong>
          <i>✦</i>
          <strong>Ngapak</strong>
          <i>✦</i>
          <strong>Jawa</strong>
          <i>✦</i>
          <strong>Papua</strong>
          <i>✦</i>
          <strong>Manado</strong>
          <i>✦</i>
          <strong>Medan</strong>
        </div>
        <section id="bahasa" className="landing-explore">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TUJUH PINTU KE CERITA BARU</span>
              <h2>Mau menyapa dari mana?</h2>
              <p>Ketuk sebuah wilayah. Perjalananmu dimulai dari satu kata.</p>
            </div>
            <Link href="/belajar" className="text-link">
              Semua bahasa <ArrowRight size={17} />
            </Link>
          </div>
          <IndonesiaMap compact />
        </section>
        <section className="landing-how">
          <div>
            <span className="eyebrow">BUKAN SEKADAR HAFAL KATA</span>
            <h2>
              Belajar untuk
              <br />
              benar-benar ngobrol.
            </h2>
            <p>
              Kenali ungkapannya, pahami konteksnya, lalu beranikan diri
              mengucapkannya.
            </p>
            <Link href="/ngobrol" className="button secondary">
              Coba Ngobrol <MessageCircle size={18} />
            </Link>
          </div>
          <div className="how-steps">
            <article>
              <b>01</b>
              <div>
                <h3>Satu langkah kecil</h3>
                <p>
                  Pelajaran singkat, latihan interaktif, dan perjalanan yang
                  terus terbuka.
                </p>
              </div>
            </article>
            <article>
              <b>02</b>
              <div>
                <h3>Dengar. Ucapkan. Ulangi.</h3>
                <p>
                  Gunakan audio yang tersedia dan dengarkan rekaman suaramu
                  sendiri.
                </p>
              </div>
            </article>
            <article>
              <b>03</b>
              <div>
                <h3>Bawa ke percakapan</h3>
                <p>
                  Dari warung hingga rumah teman, pahami kapan sebuah ungkapan
                  terasa pas.
                </p>
              </div>
            </article>
          </div>
        </section>
        <section className="content-note">
          <strong>Beragam bahasa. Selalu belajar menghargai.</strong>
          <p>
            LokaBasa hadir dengan materi perintis yang masih membutuhkan
            tinjauan penutur. Batak berfokus pada Toba, Papua pada Melayu Papua,
            dan Medan pada ragam percakapan kota. Audio sintetis tidak
            menggantikan pelafalan penutur asli.
          </p>
        </section>
      </main>
      <footer className="landing-footer">
        <Brand />
        <span>Jelajah bahasa, jumpa cerita.</span>
        <Link href="/tentang">Tentang materi & privasi ↗</Link>
      </footer>
    </div>
  );
}
