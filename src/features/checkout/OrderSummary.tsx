"use client";

import { IconBasket, IconClose, IconMinus, IconPlus } from "@ds/index";
import { PRODUCT_NAME } from "@content/product";
import { useCart } from "@/features/cart/CartProvider";
import { CouponForm } from "@/features/cart/CouponForm";
import { ProductThumb } from "@/features/cart/ProductThumb";
import { editionOfCartItem } from "@/lib/commerce/editions";
import { mainImage } from "@/lib/commerce/product-image";
import { fromMinor, type StoreCartItem } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";

/**
 * Resumo do pedido, no padrão da referência: "Carrinho" com contador, itens
 * com capa, edição, quantidade e remover, cupom, e os totais com o desconto
 * da forma de pagamento. Os valores vêm do carrinho do WooCommerce; o
 * desconto do Pix é calculado com a mesma regra que o plugin aplica ao pedido.
 */
export function OrderSummary({
  pixDiscount,
  shippingKnown,
}: {
  /** Desconto do Pix, quando Pix está escolhido e o gateway tem desconto. */
  pixDiscount: number;
  /** Já há um frete escolhido? Antes disso o total não inclui entrega. */
  shippingKnown: boolean;
}) {
  const { cart, count, busy, setQuantity } = useCart();
  if (!cart) return null;

  const minor = cart.totals.currency_minor_unit;
  const items = fromMinor(cart.totals.total_items, minor);
  const coupon = fromMinor(cart.totals.total_discount, minor);
  const shipping = fromMinor(cart.totals.total_shipping, minor);
  // Antes do endereço o WooCommerce já soma um frete estimado (pelo endereço
  // da loja). Até a entrega ser escolhida, o total mostrado não o inclui.
  const total = fromMinor(cart.totals.total_price, minor) - (shippingKnown ? 0 : shipping) - pixDiscount;

  return (
    <section aria-label="Resumo do pedido" className="flex flex-col gap-6">
      <h2 className="flex items-center gap-3 text-h4 text-text-strong">
        <IconBasket className="text-action" />
        Carrinho
        <span className="grid min-w-7 place-items-center rounded-pill bg-action px-2 py-0.5 text-label font-bold text-on-action">
          {count}
        </span>
      </h2>

      <ul className="flex flex-col gap-6">
        {cart.items.map((item) => (
          <SummaryItem key={item.key} item={item} busy={busy} onQuantity={(q) => void setQuantity(item.key, q)} />
        ))}
      </ul>

      <CouponForm />

      <dl className="flex flex-col gap-3 border-t border-border pt-5 text-field text-text-muted">
        <Row label="Subtotal" value={formatBRL(items)} />
        {coupon > 0 ? <Row label="Cupom" value={`−${formatBRL(coupon)}`} tone="action" /> : null}
        {pixDiscount > 0 ? (
          <Row label="Desconto por forma de pagamento" value={`−${formatBRL(pixDiscount)}`} tone="action" />
        ) : null}
        <Row label="Frete" value={shippingKnown ? (shipping > 0 ? formatBRL(shipping) : "Grátis") : "A calcular"} />
        <div className="mt-2 flex items-baseline justify-between border-t border-border pt-5">
          <dt className="text-h4 text-text-strong">Total</dt>
          <dd className="text-stat text-text-strong">{formatBRL(total)}</dd>
        </div>
      </dl>
    </section>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "action" }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd className={tone === "action" ? "text-action" : "text-text-strong"}>{value}</dd>
    </div>
  );
}

function SummaryItem({
  item,
  busy,
  onQuantity,
}: {
  item: StoreCartItem;
  busy: boolean;
  onQuantity: (quantity: number) => void;
}) {
  const edition = editionOfCartItem(item);
  const minor = item.totals.currency_minor_unit ?? item.prices.currency_minor_unit;
  const max = item.quantity_limits?.maximum ?? 49;
  const label = edition?.label ?? item.name;

  return (
    <li className="flex gap-4">
      <ProductThumb image={mainImage(item.images)} fallback={edition} sizes="96px" className="size-24" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <span className="text-field font-medium text-text-strong">{PRODUCT_NAME}</span>
          <button
            type="button"
            disabled={busy}
            onClick={() => onQuantity(0)}
            aria-label={`Remover ${label}`}
            className="grid size-7 shrink-0 cursor-pointer place-items-center text-lead text-text-muted hover:text-text-strong disabled:cursor-wait"
          >
            <IconClose />
          </button>
        </div>
        <span className="text-label text-text-muted">
          Edição: <span className="text-text">{edition ? edition.label.replace(/^Edição /, "") : item.name}</span>
        </span>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="inline-flex h-8 items-center rounded-card border border-border bg-surface-plain">
            <button
              type="button"
              disabled={busy || item.quantity <= 1}
              onClick={() => onQuantity(item.quantity - 1)}
              aria-label="Diminuir quantidade"
              className="grid h-full w-8 cursor-pointer place-items-center text-text-strong disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconMinus />
            </button>
            <span className="w-7 text-center text-label font-semibold text-text-strong" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              disabled={busy || item.quantity >= max}
              onClick={() => onQuantity(item.quantity + 1)}
              aria-label="Aumentar quantidade"
              className="grid h-full w-8 cursor-pointer place-items-center text-text-strong disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconPlus />
            </button>
          </div>
          <span className="text-field font-semibold text-text-strong">
            {formatBRL(fromMinor(item.totals.line_subtotal, minor))}
          </span>
        </div>
      </div>
    </li>
  );
}
