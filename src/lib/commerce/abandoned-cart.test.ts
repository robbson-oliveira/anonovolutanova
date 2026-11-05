import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  buildAbandonedCartBody,
  postAbandonedCart,
  type AbandonedCartBody,
  type AbandonedCartInput,
} from "./abandoned-cart.ts";

const ready: AbandonedCartInput = {
  consent: true,
  paid: false,
  name: "Ana Silva",
  email: "ana@example.com",
  phoneE164: "+5511987654321",
  phoneValid: true,
  items: [{ id: 19, quantity: 1 }],
  totalMinor: "10990",
  minorUnit: 2,
};

function body(over: Partial<AbandonedCartInput> = {}): AbandonedCartBody | null {
  return buildAbandonedCartBody({ ...ready, ...over });
}

describe("buildAbandonedCartBody", () => {
  it("sends the contract fields and a Brazilian phone when the box is checked", () => {
    const built = body();
    assert.deepEqual(built, {
      name: "Ana Silva",
      email: "ana@example.com",
      phone: "11987654321",
      consent: true,
      website: "",
      items: [{ id: 19, quantity: 1 }],
      total: 109.9,
    });
    assert.deepEqual(Object.keys(built ?? {}).sort(), [
      "consent",
      "email",
      "items",
      "name",
      "phone",
      "total",
      "website",
    ]);
  });

  it("does not send when the box is absent or unchecked", () => {
    assert.equal(body({ consent: false }), null);
  });

  it("does not send an empty cart or a paid order", () => {
    assert.equal(body({ items: [] }), null);
    assert.equal(body({ paid: true }), null);
  });

  it("does not send a phone that is not a valid Brazilian number", () => {
    assert.equal(body({ phoneValid: false }), null);
    assert.equal(body({ phoneE164: "+14155552671", phoneValid: true }), null);
    assert.equal(body({ phoneE164: "+55123", phoneValid: true }), null);
  });

  it("does not send more than 20 lines", () => {
    const items = Array.from({ length: 21 }, (_, i) => ({ id: i + 1, quantity: 1 }));
    assert.equal(body({ items }), null);
  });
});

describe("postAbandonedCart", () => {
  it("POSTs the JSON and does not repeat the same cart", async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const fetchImpl: typeof fetch = async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return new Response("{}", { status: 200 });
    };
    const seen = new Set<string>();
    const payload = body();
    assert.ok(payload);
    assert.equal(await postAbandonedCart("https://shop.example", payload, { fetch: fetchImpl, seen }), "ok");
    assert.equal(await postAbandonedCart("https://shop.example", payload, { fetch: fetchImpl, seen }), "skipped");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://shop.example/wp-json/anln/v1/carrinho");
    assert.equal(calls[0].init.method, "POST");
    assert.equal(calls[0].init.body, JSON.stringify(payload));
    assert.equal(JSON.parse(String(calls[0].init.body)).website, "");
  });

  it("resolves when the network fails", async () => {
    const fetchImpl: typeof fetch = async () => {
      throw new Error("offline");
    };
    const payload = body();
    assert.ok(payload);
    assert.equal(await postAbandonedCart("https://shop.example", payload, { fetch: fetchImpl }), "failed");
  });

  it("resolves when the store answers with an error", async () => {
    const fetchImpl: typeof fetch = async () => new Response("no", { status: 500 });
    const payload = body();
    assert.ok(payload);
    assert.equal(await postAbandonedCart("https://shop.example", payload, { fetch: fetchImpl }), "failed");
  });

  it("resolves when the store does not answer in time", async () => {
    const fetchImpl: typeof fetch = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
      });
    const payload = body();
    assert.ok(payload);
    assert.equal(
      await postAbandonedCart("https://shop.example", payload, { fetch: fetchImpl, timeoutMs: 20 }),
      "failed",
    );
  });
});

describe("checkout stays separate", () => {
  it("does not log the cart and does not wait on the capture during payment", () => {
    const capture = readFileSync(new URL("./abandoned-cart.ts", import.meta.url), "utf8");
    const checkout = readFileSync(new URL("../../features/checkout/CheckoutPage.tsx", import.meta.url), "utf8");
    const store = readFileSync(new URL("./store-api.ts", import.meta.url), "utf8");
    assert.equal(capture.includes("console."), false);
    assert.equal(checkout.includes("await postAbandonedCart"), false);
    assert.equal(store.includes("anln/v1/carrinho"), false);
    assert.match(checkout, /const \[cartRecoveryConsent, setCartRecoveryConsent\] = useState\(false\)/);
    assert.match(checkout, /publicEnv\.cartRecoveryEnabled/);
    assert.match(checkout, /Quero receber pelo WhatsApp um lembrete se eu não concluir a compra \(no máximo 2 mensagens\)/);
  });
});
