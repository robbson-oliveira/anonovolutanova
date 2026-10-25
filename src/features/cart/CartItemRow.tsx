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
 * Below md the capitals are 22px tall, the same as the box, which in this
 * condensed face is a 31px size. From md the label stays the small line.
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
      labelClassName="font-condensed text-[31px]! font-semibold! uppercase leading-none! tracking-[-0.02em] whitespace-nowrap text-text-strong md:text-xs!"
    >
      Embalagem para presente
    </Checkbox>
  );
}

/**
 * One cart line: thumbnail, name, quantity and the line total. The
 * miniature is the product's main image in WooCommerce, with the edition's
 * local cover as the fallback. Below md the name sits on the stepper and
 * the price is centered on the photo; from md both sit a little higher.
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
    <li className="flex flex-col font-condensed">
      <div className="flex items-start gap-2.5 md:items-stretch md:gap-4">
        <ProductThumb
          image={mainImage(item.images)}
          fallback={edition}
          sizes={compact ? "72px" : "104px"}
          className={compact ? "size-[72px]" : "size-[88px] sm:size-[104px]"}
        />
        {/* Below md the name sits on the stepper: the larger type replaces
            the old gap, so the stack does not grow past the photo. From md
            the stepper is pulled up a little closer to the name. */}
        <div className="flex min-w-0 flex-1 flex-col justify-start gap-0 md:justify-between md:gap-1">
          <span className="text-[17px] font-bold leading-tight tracking-[-0.02em] text-text-strong md:text-base">
            {title}
          </span>
          {onQuantity ? (
            <div className="flex flex-col items-start gap-2">
              <div
                role="group"
                aria-label={`Quantidade de ${title}`}
                className="inline-flex h-8 items-stretch overflow-hidden rounded-[10px] border border-border text-text-strong md:-mt-4 md:h-9"
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
              {giftWrap ? (
                <div className="hidden md:block">
                  <GiftWrapControl />
                </div>
              ) : null}
            </div>
          ) : (
            <span className="text-xs text-text-muted">Quantidade: {unitsLabel(item.quantity)}</span>
          )}
        </div>
        {/* Below md the price is centered on the photo (88px, 104px from sm),
            not on the row, and one step larger. From md it sits a little
            above the row center. */}
        <span className="shrink-0 self-start text-[24px] font-bold leading-none tracking-[-0.04em] text-text-strong max-md:mt-8 sm:max-md:mt-10 md:mt-0! md:self-center md:-translate-y-2 md:text-[26px]">
          {formatBRL(lineTotal)}
        </span>
      </div>
      {giftWrap ? (
        <div className="mt-2 md:hidden">
          <GiftWrapControl />
        </div>
      ) : null}
    </li>
  );
}
