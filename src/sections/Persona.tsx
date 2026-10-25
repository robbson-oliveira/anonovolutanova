"use client";

import { useLayoutEffect, useRef } from "react";
import { IconCheck, Reveal, RevealGroup, pageFrameClass } from "@ds/index";
import { PERSONA } from "@content/home";

/* -----------------------------------------------------------------------------
   PERSONA — Figma "Seção 5" (949:544), frame de 1440 de largura.
   padding 100/60 · gap 60 · título 648 + parágrafo 458 (gap 114) ·
   grade 1305 de 3 colunas, gap 48/36 · card 403x231 r20, borda 2px dourada,
   fundo petróleo · ícone 60x60 · gap ícone→texto 24 · texto 239px 20/24 500 -0.4px

   Telas menores (mobile first; as medidas acima valem a partir de xl/1280):
   - o conteúdo é fluido até 1305px e centralizado — acima de 1440 não estica;
   - título e parágrafo empilham até xl, quando voltam lado a lado;
   - a grade vai de 1 coluna (celular) a 2 (sm) e 3 (lg); no celular o card
     perde a altura mínima e o ícone fica ao lado do texto, para a lista não
     ficar alta demais.

   On a phone the six cards are a scroll-linked stack (see `usePersonaStack`):
   the title stays put under the header and each next card rises over the
   one in front, which scales down and fades. The list keeps its own height,
   so nothing inserts an empty stage. The section ends as the last card
   covers the one before it; Depoimentos follows at the section's own
   padding. Reduced motion and widths from `sm` up keep the plain grid.
   -------------------------------------------------------------------------- */

/**
 * Scroll-linked stack for the phone layout. The intro and each card are
 * `position: sticky` inside the section's own height — the page scroll
 * drives the pile, with no wheel hijack, no `preventDefault`, and no extra
 * runway. A viewport-tall stage left a blank screen under the active card;
 * keeping every card in flow means the next one is what sits below.
 * The sticky offset clears the shipping bar and the phone header.
 * Reversible because every frame is a pure function of scroll position.
 */
