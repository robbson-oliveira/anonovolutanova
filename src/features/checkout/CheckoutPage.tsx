"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Button,
  Heading,
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCheck,
  IconCreditCard,
  IconLock,
  IconMail,
  IconMapPin,
  IconPackage,
  IconPix,
  Text,
  cn,
} from "@ds/index";
import { BUY_URL, PRODUCT_NAME } from "@content/product";
import { useCart } from "@/features/cart/CartProvider";
import { orderAttribution } from "@/lib/attribution";
import { BR_STATES, lookupCep, maskCep, maskCpf, onlyDigits } from "@/lib/commerce/br";
import { getCheckoutConfig, type CheckoutConfig } from "@/lib/commerce/bridge-api";
import {
  errorMessage,
  fromMinor,
  processCheckout,
  selectShippingRate,
  updateCustomer,
  type StoreShippingRate,
} from "@/lib/commerce/store-api";
import { publicEnv } from "@/lib/env";
import { formatBRL } from "@/lib/format";
import { gatewayDiscount, paymentOptions, type CardInput } from "@/lib/payments";
import { cartCoupon, cartTrackItems } from "@/lib/tracking/cart-items";
import {
  savePurchaseSnapshot,
  trackAddPaymentInfo,
  trackAddShippingInfo,
  trackBeginCheckout,
} from "@/lib/tracking/events";
import { CardForm } from "./CardForm";
import { Field, SelectField } from "./Field";
import { MobileSummaryBar } from "./MobileSummaryBar";
import { OrderSummary } from "./OrderSummary";
import { PhoneField } from "./PhoneField";
import { ReviewCard } from "./ReviewCard";
import {
  EMPTY_FORM,
  addressLine,
  checkoutExtension,
  clearForm,
  loadForm,
  maskBirthDate,
  saveForm,
  toStoreAddresses,
  validateAddress,
  validateCard,
  validateContact,
  validateRecipient,
  type CheckoutForm,
  type Recipient,
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
const CEP_SEARCH_URL = "https://buscacepinter.correios.com.br/app/endereco/index.php";
const logo = "/img/logo.png";

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

/** Título de seção do formulário (a referência usa serifa itálica; aqui é o Manrope do DS). */
function SectionTitle({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <Heading as="h2" id={id} level="card" className="text-text-strong">
      {children}
    </Heading>
  );
}

/** Caixa branca de um grupo de campos ("Destinatário", "Endereço"). */
function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-card border border-border bg-surface-plain p-4 sm:p-5">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden className="flex items-center gap-2 text-field font-medium text-text-strong">
        {icon ? <span className="text-action">{icon}</span> : null}
        {title}
      </p>
      {children}
    </fieldset>
  );
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
  const [acceptTerms, setAcceptTerms] = useState(false);
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

  // begin_checkout: uma vez, quando o carrinho com itens chega.
  const beganCheckout = useRef(false);
  useEffect(() => {
    if (beganCheckout.current || !cart.cart?.items.length) return;
    beganCheckout.current = true;
    trackBeginCheckout(cartTrackItems(cart.cart), cartCoupon(cart.cart));
  }, [cart.cart]);

  // ----- Destinatário -----
  // Enquanto não é editado, o destinatário é o próprio titular. Editado uma
  // vez (presente para outra pessoa), segue o que foi digitado.
  const recipient: Recipient = form.recipientTouched
    ? form.recipient
    : { firstName: form.contact.firstName, lastName: form.contact.lastName, phone: form.contact.phone };
  const formForStore: CheckoutForm = { ...form, recipient };

  // ----- Validação -----

  const contactErrors = validateContact(form.contact, {
    cpfRequired: config?.cpf_required ?? true,
    birthDateRequired: config?.birthdate_required ?? false,
  });
  const recipientErrors = validateRecipient(recipient);
  const address = validateAddress(form.address);
  const contactValid = Object.keys(contactErrors).length === 0;
  const recipientValid = Object.keys(recipientErrors).length === 0;
  const addressValid = !address.summary;
  const needsShipping = cart.cart?.needs_shipping ?? true;
  const shippingValid = recipientValid && addressValid && (!needsShipping || Boolean(shipping.selected));
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
    const sig = JSON.stringify([
      onlyDigits(form.address.postcode),
      form.address.address_1,
      form.address.number,
      form.address.city,
      form.address.state,
      cart.count,
    ]);
    if (sig === lastSig.current) return;
    lastSig.current = sig;
    void loadRates(formForStore);
    // formForStore deriva de form; a assinatura acima é o que decide recalcular.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const selectedRate = shipping.rates.find((r) => r.rate_id === shipping.selected) ?? null;
  const minor = cart.cart?.totals.currency_minor_unit ?? 2;

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
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (step === "contato") {
      setShowErrors((s) => ({ ...s, contato: true }));
      if (contactValid) go("entrega");
    } else if (step === "entrega") {
      setShowErrors((s) => ({ ...s, entrega: true }));
      if (shippingValid && !shipping.loading) {
        trackAddShippingInfo(cartTrackItems(cart.cart), selectedRate?.name ?? "", cartCoupon(cart.cart));
        go("pagamento");
      }
    }
  };

  // ----- Totais -----

  const orderTotal = fromMinor(cart.cart?.totals.total_price, minor);
  // O desconto do Pix só entra no resumo depois que a forma de pagamento é escolhida.
  const pixDiscount = step === "pagamento" && chosen?.kind === "pix" ? gatewayDiscount(chosen.gateway, orderTotal) : 0;
  const shippingKnown = step !== "contato" && Boolean(shipping.selected);
  const payable = orderTotal - pixDiscount;

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
    if (!acceptTerms) return;

    setSubmitting(true);
    try {
      const { billing, shipping: shippingAddress } = toStoreAddresses(formForStore);
      // Reenvia endereço e frete: o total do servidor é o que vale.
      await updateCustomer({ billing_address: billing, shipping_address: shippingAddress });
      if (shipping.selected) {
        await selectShippingRate({ package_id: shipping.packageId, rate_id: shipping.selected });
      }

      const trackItems = cartTrackItems(cart.cart);
      const coupon = cartCoupon(cart.cart);
      const paymentType = chosen.kind === "pix" ? "pix" : "credit_card";
      trackAddPaymentInfo(trackItems, paymentType, coupon);

      const payment_data =
        chosen.kind === "card" ? await chosen.adapter.cardPaymentData(card) : chosen.adapter.pixPaymentData();

      const result = await processCheckout({
        billing_address: billing,
        shipping_address: shippingAddress,
        payment_method: chosen.gateway.id,
        payment_data,
        extensions: { anln_checkout: { ...checkoutExtension(formForStore), attribution: orderAttribution() } },
      });

      const status = result.payment_result?.payment_status;
      if (status === "failure" || status === "error") {
        const detail = result.payment_result.payment_details.find((d) => /message/i.test(d.key))?.value;
        throw { code: "payment_failed", status: 402, message: detail || "O pagamento não foi aprovado. Confira os dados ou escolha outra forma." };
      }

      // O purchase só sai na página de obrigado, com o pagamento confirmado.
      savePurchaseSnapshot({
        transaction_id: String(result.order_id),
        value: Math.round(payable * 100) / 100,
        shipping: fromMinor(cart.cart?.totals.total_shipping, minor),
        coupon,
        payment_type: paymentType,
        items: trackItems,
      });

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

  const header = (
    // <a> e não <Link>: "/" é o wireframe (HTML puro), não uma página React.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href="/" aria-label="Voltar ao site" className="w-fit">
      <Image src={logo} alt={PRODUCT_NAME} width={1086} height={1448} sizes="42px" preload className="block h-14 w-auto" />
    </a>
  );

  if (!cart.ready || !restored) {
    return (
      <div className="flex flex-col gap-8">
        {header}
        <Text tone="muted">Carregando seu carrinho…</Text>
      </div>
    );
  }

  if (cart.count === 0) {
    return (
      <div className="flex flex-col gap-8">
        {header}
        <div className="flex flex-col items-center gap-5 py-section-sm text-center">
          <Heading as="h1" level="subsection">
            Seu carrinho está vazio
          </Heading>
          <Button href={BUY_URL} size="md" shape="block">
            Escolher minha agenda
            <IconArrowRight />
          </Button>
        </div>
      </div>
    );
  }

  const setContact = (patch: Partial<CheckoutForm["contact"]>) =>
    setForm((f) => ({ ...f, contact: { ...f.contact, ...patch } }));
  const setRecipient = (patch: Partial<Recipient>) =>
    setForm((f) => ({ ...f, recipientTouched: true, recipient: { ...recipient, ...patch } }));
  const setAddress = (patch: Partial<CheckoutForm["address"]>) =>
    setForm((f) => ({ ...f, address: { ...f.address, ...patch } }));

  const ce = showErrors.contato ? contactErrors : {};
  const re = showErrors.entrega ? recipientErrors : {};
  const ae = showErrors.entrega ? address.errors : {};

  const contactRow = {
    label: "Contato",
    onEdit: () => go("contato"),
    content: (
      <>
        <p>
          {form.contact.firstName} {form.contact.lastName}
        </p>
        <p className="text-text-muted">{form.contact.phone.number}</p>
        <p className="text-text-muted">{form.contact.email}</p>
      </>
    ),
  };

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12">
      <div className="flex min-w-0 flex-col gap-8">
        {header}
        <h1 className="sr-only">Finalizar compra</h1>
        <Stepper current={step} onGo={go} />

        {step === "contato" ? (
          <section aria-labelledby="step-contato" className="flex flex-col gap-5">
            <SectionTitle id="step-contato">Dados do titular da compra</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="email" label="Endereço de e-mail" required type="email" autoComplete="email" inputMode="email" icon={<IconMail />} value={form.contact.email} onChange={(e) => setContact({ email: e.target.value })} error={ce.email} className="sm:col-span-2" />
              <Field id="first-name" label="Nome" required autoComplete="given-name" value={form.contact.firstName} onChange={(e) => setContact({ firstName: e.target.value })} error={ce.firstName} />
              <Field id="last-name" label="Sobrenome" required autoComplete="family-name" value={form.contact.lastName} onChange={(e) => setContact({ lastName: e.target.value })} error={ce.lastName} />
              <PhoneField id="phone" label="Telefone" required value={form.contact.phone.number} onChange={(number, valid) => setContact({ phone: { number, valid } })} error={ce.phone} className="sm:col-span-2" />
              <Field id="cpf" label="CPF" required={config?.cpf_required ?? true} inputMode="numeric" value={maskCpf(form.contact.cpf)} onChange={(e) => setContact({ cpf: onlyDigits(e.target.value) })} error={ce.cpf} className="sm:col-span-2" />
              <Field id="birthdate" label="Data de nascimento" required={config?.birthdate_required ?? false} inputMode="numeric" placeholder="dd/mm/aaaa" autoComplete="bday" icon={<IconCalendar />} value={form.contact.birthDate} onChange={(e) => setContact({ birthDate: maskBirthDate(e.target.value) })} error={ce.birthDate} className="sm:col-span-2" />
            </div>
          </section>
        ) : null}

        {step === "entrega" ? (
          <section aria-labelledby="step-entrega" className="flex flex-col gap-5">
            <ReviewCard rows={[contactRow]} />
            <SectionTitle id="step-entrega">Endereço de entrega</SectionTitle>

            <Panel title="Destinatário">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="recipient-first-name" label="Nome" required autoComplete="shipping given-name" value={recipient.firstName} onChange={(e) => setRecipient({ firstName: e.target.value })} error={re.firstName} />
                <Field id="recipient-last-name" label="Sobrenome" required autoComplete="shipping family-name" value={recipient.lastName} onChange={(e) => setRecipient({ lastName: e.target.value })} error={re.lastName} />
                <PhoneField id="recipient-phone" label="Telefone" required value={recipient.phone.number} onChange={(number, valid) => setRecipient({ phone: { number, valid } })} error={re.phone} className="sm:col-span-2" />
              </div>
            </Panel>

            <Panel title="Endereço" icon={<IconMapPin />}>
              <Field
                id="postcode"
                label="CEP"
                required
                inputMode="numeric"
                autoComplete="shipping postal-code"
                value={maskCep(form.address.postcode)}
                onChange={(e) => {
                  const value = onlyDigits(e.target.value);
                  setAddress({ postcode: value });
                  if (value.length === 8) void fillFromCep(value);
                }}
                error={ae.postcode ?? cep.error ?? undefined}
                hint={
                  cep.loading ? (
                    "Buscando endereço…"
                  ) : (
                    <a href={CEP_SEARCH_URL} target="_blank" rel="noopener noreferrer" className="text-action underline-offset-4 hover:underline">
                      Não sei meu CEP
                    </a>
                  )
                }
              />
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
                <Field id="address-1" label="Endereço" required autoComplete="shipping address-line1" value={form.address.address_1} onChange={(e) => setAddress({ address_1: e.target.value })} error={ae.address_1} />
                <Field id="number" label="Número" required inputMode="numeric" value={form.address.number} onChange={(e) => setAddress({ number: e.target.value })} error={ae.number} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="neighborhood" label="Bairro (opcional)" value={form.address.neighborhood} onChange={(e) => setAddress({ neighborhood: e.target.value })} />
                <Field id="address-2" label="Complemento (opcional)" placeholder="Apartamento, bloco, casa…" autoComplete="shipping address-line2" value={form.address.address_2} onChange={(e) => setAddress({ address_2: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="city" label="Cidade" required autoComplete="shipping address-level2" value={form.address.city} onChange={(e) => setAddress({ city: e.target.value })} error={ae.city} />
                <SelectField id="state" label="Estado" required autoComplete="shipping address-level1" value={form.address.state} onChange={(e) => setAddress({ state: e.target.value })} error={ae.state}>
                  <option value="">Selecione</option>
                  {BR_STATES.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </SelectField>
              </div>
            </Panel>

            <div className="flex flex-col gap-3" aria-busy={shipping.loading}>
              <p className="flex items-center gap-2 text-field font-medium text-text-strong">
                <IconPackage className="text-action" />
                Formas de entrega
              </p>
              {!addressValid ? (
                <Text size="xs" tone="muted" className="leading-snug">
                  {showErrors.entrega && address.summary ? address.summary : "Informe o CEP e o endereço para ver as opções de entrega."}
                </Text>
              ) : shipping.loading && !shipping.rates.length ? (
                <Text size="xs" tone="muted">
                  Calculando o frete…
                </Text>
              ) : null}
              {addressValid
                ? shipping.rates.map((rate) => {
                    const price = fromMinor(rate.price, minor);
                    const active = rate.rate_id === shipping.selected;
                    return (
                      <label
                        key={rate.rate_id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-card border bg-surface-plain px-4 py-4 sm:px-5",
                          "transition-colors [transition-duration:var(--duration-fast)]",
                          active ? "border-action" : "border-border hover:border-action/50",
                        )}
                      >
                        <input type="radio" name="shipping-rate" checked={active} disabled={shipping.loading} onChange={() => void chooseRate(rate.rate_id)} className="sr-only" />
                        {active ? (
                          <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-pill bg-action text-on-action">
                            <IconCheck />
                          </span>
                        ) : null}
                        <span className="text-field text-text-strong">
                          <span className="font-semibold">{rate.name}</span>
                          {price > 0 ? `: ${formatBRL(price)}` : ""}
                        </span>
                      </label>
                    );
                  })
                : null}
              {shipping.error ? (
                <Text size="xs" tone="accent" role="alert">
                  {shipping.error}
                </Text>
              ) : null}
            </div>
          </section>
        ) : null}

        {step === "pagamento" ? (
          <section aria-labelledby="step-pagamento" className="flex flex-col gap-5">
            <ReviewCard
              rows={[
                contactRow,
                { label: "Entrega", onEdit: () => go("entrega"), content: addressLine(form.address) },
                {
                  label: "Frete",
                  onEdit: () => go("entrega"),
                  content: selectedRate
                    ? `${selectedRate.name} — ${fromMinor(selectedRate.price, minor) > 0 ? formatBRL(fromMinor(selectedRate.price, minor)) : "Grátis"}`
                    : "—",
                },
              ]}
            />
            <SectionTitle id="step-pagamento">Formas de pagamento</SectionTitle>

            <div className="flex flex-col gap-4 rounded-card border border-border bg-surface-plain p-4 sm:p-5">
              {configError ? (
                <Text size="xs" tone="accent" role="alert">
                  {configError}
                </Text>
              ) : !config ? (
                <Text size="xs" tone="muted">
                  Carregando formas de pagamento…
                </Text>
              ) : options.length === 0 ? (
                <Text size="xs" tone="accent" role="alert">
                  Nenhuma forma de pagamento disponível agora. Fale com a gente pelo WhatsApp.
                </Text>
              ) : (
                <>
                  <div role="radiogroup" aria-label="Forma de pagamento" className="grid grid-cols-2 gap-3">
                    {options.map((o) => {
                      const active = o.kind === chosen?.kind;
                      const rule = o.gateway.discount_rule;
                      const badge =
                        o.kind === "pix" && rule
                          ? rule.type === "percent"
                            ? rule.percent > 0
                              ? `${rule.percent.toLocaleString("pt-BR")}% de desconto`
                              : null
                            : `${formatBRL(rule.amount)} de desconto`
                          : null;
                      return (
                        <button
                          key={o.kind}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setPayKind(o.kind);
                            setSubmitError(null);
                            // Campos do cartão acabaram de aparecer: sem erro até tentar pagar com eles.
                            if (o.kind !== payKind) setShowErrors((s) => ({ ...s, pagamento: false }));
                          }}
                          className={cn(
                            "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-card border bg-surface-plain px-3 py-4 text-center",
                            "transition-colors [transition-duration:var(--duration-fast)]",
                            active ? "border-2 border-action" : "border-border hover:border-action/50",
                          )}
                        >
                          <span className="text-lead text-action">{o.kind === "pix" ? <IconPix /> : <IconCreditCard />}</span>
                          <span className="text-label font-medium text-text-strong">{o.kind === "pix" ? "Pix" : "Cartão de crédito"}</span>
                          {badge ? (
                            <span className="rounded-pill bg-surface-accent-soft px-2 py-0.5 text-caption font-bold text-text-strong">{badge}</span>
                          ) : o.kind === "card" && o.gateway.installments ? (
                            <span className="text-caption text-text-muted">
                              até {Math.max(1, Math.min(o.gateway.installments.max, o.gateway.installments.interest_free_up_to))}x sem juros
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {chosen?.kind === "pix" ? (
                    <div className="flex flex-col items-center gap-2 rounded-card border border-border px-4 py-6 text-center">
                      <span className="text-h3 text-action">
                        <IconPix />
                      </span>
                      <p className="text-field font-medium text-text-strong">Pague de forma segura e instantânea</p>
                      <p className="text-label text-text-muted">Ao confirmar a compra, mostramos o código para fazer o pagamento.</p>
                    </div>
                  ) : null}

                  {chosen?.kind === "card" ? (
                    <div className="rounded-card border border-border p-4 sm:p-5">
                      <CardForm
                        gateway={chosen.gateway}
                        total={payable}
                        card={card}
                        expiryDisplay={expiry}
                        errors={showErrors.pagamento ? cardErrors : {}}
                        onChange={(c, display) => {
                          setCard(c);
                          setExpiry(display);
                        }}
                      />
                    </div>
                  ) : null}
                </>
              )}
            </div>

            <p className="text-label leading-relaxed text-text-muted">
              Seus dados pessoais serão usados para processar seu pedido, apoiar sua experiência neste site e para
              outros fins descritos em nossa{" "}
              <a href="/politica-de-privacidade" target="_blank" className="text-action underline-offset-4 hover:underline">
                política de privacidade
              </a>
              .
            </p>
            <label className="flex cursor-pointer items-start gap-3 text-label text-text-strong">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-action"
                aria-describedby={showErrors.pagamento && !acceptTerms ? "terms-error" : undefined}
              />
              <span>
                Li e concordo com os{" "}
                <a href="/termos-e-condicoes" target="_blank" className="text-action underline-offset-4 hover:underline">
                  termos e condições
                </a>
                .<span className="text-accent"> *</span>
              </span>
            </label>
            {showErrors.pagamento && !acceptTerms ? (
              <span id="terms-error" className="text-label text-accent">
                Para finalizar, é preciso aceitar os termos e condições.
              </span>
            ) : null}

            {submitError ? (
              <Text size="xs" tone="accent" role="alert">
                {submitError}
              </Text>
            ) : null}
          </section>
        ) : null}

        <div className="flex flex-col-reverse items-stretch gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step === "contato" ? (
            <a href={BUY_URL} className="flex items-center justify-center gap-2 text-field text-text-muted hover:text-text-strong">
              <IconArrowLeft />
              Voltar à loja
            </a>
          ) : (
            <button
              type="button"
              onClick={() => go(step === "pagamento" ? "entrega" : "contato")}
              className="flex cursor-pointer items-center justify-center gap-2 text-field text-text-muted hover:text-text-strong"
            >
              <IconArrowLeft />
              Voltar
            </button>
          )}
          {step === "pagamento" ? (
            <Button size="md" shape="block" type="button" onClick={() => void submit()} disabled={submitting || !chosen || cart.busy} className="h-12 w-full px-6 text-field sm:w-auto">
              <IconLock />
              {submitting ? "Processando…" : `Pagar ${formatBRL(payable)}`}
            </Button>
          ) : (
            <Button size="md" shape="block" type="button" onClick={next} disabled={step === "entrega" && shipping.loading} className="h-12 w-full px-6 text-field sm:w-auto">
              {step === "contato" ? "Continuar para entrega" : "Continuar para pagamento"}
            </Button>
          )}
        </div>
      </div>

      <aside className="hidden lg:block lg:sticky lg:top-8">
        <div className="rounded-card border border-border bg-surface-plain p-6">
          <OrderSummary pixDiscount={pixDiscount} shippingKnown={shippingKnown} />
        </div>
      </aside>

      {/* No celular o resumo abre de baixo. Na etapa de pagamento a barra dá
          lugar ao botão "Pagar", como na referência. */}
      {step !== "pagamento" ? (
        <MobileSummaryBar total={orderTotal - (shippingKnown ? 0 : fromMinor(cart.cart?.totals.total_shipping, minor))}>
          <OrderSummary pixDiscount={pixDiscount} shippingKnown={shippingKnown} />
        </MobileSummaryBar>
      ) : null}
    </div>
  );
}
