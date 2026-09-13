"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state" role="alert">
      <h1>Perjalanan terhenti sebentar.</h1>
      <p>Ada kendala memuat halaman. Progres yang sudah tersimpan tetap ada.</p>
      <button className="button" onClick={reset}>
        Coba lagi
      </button>
    </div>
  );
}
