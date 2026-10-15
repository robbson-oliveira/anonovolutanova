/**
 * O WooCommerce e os gateways brasileiros esperam o telefone nacional (DDD +
 * número, só dígitos). Número de outro país vai em E.164, como veio.
 */
export function phoneForStore(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  return e164.startsWith("+55") ? digits.slice(2) : e164;
}

/**
 * Brazilian number for display: "(27) 99999-0000". Takes E.164 or the
 * national digits WooCommerce stores; any other number is shown as it came.
 */
export function formatPhone(value: string): string {
  const national = value.startsWith("+55") ? phoneForStore(value) : value.startsWith("+") ? "" : value.replace(/\D/g, "");
  if (national.length !== 10 && national.length !== 11) return value;
  return `(${national.slice(0, 2)}) ${national.slice(2, -4)}-${national.slice(-4)}`;
}
