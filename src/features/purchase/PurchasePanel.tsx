"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Heading,
  IconArrowRight,
  IconMinus,
  IconPlus,
  IconSparkle,
  Text,
  cn,
} from "@ds/index";
import { whatsappUrlWith, type EditionId } from "@content/product";
import type { ProductImage, ProductOffer } from "@/lib/commerce/offer-types";
import { formatBRL } from "@/lib/format";
import { useOptionalCart } from "@/features/cart/CartProvider";
import { plannerThumbFocus } from "@/features/cart/planner-thumb";
import { ProductThumb } from "@/features/cart/ProductThumb";
import { GalleryStrip } from "./GalleryStrip";
import { ShippingEstimate } from "./ShippingEstimate";
import { item, trackAddToCart, trackViewItem } from "@/lib/tracking/events";

/** Acima disso é revenda: o atendimento é pelo WhatsApp (B2B a partir de 50). */
const MAX_QTY = 49;

type PurchasePanelProps = {
  offer: ProductOffer;
  /** Nível do título com o nome do produto dentro da seção onde o painel está. */
  headingAs?: "h1" | "h2" | "h3";
};

export function PurchasePanel({ offer, headingAs = "h2" }: PurchasePanelProps) {
  const firstAvailable =
    offer.editions.find((e) => e.inStock)?.id ?? offer.editions[0].id;
  const [editionId, setEditionId] = useState<EditionId>(firstAvailable);

  // `?edicao=classica` (links antigos de /comprar e de divulgação) escolhe a
  // edição. Lido no navegador para a home continuar estática.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("edicao");
    const match = offer.editions.find((e) => e.id === requested && e.inStock);
    if (match) setEditionId(match.id);
  }, [offer]);
  const [qty, setQty] = useState(1);
  // Gallery image shown in the stage instead of the cover; tied to its edition so a switch drops it.
  const [shown, setShown] = useState<{ edition: EditionId; index: number } | null>(null);
  const groupName = useId();

  const cart = useOptionalCart();
  const router = useRouter();

  const edition = offer.editions.find((e) => e.id === editionId)!;
  const total = edition.price * qty;
  const { coverSize: cs, coverBox: cb } = edition;
  const coverThumb: ProductImage = {
    src: edition.cover,
    thumbnail: edition.cover,
    srcset: "",
    sizes: "",
    alt: `${offer.name}, ${edition.label}`,
    bounds: {
      aspect: cs.width / cs.height,
      x: cb.x / cs.width,
      y: cb.y / cs.height,
      width: cb.width / cs.width,
      height: cb.height / cs.height,
    },
  };
  const galleryImages = [coverThumb, ...edition.gallery];
  const shownImage = shown?.edition === editionId ? (galleryImages[shown.index] ?? null) : null;
  // O que já está no carrinho conta para o frete grátis.
  const missingForFreeShipping = Math.max(0, offer.freeShippingMinQty - qty - (cart?.count ?? 0));
  // The selector is not in the cart yet, so only the cart alone can claim the benefit as already earned.
  const cartAlreadyQualifies = (cart?.count ?? 0) >= offer.freeShippingMinQty;
  const soldOut = offer.editions.every((e) => !e.inStock);

  const changeQty = (next: number) =>
    setQty(Math.min(MAX_QTY, Math.max(1, Number.isFinite(next) ? next : 1)));

  // The stage width, written to --stage-w, caps the cover scale for wide covers (the notepad).
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      el.style.setProperty("--stage-w", `${entry.contentBoxSize[0].inlineSize}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // view_item: uma vez por visita à página, com as edições disponíveis. A
  // trava evita o disparo duplo do Strict Mode (efeitos rodam duas vezes em dev).
  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackViewItem(
      offer.editions
        .filter((e) => e.inStock)
        .map((e) => item(e.productId ?? e.id, e.label, e.price, 1)),
    );
  }, [offer]);

  const addToCart = async () => {
    if (!cart || !edition.productId) return false;
    const ok = await cart.add(edition.productId, qty);
    if (ok) trackAddToCart([item(edition.productId, edition.label, edition.price, qty)]);
    return ok;
  };

  const orderMessage =
    `Olá! Quero ${qty} ${qty === 1 ? "unidade" : "unidades"} da ` +
    `${offer.name} — ${edition.label}.`;

  return (
    <div className="grid grid-cols-1 items-start gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
      {/* Capa da edição escolhida. Mesma regra de paridade do BookCover do DS:
          altura fixa e largura automática, nunca object-fit — as duas capas
          têm proporções diferentes. Aqui via next/image porque os PNGs têm
          ~2,5 MB e a compra acontece no celular, vinda do Instagram. */}
      {/* Sticks under the fixed shipping bar (36px) and the compact menu
          (56px). The grid is only as tall as the buy column, so the cover
          releases when that column ends — at the wholesale line. */}
      <div className="flex flex-col items-center gap-5 lg:sticky lg:top-[100px]">
        <div
          ref={stageRef}
          className="relative flex h-(--stage-h) w-full items-center justify-center [--stage-h:260px] sm:[--stage-h:480px]"
        >
          {offer.editions.map((e) => {
            const { coverBox: box, coverSize: size } = e;
            // --s scales one cover-file pixel to CSS pixels: the book fills the
            // stage height (or width for a wide cover like the notepad).
            // The layout box is the book only; the drop shadow bleeds outside.
            // --stage-w is set by the ResizeObserver above; the 500px fallback
            // covers SSR and the first paint before the observer fires.
            const px = (v: number) => `calc(${v} * var(--s))`;
            return (
              <div
                key={e.id}
                style={
                  {
                    "--s": `min(calc(var(--stage-h) / ${box.height}), calc(var(--stage-w, 500px) / ${box.width}))`,
                    width: px(box.width),
                    height: px(box.height),
                  } as React.CSSProperties
                }
                className={cn(
                  // Only the visible cover is in flow; `relative` must not sit next to
                  // `absolute`, or it wins in the stylesheet and hidden covers take up the row.
                  "shrink-0 transition-opacity [transition-duration:var(--duration-fast)]",
                  e.id === editionId && !shownImage
                    ? "relative opacity-100"
                    : "pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0",
                )}
              >
                <Image
                  src={e.cover}
                  alt={`Capa da ${offer.name}, ${e.label}`}
                  width={size.width}
                  height={size.height}
                  sizes="(min-width: 640px) 740px, 480px"
                  loading="lazy"
                  style={{
                    width: px(size.width),
                    height: px(size.height),
                    left: px(-box.x),
                    top: px(-box.y),
                  }}
                  className="absolute max-w-none drop-shadow-md"
                />
              </div>
            );
          })}
          {shownImage ? (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={shownImage.src}
                src={shownImage.src}
                srcSet={shownImage.srcset || undefined}
                sizes="(min-width: 640px) 480px, 330px"
                alt={shownImage.alt || `${offer.name}, ${edition.label}`}
                decoding="async"
                className="block h-auto max-h-(--stage-h) w-auto max-w-full"
              />
            </div>
          ) : null}
        </div>

        {/* Gallery from WooCommerce: only exists when the product has more
            images than its main one. */}
        {galleryImages.length > 0 ? (
          <GalleryStrip
            key={edition.id}
            images={galleryImages}
            label={`${offer.name}, ${edition.label}`}
            selected={shownImage ? shown!.index : 0}
            onSelect={(index) => setShown(index === null || index === 0 ? null : { edition: editionId, index })}
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Badge tone="plain" icon={<IconSparkle />}>
            Edição Limitada
          </Badge>
          <Heading as={headingAs} level={headingAs === "h1" ? "section" : "subsection"}>
            {offer.name}
          </Heading>
          <Text className="leading-snug max-md:text-[14px] max-md:leading-normal">
            Tema do mês, frase de São Josemaria Escrivá para cada dia e as práticas
            de vida interior e{"\u00A0"}muito{"\u00A0"}mais.
          </Text>
        </div>

        {/* Edição */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 pr-3 text-xs font-bold leading-snug text-text-strong max-md:text-[14px]">
            Escolha a edição e a quantidade:
          </legend>
          <div className="grid gap-3">
            {offer.editions.map((e) => {
              const active = e.id === editionId;
              return (
                <label
                  key={e.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-card border bg-surface-plain py-2 pr-2.5 pl-2.5",
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
                    aria-checked={active}
                    checked={active}
                    disabled={!e.inStock}
                    onChange={() => setEditionId(e.id)}
                    className="sr-only"
                  />
                  <ProductThumb
                    image={e.image}
                    fallback={e}
                    sizes="64px"
                    className="size-14 shrink-0 md:size-16"
                    focus={e.id === "bloco" ? plannerThumbFocus(e) : null}
                  />
                  <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                    <span className="text-[15px] font-bold leading-5 text-text-strong md:text-sm">
                      {e.label}
                    </span>
                    <span className="text-balance text-[13px] leading-snug text-text-muted md:text-xs">
                      {e.inStock ? e.description : "Esgotada"}
                    </span>
                  </span>
                  {/* Even sizes and grid centering: a half-pixel translate left the dot off the ring. */}
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-[22px] shrink-0 place-items-center rounded-full border-2 bg-surface-plain leading-none",
                      active ? "border-action shadow-radio" : "border-text-muted",
                    )}
                  >
                    {active ? <span className="size-[10px] shrink-0 rounded-full bg-action" /> : null}
                  </span>
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 max-md:gap-2">
              <div
                role="group"
                aria-labelledby={`${groupName}-qty`}
                className="inline-flex h-14 shrink-0 items-center rounded-card border border-border bg-surface-plain max-md:h-12"
              >
                <button
                  type="button"
                  onClick={() => changeQty(qty - 1)}
                  disabled={qty <= 1}
                  aria-label="Diminuir quantidade"
                  className="grid h-full w-12 cursor-pointer place-items-center text-text-strong disabled:cursor-not-allowed disabled:opacity-40 max-md:w-10"
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
                  aria-label={`Quantidade de ${edition.unit === "agenda" ? "agendas" : "blocos"}`}
                  className="h-full w-12 [appearance:textfield] bg-transparent text-center text-base font-bold text-text-strong max-md:w-9 max-md:text-sm [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => changeQty(qty + 1)}
                  disabled={qty >= MAX_QTY}
                  aria-label="Aumentar quantidade"
                  className="grid h-full w-12 cursor-pointer place-items-center text-text-strong disabled:cursor-not-allowed disabled:opacity-40 max-md:w-10"
                >
                  <IconPlus />
                </button>
              </div>
              {offer.checkoutEnabled && cart && edition.productId && !soldOut ? (
                <button
                  type="button"
                  disabled={cart.busy || !edition.inStock}
                  onClick={async () => {
                    if (await addToCart()) cart.openDrawer();
                  }}
                  className="flex h-14 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-card border border-gold-end bg-linear-90 from-gold-start to-gold-end px-3 text-center text-base font-semibold leading-tight text-on-action transition-[transform,box-shadow] [transition-duration:var(--duration-fast)] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-6px] hover:shadow-gold-start/60 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:hover:translate-y-0 max-md:h-12 max-md:px-2 max-md:text-[13px]"
                >
                  {cart.busy ? (
                    "Adicionando…"
                  ) : (
                    <>
                      <span className="md:hidden">
                        Adicionar ao
                        <br />
                        carrinho
                      </span>
                      <span className="hidden md:inline">Adicionar ao carrinho</span>
                    </>
                  )}
                </button>
              ) : null}
            </div>
            {edition.agenda ? (
              <Text as="span" size="xs" tone="muted" aria-live="polite">
                {missingForFreeShipping
                  ? `Faltam ${missingForFreeShipping} para o frete grátis`
                  : cartAlreadyQualifies
                    ? "Seu pedido já tem frete grátis"
                    : `Ao adicionar +${qty}, seu pedido ganha frete grátis`}
              </Text>
            ) : null}
            {offer.checkoutEnabled && cart?.error ? (
              <Text size="xs" tone="accent" role="alert" className="text-center">
                {cart.error}
              </Text>
            ) : null}
          </div>
        </div>

        {/* Preço */}
        <div className="flex flex-col gap-2 border-t border-border pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <Text as="span" size="sm" tone="muted">
              {qty} × {formatBRL(edition.price)}
            </Text>
            <span className="text-stat text-text-strong">{formatBRL(total)}</span>
          </div>
          <Text size="xs" tone="muted" className="text-left">
            Ou {offer.installments.count}x de {formatBRL(edition.installmentAmount)} por {edition.unit}
          </Text>
        </div>

        {/* Frete e prazo pelo CEP. The card quotes the order as it stands:
            units already in the cart, or the selector when the cart is
            still empty. Adding the selector on top of a cart of 3 made
            the badge say free shipping one unit early. The line under
            the stepper is what previews "ao adicionar". */}
        {offer.checkoutEnabled && edition.productId && !soldOut ? (
          <ShippingEstimate
            productId={edition.productId}
            quantity={(cart?.count ?? 0) > 0 ? (cart?.count ?? qty) : qty}
          />
        ) : null}

        {/* CTA */}
        <div className="flex flex-col gap-3">
          {soldOut ? (
            <Button href={whatsappUrlWith(`Olá! Quero entrar na lista de espera da ${offer.name}.`)} size="lg" shape="block" target="_blank" rel="noopener">
              Entrar na lista de espera
            </Button>
          ) : offer.checkoutEnabled && cart && edition.productId ? (
            <Button
              size="lg"
              shape="block"
              type="button"
              disabled={cart.busy || !cart.ready || !edition.inStock}
              onClick={async () => {
                if (!edition.productId || !cart.ready) return;
                // Adicionar already stored this edition. A second add-item
                // would stack another unit, including after a reload, when
                // the selector is back to 1. Finish with the cart as saved.
                const already = cart.cart?.items.some((item) => item.id === edition.productId);
                if (already) {
                  router.push("/checkout");
                  return;
                }
                if (await addToCart()) router.push("/checkout");
              }}
            >
              {cart.busy ? "Adicionando…" : "Finalizar Compra"}
              <IconArrowRight />
            </Button>
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
