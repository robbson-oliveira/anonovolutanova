"use client";

import { cn } from "@ds/index";
import { BLACK_FRIDAY } from "@content/black-friday";
import { useBlackFridayActive } from "./use-black-friday";

type BlackFridayPlannerNoteProps = {
  /** See `BlackFridayBanner`. */
  force?: boolean;
  /**
   * `plain` sits on the cream page (white panel). `warm` sits on a white
   * card (cream panel). The border runs all the way around: a side rule
   * alone reads as a generic callout.
   */
  surface?: "plain" | "warm";
  className?: string;
};

const surfaceClass = {
  plain: "bg-surface-plain",
  warm: "bg-surface",
} as const;

/**
 * Note next to the standalone daily planner: the agenda already includes
 * one free planner per unit today; this product is only for extra units.
 */
export function BlackFridayPlannerNote({
  force = false,
  surface = "plain",
  className,
}: BlackFridayPlannerNoteProps) {
  const active = useBlackFridayActive(force);
  if (!active) return null;

  return (
    <p
      data-anln-black-friday=""
      className={cn(
        "rounded-[12px] border border-gold-start px-4 py-3 text-left text-[14px] leading-snug text-text-heading-sea",
        surfaceClass[surface],
        className,
      )}
    >
      <span className="font-bold text-text-strong">{BLACK_FRIDAY.plannerLead} </span>
      {BLACK_FRIDAY.planner}
    </p>
  );
}
