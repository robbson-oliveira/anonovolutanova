"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Heading,
  IconArrowRight,
  IconCheck,
  IconMinus,
  IconPlus,
  IconSparkle,
  Text,
  cn,
} from "@ds/index";
import { whatsappUrlWith, type EditionId } from "@content/product";
import type { ProductOffer } from "@/lib/commerce/offer-types";
import { formatBRL } from "@/lib/format";
import { useOptionalCart } from "@/features/cart/CartProvider";
import { item, trackAddToCart, trackViewItem } from "@/lib/tracking/events";

/** Acima disso é revenda: o atendimento é pelo WhatsApp (B2B a partir de 50). */
const MAX_QTY = 49;

type PurchasePanelProps = {
  offer: ProductOffer;
  initialEdition?: EditionId;
};

export function PurchasePanel({ offer, initialEdition }: PurchasePanelProps) {
  const firstAvailable =
    offer.editions.find((e) => e.inStock)?.id ?? offer.editions[0].id;
  const [editionId, setEditionId] = useState<EditionId>(
    initialEdition && offer.editions.some((e) => e.id === initialEdition && e.inStock)
      ? initialEdition
      : firstAvailable,
  );
  const [qty, setQty] = useState(1);
  const groupName = useId();

  const cart = useOptionalCart();
  const router = useRouter();

  const edition = offer.editions.find((e) => e.id === editionId)!;
  const total = offer.price * qty;
  // O que já está no carrinho conta para o frete grátis.
  const missingForFreeShipping = Math.max(0, offer.freeShippingMinQty - qty - (cart?.count ?? 0));
  const soldOut = offer.editions.every((e) => !e.inStock);

  const changeQty = (next: number) =>
    setQty(Math.min(MAX_QTY, Math.max(1, Number.isFinite(next) ? next : 1)));

  // view_item: uma vez por visita à página, com as edições disponíveis. A
  // trava evita o disparo duplo do Strict Mode (efeitos rodam duas vezes em dev).
  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackViewItem(
      offer.editions
        .filter((e) => e.inStock)
        .map((e) => item(e.variationId ?? e.id, e.label, offer.price, 1)),
    );
  }, [offer]);

  const addToCart = async () => {
    if (!cart || !edition.variationId) return false;
    const ok = await cart.add(edition.variationId, qty);
    if (ok) trackAddToCart([item(edition.variationId, edition.label, offer.price, qty)]);
    return ok;
  };

  const orderMessage =
    `Olá! Quero ${qty} ${qty === 1 ? "unidade" : "unidades"} da ` +
    `${offer.name} — ${edition.label}.`;

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
      {/* Capa da edição escolhida. Mesma regra de paridade do BookCover do DS:
          altura fixa e largura automática, nunca object-fit — as duas capas
          têm proporções diferentes. Aqui via next/image porque os PNGs têm
          ~2,5 MB e a compra acontece no celular, vinda do Instagram. */}
      <div className="flex justify-center lg:sticky lg:top-8">
        <div className="relative flex h-[340px] items-end justify-center sm:h-[480px]">
          {offer.editions.map((e) => (
            <Image
              key={e.id}
              src={e.cover}
              alt={`Capa da ${offer.name}, ${e.label}`}
              width={e.coverSize.width}
              height={e.coverSize.height}
              sizes="(min-width: 640px) 330px, 240px"
              // A capa inicial é o LCP; a outra carrega junto para a troca ser imediata.
              preload={e.id === editionId}
              loading="eager"
              className={cn(
                "block h-full w-auto max-w-full drop-shadow-xl",
                "transition-opacity [transition-duration:var(--duration-fast)]",
                e.id === editionId ? "opacity-100" : "pointer-events-none absolute bottom-0 opacity-0",
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Badge tone="plain" icon={<IconSparkle />}>
            Edição Limitada
          </Badge>
          <Heading as="h1" level="section">
            {offer.name}
          </Heading>
          <Text className="leading-snug">
            Tema do mês, frase de São Josemaria Escrivá para cada dia e as práticas
            de vida interior para marcar — organização e fé na mesma página, o ano
            inteiro.
          </Text>
        </div>

        {/* Edição */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-xs font-bold text-text-strong">Escolha a edição</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {offer.editions.map((e) => {
              const active = e.id === editionId;
              return (
                <label
                  key={e.id}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-4 rounded-card border bg-surface-plain p-3",
                    "transition-colors [transition-duration:var(--duration-fast)]",
                    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-action",
                    active ? "border-action" : "border-border hover:border-action/50",
                    !e.inStock && "cursor-not-allowed opacity-50",
                  )}
                >
                  <input
                    type="radio"
                    name={groupName}
                    value={e.id}
                    aria-label={e.label}
                    checked={active}
                    disabled={!e.inStock}
                    onChange={() => setEditionId(e.id)}
                    className="sr-only"
                  />
                  <Image
                    src={e.cover}
                    alt=""
                    aria-hidden
                    width={e.coverSize.width}
                    height={e.coverSize.height}
                    sizes="56px"
                    loading="eager"
                    className="block h-[72px] w-auto"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-text-strong">{e.label}</span>
                    <span className="text-xs leading-snug text-text-muted">
                      {e.inStock ? e.description : "Esgotada"}
                    </span>
                  </span>
                  {active ? (
                    <span aria-hidden className="absolute top-3 right-3 text-action">
                      <IconCheck />
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Quantidade */}
        <div className="flex flex-col gap-3">
          <span id={`${groupName}-qty`} className="text-xs font-bold text-text-strong">
            Quantidade
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <div
              role="group"
              aria-labelledby={`${groupName}-qty`}
              className="inline-flex h-12 items-center rounded-card border border-border bg-surface-plain"
            >
              <button
                type="button"
                onClick={() => changeQty(qty - 1)}
                disabled={qty <= 1}
                aria-label="Diminuir quantidade"
                className="grid h-full w-12 cursor-pointer place-items-center text-text-strong disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconMinus />
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_QTY}
                value={qty}
                onChange={(ev) => changeQty(parseInt(ev.target.value, 10))}
                aria-label="Quantidade de agendas"
                className="h-full w-12 [appearance:textfield] bg-transparent text-center text-base font-bold text-text-strong [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => changeQty(qty + 1)}
                disabled={qty >= MAX_QTY}
                aria-label="Aumentar quantidade"
                className="grid h-full w-12 cursor-pointer place-items-center text-text-strong disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconPlus />
              </button>
            </div>
            <Text as="span" size="xs" tone={missingForFreeShipping ? "muted" : "accent"} aria-live="polite">
              {missingForFreeShipping
                ? `Faltam ${missingForFreeShipping} para o frete grátis`
                : "Frete grátis neste pedido"}
            </Text>
          </div>
        </div>

        {/* Preço */}
        <div className="flex flex-col gap-2 border-t border-border pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <Text as="span" size="sm" tone="muted">
              {qty} × {formatBRL(offer.price)}
            </Text>
            <span className="text-stat text-text-strong">{formatBRL(total)}</span>
          </div>
          <Text size="xs" tone="muted" className="text-right">
            Ou {offer.installments.count}x de {formatBRL(offer.installments.amount)} por agenda
          </Text>
        </div>

        {/* CTA — com o checkout desligado (NEXT_PUBLIC_CHECKOUT_ENABLED) ou sem o
            produto 2027 configurado, o pedido segue pelo WhatsApp. */}
        <div className="flex flex-col gap-3">
          {soldOut ? (
            <Button href={whatsappUrlWith(`Olá! Quero entrar na lista de espera da ${offer.name}.`)} size="lg" shape="block" target="_blank" rel="noopener">
              Entrar na lista de espera
            </Button>
          ) : offer.checkoutEnabled && cart && edition.variationId ? (
            <>
              <Button
                size="lg"
                shape="block"
                type="button"
                disabled={cart.busy || !edition.inStock}
                onClick={async () => {
                  if (await addToCart()) router.push("/checkout");
                }}
              >
                {cart.busy ? "Adicionando…" : "Garantir minha agenda"}
                <IconArrowRight />
              </Button>
              <button
                type="button"
                disabled={cart.busy || !edition.inStock}
                onClick={async () => {
                  if (await addToCart()) cart.openDrawer();
                }}
                className="cursor-pointer text-sm font-semibold text-action underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Adicionar ao carrinho e escolher a outra edição
              </button>
              {cart.error ? (
                <Text size="xs" tone="accent" role="alert" className="text-center">
                  {cart.error}
                </Text>
              ) : null}
            </>
          ) : (
            <>
              <Button href={whatsappUrlWith(orderMessage)} size="lg" shape="block" target="_blank" rel="noopener">
                Garantir pelo WhatsApp
                <IconArrowRight />
              </Button>
              <Text size="xs" tone="muted" className="text-center leading-snug">
                A compra direto pelo site abre em breve. Por enquanto, nossa equipe
                finaliza o seu pedido pelo WhatsApp.
              </Text>
            </>
          )}
          <Text size="xs" tone="muted" className="text-center leading-snug">
            Vai comprar {MAX_QTY + 1} unidades ou mais para revenda?{" "}
            <a
              href={whatsappUrlWith(`Olá! Tenho interesse em revender a ${offer.name}.`)}
              target="_blank"
              rel="noopener"
              className="font-semibold text-accent underline underline-offset-4"
            >
              Fale com a gente
            </a>
            .
          </Text>
        </div>
      </div>
    </div>
  );
}
