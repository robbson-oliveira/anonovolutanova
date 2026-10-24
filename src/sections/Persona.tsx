"use client";

import { useEffect, useRef } from "react";
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
   On a phone the six cards also scale and fade with the scroll position
   (see `useBenefitFocus`). Reduced motion and widths from `sm` up leave
   them still.
   -------------------------------------------------------------------------- */

/**
 * Ties each benefit card to its place in the viewport. The card nearest the
 * reading line stays full size; as it leaves upward it shrinks and fades, and
 * the next one comes in the other way. Reversible because it reads position,
 * not a one-shot trigger. Skipped when the user prefers reduced motion or the
 * list is no longer a single column.
 */
function useBenefitFocus(listRef: { readonly current: HTMLUListElement | null }) {
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 639px)");
    let frame = 0;

    const cards = () => [...list.querySelectorAll<HTMLElement>("[data-persona-card]")];

    const reset = () => {
      for (const card of cards()) {
        card.style.transform = "";
        card.style.opacity = "";
      }
    };

    const update = () => {
      frame = 0;
      if (reduce.matches || !narrow.matches) {
        reset();
        return;
      }
      const viewH = window.innerHeight || 1;
      const focus = viewH * 0.46;
      for (const card of cards()) {
        const rect = card.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const delta = (center - focus) / viewH;
        if (delta < 0) {
          const t = Math.min(1, -delta / 0.55);
          card.style.transform = `scale(${(1 - t * 0.08).toFixed(3)})`;
          card.style.opacity = (1 - t * 0.7).toFixed(3);
        } else {
          const t = Math.min(1, delta / 0.7);
          card.style.transform = `scale(${(1 - t * 0.035).toFixed(3)})`;
          card.style.opacity = (1 - t * 0.16).toFixed(3);
        }
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", onScroll);
    narrow.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onScroll);
      narrow.removeEventListener("change", onScroll);
      reset();
    };
  }, [listRef]);
}

export function Persona() {
  const listRef = useRef<HTMLUListElement>(null);
  useBenefitFocus(listRef);

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
            <p className="m-0 max-w-[640px] text-base font-normal leading-6 text-text xl:w-[458px] xl:text-[20px] xl:leading-6">
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
                <p className="m-0 text-[18px] font-medium leading-6 tracking-[-0.02em] text-text-on-warm sm:max-w-[239px] sm:text-[20px] sm:tracking-[-0.4px]">
                  {item}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </RevealGroup>
    </section>
  );
}
