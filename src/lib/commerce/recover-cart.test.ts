import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  fetchRecoveryItems,
  isRecoveryToken,
  parseRecoveryItems,
  planRecoveryMerge,
  scrubRecoveryReferrer,
  urlWithoutRecoveryToken,
} from "./recover-cart.ts";

const TOKEN = "a".repeat(32);

describe("recovery token", () => {
  it("accepts the 32-character token the store issues", () => {
    assert.equal(isRecoveryToken(TOKEN), true);
    assert.equal(isRecoveryToken(`${TOKEN}x`), false);
    assert.equal(isRecoveryToken("short"), false);
    assert.equal(isRecoveryToken(`${"a".repeat(31)}-`), false);
  });

  it("removes rc and keeps the campaign parameters", () => {
    const clean = urlWithoutRecoveryToken(
      new URL(`https://anonovolutanova.com.br/carrinho?rc=${TOKEN}&utm_source=whatsapp&utm_medium=recuperacao&utm_campaign=carrinho_msg1`),
    );
    assert.ok(clean);
    assert.equal(clean.searchParams.has("rc"), false);
    assert.equal(clean.searchParams.get("utm_source"), "whatsapp");
    assert.equal(clean.searchParams.get("utm_campaign"), "carrinho_msg1");
    assert.equal(clean.pathname, "/carrinho");
  });

  it("strips an invalid rc too, and leaves a url without one alone", () => {
    const clean = urlWithoutRecoveryToken(new URL("https://shop.example/carrinho?rc=nope"));
    assert.equal(clean?.search, "");
    assert.equal(urlWithoutRecoveryToken(new URL("https://shop.example/carrinho?utm_source=whatsapp")), null);
  });

  it("does not keep a token that arrived in the referrer", () => {
    const scrubbed = scrubRecoveryReferrer(
      `https://admin.anonovolutanova.com.br/wp-json/anln/v1/r/${TOKEN}?m=1`,
    );
    assert.ok(scrubbed);
    assert.equal(scrubbed.includes(TOKEN), false);
    assert.equal(scrubRecoveryReferrer("not a url"), null);
    assert.equal(scrubRecoveryReferrer(null), null);
  });
});

describe("parseRecoveryItems", () => {
  it("keeps ids and quantities and drops anything else", () => {
    assert.deepEqual(
      parseRecoveryItems({
        ok: true,
        email: "ana@example.com",
        total: 109.9,
        items: [
          { id: 19, quantity: 2, name: "Agenda" },
          { id: 0, quantity: 1 },
          { id: 7, quantity: 150 },
        ],
      }),
      [
        { id: 19, quantity: 2 },
        { id: 7, quantity: 99 },
      ],
    );
  });

  it("returns null for a refusal", () => {
    assert.equal(parseRecoveryItems({ ok: false }), null);
    assert.equal(parseRecoveryItems({ ok: true, items: [] }), null);
    assert.equal(parseRecoveryItems(null), null);
  });
});

describe("planRecoveryMerge", () => {
  it("raises a line to the recovered quantity and leaves a higher one", () => {
    const ops = planRecoveryMerge(
      [
        { id: 19, key: "color", quantity: 1 },
        { id: 20, key: "classic", quantity: 4 },
      ],
      [
        { id: 19, quantity: 3 },
        { id: 20, quantity: 2 },
      ],
    );
    assert.deepEqual(ops, [{ type: "update", key: "color", id: 19, quantity: 3 }]);
  });

  it("adds a product that is not in the cart and does not remove the others", () => {
    const ops = planRecoveryMerge(
      [{ id: 19, key: "color", quantity: 1 }],
      [{ id: 21, quantity: 2 }],
    );
    assert.deepEqual(ops, [{ type: "add", id: 21, quantity: 2 }]);
  });

  it("does not emit a removal or a coupon", () => {
    const ops = planRecoveryMerge([], [{ id: 19, quantity: 1 }]);
    assert.equal(ops.some((op) => op.type !== "add" && op.type !== "update"), false);
    assert.equal(JSON.stringify(ops).includes("coupon"), false);
  });
});

describe("fetchRecoveryItems", () => {
  it("calls the recover route and returns only lines", async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async (url) => {
      calls.push(String(url));
      return new Response(JSON.stringify({
        ok: true,
        email: "ana@example.com",
        items: [{ id: 19, quantity: 2, name: "Agenda" }],
      }), { status: 200 });
    };
    assert.deepEqual(await fetchRecoveryItems("http://127.0.0.1:3999", TOKEN, fetchImpl), [{ id: 19, quantity: 2 }]);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].startsWith("http://127.0.0.1:3999/wp-json/anln/v1/carrinho/recuperar?rc="), true);
    assert.equal(calls[0].includes(TOKEN), true);
  });

  it("returns null on 404, 429 and a timeout, without throwing", async () => {
    const missing: typeof fetch = async () => new Response(JSON.stringify({ ok: false }), { status: 404 });
    const limited: typeof fetch = async () => new Response(JSON.stringify({ ok: false }), { status: 429 });
    const hang: typeof fetch = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
      });
    assert.equal(await fetchRecoveryItems("http://127.0.0.1:3999", TOKEN, missing), null);
    assert.equal(await fetchRecoveryItems("http://127.0.0.1:3999", TOKEN, limited), null);
    assert.equal(await fetchRecoveryItems("http://127.0.0.1:3999", "nope", missing), null);
    assert.equal(await fetchRecoveryItems("http://127.0.0.1:3999", TOKEN, hang, 20), null);
  });
});

describe("the token stays off the page", () => {
  it("strips rc in the proxy before attribution, and the checkout does not restore", () => {
    const proxy = readFileSync(new URL("../../proxy.ts", import.meta.url), "utf8");
    const checkout = readFileSync(new URL("../../features/checkout/CheckoutPage.tsx", import.meta.url), "utf8");
    const store = readFileSync(new URL("./store-api.ts", import.meta.url), "utf8");
    const recover = readFileSync(new URL("./recover-cart.ts", import.meta.url), "utf8");
    const proxyBody = proxy.slice(proxy.indexOf("export function proxy"));
    assert.ok(proxyBody.indexOf("recoveryRedirect(request)") < proxyBody.indexOf("attributionFromRequest"));
    assert.match(proxy, /httpOnly: true/);
    assert.match(proxy, /path: "\/carrinho"/);
    assert.equal(recover.includes("console."), false);
    assert.equal(checkout.includes("carrinho/recuperar"), false);
    assert.equal(checkout.includes("mergeRecovered"), false);
    assert.equal(store.includes("anln/v1/carrinho"), false);
    assert.equal(store.includes("processCheckout"), true);
  });
});
