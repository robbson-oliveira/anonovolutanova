"use client";

import { useEffect, useRef } from "react";
import {
  type IconProps,
  IconAniversarios,
  IconNovenaImaculada,
  IconOitavario,
  IconOutrasDatas,
  IconSeteDomingosSaoJose,
  IconTrisagio,
  Reveal,
} from "@ds/index";
import { LITURGICAL } from "@content/home";
import { OFFER_ANCHOR } from "@content/product";

/**
 * Um ícone por data, na ordem de `LITURGICAL.dates`.
 */
const ICONS = [
  IconOitavario,
  IconNovenaImaculada,
  IconSeteDomingosSaoJose,
  IconAniversarios,
  IconTrisagio,
  IconOutrasDatas,
];

/**
 * Medidas extraídas do DOM do wireframe em viewport 1440:
 * seção 1440×1488, padding 100/60; coluna útil 1018px;
 * fundo (Figma "Seção 4", 949:647): a textura antiga (de 13% a 95,5% da largura)
 * sob a aquarela nova, as duas em opacidade 0.19 com mistura darken; cards 499×270 brancos, raio 12,
 * padding 42/32, ícone 60 e 20px até o título (24/24, ls -0.96);
 * grade 2 colunas com gap 20; CTA 600×68, raio 10.
 * Só o título anima (fade + 28px, ~700ms) — os cards entram estáticos.
 *
 * Telas menores (mobile first; o desenho medido vale inteiro a partir de `xl`):
 * - a coluna de 1018px vira fluida (w-full + max-w) e o padding da seção
 *   encolhe para 16px nas laterais;
 * - o título usa o token `text-h2` (34px → 60px, já em 60 no 1440);
 * - subtítulo e parágrafo, lado a lado no desktop, empilham centralizados
 *   abaixo de `md`;
 * - below `md` the dates sit in two compact columns (icon above the copy,
 *   smaller type, text wraps). From `md` the measured two-column cards
 *   return, and the 270px height is a minimum so the copy never spills.
 */
/**
 * One height for every date card: the tallest in the current row layout.
 * Clearing the inline min-height before measuring keeps a width change from
 * locking in a stale value. The observer watches width only, so writing
 * the height does not retrigger it.
 */
function useEqualCards(listRef: { readonly current: HTMLUListElement | null }) {
  useEffect(() => {
    const ul = listRef.current;
    if (!ul) return;
    let frame = 0;
    let lastWidth = -1;

    const measure = () => {
      frame = 0;
      const cards = [...ul.querySelectorAll<HTMLElement>("[data-date-card]")];
      if (!cards.length) return;
      for (const card of cards) card.style.minHeight = "";
      const max = Math.max(...cards.map((card) => card.getBoundingClientRect().height));
      const px = `${Math.ceil(max)}px`;
      for (const card of cards) card.style.minHeight = px;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (Math.abs(width - lastWidth) < 0.5) return;
      lastWidth = width;
      schedule();
    });
    ro.observe(ul);
    document.fonts?.ready.then(schedule).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [listRef]);
}

export function Liturgical() {
  const listRef = useRef<HTMLUListElement>(null);
  useEqualCards(listRef);

  return (
    <section className="relative overflow-hidden bg-surface px-4 py-16 sm:px-6 md:px-10 md:py-20 xl:px-[60px] xl:py-[100px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.19] mix-blend-darken"
      >
        <div className="absolute inset-y-0 left-[12.96%] right-[4.53%] bg-[url('/img/textura-liturgica.png')] bg-[length:100%_100%]" />
        <div className="absolute inset-0 bg-[url('/img/textura-liturgica.webp')] bg-cover bg-center" />
      </div>

      <div className="relative mx-auto w-full max-w-[1018px]">
        <Reveal variant="up">
          <h2 className="text-center text-h2 font-bold text-text-lead max-md:px-2 max-md:text-[28px] max-md:leading-[1.12]">
            {LITURGICAL.title}
          </h2>
        </Reveal>

        <div className="mt-4 flex flex-col gap-3 text-center md:mt-[13px] md:flex-row md:justify-between md:gap-10 md:text-left lg:px-[55px]">
          <p className="text-base text-text max-md:px-2 max-md:text-[15px] max-md:leading-snug md:w-[270px]">
            {LITURGICAL.subtitle}
          </p>
          <p className="text-base text-text-strong max-md:px-1 max-md:text-[15px] max-md:leading-snug md:w-[372px]">
            {LITURGICAL.paragraph}
          </p>
        </div>

        <ul ref={listRef} className="mt-8 grid grid-cols-2 gap-2.5 md:mt-[39px] md:gap-[20px]">
          {LITURGICAL.dates.map((date, i) => (
            <li
              key={date.title}
              data-date-card
              className="flex h-full flex-col items-start gap-2 rounded-card bg-surface-plain px-3 py-3 md:block md:min-h-[270px] md:px-[32px] md:py-[42px]"
            >
              <DateIcon icon={ICONS[i % ICONS.length]} />
              <div className="min-w-0">
                <p className="text-[13px] font-bold leading-4 tracking-[-0.03em] text-text-strong md:mt-[20px] md:text-[24px] md:leading-6 md:tracking-[-0.04em]">
                  {date.title}
                </p>
                <p className="mt-1 text-balance text-[12px] leading-[15px] text-text md:mt-[10px] md:text-base md:leading-normal">
                  {date.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-base text-text max-md:px-3 max-md:text-[15px] max-md:leading-snug md:mt-[39px]">
          {LITURGICAL.closing}
        </p>

        <a
          href={OFFER_ANCHOR}
          className="mx-auto mt-8 flex h-[68px] w-full max-w-[600px] items-center justify-center rounded-[10px] bg-linear-90 from-gold-start to-gold-end px-6 text-center text-[16px] font-bold leading-[16px] tracking-[-0.04em] text-on-action transition-[filter] [transition-duration:var(--duration-fast)] hover:brightness-110 md:mt-[39px]"
        >
          {LITURGICAL.cta}
        </a>
      </div>
    </section>
  );
}

/** O tile creme vive aqui, não dentro do SVG: o ícone é só o glifo. */
function DateIcon({ icon: Icon }: { icon: React.ComponentType<IconProps> }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-card bg-surface-peach text-text-strong md:size-[60px]">
      <Icon className="size-full" />
    </span>
  );
}
