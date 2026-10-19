"use client";

import { useRef, useState } from "react";
import { cn } from "@ds/index";
import type { ProductImage } from "@/lib/commerce/offer-types";

type GalleryStripProps = {
  images: ProductImage[];
  /** Fallback alt text for images WooCommerce publishes without one. */
  label: string;
};

/**
 * The product gallery under the cover: a swipeable strip with no scrollbar and
 * a dot per image (Figma 949:422). The dots follow the scroll position and
 * jump to an image when clicked. Remount it (`key`) when the images change.
 */
export function GalleryStrip({ images, label }: GalleryStripProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

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
    <div className="flex w-full max-w-full flex-col items-center gap-5">
      <ul
        ref={listRef}
        onScroll={syncActive}
        className="flex h-[136px] max-w-full snap-x snap-mandatory items-center gap-[5px] overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <li key={image.src} className="h-full shrink-0 snap-start overflow-hidden not-first:-ml-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              srcSet={image.srcset || undefined}
              sizes="190px"
              alt={image.alt || `${label}, imagem ${index + 2}`}
              loading="lazy"
              decoding="async"
              // Slight zoom to crop the thin border baked into the WooCommerce images.
              className="block h-full w-auto scale-[1.04]"
            />
          </li>
        ))}
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
                "relative size-[13px] cursor-pointer rounded-pill transition-colors [transition-duration:var(--duration-fast)]",
                // Invisible padding keeps a comfortable touch target around the 13px dot.
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
