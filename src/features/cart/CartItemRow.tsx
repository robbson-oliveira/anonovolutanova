"use client";

import { useId, useState } from "react";
import { Checkbox, IconMinus, IconPlus, cn } from "@ds/index";
import { editionOfCartItem } from "@/lib/commerce/editions";
import { mainImage } from "@/lib/commerce/product-image";
import { fromMinor, type StoreCartItem } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { cartLineTitle } from "./line-title";
import { plannerPaperFocus } from "./planner-thumb";
import { ProductThumb } from "./ProductThumb";

/** Two digits in the middle cell ("02"), as on the cart reference. */
function unitsLabel(quantity: number) {
  return String(quantity).padStart(2, "0");
}

/**
 * Below md the line is a small condensed label inside the name column.
 * From md the box stays 22px and the label stays the 16px line.
 * Without `onCheckedChange` the check stays in this component (it does not
 * reach the order). With it, the parent stores the choice.
 */
function GiftWrapControl({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const [localChecked, setLocalChecked] = useState(false);
  const id = useId();
  const controlled = onCheckedChange !== undefined;
  return (
    <Checkbox
      id={id}
      checked={controlled ? Boolean(checked) : localChecked}
      onCheckedChange={controlled ? onCheckedChange : setLocalChecked}
      align="center"
      className="gap-0"
      rowClassName="max-md:gap-1.5!"
      boxClassName="relative size-4! rounded-[3px] [&_svg]:size-3! max-md:before:absolute max-md:before:-inset-3 max-md:before:content-[''] md:size-[22px]! md:[&_svg]:size-4!"
      labelClassName="font-condensed text-[13px]! font-semibold! uppercase leading-snug! tracking-[0.015em] text-balance text-text-strong max-md:inline-flex max-md:min-h-10 max-md:items-center md:text-xs!"
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
  giftWrapped = false,
  onGiftWrap,
  matchTitleWeight = false,
}: {
  item: StoreCartItem;
  busy: boolean;
  onQuantity?: (quantity: number) => void;
  compact?: boolean;
  /** Draws the gift-wrap checkbox. It does not change the line price. */
  giftWrap?: boolean;
  /** Checked when the parent is storing the choice. */
  giftWrapped?: boolean;
  /** Stores the choice. Absent, the checkbox keeps it to itself. */
  onGiftWrap?: (checked: boolean) => void;
  /**
   * Below md, the line price uses the title's weight (medium, 500).
   * From md it stays bold. Only the cart drawer turns this on.
   */
  matchTitleWeight?: boolean;
}) {
  const edition = editionOfCartItem(item);
  const image = mainImage(item.images);
  const minor = item.totals.currency_minor_unit ?? item.prices.currency_minor_unit;
  const lineTotal = fromMinor(item.totals.line_subtotal, minor);
  const max = item.quantity_limits?.maximum ?? 49;
  const title = cartLineTitle(item);

  return (
    <li className="flex items-start gap-2.5 font-condensed md:items-stretch md:gap-4">
      <ProductThumb
        image={image}
        fallback={edition}
        sizes={compact ? "72px" : "104px"}
        className={compact ? "size-[72px]" : "size-[88px] sm:size-[104px]"}
        focus={edition?.id === "bloco" ? plannerPaperFocus(image, edition) : null}
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
            {giftWrap ? <GiftWrapControl checked={giftWrapped} onCheckedChange={onGiftWrap} /> : null}
          </div>
        ) : (
          <span className="text-xs text-text-muted">Quantidade: {unitsLabel(item.quantity)}</span>
        )}
      </div>
      {/* Below md the price centers on the whole row (name, stepper, gift).
          From md it sits a little above the row center. */}
      <span
        className={cn(
          "shrink-0 self-center text-[26px] leading-none tracking-[-0.04em] text-text-strong md:-translate-y-2",
          matchTitleWeight ? "font-medium md:font-bold" : "font-bold",
        )}
      >
        {formatBRL(lineTotal)}
      </span>
    </li>
  );
}
