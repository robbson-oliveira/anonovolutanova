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

/** Página interna de cada aba. A primeira aba é sempre a capa. */
const TAB_PAGES: (string | null)[] = [
  null,
  "/img/interna-propositos-mes.png",
  "/img/interna-metas-anuais.png",
  "/img/interna-oferta.png",
  "/img/interna-agenda-diaria.png",
];

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
 */
export function Explore() {
  const [edition, setEdition] = useState<string>(EDITIONS[0].id);
  const [paused, setPaused] = useState(false);
  const [tab, setTab] = useState(0);
  const [openSpot, setOpenSpot] = useState<number | null>(null);

  const cover = COVERS[edition as keyof typeof COVERS];
  const page = TAB_PAGES[tab];

  return (
    <section id="explore" className="bg-surface px-[60px] pb-[100px] pt-[120px]">
      <Reveal variant="up" className="text-center">
        <h2 className="text-[60px] font-bold leading-[60px] tracking-[-0.05em] text-text-strong">
          {EXPLORE.eyebrow}
        </h2>
      </Reveal>
      <p className="mx-auto mt-[20px] w-[389px] max-w-full text-center text-[20px] leading-[24px] text-text">
        {EXPLORE.title}
      </p>

      <div
        className="mt-[49px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <EditionSelector
          options={EDITIONS}
          value={edition}
          onChange={setEdition}
          paused={paused}
        />
      </div>

      <div className="mx-auto mt-[33px] w-[1160px] max-w-full rounded-[18px] px-[60px]">
        <div
          role="tablist"
          aria-label="Páginas da agenda"
          className="flex flex-wrap justify-center gap-[8px]"
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
                "cursor-pointer rounded-[10px] p-[10px] text-[16px] leading-[16px] tracking-[-0.04em] transition-colors",
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
          className="mt-[32px] flex justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative">
            {page ? (
              <img
                src={page}
                alt={`Página interna: ${EXPLORE.tabs[tab]}`}
                style={{ height: `${COVER_HEIGHT}px`, width: "auto" }}
                className="block max-w-full rounded-[8px]"
              />
            ) : (
              <>
                <BookCover
                  src={cover.src}
                  alt={cover.alt}
                  height={COVER_HEIGHT}
                />
                {HOTSPOTS.map((spot, i) => (
                  <div
                    key={spot.title}
                    className="absolute"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  >
                    <button
                      type="button"
                      aria-expanded={openSpot === i}
                      aria-label={spot.title}
                      onClick={() => setOpenSpot(openSpot === i ? null : i)}
                      className="grid size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-pill bg-action text-on-action shadow-[0_2px_8px_rgb(0_0_0/0.2)]"
                    >
                      <span className="text-[14px] leading-none">+</span>
                    </button>
                    {openSpot === i && (
                      <div className="absolute left-4 top-4 z-10 w-56 rounded-card bg-surface p-4 shadow-float">
                        <p className="text-sm font-bold text-text-strong">
                          {spot.title}
                        </p>
                        <Text size="xs" className="mt-1.5">
                          {spot.text}
                        </Text>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <figure className="mx-auto mt-[28px] w-[582px] max-w-full text-center">
          <blockquote className="text-[20px] leading-[24px] text-text">
            “{QUOTE.text}”
          </blockquote>
          <figcaption className="mt-[20px] text-[30px] font-bold leading-[36px] text-accent-hover">
            — {QUOTE.author}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
