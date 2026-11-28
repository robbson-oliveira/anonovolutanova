/**
 * Black Friday 2026 window, America/Sao_Paulo.
 *
 * Brazil has not observed daylight saving since 2019, so Brasília is a fixed
 * UTC−3. The bounds carry that offset: the host timezone does not matter,
 * and the server and the browser agree on the same instants.
 *
 * Inclusive from 27/11/2026 08:00:00.000 through 23:59:59.999.
 *
 * `BLACK_FRIDAY_HOME_ACTIVE` is the one switch for the public home. `true`
 * renders the approved campaign layout on `/`, which stays indexable.
 * `false` restores the original home without removing any of its sections.
 * `/home-2` does not read it.
 */

export const BLACK_FRIDAY_HOME_ACTIVE = false;

export const BLACK_FRIDAY_START_ISO = "2026-11-27T08:00:00-03:00";
export const BLACK_FRIDAY_END_ISO = "2026-11-27T23:59:59-03:00";

export const BLACK_FRIDAY_START_MS = Date.parse(BLACK_FRIDAY_START_ISO);
/** The named end instant. The window also covers the rest of that second. */
export const BLACK_FRIDAY_END_MS = Date.parse(BLACK_FRIDAY_END_ISO);
/** Midnight that closes the day, 2026-11-28 00:00:00 BRT. The top-bar clock counts to this. */
export const BLACK_FRIDAY_MIDNIGHT_ISO = "2026-11-28T00:00:00-03:00";
export const BLACK_FRIDAY_MIDNIGHT_MS = Date.parse(BLACK_FRIDAY_MIDNIGHT_ISO);

export type BlackFridayClock = {
  /** `start` counts down to 08:00. `end` counts down to midnight, then holds. */
  phase: "start" | "end";
  time: string;
};

function padClock(ms: number): string {
  const total = Math.floor(Math.max(0, ms) / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Top bar of `/home-2`. Before 08:00 BRT it counts down to the opening.
 * From 08:00 until midnight it counts down to 2026-11-28 00:00 BRT.
 * After midnight it stays at 00:00:00.
 */
export function blackFridayClock(now: number): BlackFridayClock {
  if (now < BLACK_FRIDAY_START_MS) {
    return { phase: "start", time: padClock(BLACK_FRIDAY_START_MS - now) };
  }
  if (now < BLACK_FRIDAY_MIDNIGHT_MS) {
    return { phase: "end", time: padClock(BLACK_FRIDAY_MIDNIGHT_MS - now) };
  }
  return { phase: "end", time: "00:00:00" };
}

/** Query flag for reviewing the notices before the window opens. Client only. */
export const BLACK_FRIDAY_PREVIEW_PARAM = "preview_bf";

/**
 * True when `now` falls inside the Black Friday window.
 * Does not read the preview query: that stays in the browser hook, so a
 * static page never bakes a visitor-specific URL into the HTML.
 */
export function isBlackFridayWindow(now: Date): boolean {
  const t = now.getTime();
  if (Number.isNaN(t)) return false;
  return t >= BLACK_FRIDAY_START_MS && t <= BLACK_FRIDAY_END_MS + 999;
}

/**
 * Which surface may follow the clock.
 *
 * The original home passes neither, so it stays as it is, including during
 * the window and with `?preview_bf=1`. The campaign layout (`/home-2`, and
 * `/` while `BLACK_FRIDAY_HOME_ACTIVE`) passes `force`. The cart and its
 * drawer pass `schedule`, so they open with the window or the preview
 * query and close on their own at midnight.
 */
export function showBlackFridayNotice(input: {
  force: boolean;
  schedule: boolean;
  /** True inside the window or when the preview query is set. */
  scheduled: boolean;
}): boolean {
  return input.force || (input.schedule && input.scheduled);
}
