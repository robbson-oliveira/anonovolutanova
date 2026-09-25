/**
 * O WooCommerce e os gateways brasileiros esperam o telefone nacional (DDD +
 * número, só dígitos). Número de outro país vai em E.164, como veio.
 */
export function phoneForStore(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  return e164.startsWith("+55") ? digits.slice(2) : e164;
}
