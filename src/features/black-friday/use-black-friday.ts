"use client";

import { useSyncExternalStore } from "react";
import {
  BLACK_FRIDAY_END_MS,
  BLACK_FRIDAY_PREVIEW_PARAM,
  BLACK_FRIDAY_START_MS,
  isBlackFridayWindow,
} from "@/lib/black-friday";

/**
 * The server snapshot is always closed.
 *
 * The home is static. Baking the clock into that HTML would mismatch hydration
 * once the window opens (the file was generated earlier) and cannot see
 * `?preview_bf=1`, which exists only in the browser. React hydrates against
 * this snapshot, then applies the client snapshot without a warning.
 * `/home-2` does not use this path: it passes `force`, so the notices are in
 * the first paint.
 */
function serverSnapshot(): boolean {
  return false;
}

function clientSnapshot(): boolean {
  try {
    const preview =
      new URLSearchParams(window.location.search).get(BLACK_FRIDAY_PREVIEW_PARAM) === "1";
    return preview || isBlackFridayWindow(new Date());
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void): () => void {
  const timers: number[] = [];
  const now = Date.now();
  if (now < BLACK_FRIDAY_START_MS) {
    timers.push(window.setTimeout(onChange, BLACK_FRIDAY_START_MS - now));
  }
  if (now <= BLACK_FRIDAY_END_MS + 999) {
    timers.push(window.setTimeout(onChange, BLACK_FRIDAY_END_MS + 1000 - now));
  }
  window.addEventListener("popstate", onChange);
  return () => {
    for (const id of timers) window.clearTimeout(id);
    window.removeEventListener("popstate", onChange);
  };
}

/**
 * True during the Brasília window, or when the page was opened with
 * `?preview_bf=1`. `force` is for `/home-2`, which must render the notices
 * on the server regardless of the clock.
 */
export function useBlackFridayActive(force = false): boolean {
  const scheduled = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  return force || scheduled;
}
