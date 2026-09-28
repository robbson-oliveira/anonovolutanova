/**
 * O WooCommerce e os gateways brasileiros esperam o telefone nacional (DDD +
 * número, só dígitos). Número de outro país vai em E.164, como veio.
 */
export function phoneForStore(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  return e164.startsWith("+55") ? digits.slice(2) : e164;
}

/** Brazilian number for display: "(27) 99999-0000". Other countries stay in E.164. */
export function formatPhone(e164: string): string {
  if (!e164.startsWith("+55")) return e164;
  const d = phoneForStore(e164);
  if (d.length !== 10 && d.length !== 11) return e164;
  return `(${d.slice(0, 2)}) ${d.slice(2, -4)}-${d.slice(-4)}`;
}
