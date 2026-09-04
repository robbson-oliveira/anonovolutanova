"use client";

import { useState } from "react";
import {
  BookCover,
  Container,
  EditionSelector,
  Heading,
  Reveal,
  Tabs,
  Text,
} from "@ds/index";
import { EXPLORE } from "@content/home";
import { EDITIONS } from "@content/product";
import capaColor from "@/public/img/capa-color.png";
import capaClassica from "@/public/img/capa-classica.png";

const COVERS = {
  color: { src: capaColor, alt: "Capa da Edição Color" },
  classica: { src: capaClassica, alt: "Capa da Edição Clássica" },
} as const;

/** Altura fixa das duas capas — é ela que garante a paridade. */
const COVER_HEIGHT = 607;

/**
 * Pontos de interesse sobre a capa. Posições em percentual da imagem.
 *
 * ⚠️ PENDÊNCIA HERDADA: no protótipo estes textos ainda descreviam a capa de
 * 2026 (estética de vitral). Foram reescritos aqui para a capa 2027 (aquarela,
 * patos à água), mas a copy final é decisão da marca — ver BRIEFING-NEXTJS.md.
 */
const HOTSPOTS = [
  {
    x: 18,
    y: 42,
    title: "Espiral metálica",
    text: "Abre 360°, para escrever com a agenda dobrada sobre a mesa.",
  },
  {
    x: 74,
    y: 66,
    title: "Hotstamp",
    text: "O ano em película metalizada, aplicada a quente sobre a capa dura.",
  },
  {
    x: 50,
    y: 82,
    title: "Patos à água",
    text: "O tema do ano: lançar-se à água com confiança, um dia de cada vez.",
  },
];

export function Explore() {
  const [edition, setEdition] = useState<string>(EDITIONS[0].id);
  const [paused, setPaused] = useState(false);
  const [openSpot, setOpenSpot] = useState<number | null>(null);

  const cover = COVERS[edition as keyof typeof COVERS];

  const coverPanel = (
    <div
      className="flex justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <BookCover src={cover.src} alt={cover.alt} height={COVER_HEIGHT} />

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
              className="grid size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-pill bg-surface/85 text-sm text-text-strong shadow-card backdrop-blur transition-colors [transition-duration:var(--duration-fast)] hover:bg-surface"
            >
              +
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
      </div>
    </div>
  );

  const tabs = EXPLORE.tabs.map((label, i) => ({
    label,
    content:
      i === 0 ? (
        coverPanel
      ) : (
        <div className="flex justify-center py-16">
          <Text tone="muted">Prévia de “{label}” em breve.</Text>
        </div>
      ),
  }));

  return (
    <section id="explore" className="bg-surface px-6 py-24 md:px-16">
      <Container>
        <Reveal variant="up" className="text-center">
          <Heading as="h2">{EXPLORE.eyebrow}</Heading>
          <Text tone="muted" className="mx-auto mt-4 max-w-[420px] text-balance">
            {EXPLORE.title}
          </Text>
        </Reveal>

        <div
          className="mt-10"
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

        <Tabs items={tabs} className="mt-12" />
      </Container>
    </section>
  );
}
