import media from "@/data/region-media.json";
import { RegionImage } from "@/components/region-image";
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">CERITA DI BALIK VISUAL</span>
          <h1>Terima kasih, para perekam negeri.</h1>
          <p>
            Foto nyata dari daerah yang kita jelajahi, digunakan dengan atribusi
            dan lisensi terbuka.
          </p>
        </div>
      </div>
      <div className="courses-grid">
        {Object.entries(media).map(([id, item]) => (
          <article className="panel media-credit" key={id}>
            <RegionImage variant={id} />
            <h2>{item.alt}</h2>
            <p>Foto: {item.author}</p>
            <p>
              <a href={item.source} target="_blank" rel="noreferrer">
                Sumber asli ↗
              </a>{" "}
              ·{" "}
              <a href={item.licenseUrl} target="_blank" rel="noreferrer">
                {item.license}
              </a>
            </p>
            <small>
              {item.changes} Versi adaptasi foto tetap di bawah lisensi yang
              sama.
            </small>
          </article>
        ))}
      </div>
      <section className="panel">
        <h2>Peta & karakter</h2>
        <p>
          Geometri negara:{" "}
          <a href="https://www.naturalearthdata.com/about/terms-of-use/">
            Natural Earth, public domain
          </a>
          , resolusi 1:50 juta melalui world-atlas. Titik mewakili lokasi
          belajar, bukan sebaran atau batas bahasa.
        </p>
        <p>
          Delapan avatar hewan orisinal dibuat dengan bantuan generasi gambar AI
          untuk LokaBasa. Avatar adalah karakter imajinatif, bukan representasi
          kelompok etnis.
        </p>
      </section>
    </>
  );
}
