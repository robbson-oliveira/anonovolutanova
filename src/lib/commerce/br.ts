/**
 * Máscaras e validações brasileiras do checkout (CPF, CEP, telefone, UF).
 * Funções puras: nada aqui toca rede ou React.
 */

export const onlyDigits = (s: string) => (s ?? "").replace(/\D/g, "");

export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

/** Dígitos verificadores do CPF (e rejeita sequências repetidas). */
export function isValidCpf(value: string): boolean {
  const d = onlyDigits(value);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digit = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return digit(9) === Number(d[9]) && digit(10) === Number(d[10]);
}

export function maskCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

/** (27) 99279-4290 ou (27) 3279-4290. */
export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const isValidPhone = (value: string) => {
  const d = onlyDigits(value);
  return d.length === 10 || d.length === 11;
};

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const BR_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export type BrAddress = {
  postcode: string;
  address_1: string;
  number: string;
  neighborhood: string;
  address_2: string;
  city: string;
  state: string;
};

/**
 * Rótulos dos campos obrigatórios que faltam, na ordem do formulário. A Store
 * API recusa o pedido inteiro com um campo vazio, e só avisa na hora de pagar.
 */
export function missingAddressFields(a: Partial<BrAddress>): string[] {
  const filled = (v?: string) => Boolean(v?.trim());
  const missing: string[] = [];
  if (onlyDigits(a.postcode ?? "").length !== 8) missing.push("CEP");
  if (!filled(a.address_1)) missing.push("rua");
  if (!filled(a.number)) missing.push("número");
  if (!filled(a.neighborhood)) missing.push("bairro");
  if (!filled(a.city)) missing.push("cidade");
  if (!BR_STATES.includes((a.state ?? "") as (typeof BR_STATES)[number])) missing.push("estado");
  return missing;
}

/** "rua", "rua e número", "rua, número e cidade". */
export function joinLabels(labels: string[]): string {
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} e ${labels[labels.length - 1]}`;
}

export type ViaCepResult = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

const cepCache = new Map<string, ViaCepResult>();

/**
 * Endereço de um CEP pelo ViaCEP (público, sem chave, chamado do navegador).
 * `null` para CEP inexistente; lança se o serviço não responder.
 */
export async function lookupCep(cep: string): Promise<ViaCepResult | null> {
  const d = onlyDigits(cep);
  if (d.length !== 8) return null;
  const cached = cepCache.get(d);
  if (cached) return cached;

  const res = await fetch(`https://viacep.com.br/ws/${d}/json/`, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`ViaCEP ${res.status}`);
  const json = (await res.json()) as ViaCepResult & { erro?: boolean | string };
  if (json.erro) return null;
  cepCache.set(d, json);
  return json;
}
