"use client";

import { useRef, useState } from "react";
import { cn } from "@ds/index";
import type { ProductImage } from "@/lib/commerce/offer-types";

/** Height of what each miniature shows, in px; the strip is taller so shadows are not clipped. */
const SUBJECT_H = 112;

type GalleryStripProps = {
  images: ProductImage[];
  /** Fallback alt text for images WooCommerce publishes without one. */
  label: string;
  /** Index of the image currently shown in the product stage, or null for the cover. */
  selected: number | null;
  /** Picks an image for the stage; null goes back to the cover. */
  onSelect: (index: number | null) => void;
};

/**
 * The product gallery under the cover: a swipeable strip with no scrollbar and
 * a dot per image (Figma 949:422). The dots follow the scroll position and
 * jump to an image when clicked; clicking a thumbnail shows it in the product
 * stage above (clicking the selected one again goes back to the cover).
 * Remount it (`key`) when the images change.
 */
export function GalleryStrip({ images, label, selected, onSelect }: GalleryStripProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const altOf = (image: ProductImage, index: number) => image.alt || `${label}, imagem ${index + 2}`;

  const syncActive = () => {
    const list = listRef.current;
    if (!list) return;
    const maxScroll = list.scrollWidth - list.clientWidth;
    if (maxScroll <= 0) return;
    setActive(Math.round((list.scrollLeft / maxScroll) * (images.length - 1)));
  };

  const goTo = (index: number) => {
    const list = listRef.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item) return;
    list.scrollTo({ left: item.offsetLeft - list.offsetLeft, behavior: "smooth" });
    setActive(index);
  };

  return (
    // z-10: the cover's transparent shadow margin reaches into this area and must stay under the thumbnails.
    <div className="relative z-10 flex w-full max-w-full flex-col items-center gap-5">
      <ul
        ref={listRef}
        onScroll={syncActive}
        className="flex h-[136px] max-w-full snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => {
          // Each file is a cutout with its own transparent margin, so sizing the
          // file would size the margin. The frame is the subject alone, at one
          // height for every image; the file is placed inside it so margin and
          // shadow bleed out. Without measured bounds the file is sized as is.
          const b = image.bounds;
          const fileH = b ? SUBJECT_H / b.height : SUBJECT_H;
          const fileW = b ? fileH * b.aspect : 0;
          return (
            // The images overlap: the first (the open agenda) sits at the back
            // and each following sheet lands on top of the previous one.
            <li
              key={image.src}
              style={b ? { width: fileW * b.width } : undefined}
              className="shrink-0 snap-start"
            >
              <button
                type="button"
                onClick={() => onSelect(selected === index ? null : index)}
                aria-label={`Mostrar imagem ${index + 1} de ${images.length}`}
                aria-pressed={selected === index}
                style={{ height: SUBJECT_H }}
                className={cn(
                  "relative block w-full cursor-pointer overflow-hidden rounded-md outline-2 -outline-offset-2 focus-visible:outline-action",
                  selected === index ? "outline-action" : "outline-transparent",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  srcSet={image.srcset || undefined}
                  sizes="190px"
                  alt={altOf(image, index)}
                  loading="lazy"
                  decoding="async"
                  style={
                    b
                      ? { width: fileW, height: fileH, left: -b.x * fileW, top: -b.y * fileH }
                      : { height: SUBJECT_H }
                  }
                  className={cn("max-w-none", b ? "absolute" : "block w-auto")}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {images.length > 1 ? (
        <div className="flex items-center gap-0.5">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ver imagem ${index + 1} de ${images.length}`}
              aria-current={index === active}
              className={cn(
                "relative size-2.5 cursor-pointer rounded-pill transition-colors [transition-duration:var(--duration-fast)]",
                // Invisible padding keeps a comfortable touch target around the 10px dot.
                "before:absolute before:-inset-1.5 before:content-['']",
                index === active ? "bg-gold-start" : "bg-action",
              )}
            />
          ))}
        </div>
      ) : null}

    </div>
  );
}
