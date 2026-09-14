import Image from "next/image";
import media from "@/data/region-media.json";
export function RegionImage({
  variant = "jawa",
  compact = false,
  priority = false,
}: {
  variant?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  const item = media[variant as keyof typeof media] || media.jawa;
  return (
    <Image
      className="region-photo"
      src={item.src}
      alt={item.alt}
      width={960}
      height={540}
      sizes={
        compact
          ? "(max-width: 640px) 112px, 138px"
          : "(max-width: 600px) calc(100vw - 64px), (max-width: 1100px) 50vw, 600px"
      }
      quality={72}
      priority={priority}
    />
  );
}
