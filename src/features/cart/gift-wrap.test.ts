import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BLACK_FRIDAY_MIDNIGHT_MS, BLACK_FRIDAY_START_MS } from "../../lib/black-friday.ts";
import { orderCustomerNote } from "./gift-wrap.ts";

const BEFORE = BLACK_FRIDAY_START_MS - 1;
const OPEN = BLACK_FRIDAY_START_MS;
const MIDNIGHT = BLACK_FRIDAY_MIDNIGHT_MS;

type Line = {
  id: number;
  quantity: number;
  name: string;
  variation: Array<{ attribute: string; value: string }>;
};

const color = (quantity: number): Line => ({
  id: 19,
  quantity,
  name: "Agenda Ano Novo Luta Nova 2027 — Edição Color",
  variation: [],
});

const classic = (quantity: number): Line => ({
  id: 6419,
  quantity,
  name: "Agenda Ano Novo Luta Nova 2027 — Edição Clássica",
  variation: [],
});

const notepad = (quantity: number): Line => ({
  id: 6581,
  quantity,
  name: "Planner Diário",
  variation: [],
});

const note = (items: Line[], typed = "", selected: number[] = [], now = OPEN) =>
  orderCustomerNote(items, typed, selected, now);

describe("orderCustomerNote Black Friday gift", () => {
  it("stays silent before 08:00 BRT", () => {
    assert.equal(note([color(1)], "", [], BEFORE), "");
  });

  it("asks for one planner when the cart has one agenda", () => {
    assert.equal(
      note([color(1)]),
      "Pedido da Black Friday — adicionar 1 Planner Diário de brinde (1 por agenda).",
    );
  });

  it("counts every agenda, across both editions", () => {
    assert.equal(
      note([color(2), classic(1)]),
      "Pedido da Black Friday — adicionar 3 Planners Diários de brinde (1 por agenda).",
    );
  });

  it("does not count a loose notepad bought next to agendas", () => {
    assert.equal(
      note([color(2), notepad(1)]),
      "Pedido da Black Friday — adicionar 2 Planners Diários de brinde (1 por agenda).",
    );
  });

  it("stays silent when the cart is only the loose notepad", () => {
    assert.equal(note([notepad(2)]), "");
  });

  it("keeps the gift-wrap line and adds the packer line under it", () => {
    const written = note([color(1)], "", [19]);
    assert.equal(
      written,
      "Embalar para presente: 1 agenda Edição Color\n" +
        "Pedido da Black Friday — adicionar 1 Planner Diário de brinde (1 por agenda).",
    );
  });

  it("does not repeat the packer line when the note already has it", () => {
    const once = note([color(1)]);
    const twice = note([color(1)], once);
    assert.equal(twice, once);
    assert.equal(twice.split("Pedido da Black Friday").length - 1, 1);
  });

  it("closes at midnight BRT on 28/11", () => {
    assert.equal(note([color(1)], "", [], MIDNIGHT - 1).includes("Pedido da Black Friday"), true);
    assert.equal(note([color(3)], "", [], MIDNIGHT), "");
  });
});
