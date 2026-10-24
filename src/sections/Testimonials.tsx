"use client";

import { useRef } from "react";
import { IconStar, Reveal, RevealGroup } from "@ds/index";
import { TESTIMONIALS } from "@content/offer";

const AVATARS = ["/img/avatar-robson.jpeg", "/img/avatar-andrea.jpg", "/img/avatar-jeje.jpg"];

/* -----------------------------------------------------------------------------
   DEPOIMENTOS — medido no wireframe (viewport 1440), section 1440x936.
   padding 0 0 200 60 · título x201 (y250 no Figma; o recuo de cima foi reduzido de propósito) 120/132 600 -6px
   botões 60x60 r15 degradê dourado (Figma 949:540), estrelas douradas
   cards 505x288 r12 branco, sombra 0 1px 2px rgba(0,0,0,.1), pad 42px 0
   conteúdo 421 · gap 30 · avatar 60x60 r12 · gap 12 · nome/cidade 24/24 700
   estrelas 124x21 · citação 20/24 400

   Telas menores (mobile first; as medidas acima valem a partir de xl/1280):
   - o trilho continua sendo um carrossel horizontal com scroll-snap, que no
     celular se usa pelo gesto de arrastar; o card ocupa ~82% da largura para
     o próximo aparecer cortado na borda e indicar que há mais;
   - o recuo de 201px só entra em xl; abaixo disso é o gutter da página. Acima
     de 1440 o recuo acompanha a coluna centralizada de 1440, e o trilho segue
     sangrando até a borda direita da tela, como no desenho;
   - o título usa text-h2-hero (48 → 87px) e só chega aos 120px em xl;
   - padding do card, nome e citação encolhem no celular; o card cresce na
     altura se o texto pedir (min-h 288 no desktop), e todos ficam iguais.
   -------------------------------------------------------------------------- */

export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);

  /* O passo é medido no DOM (largura do card + gap), e não fixo: o card muda
     de largura entre breakpoints e um passo fixo sairia do snap. */
  const slide = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = first ? first.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      id="depoimentos"
      className="overflow-hidden bg-surface pb-16 pt-8 md:pb-24 md:pt-16 xl:pb-[118px] xl:pt-[60px]"
    >
      <RevealGroup
        className={
          "pl-4 sm:pl-6 md:pl-10 " +
          /* 201 = 60 do padding da seção + 141 do recuo, na coluna de 1440 */
          "xl:pl-[max(201px,calc((100%_-_1440px)/2_+_201px))]"
        }
      >
        <Reveal variant="up">
          <h2 className="m-0 max-w-full pr-4 text-h2-hero font-semibold text-text-card xl:w-[800px] xl:text-[120px] xl:leading-[132px] xl:tracking-[-6px]">
            Depoimentos
          </h2>
        </Reveal>

        <Reveal variant="up" delay={90}>
          <ul
            ref={trackRef}
            className={
              "m-0 mt-8 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto pb-1 pl-0 pr-4 " +
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
              "sm:gap-6 sm:pr-6 md:mt-12 xl:mt-[58px] xl:pr-0"
            }
          >
            {TESTIMONIALS.map((item, i) => (
              <li
                key={item.name}
                className="w-[min(505px,82vw)] shrink-0 snap-start xl:w-[505px]"
              >
                <article className="h-full rounded-card bg-surface-plain p-6 shadow-subtle sm:p-8 xl:min-h-[288px] xl:p-[42px]">
                  <div className="flex items-start gap-3">
                    <img
                      src={AVATARS[i % AVATARS.length]}
                      alt=""
                      aria-hidden
                      width={60}
                      height={60}
                      className="size-[60px] shrink-0 rounded-card object-cover"
                    />
                    <div className="flex min-w-0 flex-col gap-0.5 pt-2.5">
                      <p className="m-0 text-[20px] font-bold leading-none tracking-[-0.04em] text-text-card sm:text-[24px]">
                        {item.name}
                      </p>
                      <p className="m-0 text-[20px] font-bold leading-none tracking-[-0.04em] text-text-muted sm:text-[24px]">
                        {item.city}
                      </p>
                    </div>
                  </div>

                  <p
                    aria-label="5 de 5 estrelas"
                    className="m-0 mt-5 flex h-[21px] w-[124px] gap-[5px] text-[21px] leading-[21px] text-gold-start"
                  >
                    {Array.from({ length: 5 }, (_, s) => (
                      <IconStar key={s} aria-hidden />
                    ))}
                  </p>

                  <blockquote className="m-0 mt-6 text-[18px] leading-[1.35] text-text sm:mt-[30px] sm:text-base xl:w-[421px]">
                    {item.quote}
                  </blockquote>
                </article>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-6 flex gap-2.5 xl:mt-[27px]">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => slide(dir)}
              aria-label={dir === -1 ? "Depoimento anterior" : "Próximo depoimento"}
              className={
                "grid size-12 cursor-pointer place-items-center rounded-[12px] border-0 " +
                "text-text-on-inverse md:size-[60px] md:rounded-[15px] " +
                "bg-linear-to-r from-gold-start to-gold-end"
              }
            >
              <svg width="16" height="26" viewBox="0 0 16 26" fill="none" aria-hidden className="md:h-[22px] md:w-[14px]">
                <path
                  d={dir === -1 ? "M13 2 3 13l10 11" : "M3 2l10 11L3 24"}
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
