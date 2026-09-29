/**
 * Estado do checkout: tipos, validação por etapa e persistência.
 * Funções puras — os componentes só as chamam.
 */

import {
  BR_STATES,
  isValidCnpj,
  normalizeCnpj,
  isValidCpf,
  isValidEmail,
  joinLabels,
  onlyDigits,
} from "@/lib/commerce/br";
import type { StoreAddress } from "@/lib/commerce/store-api";
import type { CardInput } from "@/lib/payments";
import { phoneForStore } from "./phone";

export type Step = "contato" | "entrega" | "pagamento";

export const STEPS: Array<{ key: Step; label: string }> = [
  { key: "contato", label: "Contato" },
  { key: "entrega", label: "Entrega" },
  { key: "pagamento", label: "Pagamento" },
];

/** Telefone em E.164 e se o intl-tel-input o considera válido para o país. */
export type Phone = { number: string; valid: boolean };

/** Pessoa física (CPF) ou jurídica (razão social + CNPJ). */
export type PersonType = "pf" | "pj";

/** Titular da compra (cobrança, nota fiscal, e-mails). */
export type Contact = {
  email: string;
  firstName: string;
  lastName: string;
  phone: Phone;
  /** Comprando como pessoa física ou jurídica. Decide CPF ou CNPJ. */
  personType: PersonType;
  /** Só dígitos. Vale para pessoa física. */
  cpf: string;
  /** Razão social. Vale para pessoa jurídica. */
  company: string;
  /** Só dígitos. Vale para pessoa jurídica. */
  cnpj: string;
  /** "dd/mm/aaaa", opcional salvo se o plugin exigir. */
  birthDate: string;
};

/** Quem recebe a agenda. Começa igual ao titular; pode ser outra pessoa (presente). */
export type Recipient = {
  firstName: string;
  lastName: string;
  phone: Phone;
};

/** Os campos de endereço combinados: CEP, endereço, número, bairro, complemento, cidade e estado. */
export type Address = {
  postcode: string;
  address_1: string;
  number: string;
  neighborhood: string;
  address_2: string;
  city: string;
  state: string;
};

export type CheckoutForm = {
  contact: Contact;
  recipient: Recipient;
  /** O destinatário foi editado à mão? Enquanto não, ele acompanha o titular. */
  recipientTouched: boolean;
  address: Address;
};

const EMPTY_PHONE: Phone = { number: "", valid: false };

export const EMPTY_FORM: CheckoutForm = {
  contact: {
    email: "",
    firstName: "",
    lastName: "",
    phone: EMPTY_PHONE,
    personType: "pf",
    cpf: "",
    company: "",
    cnpj: "",
    birthDate: "",
  },
  recipient: { firstName: "", lastName: "", phone: EMPTY_PHONE },
  recipientTouched: false,
  address: { postcode: "", address_1: "", number: "", neighborhood: "", address_2: "", city: "", state: "" },
};

export type Errors<T> = Partial<Record<keyof T, string>>;

/** "dd/mm/aaaa" de uma data real, entre 1900 e hoje. */
export function isValidBirthDate(value: string, now = new Date()): boolean {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) return false;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d && y >= 1900 && date <= now;
}

