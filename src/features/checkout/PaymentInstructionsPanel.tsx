"use client";

import { useState } from "react";
import { Button, IconCheck, IconClock, IconCopy, IconExternal, IconPix, cn } from "@ds/index";
import type { PaymentInstructions } from "@/lib/commerce/bridge-api";

type Instructions = NonNullable<PaymentInstructions["instructions"]>;
type Pix = Extract<Instructions, { type: "pix" }>["pix"];
type PaymentStatus = PaymentInstructions["payment_status"];

const PIX_STEPS = [
  "Abra o app do seu banco e entre na área Pix.",
  "Escolha pagar com QR Code ou com Pix copia e cola.",
  "Escaneie o código ou cole o código copiado.",
  "Confira os dados e conclua o pagamento.",
];

/** The bridge sends the expiry as "Y-m-d H:i:s" (or ISO); null when it does not parse. */
export function parsePixExpiry(raw: string): number | null {
  if (!raw) return null;
  const ms = Date.parse(raw.replace(" ", "T"));
  return Number.isNaN(ms) ? null : ms;
}

type PaymentInstructionsPanelProps = {
  instructions: Instructions;
  status: PaymentStatus;
};

/**
 * What the buyer still has to do to pay, as in the reference: the Pix QR
 * Code with the copy-and-paste code and the steps, or the boleto link, with
 * a badge that follows the payment status while the page polls the bridge.
 */
export function PaymentInstructionsPanel({ instructions, status }: PaymentInstructionsPanelProps) {
  const pix = instructions.type === "pix";

  return (
    <section aria-labelledby="payment-instructions" className="rounded-card border border-border bg-surface-plain p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="payment-instructions" className="flex items-center gap-2 text-field font-semibold text-text-strong">
          {pix ? <IconPix className="shrink-0 text-action" /> : null}
          {status === "paid"
            ? pix
              ? "Pagamento com Pix"
              : "Pagamento com boleto"
            : pix
              ? "Pague com Pix para confirmar o pedido"
              : "Pague o boleto para confirmar o pedido"}
        </h2>
        <StatusBadge status={status} />
      </div>

      {status === "paid" ? (
        <p className="mt-3 text-label text-text-muted">
          Recebemos a confirmação do pagamento. Seu pedido já está sendo preparado.
        </p>
      ) : instructions.type === "pix" ? (
        <PixBody pix={instructions.pix} />
      ) : (
        <BoletoBody url={instructions.boleto.url} digitableLine={instructions.boleto.digitable_line ?? ""} />
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const base = "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-pill px-3 py-1 text-fine font-medium";
  if (status === "paid") {
    return (
      <span className={cn(base, "bg-success text-on-success")}>
        <IconCheck />
        Pagamento confirmado
      </span>
    );
  }
  if (status === "failed") {
    return <span className={cn(base, "bg-accent-track text-accent")}>Pagamento não concluído</span>;
  }
  return (
    <span className={cn(base, "bg-surface-accent-soft text-text-strong")}>
      <IconClock className="animate-pulse" />
      Aguardando pagamento
    </span>
  );
}

/** Read-only code with a copy button: the Pix copy-and-paste code or the boleto's linha digitável. */
function CopyField({ id, label, value, display }: { id: string; label: string; value: string; display?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // No clipboard permission: the code is still selectable in the field.
    }
  };

  return (
    <>
      <label htmlFor={id} className="text-fine font-medium text-text-muted">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          readOnly
          value={display ?? value}
          onFocus={(e) => e.currentTarget.select()}
          className="h-11 min-w-0 flex-1 rounded-xs border border-border bg-surface-muted px-3 font-mono text-fine text-text-strong"
        />
        <Button type="button" shape="block" onClick={() => void copy()} className="shrink-0 px-4! text-label!">
          {copied ? <IconCheck /> : <IconCopy />}
          {copied ? "Copiado" : "Copiar código"}
        </Button>
      </div>
    </>
  );
}

function PixBody({ pix }: { pix: Pix }) {
  const expires = parsePixExpiry(pix.expires_at);

  return (
    <div className="mt-5 grid items-start gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
      {pix.qr_code_base64 ? (
        // Base64 QR from the gateway: nothing for the image optimizer to do.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/png;base64,${pix.qr_code_base64}`}
          alt="QR Code do Pix"
          width={176}
          height={176}
          className="mx-auto size-44 rounded-xs border border-border bg-surface-plain p-2 sm:mx-0"
        />
      ) : null}

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <CopyField id="pix-code" label="Pix copia e cola" value={pix.qr_code} />
          {expires ? (
            <p className="text-fine text-text-muted">
              Este código expira em{" "}
              {new Date(expires).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}.
            </p>
          ) : null}
        </div>

        <ol className="flex flex-col gap-2">
          {PIX_STEPS.map((step, i) => (
            <li key={step} className="flex gap-2.5 text-fine text-text-muted">
              <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-pill bg-selection text-caption font-semibold text-action">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * "00190.00009 02819.136009 66281.313172 6 00000000010000", the grouping
 * printed on the boleto, from the 47 digits; anything else as it came.
 */
function formatDigitableLine(line: string): string {
  const m = /^(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d)(\d{14})$/.exec(line);
  return m ? `${m[1]}.${m[2]} ${m[3]}.${m[4]} ${m[5]}.${m[6]} ${m[7]} ${m[8]}` : line;
}

/** The boleto link, and the linha digitável to copy when the gateway sends it (bridge 0.5.0+, Asaas Store API). */
function BoletoBody({ url, digitableLine }: { url: string; digitableLine: string }) {
  return (
    <div className="mt-5 flex flex-col items-start gap-3">
      <p className="text-label text-text-muted">
        {digitableLine
          ? "Seu boleto foi gerado. Copie a linha digitável para pagar no app do banco, ou abra o boleto para pagar em qualquer banco ou lotérica."
          : "Seu boleto foi gerado. Abra o boleto para pagar no app do banco, em qualquer banco ou lotérica."}
      </p>
      {digitableLine ? (
        <div className="flex w-full flex-col gap-1.5">
          <CopyField id="boleto-line" label="Linha digitável" value={digitableLine} display={formatDigitableLine(digitableLine)} />
        </div>
      ) : null}
      <Button href={url} target="_blank" rel="noopener noreferrer" shape="block">
        <IconExternal />
        Visualizar boleto
      </Button>
      <p className="text-fine text-text-muted">A confirmação do boleto pode levar até 2 dias úteis.</p>
    </div>
  );
}

/** Placeholder with the Pix panel's shape while the order is read. */
export function PaymentInstructionsSkeleton() {
  const bar = "animate-pulse rounded-sm bg-surface-muted";
  return (
    <div aria-hidden className="rounded-card border border-border bg-surface-plain p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className={cn(bar, "h-5 w-56 sm:w-72")} />
        <span className={cn(bar, "h-6 w-40 rounded-pill")} />
      </div>
      <div className="mt-5 grid items-start gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
        <span className={cn(bar, "mx-auto size-44 sm:mx-0")} />
        <div className="flex flex-col gap-4">
          <span className={cn(bar, "h-11 w-full")} />
          {PIX_STEPS.map((step) => (
            <span key={step} className={cn(bar, "h-3 w-full max-w-xs")} />
          ))}
        </div>
      </div>
    </div>
  );
}
