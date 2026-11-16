/**
 * Temporary storefront closure (payment gateway down).
 *
 * `true` makes `proxy.ts` rewrite every page to `/manutencao`.
 * To reopen the store, set this to `false` and deploy, or revert the
 * commit that turned it on. Assets, `/_next` and `/api` stay reachable
 * because the proxy matcher already skips them.
 */
export const MAINTENANCE_MODE = true;
