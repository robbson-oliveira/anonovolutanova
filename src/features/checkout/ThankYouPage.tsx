"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, IconCheck, IconClose, IconHeadset, cn } from "@ds/index";
import { INSTAGRAM_URL, PRODUCT_NAME, WHATSAPP_URL } from "@content/product";
import { getPaymentInstructions, type OrderSummary, type PaymentInstructions } from "@/lib/commerce/bridge-api";
import { ProductThumb } from "@/features/cart/ProductThumb";
import { onlyDigits } from "@/lib/commerce/br";
import { editionOfCartItem } from "@/lib/commerce/editions";
import { mainImage } from "@/lib/commerce/product-image";
import { errorMessage } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { trackPurchaseOnce } from "@/lib/tracking/events";
import { PaymentInstructionsPanel, PaymentInstructionsSkeleton, parsePixExpiry } from "./PaymentInstructionsPanel";
import { formatPhone } from "./phone";
import { PixCountdown, PixCountdownSkeleton } from "./PixCountdown";
import { addressLine } from "./state";

/** How often to ask whether the payment went through, and for how long. */
const POLL_MS = 5000;
const POLL_FOR_MS = 30 * 60 * 1000;
/** Usual Pix validity: the countdown ring's full length when the order date is unknown. */
const PIX_WINDOW_MS = 30 * 60 * 1000;
const PIX_COUNTDOWN_MAX_MS = 24 * 60 * 60 * 1000;

/**
 * Thank-you page, following the reference: a green "Obrigado" banner with
 * the order number, the Pix countdown and instructions while the payment is
 * open, then the order details (contact, delivery, shipping, payment) beside
 * the summary of what was bought.
 *
 * The URL carries the order (`?order_id=&token=&payment=`, the token being
 * WooCommerce's order key). The bridge answers the payment status, the Pix
 * QR and copy-and-paste code, and the order summary; the page asks again
 * until the payment lands.
 */
