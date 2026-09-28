"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button, IconCheck, IconClose, IconHeadset, cn } from "@ds/index";
import { EDITIONS, INSTAGRAM_URL, PRODUCT_NAME, WHATSAPP_URL } from "@content/product";
import { getPaymentInstructions, type PaymentInstructions } from "@/lib/commerce/bridge-api";
import { errorMessage } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { trackPurchaseOnce } from "@/lib/tracking/events";
import { PaymentInstructionsPanel, PaymentInstructionsSkeleton, parsePixExpiry } from "./PaymentInstructionsPanel";
import { formatPhone } from "./phone";
import { PixCountdown, PixCountdownSkeleton } from "./PixCountdown";
import { loadReceipt, type OrderReceipt } from "./receipt";

/** How often to ask whether the payment went through, and for how long. */
const POLL_MS = 5000;
const POLL_FOR_MS = 30 * 60 * 1000;
/** Usual Pix validity: the countdown ring's full length when the receipt is missing. */
const PIX_WINDOW_MS = 30 * 60 * 1000;

/**
 * Thank-you page, following the reference: a green "Obrigado" banner with
 * the order number, the Pix countdown and instructions while the payment is
 * open, then the order details (contact, delivery, shipping, payment) beside
 * the summary of what was bought.
 *
 * The URL carries the order (`?order_id=&token=&payment=`, the token being
 * WooCommerce's order key). The bridge answers the payment status and, for
 * Pix, the QR and the copy-and-paste code; the page asks again until the
 * payment lands. The details come from the receipt the checkout saved.
 */
export function ThankYouPage() {
  const params = useSearchParams();
  const orderId = Number(params.get("order_id"));
  const orderKey = params.get("token") ?? "";
  const paymentKind = params.get("payment") ?? "";

  // Only rendered in the browser (useSearchParams bails the page out of the
  // server render up to its Suspense), so reading sessionStorage here is safe.
  const [receipt] = useState<OrderReceipt | null>(() => (orderId && orderKey ? loadReceipt(orderId, orderKey) : null));
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

  const failed = data?.payment_status === "failed";
  const instructions = data?.instructions ?? null;
  const pix = instructions?.type === "pix" ? instructions.pix : null;
  const isPixOrder = paymentKind === "pix" || receipt?.payment.kind === "pix" || Boolean(pix);
  const loading = !data && !error;

  const pixDeadline = pix ? parsePixExpiry(pix.expires_at) : null;
  const placedAt = receipt ? Date.parse(receipt.placedAt) : NaN;
  const pixCountingDown = Boolean(pix) && data?.payment_status === "pending" && pixDeadline != null;

  return (
    <div className="flex flex-col">
      <Banner orderId={orderId} firstName={receipt?.contact.firstName ?? ""} failed={failed} />

      <p className="mx-auto mt-4 max-w-[640px] text-center text-field leading-snug text-text">
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
              totalMs={Number.isNaN(placedAt) ? PIX_WINDOW_MS : Math.max(1, pixDeadline! - placedAt)}
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

      {receipt ? (
        // On a phone the summary comes first: what was bought and the total, right after the banner.
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <OrderDetails receipt={receipt} />
            <Community />
            <HelpRow />
          </div>
          <div className="order-1 lg:order-2 lg:border-l lg:border-border lg:pl-14">
            <ReceiptSummary receipt={receipt} />
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-10 flex w-full max-w-[720px] flex-col gap-6">
          {data && data.total > 0 ? (
            <div className="flex items-baseline justify-between rounded-card border border-border px-5 py-4">
              <span className="text-field text-text-muted">Total do pedido</span>
              <span className="text-h4 text-text-strong">{formatBRL(data.total)}</span>
            </div>
          ) : null}
          <Community />
          <HelpRow />
        </div>
      )}
    </div>
  );
}

/** Green success banner of the reference; terracotta when the payment was refused. */
function Banner({ orderId, firstName, failed }: { orderId: number; firstName: string; failed: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 rounded-card px-6 py-5 sm:py-6",
        failed ? "bg-accent text-text-on-inverse" : "bg-success text-on-success",
      )}
    >
      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-pill border-2 border-current text-h4 sm:size-11">
        {failed ? <IconClose /> : <IconCheck />}
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-label opacity-85">Pedido nº {orderId}</p>
        <h1 className="text-h4">
          {failed ? "Pagamento não concluído" : `Obrigado${firstName ? `, ${firstName}` : ""}!`}
        </h1>
      </div>
    </div>
  );
}