export function maskBirthDate(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function validateContact(
  c: Contact,
  rules: { cpfRequired: boolean; birthDateRequired: boolean },
): Errors<Contact> {
  const e: Errors<Contact> = {};
  if (!isValidEmail(c.email)) e.email = "Informe um e-mail válido.";
  if (!c.firstName.trim()) e.firstName = "Informe seu nome.";
  if (!c.lastName.trim()) e.lastName = "Informe seu sobrenome.";
  if (!c.phone.valid) e.phone = "Informe um telefone válido, com DDD.";
  if (c.personType === "pj") {
    // Pessoa jurídica: razão social e CNPJ sempre. A regra do CPF não vale aqui.
    if (!c.company.trim()) e.company = "Informe a razão social.";
    if (!isValidCnpj(c.cnpj)) e.cnpj = "CNPJ inválido.";
  } else if ((rules.cpfRequired || c.cpf.trim()) && !isValidCpf(c.cpf)) {
    e.cpf = "CPF inválido.";
  }
  if ((rules.birthDateRequired || c.birthDate.trim()) && !isValidBirthDate(c.birthDate)) {
    e.birthDate = "Data inválida (dd/mm/aaaa).";
  }
  return e;
}

export function validateRecipient(r: Recipient): Errors<Recipient> {
  const e: Errors<Recipient> = {};
  if (!r.firstName.trim()) e.firstName = "Informe o nome de quem recebe.";
  if (!r.lastName.trim()) e.lastName = "Informe o sobrenome.";
  if (!r.phone.valid) e.phone = "Informe um telefone válido, com DDD.";
  return e;
}

/**
 * Campos obrigatórios do endereço que faltam. A Store API recusa o pedido
 * inteiro com um campo vazio, e só avisa na hora de pagar. Bairro e
 * complemento são opcionais (há CEP de cidade pequena sem bairro).
 */
export function validateAddress(a: Address): { errors: Errors<Address>; summary: string | null } {
  const errors: Errors<Address> = {};
  const missing: string[] = [];
  if (onlyDigits(a.postcode).length !== 8) {
    errors.postcode = "CEP com 8 dígitos.";
    missing.push("CEP");
  }
  if (!a.address_1.trim()) {
    errors.address_1 = "Informe o endereço.";
    missing.push("endereço");
  }
  if (!a.number.trim()) {
    errors.number = "Informe o número.";
    missing.push("número");
  }
  if (!a.city.trim()) {
    errors.city = "Informe a cidade.";
    missing.push("cidade");
  }
  if (!BR_STATES.includes(a.state as (typeof BR_STATES)[number])) {
    errors.state = "Escolha o estado.";
    missing.push("estado");
  }
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
 * Endereços no formato da Store API. Cobrança = titular; entrega =
 * destinatário, no mesmo endereço. Número e bairro vão à parte, na extensão
 * `anln_checkout`: o esquema de endereço da Store API não tem esses campos.
 * Pessoa jurídica: a razão social vai em `company` da cobrança.
 */
export function toStoreAddresses(form: CheckoutForm): { billing: StoreAddress; shipping: StoreAddress } {
  const place = {
    company: "",
    address_1: form.address.address_1.trim(),
    address_2: form.address.address_2.trim(),
    city: form.address.city.trim(),
    state: form.address.state,
    postcode: onlyDigits(form.address.postcode),
    country: "BR",
  };
  return {
    billing: {
      ...place,
      company: form.contact.personType === "pj" ? form.contact.company.trim() : "",
      first_name: form.contact.firstName.trim(),
      last_name: form.contact.lastName.trim(),
      phone: phoneForStore(form.contact.phone.number),
      email: form.contact.email.trim(),
    },
    shipping: {
      ...place,
      first_name: form.recipient.firstName.trim(),
      last_name: form.recipient.lastName.trim(),
      phone: phoneForStore(form.recipient.phone.number),
    },
  };
}

/** "dd/mm/aaaa" → "aaaa-mm-dd" (ou vazio). */
const isoDate = (br: string) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
};

/**
 * `extensions.anln_checkout`: o que o anln-storefront-bridge grava no pedido.
 * Pessoa física manda o CPF; jurídica manda CNPJ e razão social (e não o CPF).
 */
export function checkoutExtension(form: CheckoutForm) {
  const c = form.contact;
  const document =
    c.personType === "pj"
      ? { person_type: "pj" as const, cnpj: normalizeCnpj(c.cnpj), company: c.company.trim() }
      : { person_type: "pf" as const, cpf: onlyDigits(c.cpf) };
  return {
    ...document,
    birthdate: isoDate(form.contact.birthDate),
    billing_number: form.address.number.trim(),
    billing_neighborhood: form.address.neighborhood.trim(),
    shipping_number: form.address.number.trim(),
    shipping_neighborhood: form.address.neighborhood.trim(),
  };
}

/** Uma linha: "Rua X, 212, Colombo - PR (CEP: 83407-280)". */
export function addressLine(a: Address): string {
  const cep = onlyDigits(a.postcode);
  const parts = [a.address_1.trim(), a.number.trim(), a.address_2.trim()].filter(Boolean).join(", ");
  return `${parts}${a.neighborhood.trim() ? `, ${a.neighborhood.trim()}` : ""}, ${a.city.trim()} - ${a.state} (CEP: ${cep.slice(0, 5)}-${cep.slice(5)})`;
}

// ----- Persistência -----
// Contact, recipient and address are kept in localStorage as they are typed,
// so leaving the checkout (or closing the tab) and coming back fills them in
// again. They expire after STORAGE_TTL_MS and are cleared once the order is
// placed. The card is NEVER stored.

const STORAGE_KEY = "anln_checkout";
/** A form untouched for this long is dropped: a shared computer should not keep someone's CPF forever. */
const STORAGE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type StoredForm = { form?: Partial<CheckoutForm>; step?: Step; savedAt?: number };

/**
 * The saved form. Before localStorage it lived in sessionStorage; a form
 * still there moves over on the first read.
 */
function readStored(): StoredForm | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as StoredForm;

  const legacy = window.sessionStorage.getItem(STORAGE_KEY);
  if (!legacy) return null;
  window.sessionStorage.removeItem(STORAGE_KEY);
  window.localStorage.setItem(STORAGE_KEY, legacy);
  return JSON.parse(legacy) as StoredForm;
}

export function loadForm(): { form: CheckoutForm; step: Step } | null {
  try {
    const parsed = readStored();
    if (!parsed?.form) return null;
    // Legacy entries have no `savedAt`: they are recent (a session's worth).
    if (parsed.savedAt && Date.now() - parsed.savedAt > STORAGE_TTL_MS) {
      clearForm();
      return null;
    }
    const f = parsed.form;
    // Formato antigo guardava o telefone como string: descarta, pede de novo.
    const phone = (p: unknown): Phone =>
      p && typeof p === "object" && "number" in p ? (p as Phone) : EMPTY_PHONE;
    // Formulário salvo antes da escolha PF/PJ não tem `personType`: é pessoa física.
    const personType: PersonType = f.contact?.personType === "pj" ? "pj" : "pf";
    return {
      form: {
        contact: { ...EMPTY_FORM.contact, ...f.contact, personType, phone: phone(f.contact?.phone) },
        recipient: { ...EMPTY_FORM.recipient, ...f.recipient, phone: phone(f.recipient?.phone) },
        recipientTouched: Boolean(f.recipientTouched),
        address: { ...EMPTY_FORM.address, ...f.address },
      },
      step: STEPS.some((s) => s.key === parsed.step) ? parsed.step! : "contato",
    };
  } catch {
    return null;
  }
}

export function saveForm(form: CheckoutForm, step: Step): void {
  if (typeof window === "undefined") return;
  try {
    const stored: StoredForm = { form, step, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Sem storage (aba anônima, storage bloqueado): o formulário só não sobrevive à saída.
  }
}

/**
 * CEP cotado na home (`anln_cep`, localStorage, 8 dígitos) para adiantar o
 * endereço do checkout. Vazio se não houver ou o storage não estiver acessível.
 */
export function quotedCep(): string {
  try {
    const d = onlyDigits(window.localStorage.getItem("anln_cep") ?? "");
    return d.length === 8 ? d : "";
  } catch {
    return "";
  }
}

export function clearForm(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // idem
  }
}
