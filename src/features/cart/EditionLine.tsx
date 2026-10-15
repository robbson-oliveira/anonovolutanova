"use client";

import { Button, IconCheck, IconMinus, IconPlus, cn } from "@ds/index";
import { PRODUCT_NAME } from "@content/product";
import type { EditionOffer } from "@/lib/commerce/offer-types";
import { fromMinor, type StoreCartItem } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { ProductThumb } from "./ProductThumb";

/** Above this it is resale: handled on WhatsApp (B2B from 50 units). */
const MAX_QTY = 49;

type EditionLineProps = {
  edition: EditionOffer;
  /** Unit price from the offer, shown before the edition is in the cart. */
  price: number;
  /** The edition's line in the cart, if it is there. */
  line: StoreCartItem | null;
  busy: boolean;
  onAdd: () => void;
  onQuantity: (quantity: number) => void;
};

/**
 * One edition on the cart page, in the shape of the reference's cart items:
 * miniature, name, stock, quantity and line total. Choosing the edition and
 * editing the cart are the same gesture: "Adicionar" puts one unit in the
 * WooCommerce cart, and the stepper changes that line from then on.
 */
export function EditionLine({ edition, price, line, busy, onAdd, onQuantity }: EditionLineProps) {
  const quantity = line?.quantity ?? 0;
  const max = line?.quantity_limits?.maximum ?? MAX_QTY;
  const minor = line ? (line.totals.currency_minor_unit ?? line.prices.currency_minor_unit) : 2;
  const total = line ? fromMinor(line.totals.line_subtotal, minor) : price;

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-card border border-border bg-surface-plain p-4 shadow-subtle sm:p-5",
        !edition.inStock && "opacity-60",
      )}
    >
      <div className="flex gap-4 sm:gap-5">
        <ProductThumb image={edition.image} fallback={edition} sizes="(min-width: 640px) 112px, 80px" className="size-20 sm:size-28" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-field font-bold text-text-strong">{edition.label}</h3>
            <span className="text-field font-bold whitespace-nowrap text-text-strong">{formatBRL(total)}</span>
          </div>
          <p className="text-label text-text-muted">{PRODUCT_NAME}</p>
          <p className="text-label leading-snug text-text">{edition.description}</p>
          {quantity > 1 ? <p className="text-fine text-text-muted">{formatBRL(price)} cada</p> : null}
        </div>
      </div>

      {/* Under the text on larger screens (112px miniature + 20px gap); full width on the phone. */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:pl-[132px]">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-fine font-semibold",
            edition.inStock ? "bg-success-soft text-on-success-soft" : "bg-surface-muted text-text-muted",
          )}
        >
          {edition.inStock ? <IconCheck /> : null}
          {edition.inStock ? "Em estoque" : "Esgotada"}
        </span>

        {quantity > 0 ? (
          <div className="flex items-center gap-4">
            <div
              role="group"
              aria-label={`Quantidade da ${edition.label}`}
              className="inline-flex h-10 items-center rounded-pill border border-border bg-surface-plain"
            >
              <button
                type="button"
                disabled={busy}
                onClick={() => onQuantity(quantity - 1)}
                aria-label={quantity === 1 ? `Remover a ${edition.label}` : "Diminuir quantidade"}
                className="grid h-full w-10 cursor-pointer place-items-center text-text-strong disabled:cursor-wait disabled:opacity-40"
              >
                <IconMinus />
              </button>
              <span className="w-8 text-center text-field font-semibold text-text-strong" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                disabled={busy || quantity >= max}
                onClick={() => onQuantity(quantity + 1)}
                aria-label="Aumentar quantidade"
                className="grid h-full w-10 cursor-pointer place-items-center text-text-strong disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconPlus />
              </button>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => onQuantity(0)}
              className="cursor-pointer text-label text-text-muted underline-offset-4 hover:text-text-strong hover:underline disabled:cursor-wait"
            >
              Remover
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            shape="pill"
            disabled={busy || !edition.inStock || !edition.productId}
            onClick={onAdd}
            className="h-10 px-5 text-label"
          >
            <IconPlus />
            Adicionar
          </Button>
        )}
      </div>
    </li>
  );
}