function usePersonaStack(
  trackRef: { readonly current: HTMLDivElement | null },
  stickyRef: { readonly current: HTMLDivElement | null },
  listRef: { readonly current: HTMLUListElement | null },
) {
  useLayoutEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const list = listRef.current;
    if (!track || !sticky || !list) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 639px)");
    let frame = 0;
    let cardH = 0;
    let gap = 0;
    /** Viewport Y the cards stick to. Cached; not read on scroll. */
    let stickLine = 0;
    /** Layout document-Y of each card. Scroll math uses these, not rects. */
    let tops: number[] = [];
    let cancelled = false;

    const cards = () => [...list.querySelectorAll<HTMLElement>("[data-persona-card]")];

    const clearCard = (card: HTMLElement) => {
      card.style.transform = "";
      card.style.opacity = "";
      card.style.transformOrigin = "";
      card.style.willChange = "";
    };

    const clearLi = (li: HTMLElement) => {
      li.style.position = "";
      li.style.top = "";
      li.style.zIndex = "";
      li.style.height = "";
      li.style.marginBottom = "";
      li.style.paddingBottom = "";
      li.style.boxSizing = "";
      li.style.removeProperty("animation");
    };

    const reset = () => {
      for (const card of cards()) {
        clearCard(card);
        const li = card.parentElement;
        if (li) clearLi(li);
      }
      list.style.display = "";
      list.style.flexDirection = "";
      list.style.gap = "";
      list.style.marginTop = "";
      list.style.position = "";
      list.style.zIndex = "";
      list.querySelectorAll("[data-persona-spacer]").forEach((node) => node.remove());
      sticky.style.position = "";
      sticky.style.top = "";
      sticky.style.paddingBottom = "";
      track.style.paddingBottom = "";
      track.removeAttribute("data-persona-stack");
    };

    // Park the title just under the shipping bar and the phone header.
    const pinTop = () => {
      const bar = document.querySelector<HTMLElement>("[data-anln-topbar]");
      const header = document.querySelector<HTMLElement>("[data-anln-header]");
      const barBottom = bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
      const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
      return Math.max(barBottom, headerBottom) + 12;
    };

    const measure = () => {
      reset();
      cardH = 0;
      if (reduce.matches || !narrow.matches) return false;
      // A grid cell is only as tall as its item, so sticky on the <li>
      // would have nowhere to travel. A column with flex gap (not margin
      // or padding on the sticky box) lets the next card rise over the
      // one stuck above it. Margin or padding on that box holds the next
      // card a step lower, so the one behind peeks out above it.
      list.style.display = "flex";
      list.style.flexDirection = "column";
      list.style.gap = "1rem";
      const items = cards();
      const heights = items.map((card) => card.parentElement?.offsetHeight ?? 0);
      cardH = Math.max(0, ...heights);
      if (!cardH) return false;

      // The gap under the paragraph becomes padding on the sticky intro,
      // and the list is pulled back over that padding. The intro box then
      // ends where the card pile ends, so the title and the last card
      // leave together. No padding on the track: a card of it stayed in
      // the document after the last card had already covered the one
      // before it, and that was the blank band before Depoimentos. The
      // list's own height is the whole runway.
      gap = parseFloat(getComputedStyle(list).marginTop) || 0;
      sticky.style.position = "sticky";
      sticky.style.top = `${pinTop()}px`;
      sticky.style.paddingBottom = `${cardH + gap}px`;
      list.style.marginTop = `-${cardH}px`;
      list.style.position = "relative";
      list.style.zIndex = "1";
      track.dataset.personaStack = "on";
      track.style.paddingBottom = "";

      items.forEach((card, i) => {
        const li = card.parentElement;
        if (!li) return;
        li.style.position = "sticky";
        li.style.zIndex = String(i + 1);
        li.style.height = `${cardH}px`;
        li.style.marginBottom = "0";
        li.style.paddingBottom = "0";
        li.style.boxSizing = "border-box";
        // The entrance animation writes `transform` on the <li>. Any
        // transform on the sticky box itself stops it sticking in Safari.
        li.style.setProperty("animation", "none", "important");
        card.style.willChange = "transform";
        card.style.transformOrigin = "top center";
      });

      const top = pinTop();
      sticky.style.top = `${top}px`;
      const text = sticky.querySelector<HTMLElement>("[data-persona-intro]");
      // Layout height, not the current viewport position. Measuring the
      // text with getBoundingClientRect while the section is still down
      // the page stored that distance as the sticky offset.
      const textH = text?.offsetHeight ?? sticky.offsetHeight;
      stickLine = top + textH + gap;
      const listDoc = list.getBoundingClientRect().top + window.scrollY;
      tops = items.map((card) => {
        const li = card.parentElement;
        if (!li) return 0;
        li.style.top = `${stickLine.toFixed(2)}px`;
        return listDoc + li.offsetTop;
      });
      return true;
    };

    const update = () => {
      frame = 0;
      if (reduce.matches || !narrow.matches) {
        if (track.dataset.personaStack === "on") reset();
        return;
      }
      if (!cardH && !measure()) return;

      const y = window.scrollY;
      const items = cards();
      // Transforms only. Reading layout here is what shook the pile on
      // iPhone: sticky `top` and getBoundingClientRect on every frame.
      for (let i = items.length - 1; i >= 0; i--) {
        const card = items[i];
        if (!items[i + 1]) {
          if (card.style.transform) clearCard(card);
          continue;
        }
        const nextVisual = Math.max(stickLine, tops[i + 1] - y);
        const linear = Math.min(1, Math.max(0, (stickLine + cardH - nextVisual) / cardH));
        // Smoothstep: the scale and fade ease across the same short gap
        // the cards already have. Full cover still lands when linear is 1.
        const progress = linear * linear * (3 - 2 * linear);
        const scale = 1 - progress * 0.06;
        const opacity = 1 - progress * 0.45;
        // 14px at rest is enough to sink the gold edge under the card in
        // front. A live rect correction forced layout and jittered.
        const tuck = progress * 14;
        card.style.transformOrigin = "top center";
        card.style.transform = `translate3d(0,${tuck.toFixed(1)}px,0) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      cardH = 0;
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Toolbar show/hide resizes the visual viewport without changing
    // layout. Remeasuring on that event was a second source of jitter.
    const shell = document.querySelector("[data-anln-header]")?.parentElement;
    const shellObserver = shell ? new ResizeObserver(onResize) : null;
    if (shell) shellObserver?.observe(shell);
    reduce.addEventListener("change", onResize);
    narrow.addEventListener("change", onResize);
    void document.fonts?.ready.then(() => {
      if (!cancelled) onResize();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      shellObserver?.disconnect();
      reduce.removeEventListener("change", onResize);
      narrow.removeEventListener("change", onResize);
      reset();
    };
  }, [trackRef, stickyRef, listRef]);
}

export function Persona() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  usePersonaStack(trackRef, stickyRef, listRef);

  return (
    <section
      id="persona"
      className={`${pageFrameClass} bg-surface py-16 md:py-20 xl:py-[100px]`}
    >
      <div ref={trackRef} className="mx-auto w-full max-w-[1305px]">
        <RevealGroup>
          <div ref={stickyRef}>
            <div
              data-persona-intro
              className="relative z-30 flex flex-col gap-6 bg-surface xl:flex-row xl:items-center xl:justify-between xl:gap-[114px]"
            >
              <Reveal variant="up">
                {/* text-h2 = clamp(34px, 4.2vw, 60px), lh 1, ls -0.05em (= -3px at 60px).
                    Phone breaks are explicit so the three lines match the reference. */}
                <h2 className="m-0 max-w-[648px] text-h2 text-text-lead max-md:text-[32px] max-md:leading-[1.08] xl:w-[648px]">
                  Feita para quem
                  <br className="md:hidden" />
                  <span className="max-md:hidden"> </span>
                  quer viver
                  <br className="md:hidden" />
                  <span className="max-md:hidden"> </span>
                  com propósito
                </h2>
              </Reveal>
              <Reveal variant="up" delay={90}>
                <p className="m-0 max-w-[640px] text-balance text-base font-normal leading-6 text-text max-sm:text-[15px] max-sm:leading-snug xl:w-[458px] xl:text-[20px] xl:leading-6">
                  <span className="md:hidden">
                    A Agenda Ano Novo, Luta Nova é
                    <br />
                    para quem busca unir fé e vida
                    <br />
                    prática, para quem acredita que
                    <br />
                    organizar o tempo é também
                    <br />
                    cuidar da alma.
                  </span>
                  <span className="hidden md:inline">{PERSONA.paragraph}</span>
                </p>
              </Reveal>
            </div>
          </div>

          <ul
            ref={listRef}
            className="m-0 mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:mt-[60px] xl:gap-x-12 xl:gap-y-9"
          >
          {PERSONA.items.map((item, i) => (
            <Reveal key={item} as="li" variant="up" delay={120 + (i % 3) * 80}>
              <div
                data-persona-card
                className={
                  "flex h-full origin-center flex-row items-center gap-4 rounded-[20px] border-2 border-solid " +
                  "border-gold-start bg-surface-warm-card px-5 py-6 " +
                  "sm:flex-col sm:items-start sm:justify-center sm:gap-6 sm:px-[18px] sm:py-[18px] " +
                  "motion-reduce:transform-none motion-reduce:opacity-100 " +
                  "lg:min-h-[231px]"
                }
              >
                <span
                  aria-hidden
                  className="grid size-12 shrink-0 place-items-center text-[22px] text-text-on-inverse sm:size-[60px]"
                >
                  <IconCheck />
                </span>
                <p className="m-0 text-balance text-[18px] font-medium leading-6 tracking-[-0.02em] text-text-on-warm sm:max-w-[239px] sm:text-[20px] sm:tracking-[-0.4px]">
                  {item}
                </p>
              </div>
            </Reveal>
          ))}
          </ul>
        </RevealGroup>
      </div>
    </section>
  );
}
