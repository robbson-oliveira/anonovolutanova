import Image from "next/image";
import { cn } from "@ds/index";
import type { ProductImage } from "@/lib/commerce/offer-types";

type ProductThumbProps = {
  /** Main image of the product in WooCommerce. */
  image: ProductImage | null;
  /** Local cover of the edition, shown when WooCommerce has no image. */
  fallback?: { cover: string; coverSize: { width: number; height: number } } | null;
  /** Rendered width of the frame, for the browser to pick a file from the srcset. */
  sizes: string;
  /** Frame size (`size-18`, `size-24`…). */
  className?: string;
  /**
   * Opaque product box, as fractions of a landscape file. `object-contain`
   * centers the file, so uneven transparent margins (the notepad) sit off
   * center. The shift recenters that box in the square without resizing it.
   */
  focus?: {
    x: number;
    y: number;
    width: number;
    height: number;
    /** File height divided by width. Only landscape files (below 1) are shifted. */
    fileAspect: number;
  } | null;
};

/**
 * Percentages of the square frame. Width-bound `object-contain` maps a
 * fraction of the file width straight onto the frame; the height fraction
 * is scaled by the file's aspect because the painted image is shorter than
 * the frame and already vertically centered.
 */
function frameShift(focus: NonNullable<ProductThumbProps["focus"]>): string | undefined {
  if (focus.fileAspect >= 1) return undefined;
  const cx = focus.x + focus.width / 2;
  const cy = focus.y + focus.height / 2;
  const x = (0.5 - cx) * 100;
  const y = (0.5 - cy) * focus.fileAspect * 100;
  if (Math.abs(x) < 0.4 && Math.abs(y) < 0.4) return undefined;
  return `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%)`;
}

/**
 * Product miniature: the product's main image as WooCommerce publishes it,
 * in a square frame. `object-contain` keeps the whole picture, whether it is a
 * cropped photo or a cover on a transparent background; the edition's local
 * cover stands in when the product has no image (or the site is not selling).
 */
export function ProductThumb({ image, fallback, sizes, className, focus }: ProductThumbProps) {
  const shift = focus ? frameShift(focus) : undefined;
  return (
    <span
      aria-hidden
      className={cn("relative block shrink-0 overflow-hidden rounded-card bg-surface-muted", className)}
    >
      {image ? (
        // <img> and not next/image: the file comes from WordPress, which
        // already publishes every size in the srcset; the optimizer would
        // also refuse the local WordPress (a private address) in development.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          srcSet={image.srcset || undefined}
          sizes={sizes}
          alt=""
          loading="lazy"
          decoding="async"
          style={shift ? { transform: shift } : undefined}
          className="absolute inset-0 size-full object-contain"
        />
      ) : fallback ? (
        <Image
          src={fallback.cover}
          alt=""
          fill
          sizes={sizes}
          style={shift ? { transform: shift } : undefined}
          className={shift ? "object-contain" : "object-contain p-1.5"}
        />
      ) : null}
    </span>
  );
}
