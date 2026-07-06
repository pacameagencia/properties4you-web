import Image from "next/image";
import { cn } from "@/lib/utils";

/** Imagen de propiedad con fallback elegante cuando aún no hay foto. */
export function PropertyMedia({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-[#161d24] via-[#111820] to-[#0c1116]",
          className,
        )}
      >
        <div className="text-center">
          <div className="font-display text-2xl text-line-2 opacity-40">P4Y</div>
          <div className="mt-1 h-px w-10 bg-gold/30 mx-auto" />
        </div>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
