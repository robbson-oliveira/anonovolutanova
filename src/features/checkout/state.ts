/**
 * Estado do checkout: tipos, validação por etapa e persistência.
 * Funções puras — o componente só as chama.
 */

import {
  isValidCpf,
  isValidEmail,
  isValidPhone,
  joinLabels,
  missingAddressFields,
  onlyDigits,
  type BrAddress,
} from "@/lib/commerce/br";
import type { StoreAddress } from "@/lib/commerce/store-api";
import type { CardInput } from "@/lib/payments";

export type Step = "contato" | "entrega" | "pagamento";

export const STEPS: Array<{ key: Step; label: string }> = [
  { key: "contato", label: "Contato" },
  { key: "entrega", label: "Entrega" },
  { key: "pagamento", label: "Pagamento" },
];

export type Contact = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  cpf: string;
};

export type CheckoutForm = {
  contact: Contact;
  address: BrAddress;
};

export const EMPTY_FORM: CheckoutForm = {
  contact: { email: "", firstName: "", lastName: "", phone: "", cpf: "" },
  address: { postcode: "", address_1: "", number: "", neighborhood: "", address_2: "", city: "", state: "" },
};

export type Errors<T> = Partial<Record<keyof T, string>>;

export function validateContact(c: Contact, cpfRequired: boolean): Errors<Contact> {
  const e: Errors<Contact> = {};
  if (!isValidEmail(c.email)) e.email = "Informe um e-mail válido.";
  if (!c.firstName.trim()) e.firstName = "Informe seu nome.";
  if (!c.lastName.trim()) e.lastName = "Informe seu sobrenome.";
  if (!isValidPhone(c.phone)) e.phone = "Informe um celular com DDD.";
  if ((cpfRequired || c.cpf.trim()) && !isValidCpf(c.cpf)) e.cpf = "CPF inválido.";
  return e;
}

export function validateAddress(a: BrAddress): { errors: Errors<BrAddress>; summary: string | null } {
  const missing = missingAddressFields(a);
  const labelToField: Record<string, keyof BrAddress> = {
    CEP: "postcode",
    rua: "address_1",
    número: "number",
    bairro: "neighborhood",
    cidade: "city",
    estado: "state",
  };
  const errors: Errors<BrAddress> = {};
  for (const label of missing) errors[labelToField[label]] = "Campo obrigatório.";
  if (errors.postcode) errors.postcode = "CEP com 8 dígitos.";
  return { errors, summary: missing.length ? `Falta preencher: ${joinLabels(missing)}.` : null };
}

export function validateCard(card: CardInput, now = new Date()): Errors<CardInput> {
  const e: Errors<CardInput> = {};
  const number = onlyDigits(card.number);
  if (!card.holderName.trim() || card.holderName.trim().split(/\s+/).length < 2) {
    e.holderName = "Nome como está no cartão.";
  }
  if (number.length < 13 || number.length > 19 || !luhn(number)) e.number = "Número do cartão inválido.";
  const month = Number(card.expMonth);
  const year = Number(card.expYear);
  const expired =
    year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
  if (!(month >= 1 && month <= 12) || card.expYear.length !== 4 || expired) e.expMonth = "Validade inválida.";
  if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = "Código de 3 ou 4 dígitos.";
  return e;
}

/** Dígito verificador do cartão (Luhn). */
export function luhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

/**
 * Endereço no formato da Store API. Cobrança = entrega (um endereço só no
 * formulário). Número e bairro vão à parte, na extensão `anln_checkout`,
 * porque o esquema de endereço da Store API não tem esses campos.
 */
export function toStoreAddresses(form: CheckoutForm): { billing: StoreAddress; shipping: StoreAddress } {
  const base: StoreAddress = {
    first_name: form.contact.firstName.trim(),
    last_name: form.contact.lastName.trim(),
    company: "",
    address_1: form.address.address_1.trim(),
    address_2: form.address.address_2.trim(),
    city: form.address.city.trim(),
    state: form.address.state,
    postcode: onlyDigits(form.address.postcode),
    country: "BR",
    phone: onlyDigits(form.contact.phone),
  };
  return { billing: { ...base, email: form.contact.email.trim() }, shipping: base };
}

/** `extensions.anln_checkout`: o que o anln-storefront-bridge grava no pedido. */
export function checkoutExtension(form: CheckoutForm) {
  return {
    cpf: onlyDigits(form.contact.cpf),
    billing_number: form.address.number.trim(),
    billing_neighborhood: form.address.neighborhood.trim(),
    shipping_number: form.address.number.trim(),
    shipping_neighborhood: form.address.neighborhood.trim(),
  };
}

// ----- Persistência -----
// Contato e endereço sobrevivem a um recarregamento (sessionStorage, some ao
// fechar a aba). O cartão NUNCA é guardado.

const STORAGE_KEY = "anln_checkout";

export function loadForm(): { form: CheckoutForm; step: Step } | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { form?: CheckoutForm; step?: Step };
    if (!parsed.form) return null;
    return {
      form: {
        contact: { ...EMPTY_FORM.contact, ...parsed.form.contact },
        address: { ...EMPTY_FORM.address, ...parsed.form.address },
      },
      step: STEPS.some((s) => s.key === parsed.step) ? parsed.step! : "contato",
    };
  } catch {
    return null;
  }
}

export function saveForm(form: CheckoutForm, step: Step): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }));
  } catch {
    // Sem storage: o formulário só não sobrevive ao recarregamento.
  }
}

export function clearForm(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // idem
  }
}
