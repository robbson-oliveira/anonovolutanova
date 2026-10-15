/**
 * Color overrides for the purchase flow (cart, checkout, thank-you page):
 * petrol blue as the action color and a bronze shipping badge. They override
 * the semantic tokens on the page wrapper, so the landing page keeps the moss
 * green. One constant keeps the three pages in sync.
 */
export const STORE_FLOW_THEME =
  "[--color-action:var(--brand-petrol-900)] [--color-action-hover:var(--brand-petrol-700)] " +
  "[--color-badge:var(--brand-bronze-600)] [--color-on-badge:var(--brand-paper-100)]";
