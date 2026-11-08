import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ANLN_SEND_META_IDS,
  captureMetaIds,
  metaCheckoutFields,
  serverTrackingExtension,
} from "./attribution.ts";

const ORIGIN = "https://anonovolutanova.com.br";

function install(options: { href: string; storage: "ok" | "throw"; cookie?: string }): { href: string } {
  const jar = new Map<string, string>();
  const storage =
    options.storage === "ok"
      ? {
          getItem: (key: string) => jar.get(key) ?? null,
          setItem: (key: string, value: string) => {
            jar.set(key, String(value));
          },
          removeItem: (key: string) => {
            jar.delete(key);
          },
        }
      : {
          getItem: () => {
            throw new Error("sessionStorage blocked");
          },
          setItem: () => {
            throw new Error("sessionStorage blocked");
          },
          removeItem: () => {
            throw new Error("sessionStorage blocked");
          },
        };
  const location = { href: options.href, origin: ORIGIN };
  Object.assign(globalThis, {
    window: {
      location,
      sessionStorage: storage,
      // A parent frame with another click must not be read.
      parent: { location: { href: `${ORIGIN}/?fbclid=EVIL` } },
    },
    document: { cookie: options.cookie ?? "" },
  });
  return location;
}

const scenario = process.argv[2];

if (scenario === "ssr") {
  const ids = captureMetaIds();
  if (ids.fbp || ids.fbc || ids.fbclid) process.exit(2);
  process.exit(0);
}

if (scenario === "reload") {
  install({ href: `${ORIGIN}/checkout`, storage: "throw" });
  const ids = captureMetaIds();
  if (ids.fbp || ids.fbc || ids.fbclid) process.exit(2);
  process.exit(0);
}

describe("captureMetaIds", () => {
  it("keeps a real click for this document and does not invent one", () => {
    const location = install({ href: `${ORIGIN}/checkout`, storage: "throw" });
    assert.deepEqual(captureMetaIds(), {});

    location.href = `${ORIGIN}/?utm_source=facebook&utm_medium=cpc&utm_campaign=agenda`;
    assert.deepEqual(captureMetaIds(), {});

    location.href = `${ORIGIN}/?fbclid=CLICK_A`;
    const first = captureMetaIds();
    // The landing call's return is what installTracking discards.
    assert.equal(first.fbclid, "CLICK_A");
    assert.match(first.fbc ?? "", /^fb\.1\.\d+\.CLICK_A$/);

    location.href = `${ORIGIN}/checkout`;
    const atCheckout = captureMetaIds();
    assert.equal(atCheckout.fbc, first.fbc);
    assert.equal(atCheckout.fbclid, "CLICK_A");

    location.href = `${ORIGIN}/carrinho?fbclid=CLICK_B`;
    const replaced = captureMetaIds();
    assert.equal(replaced.fbclid, "CLICK_B");
    assert.match(replaced.fbc ?? "", /^fb\.1\.\d+\.CLICK_B$/);
    assert.notEqual(replaced.fbc, first.fbc);

    location.href = `${ORIGIN}/checkout`;
    assert.equal(captureMetaIds().fbc, replaced.fbc);

    install({
      href: `${ORIGIN}/?fbclid=CLICK_NEW`,
      storage: "throw",
      cookie: "_fbc=fb.1.50.CLICK_OLD; _fbp=fb.1.9.browser",
    });
    const fromNewClick = captureMetaIds();
    assert.equal(fromNewClick.fbclid, "CLICK_NEW");
    assert.match(fromNewClick.fbc ?? "", /^fb\.1\.\d+\.CLICK_NEW$/);
    assert.equal(fromNewClick.fbp, "fb.1.9.browser");

    (globalThis as unknown as { window: { location: { href: string } } }).window.location.href =
      `${ORIGIN}/checkout`;
    const stillNew = captureMetaIds();
    assert.equal(stillNew.fbc, fromNewClick.fbc);
    assert.equal(stillNew.fbclid, "CLICK_NEW");
    assert.notEqual(stillNew.fbc, "fb.1.50.CLICK_OLD");
    const tracked = serverTrackingExtension(false);
    assert.equal(tracked.fbc, fromNewClick.fbc);
    assert.equal(tracked.consent, "nao");
    assert.equal("fbclid" in tracked, false);

    const pixelTime = Date.now() + 60_000;
    (globalThis as unknown as { document: { cookie: string } }).document.cookie =
      `_fbc=fb.1.${pixelTime}.CLICK_PIXEL; _fbp=fb.1.9.browser`;
    const fromNewCookie = captureMetaIds();
    assert.equal(fromNewCookie.fbc, `fb.1.${pixelTime}.CLICK_PIXEL`);
    assert.equal(fromNewCookie.fbclid, "CLICK_PIXEL");

    (globalThis as unknown as { window: { location: { href: string } } }).window.location.href =
      `${ORIGIN}/?fbclid=CLICK_D`;
    const newer = captureMetaIds();
    assert.equal(newer.fbclid, "CLICK_D");
    assert.match(newer.fbc ?? "", /^fb\.1\.\d+\.CLICK_D$/);
    assert.notEqual(newer.fbc, "fb.1.50.CLICK_C");

    const working = install({ href: `${ORIGIN}/?fbclid=CLICK_E`, storage: "ok" });
    const stored = captureMetaIds();
    working.href = `${ORIGIN}/checkout`;
    assert.equal(captureMetaIds().fbc, stored.fbc);

    assert.equal(ANLN_SEND_META_IDS, false);
    assert.deepEqual(metaCheckoutFields(), {});
    const tracking = serverTrackingExtension(false);
    assert.equal(tracking.consent, "nao");
    assert.equal("fbclid" in tracking, false);
    assert.equal(tracking.fbc, stored.fbc);
    assert.equal(serverTrackingExtension(true).consent, "sim");
  });

  it("loses the click on a new document when storage is blocked, and ignores SSR and parent frames", () => {
    const file = fileURLToPath(import.meta.url);
    const run = (name: string) =>
      spawnSync(process.execPath, ["--experimental-strip-types", file, name], { encoding: "utf8" });
    const reload = run("reload");
    assert.equal(reload.status, 0, reload.stderr);
    const ssr = run("ssr");
    assert.equal(ssr.status, 0, ssr.stderr);
  });
});
