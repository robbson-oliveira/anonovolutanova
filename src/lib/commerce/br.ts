/**
 * Máscaras e validações brasileiras do checkout (CPF, CNPJ, CEP, telefone, UF).
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

/** "00.000.000/0000-00" enquanto se digita. */
/**
 * CNPJ sem máscara, em maiúsculas. Desde julho de 2026 a Receita emite CNPJ
 * alfanumérico: as 12 primeiras posições aceitam letras, os 2 dígitos
 * verificadores continuam números. Os numéricos antigos seguem valendo.
 */
export function normalizeCnpj(value: string): string {
  const chars = (value ?? "").toUpperCase().replace(/[^0-9A-Z]/g, "");
  const base = chars.slice(0, 12);
  const check = chars.slice(12).replace(/\D/g, "").slice(0, 2);
  return base + check;
}

export function maskCnpj(value: string): string {
  const c = normalizeCnpj(value);
  const parts = [c.slice(0, 2), c.slice(2, 5), c.slice(5, 8), c.slice(8, 12), c.slice(12, 14)];
  let out = parts[0];
  if (parts[1]) out += `.${parts[1]}`;
  if (parts[2]) out += `.${parts[2]}`;
  if (parts[3]) out += `/${parts[3]}`;
  if (parts[4]) out += `-${parts[4]}`;
  return out;
}

/**
 * Dígitos verificadores do CNPJ, numérico ou alfanumérico (pesos 5..2,9..2 e
 * 6..2,9..2; cada posição vale o código ASCII menos 48, então "0".."9" valem
 * 0..9 e "A".."Z" valem 17..42). Rejeita sequências repetidas.
 */
export function isValidCnpj(value: string): boolean {
  const c = normalizeCnpj(value);
  if (!/^[0-9A-Z]{12}\d{2}$/.test(c) || /^(.)\1{13}$/.test(c)) return false;
  const digit = (len: number) => {
    let sum = 0;
    let weight = len - 7;
    for (let i = 0; i < len; i++) {
      sum += (c.charCodeAt(i) - 48) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return digit(12) === Number(c[12]) && digit(13) === Number(c[13]);
}

export function maskCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const BR_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export type BrState = (typeof BR_STATES)[number];

/** Nome por extenso de cada UF, para listas ("Espírito Santo (ES)"). */
export const BR_STATE_NAMES: Record<BrState, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

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
