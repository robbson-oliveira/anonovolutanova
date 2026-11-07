"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, cn, pageFrameClass } from "@ds/index";
import {
  GALLERY_LEAD,
  GALLERY_PHOTOS,
  GALLERY_TITLE,
  galleryColumns,
  type GalleryColumnItem,
} from "@content/gallery";
import type PhotoSwipeLightbox from "photoswipe/lightbox";

const cardClass =
  "block w-full overflow-hidden rounded-[10px] bg-surface-plain " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

type ColumnProps = {
  items: GalleryColumnItem[];
  direction: "up" | "down";
  paused: boolean;
  onOpen: (index: number) => void;
};

/**
 * One column is two identical halves. The animation moves exactly half the
 * track, so the copy sits where the original started and the loop does not
 * jump. Margin lives on each card: a flex `gap` would make -50% miss the seam.
 * The copy is inert, so it is not a second tab stop and not a second photo
 * in the lightbox. Both copies load immediately: the moving half is on
 * screen only because of the transform, so lazy loading would leave it blank.
 */
function Column({ items, direction, paused, onOpen }: ColumnProps) {
  const cards = (clone: boolean) =>
    items.map(({ photo, index }) => (
      <div key={`${clone ? "copy" : "photo"}-${index}`} className="mb-3">
        {clone ? (
          <div className={cardClass}>
            <Image
              src={photo.src}
              alt=""
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 440px, 45vw"
              loading="eager"
              unoptimized
              className="h-auto w-full"
            />
          </div>
        ) : (
          <button
            type="button"
            data-gallery-photo=""
            className={cn(cardClass, "cursor-pointer border-0 p-0 text-left")}
            onClick={() => onOpen(index)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 440px, 45vw"
              loading="eager"
              unoptimized
              className="h-auto w-full"
            />
          </button>
        )}
      </div>
    ));

  return (
    <div
      className={cn(
        "anln-gallery-track flex flex-col motion-safe:will-change-transform",
        direction === "up"
          ? "motion-safe:animate-gallery-up"
          : "motion-safe:animate-gallery-down motion-reduce:translate-y-12",
      )}
      style={paused ? { animationPlayState: "paused" } : undefined}
    >
      <div>{cards(false)}</div>
      <div inert aria-hidden="true">
        {cards(true)}
      </div>
    </div>
  );
}

/**
 * Test gallery. Two columns drift in opposite directions inside the page
 * frame. The page itself keeps scrolling: nothing here calls preventDefault
 * on touch or wheel. PhotoSwipe opens only the original list.
 */
export function ProductGallery() {
  const { left, right } = galleryColumns(GALLERY_PHOTOS);
  const frameRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [photoFocus, setPhotoFocus] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [offscreen, setOffscreen] = useState(true);
  const paused = userPaused || holding || hovering || photoFocus || lightboxOpen || offscreen;

  useEffect(() => {
    const node = frameRef.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      setOffscreen(!entry?.isIntersecting);
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!holding) return;
    const end = () => setHolding(false);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [holding]);

  useEffect(() => {
    let dead = false;
    let lightbox: PhotoSwipeLightbox | null = null;
    const scrollY = { current: 0 };

    const release = () => {
      if (dead) return;
      document.body.style.overflow = "";
      if (Math.abs(window.scrollY - scrollY.current) > 1) {
        window.scrollTo(0, scrollY.current);
      }
      setLightboxOpen(false);
    };

    void (async () => {
      const [{ default: Lightbox }] = await Promise.all([
        import("photoswipe/lightbox"),
        import("photoswipe/style.css"),
      ]);
      if (dead) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      lightbox = new Lightbox({
        dataSource: GALLERY_PHOTOS.map((photo) => ({
          src: photo.fullSrc,
          width: photo.fullWidth,
          height: photo.fullHeight,
          alt: photo.alt,
        })),
        pswpModule: () => import("photoswipe"),
        bgOpacity: 0.92,
        wheelToZoom: true,
        pinchToClose: false,
        // 1 is the file's own pixel size. The three 720px photos stay sharp
        // instead of being stretched to fill a wide screen.
        initialZoomLevel: (zoom) => Math.min(1, zoom.fit),
        secondaryZoomLevel: (zoom) => Math.max(zoom.initial, Math.min(1, zoom.fit * 2)),
        maxZoomLevel: () => 1,
        showHideAnimationType: reduce ? "none" : "zoom",
        padding: { top: 56, bottom: 48, left: 16, right: 16 },
      });
      lightbox.on("beforeOpen", () => {
        scrollY.current = window.scrollY;
        // SmoothScroll stops while a drawer holds the body. PhotoSwipe only
        // locks its own layer, so the page wheel would keep moving behind it.
        document.body.style.overflow = "hidden";
        setLightboxOpen(true);
      });
      lightbox.on("closingAnimationEnd", release);
      lightbox.init();
      lightboxRef.current = lightbox;
    })();

    return () => {
      dead = true;
      lightbox?.destroy();
      lightboxRef.current = null;
      document.body.style.overflow = "";
    };
  }, []);

  const openAt = (index: number) => {
    lightboxRef.current?.loadAndOpen(index);
  };

  return (
    <section
      id="fotos-reais"
      aria-labelledby="fotos-reais-titulo"
      className={cn(pageFrameClass, "scroll-mt-[124px] bg-surface py-12 lg:scroll-mt-[100px] lg:py-16")}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-14">
        <div className="lg:w-[340px] lg:shrink-0 lg:pt-2">
          <h2
            id="fotos-reais-titulo"
            className="text-balance text-center text-h2 font-bold text-text-lead lg:text-left"
          >
            {GALLERY_TITLE}
          </h2>
          <p className="mt-4 text-balance text-center text-base leading-snug text-text lg:text-left">
            {GALLERY_LEAD}
          </p>
          <div className="mt-5 flex justify-center lg:justify-start">
            <Button
              type="button"
              variant="secondary"
              size="md"
              aria-pressed={userPaused}
              onClick={() => setUserPaused((value) => !value)}
            >
              {userPaused ? "Reproduzir movimento" : "Pausar movimento"}
            </Button>
          </div>
        </div>

        <div className="min-w-0 w-full lg:min-h-0 lg:flex-1">
        <div
          ref={frameRef}
          className="relative h-[520px] touch-pan-y overflow-hidden md:h-[600px] lg:h-[680px]"
          onPointerDown={(event) => {
            if (event.pointerType === "touch") setHolding(true);
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHovering(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setHovering(false);
          }}
          onFocus={(event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.dataset.galleryPhoto !== undefined) {
              setPhotoFocus(true);
            }
          }}
          onBlur={(event) => {
            const next = event.relatedTarget;
            if (!(next instanceof HTMLElement) || next.dataset.galleryPhoto === undefined) {
              setPhotoFocus(false);
            }
          }}
        >
          <div className="grid h-full grid-cols-2 gap-3">
            <Column items={left} direction="up" paused={paused} onOpen={openAt} />
            <Column items={right} direction="down" paused={paused} onOpen={openAt} />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-linear-180/srgb from-surface to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-linear-0/srgb from-surface to-transparent"
          />
        </div>
        </div>
      </div>
    </section>
  );
}
