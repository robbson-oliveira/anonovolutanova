"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Heading, IconArrowRight, Text, cn } from "@ds/index";
import { useCart } from "@/features/cart/CartProvider";
import { BR_STATES, lookupCep, maskCep, maskCpf, maskPhone, onlyDigits } from "@/lib/commerce/br";
import { getCheckoutConfig, type CheckoutConfig } from "@/lib/commerce/bridge-api";
import { publicEnv } from "@/lib/env";
import {
  errorMessage,
  fromMinor,
  processCheckout,
  selectShippingRate,
  updateCustomer,
  type StoreShippingRate,
} from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { gatewayDiscount, paymentOptions, type CardInput } from "@/lib/payments";
import { CardForm } from "./CardForm";
import { Field, SelectField } from "./Field";
import { OrderSummary } from "./OrderSummary";
import {
  EMPTY_FORM,
  checkoutExtension,
  clearForm,
  loadForm,
  saveForm,
  toStoreAddresses,
  validateAddress,
  validateCard,
  validateContact,
  type CheckoutForm,
  type Step,
} from "./state";
import { Stepper } from "./Stepper";

type ShippingState = {
  rates: StoreShippingRate[];
  packageId: number;
  selected: string;
  loading: boolean;
  error: string | null;
};

const EMPTY_CARD: CardInput = { holderName: "", number: "", expMonth: "", expYear: "", cvv: "", installments: 1 };

/**
 * O WooCommerce devolve `redirect_url` em todo pedido. Só se segue quando ela
 * sai do WordPress (autenticação 3DS de um gateway); se aponta para a página
 * de obrigado do próprio WordPress, a de obrigado é a nossa.
 */
function isExternalRedirect(url: string): boolean {
  if (!url) return false;
  try {
    const target = new URL(url, window.location.origin);
    return target.origin !== window.location.origin && target.host !== new URL(publicEnv.wpUrl).host;
  } catch {
    return false;
  }
}

