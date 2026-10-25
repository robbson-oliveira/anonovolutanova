"use client";

import { useId, useState } from "react";
import { Checkbox, IconMinus, IconPlus } from "@ds/index";
import { editionOfCartItem } from "@/lib/commerce/editions";
import { mainImage } from "@/lib/commerce/product-image";
import { fromMinor, type StoreCartItem } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { GIFT_WRAP_AFFECTS_ORDER } from "./gift-wrap";
import { ProductThumb } from "./ProductThumb";

/** Two digits in the middle cell ("02"), as on the cart reference. */
function unitsLabel(quantity: number) {
  return String(quantity).padStart(2, "0");
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
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={setChecked}
      align="center"
      className="gap-0"
      boxClassName="size-[22px]! rounded-[3px]"
      labelClassName="font-condensed text-[10px]! font-semibold! uppercase leading-none! tracking-[-0.02em] whitespace-nowrap text-text-strong min-[380px]:text-[11px]! sm:text-xs!"
    >
      Embalagem para presente
    </Checkbox>
  );
}

/**
 * Uma linha do carrinho: miniatura, nome, quantidade e total da linha. The
 * miniature is the product's main image in WooCommerce, with the edition's
 * local cover as the fallback. The text block (title, stepper, gift box)
 * stretches to the photo; the price sits on the right, vertically centered.
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
  const title = edition ? edition.label : item.name;

  return (
    <li className="flex items-stretch gap-2.5 font-condensed sm:gap-4">
      <ProductThumb
        image={mainImage(item.images)}
        fallback={edition}
        sizes={compact ? "72px" : "104px"}
        className={compact ? "size-[72px]" : "size-[88px] sm:size-[104px]"}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
        <span className="text-[15px] font-bold leading-tight tracking-[-0.02em] text-text-strong sm:text-base">
          {title}
        </span>
        {onQuantity ? (
          <div className="flex flex-col items-start gap-2">
            <div
              role="group"
              aria-label={`Quantidade de ${title}`}
              className="-mt-1.5 inline-flex h-8 items-stretch overflow-hidden rounded-[10px] border border-border text-text-strong sm:h-9"
            >
              <button
                type="button"
                disabled={busy}
                onClick={() => onQuantity(item.quantity - 1)}
                aria-label={item.quantity === 1 ? `Remover ${title}` : "Diminuir quantidade"}
                className="grid w-8 cursor-pointer place-items-center border-r border-border text-sm disabled:cursor-wait disabled:opacity-40 sm:w-9"
              >
                <IconMinus />
              </button>
              <span
                className="grid min-w-8 place-items-center border-r border-border px-1 text-[13px] font-semibold tabular-nums tracking-[-0.02em] sm:min-w-10 sm:text-sm"
                aria-live="polite"
              >
                {unitsLabel(item.quantity)}
              </span>
              <button
                type="button"
                disabled={busy || item.quantity >= max}
                onClick={() => onQuantity(item.quantity + 1)}
                aria-label="Aumentar quantidade"
                className="grid w-8 cursor-pointer place-items-center text-sm disabled:cursor-not-allowed disabled:opacity-40 sm:w-9"
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
      <span className="shrink-0 self-center text-[20px] font-bold leading-none tracking-[-0.04em] text-text-strong min-[380px]:text-[22px] sm:text-[26px]">
        {formatBRL(lineTotal)}
      </span>
    </li>
  );
}