/** Contact / delivery / shipping / payment, the same frame as the checkout review. */
function OrderDetails({ receipt }: { receipt: OrderReceipt }) {
  const { contact, shipping } = receipt;
  const rows: Array<{ label: string; content: React.ReactNode }> = [
    {
      label: "Contato",
      content: (
        <>
          <p>{contact.name}</p>
          {contact.company ? <p className="text-text-muted">{contact.company}</p> : null}
          {contact.phone ? (
            <a href={`tel:${contact.phone}`} className="block text-action underline-offset-4 hover:underline">
              {formatPhone(contact.phone)}
            </a>
          ) : null}
          {contact.email ? (
            <a href={`mailto:${contact.email}`} className="block break-all text-action underline-offset-4 hover:underline">
              {contact.email}
            </a>
          ) : null}
        </>
      ),
    },
    {
      label: "Entrega",
      content: (
        <>
          {receipt.recipient ? <p>Para {receipt.recipient}</p> : null}
          <p className={receipt.recipient ? "text-text-muted" : undefined}>{receipt.address}</p>
        </>
      ),
    },
    {
      label: "Envio",
      content: shipping ? `${shipping.label} — ${shipping.price > 0 ? formatBRL(shipping.price) : "Grátis"}` : "—",
    },
    { label: "Pagamento", content: receipt.payment.label },
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
        <Button href="/" variant="secondary" shape="block" className="h-10 px-5">
          Voltar ao site
        </Button>
        <Button href={INSTAGRAM_URL} target="_blank" rel="noopener" shape="block" className="h-10 px-5">
          Seguir no Instagram
        </Button>
      </div>
    </div>
  );
}

/** What was bought and the totals, frozen at the moment of the order. */
function ReceiptSummary({ receipt }: { receipt: OrderReceipt }) {
  return (
    <section aria-label="Resumo do pedido" className="flex flex-col">
      <ul className="flex flex-col gap-5">
        {receipt.items.map((item) => {
          const edition = EDITIONS.find((e) => e.id === item.edition) ?? null;
          return (
            <li key={item.key} className="flex items-start gap-4">
              {edition ? (
                <Image
                  src={edition.cover}
                  alt=""
                  aria-hidden
                  width={edition.coverSize.width}
                  height={edition.coverSize.height}
                  sizes="48px"
                  className="block h-20 w-auto shrink-0 drop-shadow-md"
                />
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <p className="text-field font-medium text-text-strong">{PRODUCT_NAME}</p>
                <p className="text-label text-text-muted">
                  Edição: <span className="text-text">{edition ? edition.label.replace(/^Edição /, "") : item.name}</span>
                </p>
                <span className="w-fit rounded-xs border border-border px-2 py-0.5 text-fine text-text-muted">
                  × {item.quantity}
                </span>
              </div>
              <p className="text-field font-semibold whitespace-nowrap text-text-strong">{formatBRL(item.total)}</p>
            </li>
          );
        })}
      </ul>

      <dl className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-field text-text-muted">
        <Row label="Subtotal" value={formatBRL(receipt.subtotal)} />
        {receipt.coupon > 0 ? <Row label="Cupom" value={`−${formatBRL(receipt.coupon)}`} tone="action" /> : null}
        {receipt.paymentDiscount > 0 ? (
          <Row label="Desconto por forma de pagamento" value={`−${formatBRL(receipt.paymentDiscount)}`} tone="action" />
        ) : null}
        {receipt.shipping ? (
          <div className="flex justify-between gap-4">
            <dt>Entrega</dt>
            <dd className="text-right text-text-strong">
              {receipt.shipping.price > 0 ? formatBRL(receipt.shipping.price) : "Grátis"}{" "}
              <span className="text-text-muted">via {receipt.shipping.label}</span>
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
        <span className="text-h4 text-text-strong">Total</span>
        <span className="flex items-baseline gap-2">
          <span className="rounded-sm bg-surface-muted px-1.5 py-0.5 text-caption font-medium text-text-muted uppercase">BRL</span>
          <span className="text-h4 text-text-strong">{formatBRL(receipt.total)}</span>
        </span>
      </div>
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
