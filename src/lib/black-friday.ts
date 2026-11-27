/**
 * Black Friday 2026 window, America/Sao_Paulo.
 *
 * Brazil has not observed daylight saving since 2019, so Brasília is a fixed
 * UTC−3. The bounds carry that offset: the host timezone does not matter,
 * and the server and the browser agree on the same instants.
 *
 * Inclusive from 27/11/2026 08:00:00.000 through 23:59:59.999.
 */

export const BLACK_FRIDAY_START_ISO = "2026-11-27T08:00:00-03:00";
export const BLACK_FRIDAY_END_ISO = "2026-11-27T23:59:59-03:00";

export const BLACK_FRIDAY_START_MS = Date.parse(BLACK_FRIDAY_START_ISO);
/** The named end instant. The window also covers the rest of that second. */
export const BLACK_FRIDAY_END_MS = Date.parse(BLACK_FRIDAY_END_ISO);

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
 * The public home (`/`) never does: it stays as it is, including during the
 * window and with `?preview_bf=1`. `/home-2` passes `force`. The cart and
 * its drawer pass `schedule`, so they open with the window or the preview
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
