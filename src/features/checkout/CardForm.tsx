"use client";

import { Select } from "@ds/index";
import { onlyDigits } from "@/lib/commerce/br";
import type { CheckoutGateway } from "@/lib/commerce/bridge-api";
import type { CardInput } from "@/lib/payments";
import { formatBRL } from "@/lib/format";
import { Field } from "./Field";
import type { Errors } from "./state";

const maskCardNumber = (v: string) => onlyDigits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

/** "MM/AA" digitado → mês e ano com 4 dígitos. */
function parseExpiry(value: string): { expMonth: string; expYear: string; display: string } {
  const d = onlyDigits(value).slice(0, 4);
  const display = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  return { expMonth: d.slice(0, 2), expYear: d.length === 4 ? `20${d.slice(2)}` : "", display };
}

/** Asaas API floor, for bridges older than 0.5.0 that don't send the minimum. */
const DEFAULT_MIN_INSTALLMENT = 5;

/**
 * Installments up to the gateway's maximum, interest-free ones only: the site
 * advertises "3x sem juros", and showing interest-bearing ones would mean
 * showing each final amount, which depends on the gateway's rate.
 *
 * The minimum installment value is the gateway's too: below it the Asaas
 * plugin offers fewer installments, and a count it doesn't offer fails.
 */
function installmentOptions(gateway: CheckoutGateway, total: number) {
  const rules = gateway.installments ?? { max: 1, interest_free_up_to: 1, monthly_rate_percent: 0 };
  const max = Math.max(1, Math.min(rules.max, rules.interest_free_up_to));
  const minValue = rules.min_installment_value ?? DEFAULT_MIN_INSTALLMENT;
  return Array.from({ length: max }, (_, i) => i + 1).filter((n) => n === 1 || total / n >= minValue);
}

export function CardForm({
  gateway,
  total,
  card,
  expiryDisplay,
  errors,
  onChange,
}: {
  gateway: CheckoutGateway;
  total: number;
  card: CardInput;
  expiryDisplay: string;
  errors: Errors<CardInput>;
  onChange: (card: CardInput, expiryDisplay: string) => void;
}) {
  const set = (patch: Partial<CardInput>) => onChange({ ...card, ...patch }, expiryDisplay);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        id="cc-number"
        label="Número do cartão"
        inputMode="numeric"
        autoComplete="cc-number"
        value={maskCardNumber(card.number)}
        onChange={(e) => set({ number: onlyDigits(e.target.value) })}
        error={errors.number}
        className="sm:col-span-2"
      />
      <Field
        id="cc-name"
        label="Nome impresso no cartão"
        autoComplete="cc-name"
        autoCapitalize="characters"
        value={card.holderName}
        onChange={(e) => set({ holderName: e.target.value })}
        error={errors.holderName}
        className="sm:col-span-2"
      />
      <Field
        id="cc-exp"
        label="Validade"
        placeholder="MM/AA"
        inputMode="numeric"
        autoComplete="cc-exp"
        value={expiryDisplay}
        onChange={(e) => {
          const { expMonth, expYear, display } = parseExpiry(e.target.value);
          onChange({ ...card, expMonth, expYear }, display);
        }}
        error={errors.expMonth}
      />
      <Field
        id="cc-cvv"
        label="Código de segurança"
        placeholder="CVV"
        inputMode="numeric"
        autoComplete="cc-csc"
        value={card.cvv}
        onChange={(e) => set({ cvv: onlyDigits(e.target.value).slice(0, 4) })}
        error={errors.cvv}
      />
      <Select
        id="cc-installments"
        label="Parcelas"
        value={String(card.installments)}
        onValueChange={(v) => set({ installments: Number(v) })}
        options={installmentOptions(gateway, total).map((n) => ({
          value: String(n),
          label: n === 1 ? `À vista — ${formatBRL(total)}` : `${n}x de ${formatBRL(total / n)} sem juros`,
        }))}
        className="sm:col-span-2"
      />
    </div>
  );
}
