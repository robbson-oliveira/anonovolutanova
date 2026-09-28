"use client";

import { useState } from "react";
import { BookCover, EditionSelector, Reveal, Text, cn } from "@ds/index";
import { EXPLORE, QUOTE } from "@content/home";
import { EDITIONS } from "@content/product";

const capaColor = "/img/capa-color.png";
const capaClassica = "/img/capa-classica.png";

const COVERS = {
  color: { src: capaColor, alt: "Capa da Edição Color" },
  classica: { src: capaClassica, alt: "Capa da Edição Clássica" },
} as const;

/** Altura fixa das duas capas — é ela que garante a paridade. */
const COVER_HEIGHT = 607;

/**
 * Altura das capas em telas estreitas: os 607px, ou a altura em que a capa
 * MAIS LARGA ainda cabe na largura do painel (cqw do `@container` do painel).
 * As duas usam o mesmo valor, então a paridade vale em qualquer largura.
 */
const COVER_HEIGHT_PER_WIDTH = Math.min(
  ...EDITIONS.map((e) => e.coverSize.height / e.coverSize.width),
);
const COVER_VIEW_HEIGHT = `min(${COVER_HEIGHT}px, ${(COVER_HEIGHT_PER_WIDTH * 100).toFixed(3)}cqw)`;

type TabPage = { src: string; width: number; height: number };

/**
 * Página interna de cada aba. A primeira aba é sempre a capa. As dimensões
 * são as dos arquivos em public/img: com elas a altura encolhe na proporção
 * certa quando a largura acaba, em vez de a imagem ser espremida.
 */
const TAB_PAGES: (TabPage | null)[] = [
  null,
  { src: "/img/interna-propositos-mes.png", width: 1756, height: 824 },
  { src: "/img/interna-metas-anuais.png", width: 1772, height: 2599 },
  { src: "/img/interna-oferta.png", width: 2340, height: 2896 },
  { src: "/img/interna-agenda-diaria.png", width: 1684, height: 2372 },
];

/** Os 607px, ou a altura em que a página ocupa a largura toda do painel. */
function pageViewHeight(page: TabPage) {
  return `min(${COVER_HEIGHT}px, ${((page.height / page.width) * 100).toFixed(3)}cqw)`;
}

/**
 * Pontos de interesse sobre a capa. Percentuais medidos no wireframe:
 * a capa ocupa 433,6×607 e os três marcadores de 28px caem em
 * (69,1 / 175,6), (258,5 / 395,7) e (303,1 / 319,9) px dentro dela.
 */
const HOTSPOTS = [
  {
    x: 15.94,
    y: 28.93,
    title: "Espiral metálica",
    text: "Abre 360°, para escrever com a agenda dobrada sobre a mesa.",
  },
  {
    x: 59.62,
    y: 65.19,
    title: "Patos à água",
    text: "O tema do ano: lançar-se à água com confiança, um dia de cada vez.",
  },
  {
    x: 69.9,
    y: 52.7,
    title: "Hotstamp",
    text: "O ano em película metalizada, aplicada a quente sobre a capa dura.",
  },
];

/**
 * Medidas extraídas do DOM do wireframe (viewport 1440):
 * seção 1440×1288, padding 120/60/100; título 60/60 ls -3; apoio 20/24 a 389px;
 * seletor a 297px do topo; painel 1160×819, raio 18, padding lateral 60;
 * abas 36px de altura, raio 10, padding 10, texto 16/16 ls -0,64;
 * capa 607px de altura centralizada; citação de 582px no pé do painel.
 *
 * Telas menores (mobile first; a 1440 as medidas acima valem ao pixel):
 *   - padding lateral 16px no celular, 40 no tablet e 60 a partir de xl; o
 *     painel perde o padding próprio abaixo de md;
 *   - o título usa o token text-h2 (clamp que chega aos 60px do wireframe);
 *   - abaixo de md as abas viram uma faixa com rolagem horizontal que sangra
 *     até a borda da tela, com 44px de altura para o toque; de md em diante
 *     voltam a quebrar linha centralizadas, com os 36px medidos;
 *   - capa e páginas internas têm altura min(607px, largura do painel), então
 *     encolhem proporcionalmente em vez de serem espremidas; a área da imagem
 *     guarda sempre a altura da capa, para o painel não pular ao trocar de aba;
 *   - o balão dos pontos de interesse abre ao lado do marcador a partir de md;
 *     no celular ele vira uma faixa no pé da capa, que caberia em qualquer
 *     largura (ao lado do marcador ele sairia da tela).
 */
