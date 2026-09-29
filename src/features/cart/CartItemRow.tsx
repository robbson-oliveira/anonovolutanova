"use client";

import { IconMinus, IconPlus } from "@ds/index";
import { editionOfCartItem } from "@/lib/commerce/editions";
import { mainImage } from "@/lib/commerce/product-image";
import { fromMinor, type StoreCartItem } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { ProductThumb } from "./ProductThumb";

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
}: {
  item: StoreCartItem;
  busy: boolean;
  onQuantity?: (quantity: number) => void;
  compact?: boolean;
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
          <div className="inline-flex h-9 w-fit items-center rounded-card border border-border bg-surface-plain">
            <button
              type="button"
              disabled={busy}
              onClick={() => onQuantity(item.quantity - 1)}
              aria-label={item.quantity === 1 ? `Remover ${edition?.label ?? item.name}` : "Diminuir quantidade"}
              className="grid h-full w-9 cursor-pointer place-items-center text-text-strong disabled:cursor-wait disabled:opacity-50"
            >
              <IconMinus />
            </button>
            <span className="w-8 text-center text-sm font-bold text-text-strong" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              disabled={busy || item.quantity >= max}
              onClick={() => onQuantity(item.quantity + 1)}
              aria-label="Aumentar quantidade"
              className="grid h-full w-9 cursor-pointer place-items-center text-text-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconPlus />
            </button>
          </div>
        ) : (
          <span className="text-xs text-text-muted">Quantidade: {item.quantity}</span>
        )}
      </div>
      <span className="text-sm font-bold text-text-strong">{formatBRL(lineTotal)}</span>
    </li>
  );
}
