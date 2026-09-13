import { IndonesiaMap } from "@/components/indonesia-map";
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">SATU NEGERI, BANYAK CERITA</span>
          <h1>Peta Nusantara</h1>
          <p>Setiap pulau punya sapaan. Temukan tujuan perjalananmu.</p>
        </div>
      </div>
      <IndonesiaMap />
      <p className="muted">
        Peta ilustratif untuk navigasi belajar, bukan rujukan batas wilayah atau
        persebaran bahasa.
      </p>
    </>
  );
}