export function ThankYouPage() {
  const params = useSearchParams();
  const orderId = Number(params.get("order_id"));
  const orderKey = params.get("token") ?? "";
  const paymentKind = params.get("payment") ?? "";

  const [data, setData] = useState<PaymentInstructions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !orderKey) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const started = Date.now();

    const poll = async () => {
      try {
        const next = await getPaymentInstructions(orderId, orderKey);
        if (stopped) return;
        setData(next);
        setError(null);
        if (next.payment_status !== "pending" || Date.now() - started > POLL_FOR_MS) return;
      } catch (err) {
        if (stopped) return;
        setError(errorMessage(err, "Não conseguimos consultar o pedido agora."));
      }
      timer = setTimeout(poll, POLL_MS);
    };
    void poll();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [orderId, orderKey]);

  // purchase: once per order, when the payment is confirmed.
  const paid = data?.payment_status === "paid";
  useEffect(() => {
    if (paid) trackPurchaseOnce(orderId);
  }, [paid, orderId]);

  if (!orderId || !orderKey) {
    return (
      <div className="flex flex-col items-center gap-3 py-section-sm text-center">
        <h1 className="text-h4 text-text-strong">Pedido não encontrado</h1>
        <p className="text-field text-text-muted">Se você acabou de comprar, confira o e-mail de confirmação.</p>
      </div>
    );
  }

  const order = data?.order ?? null;
  const failed = data?.payment_status === "failed";
  const instructions = data?.instructions ?? null;
  const pix = instructions?.type === "pix" ? instructions.pix : null;
  const isPixOrder = paymentKind === "pix" || Boolean(pix);
  const loading = !data && !error;

  const pixDeadline = pix ? parsePixExpiry(pix.expires_at) : null;
  const placedAt = order ? Date.parse(order.created_at) : NaN;
  // Asaas dates the QR Code a year past the due date: a countdown that long
  // says nothing, so the ring only shows for a window of up to a day.
  const pixWindowMs = pixDeadline == null || Number.isNaN(placedAt) ? PIX_WINDOW_MS : Math.max(1, pixDeadline - placedAt);
  const pixCountingDown =
    Boolean(pix) && data?.payment_status === "pending" && pixDeadline != null && pixWindowMs <= PIX_COUNTDOWN_MAX_MS;

  return (
    <div className="flex flex-col">
      <Banner number={order?.number ?? String(orderId)} firstName={order?.customer.first_name.trim() ?? ""} failed={failed} />

      <p className="mt-4 text-center text-field leading-snug text-text">
        {paid
          ? `Sua ${PRODUCT_NAME} já está reservada. Enviamos a confirmação por e-mail e avisamos quando o pedido sair para entrega.`
          : failed
            ? "O pedido foi registrado, mas o pagamento não foi aprovado. Fale com a gente pelo WhatsApp que ajudamos a concluir."
            : pix
              ? "Falta só o pagamento: use o QR Code ou o código abaixo. A confirmação aparece aqui sozinha."
              : loading
                ? "Consultando o pedido…"
                : "Estamos confirmando o pagamento. Esta página se atualiza sozinha."}
      </p>
      {error ? (
        <p role="alert" className="mt-2 text-center text-label text-accent">
          {error}
        </p>
      ) : null}

      {isPixOrder && (loading || pixCountingDown) ? (
        <div className="mt-6">
          {loading ? (
            <PixCountdownSkeleton />
          ) : (
            <PixCountdown
              deadline={pixDeadline!}
              totalMs={pixWindowMs}
            />
          )}
        </div>
      ) : null}

      {isPixOrder && loading ? (
        <div className="mt-6">
          <PaymentInstructionsSkeleton />
        </div>
      ) : instructions && data ? (
        <div className="mt-6">
          <PaymentInstructionsPanel instructions={instructions} status={data.payment_status} />
        </div>
      ) : null}

      {/* On a phone the summary comes first: what was bought and the total, right after the banner. */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          {order ? <OrderDetails order={order} /> : loading ? <DetailsSkeleton /> : null}
          <Community />
          <HelpRow />
        </div>
        <div className="order-1 lg:order-2 lg:border-l lg:border-border lg:pl-14">
          {order ? (
            <OrderItems order={order} />
          ) : loading ? (
            <ItemsSkeleton />
          ) : data ? (
            // Bridge older than 0.5.0: no summary, only the total.
            <TotalRow total={data.total} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Green success banner of the reference; terracotta when the payment was refused. */
function Banner({ number, firstName, failed }: { number: string; firstName: string; failed: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 rounded-card px-6 py-5 sm:py-6",
        failed ? "bg-accent text-text-on-inverse" : "bg-success text-on-success",
      )}
    >
      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-pill border-2 border-current text-h4 sm:size-12">
        {failed ? <IconClose /> : <IconCheck />}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-label leading-tight opacity-90">Pedido nº {number}</p>
        {/* text-current: the base style paints every heading dark green. */}
        <h1 className="text-h3 text-current">
          {failed ? "Pagamento não concluído" : `Obrigado${firstName ? `, ${firstName}` : ""}!`}
        </h1>
      </div>
    </div>
  );
}

const fullName = (first: string, last: string) => `${first} ${last}`.trim();

/** "Frete grátis" already says the price; repeating "Grátis" next to it reads twice. */
const isFreeMethod = (method: string) => /gr[aá]tis/i.test(method);

/** Contact / delivery / shipping / payment, the same frame as the checkout review. */
function OrderDetails({ order }: { order: OrderSummary }) {
  const { customer, shipping_address: to, shipping } = order;
  const buyer = fullName(customer.first_name, customer.last_name);
  const recipient = fullName(to.first_name, to.last_name);
  const giftTo = recipient && recipient !== buyer ? recipient : "";
  const address = addressLine({ ...to, postcode: onlyDigits(to.postcode) });

  const rows: Array<{ label: string; content: React.ReactNode }> = [
    {
      label: "Contato",
      content: (
        <>
          <p>{buyer}</p>
          {customer.company ? <p className="text-text-muted">{customer.company}</p> : null}
          {customer.phone ? (
            <a href={`tel:${customer.phone.replace(/[^\d+]/g, "")}`} className="block text-action underline-offset-4 hover:underline">
              {formatPhone(customer.phone)}
            </a>
          ) : null}
          {customer.email ? (
            <a href={`mailto:${customer.email}`} className="block break-all text-action underline-offset-4 hover:underline">
              {customer.email}
            </a>
          ) : null}
        </>
      ),
    },
    {
      label: "Entrega",
      content: (
        <>
          {giftTo ? <p>Para {giftTo}</p> : null}
          <p className={giftTo ? "text-text-muted" : undefined}>{address}</p>
        </>
      ),
    },
    {
      label: "Envio",
      content: !shipping
        ? "—"
        : shipping.total > 0
          ? `${shipping.method} — ${formatBRL(shipping.total)}`
          : isFreeMethod(shipping.method)
            ? shipping.method
            : `${shipping.method} — Grátis`,
    },
    { label: "Pagamento", content: order.payment_method.title || "—" },
  ];

  return (
    <dl className="divide-y divide-border rounded-card border border-border bg-surface-plain">
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-4 px-4 py-4 sm:px-5">
          <dt className="w-20 shrink-0 text-field text-text-muted sm:w-24">{row.label}</dt>
          <dd className="min-w-0 flex-1 text-field break-words text-text-strong">{row.content}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Closing with an invitation to take part, as the brand voice asks. */
function Community() {
  return (
    <div className="flex flex-col gap-1 rounded-card bg-surface-warm px-5 py-4">
      <p className="text-field font-medium text-text-strong">
        A santidade se constrói nas pequenas coisas, um dia de cada vez.
      </p>
      <p className="text-label text-text-muted">
        Acompanhe a comunidade da Agenda Ano Novo, Luta Nova no Instagram.
      </p>
    </div>
  );
}

function HelpRow() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 text-label whitespace-nowrap text-text-muted">
        <IconHeadset className="shrink-0" />
        <span>
          Precisa de ajuda?{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="font-semibold text-text-strong underline-offset-4 hover:underline">
            Falar no WhatsApp
          </a>
        </span>
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/" variant="secondary" shape="block" className="h-10! px-4! text-label!">
          Voltar ao site
        </Button>
        <Button href={INSTAGRAM_URL} target="_blank" rel="noopener" shape="block" className="h-10! px-4! text-label!">
          Seguir no Instagram
        </Button>
      </div>
    </div>
  );
}

/** What was bought and the totals, as WooCommerce recorded them. */
function OrderItems({ order }: { order: OrderSummary }) {
  const { totals } = order;
  return (
    <section aria-label="Resumo do pedido" className="flex flex-col">
      <ul className="flex flex-col gap-5">
        {order.items.map((item) => {
          const edition = editionOfCartItem({
            variation: item.attributes.map((a) => ({ attribute: a.name, value: a.value })),
            name: item.name,
          });
          return (
            <li key={item.id} className="flex items-start gap-4">
              <ProductThumb
                image={mainImage(item.image ? [{ src: item.image }] : [])}
                fallback={edition}
                sizes="80px"
                className="size-20"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <p className="text-field font-medium text-text-strong">{PRODUCT_NAME}</p>
                <p className="text-label text-text-muted">
                  Edição: <span className="text-text">{edition ? edition.label.replace(/^Edição /, "") : item.name}</span>
                </p>
                <span className="w-fit rounded-xs border border-border px-2 py-0.5 text-fine text-text-muted">
                  × {item.quantity}
                </span>
              </div>
              <p className="text-field font-semibold whitespace-nowrap text-text-strong">{formatBRL(item.subtotal)}</p>
            </li>
          );
        })}
      </ul>

      <dl className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-field text-text-muted">
        <Row label="Subtotal" value={formatBRL(totals.subtotal)} />
        {totals.discount > 0 ? <Row label="Cupom" value={`−${formatBRL(totals.discount)}`} tone="action" /> : null}
        {order.fees.map((fee, i) =>
          fee.total < 0 ? (
            <Row key={i} label={fee.name} value={`−${formatBRL(-fee.total)}`} tone="action" />
          ) : (
            <Row key={i} label={fee.name} value={formatBRL(fee.total)} />
          ),
        )}
        {order.shipping ? (
          <div className="flex justify-between gap-4">
            <dt>Entrega</dt>
            <dd className="text-right text-text-strong">
              {order.shipping.total > 0 ? formatBRL(order.shipping.total) : "Grátis"}
              {order.shipping.total > 0 || !isFreeMethod(order.shipping.method) ? (
                <span className="text-text-muted"> via {order.shipping.method}</span>
              ) : null}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-5 border-t border-border pt-5">
        <TotalRow total={totals.total} />
      </div>
    </section>
  );
}

function TotalRow({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-h4 text-text-strong">Total</span>
      <span className="flex items-baseline gap-2">
        <span className="rounded-sm bg-surface-muted px-1.5 py-0.5 text-caption font-medium text-text-muted uppercase">BRL</span>
        <span className="text-h4 text-text-strong">{formatBRL(total)}</span>
      </span>
    </div>
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

const bar = "animate-pulse rounded-sm bg-surface-muted";

/** Placeholders with the shape of the details frame while the order is read. */
function DetailsSkeleton() {
  return (
    <div aria-hidden className="divide-y divide-border rounded-card border border-border">
      {[3, 1, 1, 1].map((lines, i) => (
        <div key={i} className="flex gap-4 px-4 py-4 sm:px-5">
          <span className={cn(bar, "h-4 w-20 shrink-0")} />
          <span className="flex flex-1 flex-col gap-2">
            {Array.from({ length: lines }, (_, j) => (
              <span key={j} className={cn(bar, "h-4 w-full max-w-64")} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

function ItemsSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-5">
      <div className="flex gap-4">
        <span className={cn(bar, "h-20 w-14 shrink-0")} />
        <span className="flex flex-1 flex-col gap-2">
          <span className={cn(bar, "h-4 w-full max-w-52")} />
          <span className={cn(bar, "h-4 w-24")} />
        </span>
      </div>
      <span className={cn(bar, "mt-2 h-4 w-full")} />
      <span className={cn(bar, "h-4 w-full")} />
      <span className={cn(bar, "mt-2 h-6 w-full")} />
    </div>
  );
}
