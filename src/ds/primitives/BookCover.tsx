import Image, { type StaticImageData } from "next/image";
import { cn } from "@ds/utils/cn";

type BookCoverProps = {
  src: StaticImageData | string;
  alt: string;
  /** Altura renderizada em px. É ela que garante a paridade entre as capas. */
  height: number;
  priority?: boolean;
  className?: string;
};

/**
 * Capa da agenda.
 *
 * REGRA DE PARIDADE — não trocar por `object-fit: contain`.
 * As duas edições têm proporções diferentes (1036×1519 e 1085×1519) e margens
 * internas diferentes. Com `contain`, a altura renderizada passa a depender da
 * proporção de cada arquivo e as capas ficam dessincronizadas ao alternar.
 * Altura fixa + largura automática mantém as duas exatamente na mesma altura.
 * Isso foi um problema real na prototipagem.
 */
export function BookCover({
  src,
  alt,
  height,
  priority = false,
  className,
}: BookCoverProps) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      style={{ height: `${height}px`, width: "auto" }}
      className={cn("block max-w-full", className)}
    />
  );
}
