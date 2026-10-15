"use client";

import { useId, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Heading, IconCheck, IconClose, IconMapPin, cn } from "@ds/index";
import { whatsappUrlWith } from "@content/product";
import { maskCep } from "@/lib/commerce/br";
import { deliveryDateLabel, ratePriceLabel, type ShippingRate } from "@/lib/commerce/shipping-api";
import { CepForm, Spinner } from "./CepForm";

export type FreeShippingSummary = {
  qualifies: boolean;
  /** Unidades que faltam para o frete grátis nesta linha. */
  remaining: number;
  minQty: number;
};

type ShippingOptionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** CEP da cotação na tela (8 dígitos), ou "" antes da primeira. */
  cep: string;
  /** UF do CEP, quando a loja devolveu. */
  state: string;
  /** Da mais barata para a mais cara. */
  rates: ShippingRate[];
  selectedRateId: string | null;
  onSelectRate: (rate: ShippingRate) => void;
  pending: boolean;
  /** Erro da troca de CEP (mostrado junto do campo). */
  cepError: string | null;
  /** Erro da cotação da linha atual (falha de rede, limite de consultas). */
  quoteError: string | null;
  freeShipping: FreeShippingSummary;
  onSubmitCep: (digits: string) => Promise<boolean>;
};

/** Prazo de uma forma de entrega na lista do modal. */
function deliveryLine(rate: ShippingRate): string | null {
  const date = deliveryDateLabel(rate);
  if (date) return rate.is_free ? `Chegará grátis até ${date}` : `Receba até ${date}`;
  const days = rate.delivery.days;
  if (days) return `Entrega em até ${days} ${days === 1 ? "dia" : "dias"}`;
  return null;
}

/**
 * Modal "Formas de entrega": todas as taxas da cotação, a troca de CEP e a
 * escolha da forma de entrega (guardada para o checkout marcar a mesma).
 * Quem busca e guarda é o ShippingEstimate; aqui é só apresentação.
 */
export function ShippingOptionsDialog({
  open,
  onOpenChange,
  cep,
  state,
  rates,
  selectedRateId,
  onSelectRate,
  pending,
  cepError,
  quoteError,
  freeShipping,
  onSubmitCep,
}: ShippingOptionsDialogProps) {
  const groupName = useId();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-surface-inverse/50" />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col",
            "overflow-y-auto rounded-card bg-surface-plain shadow-float focus:outline-none",
          )}
        >
          <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <Dialog.Title asChild>
              <Heading as="h2" level="card">
                Formas de entrega
              </Heading>
            </Dialog.Title>
            <Dialog.Close
              aria-label="Fechar"
              className="grid size-10 shrink-0 cursor-pointer place-items-center text-xl text-text-strong"
            >
              <IconClose />
            </Dialog.Close>
          </header>

          <div className="flex flex-col gap-6 px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-3">
              <Dialog.Description className="text-label text-text-strong">
                {cep ? "Custos e prazos calculados para este endereço:" : "Informe o CEP para calcular custos e prazos."}
              </Dialog.Description>
              {/* Remonta quando o CEP cotado muda: a troca deu certo, o campo fecha. */}
              <CepSection
                key={cep}
                cep={cep}
                state={state}
                pending={pending}
                error={cepError}
                onSubmitCep={onSubmitCep}
              />
            </div>

            {quoteError ? (
              <p role="alert" className="text-label text-accent">
                {quoteError}
              </p>
            ) : null}

            {pending && !rates.length ? (
              <p className="flex items-center gap-2 text-label text-text-muted">
                <Spinner />
                Calculando as formas de entrega…
              </p>
            ) : null}

            {cep && !pending && !quoteError && !rates.length ? (
              <p className="text-label leading-relaxed text-text-muted">
                Ainda não temos uma forma de entrega calculada para este CEP.{" "}
                <a
                  href={whatsappUrlWith(`Olá! Quero saber o frete da agenda para o CEP ${maskCep(cep)}.`)}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-action underline underline-offset-4"
                >
                  Fale com a gente pelo WhatsApp
                </a>
                .
              </p>
            ) : null}

            {rates.length ? (
              <fieldset
                aria-busy={pending || undefined}
                className={cn(
                  "flex flex-col gap-3 transition-opacity [transition-duration:var(--duration-fast)]",
                  pending && "opacity-60",
                )}
              >
                <legend className="mb-3 text-label font-semibold text-text-strong">Escolha como receber</legend>
                {rates.map((rate) => {
                  const active = rate.id === selectedRateId;
                  const line = deliveryLine(rate);
                  return (
                    <label
                      key={rate.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-card border bg-surface-plain px-4 py-3.5",
                        "transition-colors [transition-duration:var(--duration-fast)]",
                        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-action",
                        active ? "border-action" : "border-border hover:border-action/50",
                      )}
                    >
                      <input
                        type="radio"
                        name={groupName}
                        value={rate.id}
                        checked={active}
                        onChange={() => onSelectRate(rate)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-pill border",
                          active ? "border-action bg-action text-on-action" : "border-border text-transparent",
                        )}
                      >
                        <IconCheck />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-field font-semibold text-text-strong">{rate.label}</span>
                        {line ? <span className="text-label text-text-muted">{line}</span> : null}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-field font-semibold",
                          rate.is_free ? "text-action" : "text-text-strong",
                        )}
                      >
                        {ratePriceLabel(rate)}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            ) : null}

            <p className="text-label text-text-muted" aria-live="polite">
              {freeShipping.qualifies
                ? "Este pedido já tem frete grátis."
                : `Frete grátis a partir de ${freeShipping.minQty} unidades.` +
                  (freeShipping.remaining > 0
                    ? ` Faltam ${freeShipping.remaining} ${freeShipping.remaining === 1 ? "unidade" : "unidades"}.`
                    : "")}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** CEP atual com "Trocar CEP", ou o campo quando a pessoa pede para trocar. */
function CepSection({
  cep,
  state,
  pending,
  error,
  onSubmitCep,
}: {
  cep: string;
  state: string;
  pending: boolean;
  error: string | null;
  onSubmitCep: (digits: string) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);

  if (editing || !cep) {
    return (
      <CepForm
        label="Novo CEP de entrega"
        initialCep={cep}
        pending={pending}
        error={error}
        autoFocus={editing}
        onSubmit={async (digits) => {
          const ok = await onSubmitCep(digits);
          if (ok) setEditing(false);
          return ok;
        }}
        onCancel={cep ? () => setEditing(false) : undefined}
      />
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface-muted px-4 py-3">
      <span aria-hidden className="text-lg text-action">
        <IconMapPin />
      </span>
      <p className="min-w-0 flex-1 text-field text-text-strong">
        CEP <strong>{maskCep(cep)}</strong>
        {state ? <span className="text-text-muted"> · {state}</span> : null}
      </p>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="shrink-0 cursor-pointer text-label font-semibold text-action underline-offset-4 hover:underline"
      >
        Trocar CEP
      </button>
    </div>
  );
}
