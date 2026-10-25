"use client";

import { useId, useState } from "react";
import { Checkbox, IconMinus, IconPlus } from "@ds/index";
import { editionOfCartItem } from "@/lib/commerce/editions";
import { mainImage } from "@/lib/commerce/product-image";
import { fromMinor, type StoreCartItem } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { GIFT_WRAP_AFFECTS_ORDER } from "./gift-wrap";
import { ProductThumb } from "./ProductThumb";

/** "01 un." — two digits, like the discreet selector on the reference. */
function unitsLabel(quantity: number) {
  return `${String(quantity).padStart(2, "0")} un.`;
}

/**
 * Visual only. The checked value stays in this component; nothing reads it
 * into the cart, the price or the order while `GIFT_WRAP_AFFECTS_ORDER` is false.
 */
function GiftWrapControl() {
  const [checked, setChecked] = useState(false);
  const id = useId();
  void GIFT_WRAP_AFFECTS_ORDER;
  return (
    <Checkbox id={id} checked={checked} onCheckedChange={setChecked}>
      Embalagem pra presente
    </Checkbox>
  );
}

/**
 * Uma linha do carrinho: miniatura, nome, quantidade e total da linha. The
 * miniature is the product's main image in WooCommerce, with the edition's
 * local cover as the fallback.
 */
export function CartItemRow({
  item,
  busy,
  onQuantity,
  compact = false,
  giftWrap = false,
}: {
  item: StoreCartItem;
  busy: boolean;
  onQuantity?: (quantity: number) => void;
  compact?: boolean;
  /** Draws the gift-wrap checkbox. It does not change the line price. */
  giftWrap?: boolean;
}) {
  const edition = editionOfCartItem(item);
  const minor = item.totals.currency_minor_unit ?? item.prices.currency_minor_unit;
  const lineTotal = fromMinor(item.totals.line_subtotal, minor);
  const max = item.quantity_limits?.maximum ?? 49;

  return (
    <li className="flex items-center gap-4">
      <ProductThumb
        image={mainImage(item.images)}
        fallback={edition}
        sizes={compact ? "64px" : "80px"}
        className={compact ? "size-16" : "size-20"}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-sm font-bold leading-tight text-text-strong">
          {edition ? edition.label : item.name}
        </span>
        {onQuantity ? (
          <div className="flex flex-col items-start gap-2">
            <div className="inline-flex items-center gap-1 text-text-strong">
              <button
                type="button"
                disabled={busy}
                onClick={() => onQuantity(item.quantity - 1)}
                aria-label={item.quantity === 1 ? `Remover ${edition?.label ?? item.name}` : "Diminuir quantidade"}
                className="grid size-8 cursor-pointer place-items-center text-sm disabled:cursor-wait disabled:opacity-50"
              >
                <IconMinus />
              </button>
              <span className="min-w-14 text-center text-[13px] font-medium tabular-nums" aria-live="polite">
                {unitsLabel(item.quantity)}
              </span>
              <button
                type="button"
                disabled={busy || item.quantity >= max}
                onClick={() => onQuantity(item.quantity + 1)}
                aria-label="Aumentar quantidade"
                className="grid size-8 cursor-pointer place-items-center text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconPlus />
              </button>
            </div>
            {giftWrap ? <GiftWrapControl /> : null}
          </div>
        ) : (
          <span className="text-xs text-text-muted">Quantidade: {unitsLabel(item.quantity)}</span>
        )}
      </div>
      <span className="text-sm font-bold text-text-strong">{formatBRL(lineTotal)}</span>
    </li>
  );
}