export function Explore() {
  const [edition, setEdition] = useState<string>(EDITIONS[0].id);
  const [paused, setPaused] = useState(false);
  const [tab, setTab] = useState(0);
  const [openSpot, setOpenSpot] = useState<number | null>(null);

  const cover = COVERS[edition as keyof typeof COVERS];
  const page = TAB_PAGES[tab];
  const spot = openSpot === null ? null : HOTSPOTS[openSpot];

  return (
    <section
      id="explore"
      className="bg-surface px-4 pb-16 pt-16 md:px-10 md:pb-[100px] md:pt-[120px] xl:px-[60px]"
    >
      <Reveal variant="up" className="text-center">
        <h2 className="text-h2 font-bold text-text-strong">
          {EXPLORE.eyebrow}
        </h2>
      </Reveal>
      <p className="mx-auto mt-[20px] w-[389px] max-w-full text-center text-base text-text">
        {EXPLORE.title}
      </p>

      <div
        className="mt-8 md:mt-[49px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* No celular os dois rótulos de 22px + o gap de 56px passam da
            largura da tela: gap e fonte menores, e 8px a mais em cima para a
            área de toque chegar a 44px (a linha de progresso fica no pé). */}
        <EditionSelector
          options={EDITIONS}
          value={edition}
          onChange={setEdition}
          paused={paused}
          className="max-sm:gap-8 max-sm:[&_button]:text-sm max-md:[&_button]:pt-2"
        />
      </div>

      <div
        className="@container mx-auto mt-[33px] w-[1160px] max-w-full rounded-[18px] md:px-[60px]"
        style={{ "--cover-h": COVER_VIEW_HEIGHT } as React.CSSProperties}
      >
        <div
          role="tablist"
          aria-label="Páginas da agenda"
          className={cn(
            /* celular: faixa rolável que sangra até a borda (-mx-4 desfaz o
               padding da seção); py-1.5 evita cortar o anel de foco (2px + 3px de offset) */
            "-mx-4 flex gap-[8px] overflow-x-auto px-4 py-1.5 [scrollbar-width:none]",
            "md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:py-0",
          )}
        >
          {EXPLORE.tabs.map((label, i) => (
            <button
              key={label}
              role="tab"
              type="button"
              aria-selected={i === tab}
              onClick={() => {
                setTab(i);
                setOpenSpot(null);
              }}
              className={cn(
                "shrink-0 cursor-pointer whitespace-nowrap rounded-[10px] px-[10px] py-[14px] text-[16px] leading-[16px] tracking-[-0.04em] transition-colors md:py-[10px]",
                /* borda de 1px por dentro — no wireframe ela não altera os 36px de altura */
                "shadow-[inset_0_0_0_1px_var(--color-accent)]",
                "[transition-duration:var(--duration-fast)]",
                i === tab
                  ? "bg-accent font-bold text-on-action"
                  : "font-medium text-accent hover:bg-accent-track",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="mt-6 flex min-h-(--cover-h) items-center justify-center md:mt-[32px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative max-w-full">
            {page ? (
              <img
                src={page.src}
                alt={`Página interna: ${EXPLORE.tabs[tab]}`}
                width={page.width}
                height={page.height}
                style={{ height: pageViewHeight(page), width: "auto" }}
                className="block max-w-full rounded-[8px]"
              />
            ) : (
              <>
                {/* A altura inline de 607px da BookCover cede ao !important
                    só quando o painel é estreito demais (ver COVER_VIEW_HEIGHT);
                    a 1440 o valor resolvido é o mesmo. */}
                <BookCover
                  src={cover.src}
                  alt={cover.alt}
                  height={COVER_HEIGHT}
                  className="h-(--cover-h)!"
                />
                {HOTSPOTS.map((s, i) => (
                  <div
                    key={s.title}
                    className="absolute"
                    style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  >
                    {/* 28px desenhados; o ::before leva a área de toque a 44px */}
                    <button
                      type="button"
                      aria-expanded={openSpot === i}
                      aria-label={s.title}
                      onClick={() => setOpenSpot(openSpot === i ? null : i)}
                      className="relative grid size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-pill bg-action text-on-action shadow-hotspot before:absolute before:-inset-2"
                    >
                      <span className="text-[14px] leading-none">+</span>
                    </button>
                  </div>
                ))}
                {spot && (
                  <div
                    style={
                      {
                        "--spot-x": `${spot.x}%`,
                        "--spot-y": `${spot.y}%`,
                      } as React.CSSProperties
                    }
                    className={cn(
                      "absolute inset-x-3 bottom-3 z-10 rounded-card bg-surface p-4 shadow-float",
                      /* a partir de md: 16px abaixo e à direita do marcador, como no wireframe */
                      "md:inset-x-auto md:bottom-auto md:left-[calc(var(--spot-x)_+_16px)] md:top-[calc(var(--spot-y)_+_16px)] md:w-56",
                    )}
                  >
                    <p className="text-sm font-bold text-text-strong">
                      {spot.title}
                    </p>
                    <Text size="xs" className="mt-1.5">
                      {spot.text}
                    </Text>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <figure className="mx-auto mt-[28px] w-[582px] max-w-full text-center">
          <blockquote className="text-base text-text">
            “{QUOTE.text}”
          </blockquote>
          <figcaption className="mt-[20px] text-[24px] font-bold leading-[30px] text-accent-hover md:text-[30px] md:leading-[36px]">
            — {QUOTE.author}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
