const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** R$ 109,90 */
export const formatBRL = (value: number) => BRL.format(value);
