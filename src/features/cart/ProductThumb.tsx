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
};

/**
 * Product miniature: the product's main image as WooCommerce publishes it,
 * in a square frame. `object-contain` keeps the whole picture, whether it is a
 * cropped photo or a cover on a transparent background; the edition's local
 * cover stands in when the product has no image (or the site is not selling).
 */
export function ProductThumb({ image, fallback, sizes, className }: ProductThumbProps) {
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
          className="absolute inset-0 size-full object-contain"
        />
      ) : fallback ? (
        <Image src={fallback.cover} alt="" fill sizes={sizes} className="object-contain p-1.5" />
      ) : null}
    </span>
  );
}
