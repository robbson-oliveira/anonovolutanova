"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { IconChevronRight, IconTruck, cn } from "@ds/index";
import { FREE_SHIPPING_MIN_QTY, whatsappUrlWith } from "@content/product";
import { maskCep } from "@/lib/commerce/br";
import {
  deliveryDateLabel,
  estimateShipping,
  isInvalidPostcodeError,
  parseRateChoice,
  ratePriceLabel,
  readStoredCep,
  readStoredRateChoiceRaw,
  resolveChosenRate,
  shippingErrorMessage,
  subscribeShippingStorage,
  writeStoredCep,
  writeStoredRateChoice,
  type ShippingEstimate as Estimate,
  type ShippingRate,
} from "@/lib/commerce/shipping-api";
import { CepForm, Spinner } from "./CepForm";
import { ShippingOptionsDialog } from "./ShippingOptionsDialog";

/** Espera antes de recotar uma troca de edição ou de quantidade (cliques no +/−). */
const REQUOTE_DELAY_MS = 400;

type Quote = { data: Estimate; cep: string; variationId: number; quantity: number };
type Outcome = "ok" | "error" | "stale";

const lineKey = (variationId: number, quantity: number, cep: string) => `${variationId}|${quantity}|${cep}`;

/** Título do card: "Chegará grátis até dia 5 de outubro", "Receba até dia 5 de outubro"… */
function headline(rate: ShippingRate): string {
  const date = deliveryDateLabel(rate);
  if (rate.is_free) return date ? `Chegará grátis até ${date}` : "Chegará grátis";
  return date ? `Receba até ${date}` : `Entrega via ${rate.label}`;
}

type ShippingEstimateProps = {
  /** Variação (edição) no WooCommerce. Sem ela o card não aparece. */
  variationId: number;
  quantity: number;
};

/**
 * Card de frete e prazo da página de produto.
 *
 * 1. Ao montar, retoma o CEP guardado (`anln_cep`) e cota em silêncio.
 * 2. Trocar a edição ou a quantidade recota depois de 400ms, para o card
 *    sempre falar da linha que vai para o carrinho. Respostas atrasadas de
 *    linhas anteriores são descartadas.
 * 3. O selo segue a regra do negócio: frete grátis por QUANTIDADE.
 * 4. "Mais detalhes e formas de entrega" abre o modal com todas as taxas, a
 *    troca de CEP e a escolha da forma de entrega (`anln_shipping_rate`), que
 *    o checkout lê para marcar a mesma.
 */
