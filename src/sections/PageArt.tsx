"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@ds/index";

type PageArtProps = {
  src: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * One illustrated page inside an About card.
 *
 * The bitmap is the paper only. The soft shadow is `drop-shadow-page`, so a
 * flattened fringe cannot come back as a torn block. Until the file decodes,
 * a cream sheet stands in for the petrol card (the empty dark box).
 */
export function PageArt({ src, width, height, className, style }: PageArtProps) {
  const [ready, setReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const smWidth = Math.max(180, Math.round(width * 0.62));
  const sm = src.replace(/\.webp$/, "-sm.webp");

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setReady(true);
  }, [src]);

  return (
    <span className="relative block">
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-[8%] top-[6%] bottom-[8%] rounded-[10px] bg-surface-card",
          ready && "hidden",
        )}
      />
      <img
        ref={imgRef}
        src={src}
        srcSet={`${sm} ${smWidth}w, ${src} ${width}w`}
        sizes="(max-width: 1023px) 72vw, 420px"
        width={width}
        height={height}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => setReady(true)}
        className={cn("relative h-auto w-full max-w-none drop-shadow-page", className)}
        style={style}
      />
    </span>
  );
}
