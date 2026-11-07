import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cartBlockedByClassic,
  isClassicCartItem,
  productInStock,
} from "./availability.ts";

describe("productInStock", () => {
  it("does not treat is_purchasable alone as available", () => {
    assert.equal(productInStock({ is_in_stock: false, is_purchasable: true }), false);
    assert.equal(productInStock({ is_in_stock: true, is_purchasable: true }), true);
    assert.equal(productInStock(null), false);
    assert.equal(productInStock(undefined), false);
  });
});

describe("classic cart lines", () => {
  it("recognizes the classic product and blocks only that line", () => {
    const classic = { id: 6419, name: "Agenda Ano Novo Luta Nova 2027 (Clássica)", variation: [] };
    const color = { id: 19, name: "Agenda Ano Novo Luta Nova 2027 (Color)", variation: [] };
    assert.equal(isClassicCartItem(classic), true);
    assert.equal(isClassicCartItem({ id: 99, name: "Edição Clássica", variation: [] }), true);
    assert.equal(isClassicCartItem(color), false);
    assert.equal(cartBlockedByClassic([classic, color]), true);
    assert.equal(cartBlockedByClassic([color]), false);
    assert.equal(cartBlockedByClassic([]), false);
  });
});