export function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();

  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [step, setStep] = useState<Step>("contato");
  const [restored, setRestored] = useState(false);
  const [showErrors, setShowErrors] = useState<Record<Step, boolean>>({ contato: false, entrega: false, pagamento: false });

  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const [shipping, setShipping] = useState<ShippingState>({ rates: [], packageId: 0, selected: "", loading: false, error: null });
  const [cep, setCep] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });

  const [payKind, setPayKind] = useState<"pix" | "card">("pix");
  const [card, setCard] = useState<CardInput>(EMPTY_CARD);
  const [expiry, setExpiry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ----- Carregamento -----

  useEffect(() => {
    const saved = loadForm();
    if (saved) {
      setForm(saved.form);
      setStep(saved.step);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (restored) saveForm(form, step);
  }, [form, step, restored]);

  useEffect(() => {
    getCheckoutConfig()
      .then(setConfig)
      .catch((err) => setConfigError(errorMessage(err, "Não foi possível carregar as formas de pagamento.")));
  }, []);

  const options = useMemo(() => paymentOptions(config), [config]);
  const chosen = options.find((o) => o.kind === payKind) ?? options[0] ?? null;
  useEffect(() => {
    if (chosen && chosen.kind !== payKind) setPayKind(chosen.kind);
  }, [chosen, payKind]);

  // ----- Validação -----

  const contactErrors = validateContact(form.contact, config?.cpf_required ?? true);
  const address = validateAddress(form.address);
  const contactValid = Object.keys(contactErrors).length === 0;
  const addressValid = !address.summary;
  const needsShipping = cart.cart?.needs_shipping ?? true;
  const shippingValid = addressValid && (!needsShipping || Boolean(shipping.selected));
  const cardErrors = validateCard(card);

  // ----- Frete -----

  const loadRates = useCallback(async (current: CheckoutForm) => {
    setShipping((s) => ({ ...s, loading: true, error: null }));
    try {
      const { billing, shipping: shippingAddress } = toStoreAddresses(current);
      const next = await updateCustomer({ billing_address: billing, shipping_address: shippingAddress });
      cart.replace(next);
      const pkg = next.shipping_rates[0];
      const rates = pkg?.shipping_rates ?? [];
      setShipping({
        rates,
        packageId: pkg?.package_id ?? 0,
        selected: rates.find((r) => r.selected)?.rate_id ?? rates[0]?.rate_id ?? "",
        loading: false,
        error: rates.length || !next.needs_shipping ? null : "Não encontramos opções de entrega para este CEP.",
      });
    } catch (err) {
      setShipping((s) => ({ ...s, loading: false, error: errorMessage(err, "Não foi possível calcular o frete.") }));
    }
    // cart.replace é estável (setState); o resto do carrinho não entra aqui.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalcula quando o endereço completo muda (e quando o carrinho muda de
  // quantidade: 4 unidades liberam o frete grátis).
  const lastSig = useRef("");
  useEffect(() => {
    if (step === "contato" || !addressValid || !cart.cart) return;
    const sig = JSON.stringify([onlyDigits(form.address.postcode), form.address.address_1, form.address.number, form.address.city, form.address.state, cart.count]);
    if (sig === lastSig.current) return;
    lastSig.current = sig;
    void loadRates(form);
  }, [step, addressValid, form, cart.cart, cart.count, loadRates]);

  const chooseRate = async (rateId: string) => {
    setShipping((s) => ({ ...s, selected: rateId, loading: true, error: null }));
    try {
      cart.replace(await selectShippingRate({ package_id: shipping.packageId, rate_id: rateId }));
      setShipping((s) => ({ ...s, loading: false }));
    } catch (err) {
      setShipping((s) => ({ ...s, loading: false, error: errorMessage(err, "Não foi possível escolher o frete.") }));
    }
  };

  // ----- CEP -----

  const fillFromCep = async (value: string) => {
    if (onlyDigits(value).length !== 8) return;
    setCep({ loading: true, error: null });
    try {
      const found = await lookupCep(value);
      if (!found) {
        setCep({ loading: false, error: "CEP não encontrado. Confira os números." });
        return;
      }
      setForm((f) => ({
        ...f,
        address: {
          ...f.address,
          address_1: found.logradouro || f.address.address_1,
          neighborhood: found.bairro || f.address.neighborhood,
          city: found.localidade || f.address.city,
          state: found.uf || f.address.state,
        },
      }));
      setCep({ loading: false, error: null });
    } catch {
      setCep({ loading: false, error: "Não foi possível consultar o CEP. Preencha o endereço à mão." });
    }
  };

  // ----- Navegação -----

  const go = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (step === "contato") {
      setShowErrors((s) => ({ ...s, contato: true }));
      if (contactValid) go("entrega");
    } else if (step === "entrega") {
      setShowErrors((s) => ({ ...s, entrega: true }));
      if (shippingValid && !shipping.loading) go("pagamento");
    }
  };

  // ----- Totais -----

  const minor = cart.cart?.totals.currency_minor_unit ?? 2;
  const orderTotal = fromMinor(cart.cart?.totals.total_price, minor);
  // O desconto do Pix só entra no resumo depois que a forma de pagamento é escolhida.
  const pixDiscount = step === "pagamento" && chosen?.kind === "pix" ? gatewayDiscount(chosen.gateway, orderTotal) : 0;

  // ----- Pedido -----

  const submit = async () => {
    setShowErrors({ contato: true, entrega: true, pagamento: true });
    setSubmitError(null);
    if (!contactValid) return go("contato");
    if (!shippingValid) return go("entrega");
    if (!chosen) {
      setSubmitError("Nenhuma forma de pagamento disponível agora. Fale com a gente pelo WhatsApp.");
      return;
    }
    if (chosen.kind === "card" && Object.keys(cardErrors).length) return;

    setSubmitting(true);
    try {
      const { billing, shipping: shippingAddress } = toStoreAddresses(form);
      // Reenvia endereço e frete: o total do servidor é o que vale.
      await updateCustomer({ billing_address: billing, shipping_address: shippingAddress });
      if (shipping.selected) {
        await selectShippingRate({ package_id: shipping.packageId, rate_id: shipping.selected });
      }

      const payment_data =
        chosen.kind === "card" ? await chosen.adapter.cardPaymentData(card) : chosen.adapter.pixPaymentData();

      const result = await processCheckout({
        billing_address: billing,
        shipping_address: shippingAddress,
        payment_method: chosen.gateway.id,
        payment_data,
        extensions: { anln_checkout: checkoutExtension(form) },
      });

      const status = result.payment_result?.payment_status;
      if (status === "failure" || status === "error") {
        const detail = result.payment_result.payment_details.find((d) => /message/i.test(d.key))?.value;
        throw { code: "payment_failed", status: 402, message: detail || "O pagamento não foi aprovado. Confira os dados ou escolha outra forma." };
      }

      clearForm();
      cart.reset();

      const redirect = result.payment_result?.redirect_url ?? "";
      if (isExternalRedirect(redirect)) {
        window.location.href = redirect;
        return;
      }
      router.replace(
        `/checkout/obrigado?pedido=${result.order_id}&chave=${encodeURIComponent(result.order_key)}&forma=${chosen.kind}`,
      );
    } catch (err) {
      setSubmitError(errorMessage(err, "Não foi possível finalizar o pedido. Tente de novo."));
      // O pedido pode ter consumido estoque ou mudado o carrinho.
      void cart.refresh();
      setSubmitting(false);
    }
  };

  // ----- Render -----

  if (!cart.ready || !restored) {
    return (
      <Text tone="muted" className="py-section-sm text-center">
        Carregando seu carrinho…
      </Text>
    );
  }

  if (cart.count === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-section-sm text-center">
        <Heading as="h1" level="subsection">
          Seu carrinho está vazio
        </Heading>
        <Button href="/comprar" size="lg" shape="block">
          Escolher minha agenda
          <IconArrowRight />
        </Button>
      </div>
    );
  }

  const set = <K extends keyof CheckoutForm>(group: K, patch: Partial<CheckoutForm[K]>) =>
    setForm((f) => ({ ...f, [group]: { ...f[group], ...patch } }));
  const ce = showErrors.contato ? contactErrors : {};
  const ae = showErrors.entrega ? address.errors : {};

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-8">
        <Heading as="h1" level="subsection">
          Finalizar compra
        </Heading>
        <Stepper current={step} onGo={go} />

        {step === "contato" ? (
          <section aria-labelledby="step-contato" className="flex flex-col gap-5">
            <h2 id="step-contato" className="text-h4 text-text-strong">
              Seus dados
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="email" label="E-mail" type="email" autoComplete="email" inputMode="email" value={form.contact.email} onChange={(e) => set("contact", { email: e.target.value })} error={ce.email} hint="Para enviarmos a confirmação e o rastreio." className="sm:col-span-2" />
              <Field id="first-name" label="Nome" autoComplete="given-name" value={form.contact.firstName} onChange={(e) => set("contact", { firstName: e.target.value })} error={ce.firstName} />
              <Field id="last-name" label="Sobrenome" autoComplete="family-name" value={form.contact.lastName} onChange={(e) => set("contact", { lastName: e.target.value })} error={ce.lastName} />
              <Field id="phone" label="Celular (WhatsApp)" type="tel" autoComplete="tel-national" inputMode="tel" value={maskPhone(form.contact.phone)} onChange={(e) => set("contact", { phone: onlyDigits(e.target.value) })} error={ce.phone} />
              <Field id="cpf" label="CPF" inputMode="numeric" value={maskCpf(form.contact.cpf)} onChange={(e) => set("contact", { cpf: onlyDigits(e.target.value) })} error={ce.cpf} hint="Exigido para emitir a nota fiscal." />
            </div>
          </section>
        ) : null}

        {step === "entrega" ? (
          <section aria-labelledby="step-entrega" className="flex flex-col gap-5">
            <h2 id="step-entrega" className="text-h4 text-text-strong">
              Endereço de entrega
            </h2>
            <div className="grid gap-4 sm:grid-cols-6">
              <Field
                id="postcode"
                label="CEP"
                inputMode="numeric"
                autoComplete="postal-code"
                value={maskCep(form.address.postcode)}
                onChange={(e) => {
                  const value = onlyDigits(e.target.value);
                  set("address", { postcode: value });
                  if (value.length === 8) void fillFromCep(value);
                }}
                error={ae.postcode ?? cep.error ?? undefined}
                hint={cep.loading ? "Buscando endereço…" : undefined}
                className="sm:col-span-2"
              />
              <Field id="address-1" label="Rua" autoComplete="address-line1" value={form.address.address_1} onChange={(e) => set("address", { address_1: e.target.value })} error={ae.address_1} className="sm:col-span-4" />
              <Field id="number" label="Número" inputMode="numeric" value={form.address.number} onChange={(e) => set("address", { number: e.target.value })} error={ae.number} className="sm:col-span-2" />
              <Field id="address-2" label="Complemento (opcional)" autoComplete="address-line2" value={form.address.address_2} onChange={(e) => set("address", { address_2: e.target.value })} className="sm:col-span-4" />
              <Field id="neighborhood" label="Bairro" value={form.address.neighborhood} onChange={(e) => set("address", { neighborhood: e.target.value })} error={ae.neighborhood} className="sm:col-span-2" />
              <Field id="city" label="Cidade" autoComplete="address-level2" value={form.address.city} onChange={(e) => set("address", { city: e.target.value })} error={ae.city} className="sm:col-span-3" />
              <SelectField id="state" label="Estado" autoComplete="address-level1" value={form.address.state} onChange={(e) => set("address", { state: e.target.value })} error={ae.state} className="sm:col-span-1">
                <option value="">UF</option>
                {BR_STATES.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </SelectField>
            </div>

            {addressValid ? (
              <fieldset className="flex flex-col gap-3" aria-busy={shipping.loading}>
                <legend className="mb-3 text-xs font-bold text-text-strong">Entrega</legend>
                {shipping.loading && !shipping.rates.length ? (
                  <Text size="sm" tone="muted">
                    Calculando o frete…
                  </Text>
                ) : null}
                {shipping.rates.map((rate) => {
                  const price = fromMinor(rate.price, minor);
                  const active = rate.rate_id === shipping.selected;
                  return (
                    <label
                      key={rate.rate_id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-4 rounded-card border bg-surface-plain px-4 py-3",
                        active ? "border-action" : "border-border",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <input type="radio" name="shipping-rate" checked={active} disabled={shipping.loading} onChange={() => void chooseRate(rate.rate_id)} className="accent-action" />
                        <span className="text-sm font-semibold text-text-strong">{rate.name}</span>
                      </span>
                      <span className="text-sm font-bold text-text-strong">{price > 0 ? formatBRL(price) : "Grátis"}</span>
                    </label>
                  );
                })}
                {shipping.error ? (
                  <Text size="xs" tone="accent" role="alert">
                    {shipping.error}
                  </Text>
                ) : null}
              </fieldset>
            ) : showErrors.entrega && address.summary ? (
              <Text size="xs" tone="accent" role="alert">
                {address.summary}
              </Text>
            ) : null}
          </section>
        ) : null}

        {step === "pagamento" ? (
          <section aria-labelledby="step-pagamento" className="flex flex-col gap-5">
            <h2 id="step-pagamento" className="text-h4 text-text-strong">
              Pagamento
            </h2>

            {configError ? (
              <Text size="sm" tone="accent" role="alert">
                {configError}
              </Text>
            ) : !config ? (
              <Text size="sm" tone="muted">
                Carregando formas de pagamento…
              </Text>
            ) : options.length === 0 ? (
              <Text size="sm" tone="accent" role="alert">
                Nenhuma forma de pagamento disponível agora. Fale com a gente pelo WhatsApp.
              </Text>
            ) : (
              <div role="radiogroup" aria-label="Forma de pagamento" className="grid gap-3 sm:grid-cols-2">
                {options.map((o) => {
                  const active = o.kind === chosen?.kind;
                  const discount = o.kind === "pix" ? gatewayDiscount(o.gateway, orderTotal) : 0;
                  return (
                    <button
                      key={o.kind}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPayKind(o.kind)}
                      className={cn(
                        "flex cursor-pointer flex-col items-start gap-1 rounded-card border bg-surface-plain px-4 py-3 text-left",
                        active ? "border-action" : "border-border hover:border-action/50",
                      )}
                    >
                      <span className="text-sm font-bold text-text-strong">{o.kind === "pix" ? "Pix" : "Cartão de crédito"}</span>
                      <span className="text-xs text-text-muted">
                        {o.kind === "pix"
                          ? discount > 0
                            ? `${formatBRL(orderTotal - discount)} com desconto`
                            : "Aprovação na hora"
                          : `Até ${Math.max(1, Math.min(o.gateway.installments?.max ?? 1, o.gateway.installments?.interest_free_up_to ?? 1))}x sem juros`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {chosen?.kind === "pix" ? (
              <Text size="sm" className="leading-snug">
                Depois de confirmar, mostramos o QR Code e o código copia-e-cola. O pedido é
                confirmado assim que o pagamento cair.
              </Text>
            ) : null}

            {chosen?.kind === "card" ? (
              <CardForm
                gateway={chosen.gateway}
                total={orderTotal}
                card={card}
                expiryDisplay={expiry}
                errors={showErrors.pagamento ? cardErrors : {}}
                onChange={(c, display) => {
                  setCard(c);
                  setExpiry(display);
                }}
              />
            ) : null}

            {submitError ? (
              <Text size="sm" tone="accent" role="alert">
                {submitError}
              </Text>
            ) : null}
          </section>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {step !== "contato" ? (
            <button type="button" onClick={() => go(step === "pagamento" ? "entrega" : "contato")} className="cursor-pointer text-sm font-semibold text-text-strong underline-offset-4 hover:underline">
              Voltar
            </button>
          ) : (
            <span />
          )}
          {step === "pagamento" ? (
            <Button size="lg" shape="block" type="button" onClick={() => void submit()} disabled={submitting || !chosen || cart.busy}>
              {submitting ? "Finalizando…" : `Finalizar pedido · ${formatBRL(orderTotal - pixDiscount)}`}
            </Button>
          ) : (
            <Button size="lg" shape="block" type="button" onClick={next} disabled={step === "entrega" && shipping.loading}>
              Continuar
              <IconArrowRight />
            </Button>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-8">
        <OrderSummary cart={cart.cart!} busy={cart.busy} pixDiscount={pixDiscount} shippingKnown={step !== "contato" && Boolean(shipping.selected)} />
      </div>
    </div>
  );
}