export function ShippingEstimate({ variationId, quantity }: ShippingEstimateProps) {
  // localStorage via useSyncExternalStore: o servidor (e a hidratação) veem "",
  // o navegador lê o valor guardado logo em seguida, sem descompasso.
  const storedCep = useSyncExternalStore(subscribeShippingStorage, readStoredCep, () => "");
  const choiceRaw = useSyncExternalStore(subscribeShippingStorage, readStoredRateChoiceRaw, () => "");
  const choice = useMemo(() => parseRateChoice(choiceRaw), [choiceRaw]);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [pending, setPending] = useState(false);
  /** Falha ao cotar a linha atual (rede, limite de consultas). */
  const [quoteError, setQuoteError] = useState<string | null>(null);
  /** Falha ao cotar um CEP novo digitado — aparece junto do campo. */
  const [cepError, setCepError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  /** CEP que as próximas cotações usam (o digitado, enquanto é testado). */
  const targetCep = useRef("");
  /** Último CEP aceito: cotado com sucesso ou retomado do localStorage. */
  const acceptedCep = useRef("");
  const acceptedKey = useRef<string | null>(null);
  /** Linha (edição|quantidade|CEP) da última cotação disparada. */
  const lastKey = useRef<string | null>(null);
  /** Número da última cotação: só a resposta dela mexe no estado. */
  const seq = useRef(0);
  const inFlight = useRef<AbortController | null>(null);

  const runQuote = useCallback(async (cep: string, variation: number, qty: number): Promise<Outcome> => {
    // Uma cotação nova invalida a anterior: cancela o fetch e, se a resposta
    // já estiver a caminho, o número de sequência a descarta.
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    const id = ++seq.current;
    const key = lineKey(variation, qty, cep);
    lastKey.current = key;
    setPending(true);

    try {
      const data = await estimateShipping({ variationId: variation, quantity: qty, postcode: cep }, controller.signal);
      if (id !== seq.current || controller.signal.aborted) return "stale";
      acceptedCep.current = cep;
      acceptedKey.current = key;
      targetCep.current = cep;
      setQuote({ data, cep, variationId: variation, quantity: qty });
      setQuoteError(null);
      setCepError(null);
      writeStoredCep(cep);
      return "ok";
    } catch (err) {
      if (id !== seq.current || controller.signal.aborted) return "stale";
      if (cep !== acceptedCep.current) {
        // CEP novo recusado: o anterior continua valendo e na tela.
        targetCep.current = acceptedCep.current;
        lastKey.current = acceptedKey.current;
        setCepError(shippingErrorMessage(err));
      } else if (isInvalidPostcodeError(err)) {
        // O CEP guardado deixou de valer: volta ao campo vazio, sem alarde.
        targetCep.current = "";
        acceptedCep.current = "";
        acceptedKey.current = null;
        setQuote(null);
        writeStoredCep(null);
      } else {
        // Sem cotação da linha atual: mostrar a antiga prometeria outro frete.
        setQuote(null);
        setQuoteError(shippingErrorMessage(err));
      }
      return "error";
    } finally {
      if (id === seq.current) {
        setPending(false);
        inFlight.current = null;
      }
    }
  }, []);

  // Mantém a cotação em dia com a linha. Imediata na primeira (CEP retomado);
  // com espera nas trocas seguintes, para uma sequência de cliques no + virar
  // uma consulta só.
  useEffect(() => {
    if (!variationId) return;
    // CEP guardado diferente do aceito: retomada ao montar, ou outra aba trocou.
    if (storedCep && storedCep !== acceptedCep.current) {
      acceptedCep.current = storedCep;
      targetCep.current = storedCep;
    }
    const cep = targetCep.current;
    if (!cep || lineKey(variationId, quantity, cep) === lastKey.current) return;

    const delay = lastKey.current === null ? 0 : REQUOTE_DELAY_MS;
    const timer = window.setTimeout(() => {
      // Relido na hora: um CEP digitado nesse meio-tempo já vale para esta linha.
      const current = targetCep.current;
      if (!current || lineKey(variationId, quantity, current) === lastKey.current) return;
      void runQuote(current, variationId, quantity);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [storedCep, variationId, quantity, runQuote]);

  // Saiu da página no meio de uma cotação: cancela o fetch.
  useEffect(() => {
    const requests = inFlight;
    return () => requests.current?.abort();
  }, []);

  const submitCep = async (digits: string) => {
    setCepError(null);
    targetCep.current = digits;
    return (await runQuote(digits, variationId, quantity)) === "ok";
  };

  const retry = () => {
    const cep = targetCep.current || storedCep;
    if (cep) void runQuote(cep, variationId, quantity);
  };

  if (!variationId) return null;

  const data = quote?.data ?? null;
  const rates = data?.rates ?? [];
  const selected = resolveChosenRate(rates, choice);
  const shownCep = quote?.cep ?? storedCep;

  // Frete grátis por quantidade. Enquanto a cotação é de outra linha (antes da
  // primeira, ou nos 400ms depois de mudar a quantidade), vale a regra local.
  const isCurrentLine = quote !== null && quote.variationId === variationId && quote.quantity === quantity;
  const minQty = data?.free_shipping.min_qty || FREE_SHIPPING_MIN_QTY;
  const qualifies =
    isCurrentLine && data
      ? data.free_shipping.qualifies || rates.some((r) => r.is_free)
      : quantity >= minQty;
  const remaining =
    isCurrentLine && data ? data.free_shipping.remaining : Math.max(0, minQty - quantity);

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 self-start rounded-pill px-2.5 py-1 text-caption font-bold uppercase",
        qualifies ? "bg-action text-on-action" : "bg-surface-sage text-text-strong",
      )}
    >
      <IconTruck className="size-3.5" />
      {qualifies ? "Frete grátis neste pedido" : `Frete grátis a partir de ${minQty} unidades`}
    </span>
  );

  // Sem CEP ainda: o campo direto no card, sem precisar abrir o modal.
  if (!shownCep) {
    return (
      <section aria-label="Frete e prazo de entrega" className="flex flex-col gap-3 rounded-card border border-border bg-surface-plain p-4 sm:p-5">
        {badge}
        <CepForm
          label="Calcular frete e prazo"
          showLabel
          pending={pending}
          error={cepError ?? quoteError}
          onSubmit={submitCep}
        />
      </section>
    );
  }

  return (
    <section aria-label="Frete e prazo de entrega" className="flex flex-col gap-3 rounded-card border border-border bg-surface-plain p-4 sm:p-5">
      {badge}

      <div
        aria-live="polite"
        aria-busy={pending || undefined}
        className={cn(
          "flex min-h-11 flex-col justify-center gap-1 transition-opacity [transition-duration:var(--duration-fast)]",
          pending && data && "opacity-60",
        )}
      >
        {data && selected ? (
          <>
            <p className="text-field font-bold text-text-strong">{headline(selected)}</p>
            <p className="text-fine text-text-muted">
              {selected.label} · {ratePriceLabel(selected)} · para o CEP {maskCep(shownCep)}
            </p>
          </>
        ) : data ? (
          <p className="text-label leading-relaxed text-text-muted">
            Ainda não temos uma forma de entrega calculada para o CEP {maskCep(shownCep)}.{" "}
            <a
              href={whatsappUrlWith(`Olá! Quero saber o frete da agenda para o CEP ${maskCep(shownCep)}.`)}
              target="_blank"
              rel="noopener"
              className="font-semibold text-action underline underline-offset-4"
            >
              Fale com a gente pelo WhatsApp
            </a>
            .
          </p>
        ) : quoteError && !pending ? (
          <div className="flex flex-col items-start gap-1">
            <p role="alert" className="text-label text-accent">
              {quoteError}
            </p>
            <button
              type="button"
              onClick={retry}
              className="cursor-pointer text-label font-semibold text-action underline underline-offset-4"
            >
              Tentar de novo
            </button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-label text-text-muted">
            <Spinner />
            Calculando frete e prazo para o CEP {maskCep(shownCep)}…
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex cursor-pointer items-center gap-1 self-start text-label font-semibold text-action underline-offset-4 hover:underline"
      >
        Mais detalhes e formas de entrega
        <IconChevronRight />
      </button>

      <ShippingOptionsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cep={shownCep}
        state={data?.state ?? ""}
        rates={rates}
        selectedRateId={selected?.id ?? null}
        onSelectRate={(rate) => writeStoredRateChoice({ rateId: rate.id, methodId: rate.method_id })}
        pending={pending}
        cepError={cepError}
        quoteError={quoteError}
        freeShipping={{ qualifies, remaining, minQty }}
        onSubmitCep={submitCep}
      />
    </section>
  );
}
