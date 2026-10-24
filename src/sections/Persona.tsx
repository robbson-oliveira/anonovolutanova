"use client";

import { useLayoutEffect, useRef } from "react";
import { IconCheck, Reveal, RevealGroup } from "@ds/index";
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
   the list sticks below the shipping bar, the next card rises over the one
   in front, and that one scales down and fades. After the last card the
   section lets go of the scroll. Reduced motion and widths from `sm` up
   keep the plain grid.
   -------------------------------------------------------------------------- */

/**
 * Scroll-linked stack for the phone layout. The list is `position: sticky`
 * inside a track tall enough for one step per card, so the page scroll
 * itself drives the animation — no wheel hijack, no `preventDefault`.
 * The sticky offset includes the fixed shipping bar (`[data-anln-topbar]`)
 * plus a gap, otherwise the bar sits on top of the active card.
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
    let stageH = 0;
    let lastTop = -1;
    let cancelled = false;

    const cards = () => [...list.querySelectorAll<HTMLElement>("[data-persona-card]")];

    const clearLi = (li: HTMLElement) => {
      li.style.position = "";
      li.style.top = "";
      li.style.left = "";
      li.style.right = "";
      li.style.width = "";
      li.style.height = "";
      li.style.zIndex = "";
      li.style.transform = "";
      li.style.transformOrigin = "";
      li.style.opacity = "";
      li.style.removeProperty("animation");
    };

    const reset = () => {
      for (const card of cards()) {
        const li = card.parentElement;
        if (li) clearLi(li);
      }
      list.style.position = "";
      list.style.height = "";
      list.style.overflow = "";
      list.style.marginTop = "";
      list.style.background = "";
      sticky.style.position = "";
      sticky.style.top = "";
      sticky.style.zIndex = "";
      track.style.minHeight = "";
      track.removeAttribute("data-persona-stack");
    };

    const barOffset = () => {
      const bar = document.querySelector<HTMLElement>("[data-anln-topbar]");
      const barH = bar ? bar.getBoundingClientRect().height : 0;
      // 20px under the bar: the parked card never slides underneath it.
      return barH + 20;
    };

    const measure = () => {
      reset();
      cardH = 0;
      stageH = 0;
      if (reduce.matches || !narrow.matches) return false;
      const heights = cards().map((card) => card.parentElement?.offsetHeight ?? 0);
      cardH = Math.max(0, ...heights);
      if (!cardH) return false;

      const top = barOffset();
      // The stage fills the screen under the bar so the next card has a
      // runway to climb, instead of popping inside a one-card slot.
      stageH = Math.max(cardH + 48, window.innerHeight - top - 16);

      list.style.position = "relative";
      list.style.height = `${stageH}px`;
      list.style.overflow = "hidden";
      // The class margin would collapse out of the sticky box and leave
      // the parked card tight against the shipping bar.
      list.style.marginTop = "0";
      sticky.style.position = "sticky";
      sticky.style.top = `${top}px`;
      sticky.style.zIndex = "20";
      track.dataset.personaStack = "on";

      cards().forEach((card, i) => {
        const li = card.parentElement;
        if (!li) return;
        li.style.position = "absolute";
        li.style.top = "12px";
        li.style.left = "0";
        li.style.right = "0";
        li.style.width = "100%";
        li.style.height = `${cardH}px`;
        li.style.transformOrigin = "center top";
        li.style.zIndex = String(i + 1);
        // The entrance animation also writes `transform` and would win
        // over the inline stack transform.
        li.style.setProperty("animation", "none", "important");
      });

      const step = stageH;
      const count = cards().length;
      track.style.minHeight = `${sticky.offsetHeight + step * Math.max(0, count - 1)}px`;
      return true;
    };

    const update = () => {
      frame = 0;
      if (reduce.matches || !narrow.matches) {
        if (track.dataset.personaStack === "on") reset();
        return;
      }
      if (!cardH && !measure()) return;

      const top = barOffset();
      if (lastTop >= 0 && Math.abs(top - lastTop) > 8) cardH = 0;
      lastTop = top;
      if (!cardH && !measure()) return;
      sticky.style.top = `${top}px`;
      const total = track.offsetHeight - sticky.offsetHeight;
      const traveled = top - track.getBoundingClientRect().top;
      const p = total <= 0 ? 0 : Math.min(1, Math.max(0, traveled / total));
      const items = cards();
      const pos = p * Math.max(1, items.length - 1);
      const travel = Math.max(1, stageH - 12);

      items.forEach((card, i) => {
        const li = card.parentElement;
        if (!li) return;
        const delta = pos - i;
        li.style.zIndex = String(i + 1);
        if (delta < 0) {
          const dist = Math.min(1, -delta);
          li.style.transform = `translate3d(0, ${(dist * travel).toFixed(2)}px, 0)`;
          li.style.opacity = dist > 0.985 ? "0" : "1";
        } else {
          const t = Math.min(1, delta);
          const scale = 1 - t * 0.08;
          const opacity = 1 - t * 0.5;
          li.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(3)})`;
          li.style.opacity = opacity.toFixed(3);
        }
      });
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
      className="bg-surface px-4 py-16 sm:px-6 md:px-10 md:py-20 xl:px-[60px] xl:py-[100px]"
    >
      <RevealGroup className="mx-auto w-full max-w-[1305px]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between xl:gap-[114px]">
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

        <div ref={trackRef}>
          <div ref={stickyRef} className="max-sm:bg-surface">
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
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}
