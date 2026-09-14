export const avatars = [
  "Komo si Komodo",
  "Oren si Orangutan",
  "Kiki si Kakatua",
  "Tara si Tarsius",
  "Tutu si Penyu",
  "Rara si Rusa",
  "Tapi si Tapir",
  "Rangga si Rangkong",
];
export function Avatar({
  id = 0,
  large = false,
}: {
  id?: number;
  large?: boolean;
}) {
  const index = Number.isInteger(id) && id >= 0 && id < avatars.length ? id : 0;
  return (
    <span
      role="img"
      aria-label={avatars[index]}
      className={`animal-avatar ${large ? "large" : ""}`}
      style={{
        backgroundPosition: `${((index % 4) * 100) / 3}% ${Math.floor(index / 4) * 100}%`,
      }}
    />
  );
}
