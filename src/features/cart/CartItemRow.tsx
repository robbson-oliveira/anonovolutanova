"use client";

import { useId, useState } from "react";
import { Checkbox, IconMinus, IconPlus } from "@ds/index";
import { editionOfCartItem } from "@/lib/commerce/editions";
import { mainImage } from "@/lib/commerce/product-image";
import { fromMinor, type StoreCartItem } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { GIFT_WRAP_AFFECTS_ORDER } from "./gift-wrap";
import { cartLineTitle } from "./line-title";
import { ProductThumb } from "./ProductThumb";

/** Two digits in the middle cell ("02"), as on the cart reference. */
function unitsLabel(quantity: number) {
  return String(quantity).padStart(2, "0");
}

/**
 * Visual only. The checked value stays in this component; nothing reads it
 * into the cart, the price or the order while `GIFT_WRAP_AFFECTS_ORDER` is false.
 * Below md the line is a small condensed label inside the name column.
 * From md the box stays 22px and the label stays the 16px line.
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
      boxClassName="size-4! rounded-[3px] [&_svg]:size-3! md:size-[22px]! md:[&_svg]:size-4!"
      labelClassName="font-condensed text-[12px]! font-semibold! uppercase leading-none! tracking-[-0.02em] whitespace-nowrap text-text-strong md:text-xs!"
    >
      Embalagem para presente
    </Checkbox>
  );
}

/**
 * One cart line: thumbnail, name, quantity and the line total. The
 * miniature is the product's main image in WooCommerce, with the edition's
 * local cover as the fallback. Below md the name, the stepper and the gift
 * line stack in the middle column, and the price centers on that whole
 * block. From md the stepper and the price sit a little higher.
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
  const title = cartLineTitle(item);

  return (
    <li className="flex items-start gap-2.5 font-condensed md:items-stretch md:gap-4">
      <ProductThumb
        image={mainImage(item.images)}
        fallback={edition}
        sizes={compact ? "72px" : "104px"}
        className={compact ? "size-[72px]" : "size-[88px] sm:size-[104px]"}
      />
      {/* Below md the name, stepper and gift line share the middle column.
          From md the stepper is pulled up a little closer to the name. */}
      <div className="flex min-w-0 flex-1 flex-col justify-start gap-1.5 md:justify-between md:gap-1">
        <span className="text-[24px] font-medium leading-none tracking-[-0.02em] text-text-strong md:text-base md:leading-tight">
          {title}
        </span>
        {onQuantity ? (
          <div className="flex flex-col items-start gap-1.5 md:gap-2">
            <div
              role="group"
              aria-label={`Quantidade de ${title}`}
              className="inline-flex h-9 items-stretch overflow-hidden rounded-[10px] border border-border text-text-strong md:-mt-4 md:h-9"
            >
              <button
                type="button"
                disabled={busy}
                onClick={() => onQuantity(item.quantity - 1)}
                aria-label={item.quantity === 1 ? `Remover ${title}` : "Diminuir quantidade"}
                className="grid w-9 cursor-pointer place-items-center border-r border-border text-sm disabled:cursor-wait disabled:opacity-40"
              >
                <IconMinus />
              </button>
              <span
                className="grid min-w-9 place-items-center border-r border-border px-1 text-[15px] font-semibold tabular-nums tracking-[-0.02em] sm:min-w-10 sm:text-sm"
                aria-live="polite"
              >
                {unitsLabel(item.quantity)}
              </span>
              <button
                type="button"
                disabled={busy || item.quantity >= max}
                onClick={() => onQuantity(item.quantity + 1)}
                aria-label="Aumentar quantidade"
                className="grid w-9 cursor-pointer place-items-center text-sm disabled:cursor-not-allowed disabled:opacity-40"
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
      {/* Below md the price centers on the whole row (name, stepper, gift).
          From md it sits a little above the row center. */}
      <span className="shrink-0 self-center text-[26px] font-bold leading-none tracking-[-0.04em] text-text-strong md:-translate-y-2">
        {formatBRL(lineTotal)}
      </span>
    </li>
  );
}
