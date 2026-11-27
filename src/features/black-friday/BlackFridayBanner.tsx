"use client";

import { cn, pageFrameClass } from "@ds/index";
import { BLACK_FRIDAY } from "@content/black-friday";
import { useBlackFridayActive } from "./use-black-friday";

type BlackFridayBannerProps = {
  /** `home` and `cart` are full-width strips. `drawer` fits the cart panel. */
  variant: "home" | "cart" | "drawer";
  /**
   * Render on the server, ignoring the clock and `?preview_bf=1`.
   * Set only by `/home-2`.
   */
  force?: boolean;
  className?: string;
};

/**
 * Black Friday announcement. Closed until the Brasília window (or the
 * preview query, or `force`), so the public pages stay unchanged outside it.
 * A full band, not a card with a colored side rule.
 */
export function BlackFridayBanner({ variant, force = false, className }: BlackFridayBannerProps) {
  const active = useBlackFridayActive(force);
  if (!active) return null;

  if (variant === "drawer") {
    return (
      <aside
        aria-label="Black Friday"
        data-anln-black-friday=""
        className={cn("bg-surface-inverse-soft px-6 py-3 text-text-on-inverse", className)}
      >
        <p className="text-[12px] font-bold text-gold-end">{BLACK_FRIDAY.kicker}</p>
        <p className="mt-1 text-[13px] leading-snug">{BLACK_FRIDAY.cart}</p>
      </aside>
    );
  }

  const body = variant === "home" ? BLACK_FRIDAY.home : BLACK_FRIDAY.cart;

  return (
    <aside
      aria-label="Black Friday"
      data-anln-black-friday=""
      className={cn("bg-surface-inverse-soft text-text-on-inverse", className)}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-1 py-3 text-center md:gap-1.5 md:py-3.5",
          variant === "home"
            ? pageFrameClass
            : "mx-auto w-full max-w-[1200px] px-4 sm:px-6",
        )}
      >
        <p className="text-[13px] font-bold text-gold-end">{BLACK_FRIDAY.kicker}</p>
        <p className="max-w-[46rem] text-[14px] leading-snug md:text-[15px]">{body}</p>
      </div>
    </aside>
  );
}
