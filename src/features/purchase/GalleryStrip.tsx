"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IconChevronLeft, IconChevronRight, IconClose, cn } from "@ds/index";
import type { ProductImage } from "@/lib/commerce/offer-types";

type GalleryStripProps = {
  images: ProductImage[];
  /** Fallback alt text for images WooCommerce publishes without one. */
  label: string;
};

/**
 * The product gallery under the cover: a swipeable strip with no scrollbar and
 * a dot per image (Figma 949:422). The dots follow the scroll position and
 * jump to an image when clicked; clicking a thumbnail opens it large in a
 * lightbox. Remount it (`key`) when the images change.
 */
export function GalleryStrip({ images, label }: GalleryStripProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState<number | null>(null);

  const altOf = (image: ProductImage, index: number) => image.alt || `${label}, imagem ${index + 2}`;
  const step = (delta: number) =>
    setZoomed((current) => (current === null ? current : (current + delta + images.length) % images.length));

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
            <button
              type="button"
              onClick={() => setZoomed(index)}
              aria-label={`Ampliar imagem ${index + 1} de ${images.length}`}
              className="block h-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-action"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                srcSet={image.srcset || undefined}
                sizes="190px"
                alt={altOf(image, index)}
                loading="lazy"
                decoding="async"
                // Slight zoom to crop the thin border baked into the WooCommerce images.
                className="block h-full w-auto scale-[1.04]"
              />
            </button>
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

      <Dialog.Root open={zoomed !== null} onOpenChange={(open) => !open && setZoomed(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-surface-inverse/80" />
          <Dialog.Content
            aria-describedby={undefined}
            // The content covers the screen, so a click on the empty area is the backdrop click.
            onClick={(event) => {
              if (event.target === event.currentTarget) setZoomed(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") step(-1);
              if (event.key === "ArrowRight") step(1);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none sm:p-10"
          >
            <Dialog.Title className="sr-only">
              {zoomed !== null ? altOf(images[zoomed], zoomed) : label}
            </Dialog.Title>
            {zoomed !== null ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[zoomed].src}
                srcSet={images[zoomed].srcset || undefined}
                sizes="(min-width: 640px) 80vw, 100vw"
                alt={altOf(images[zoomed], zoomed)}
                className="max-h-full max-w-full rounded-card bg-surface-plain object-contain shadow-float"
              />
            ) : null}
            <Dialog.Close
              aria-label="Fechar"
              className="absolute top-3 right-3 grid size-11 cursor-pointer place-items-center rounded-pill bg-surface-plain text-xl text-text-strong shadow-float sm:top-6 sm:right-6"
            >
              <IconClose />
            </Dialog.Close>
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Imagem anterior"
                  className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-pill bg-surface-plain text-xl text-text-strong shadow-float sm:left-6"
                >
                  <IconChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Próxima imagem"
                  className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-pill bg-surface-plain text-xl text-text-strong shadow-float sm:right-6"
                >
                  <IconChevronRight />
                </button>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
