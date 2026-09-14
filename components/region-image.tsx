import Image from "next/image";
import media from "@/data/region-media.json";
export function RegionImage({ variant = "jawa" }: { variant?: string }) {
  const item = media[variant as keyof typeof media] || media.jawa;
  return (
    <Image
      className="region-photo"
      src={item.src}
      alt={item.alt}
      width={960}
      height={540}
      sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 600px"
    />
  );
}
