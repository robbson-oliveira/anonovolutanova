"use client";

import { useState } from "react";
import { Button, EditionSelector, Reveal, cn } from "@ds/index";
import { EXPLORE, QUOTE } from "@content/home";
import { CART_URL, EDITIONS } from "@content/product";

const capaColor = "/img/capa-color.png";
const capaClassica = "/img/capa-classica.png";

/**
 * As capas são as mesmas da hero: mockups com a sombra assada no PNG, então a
 * imagem é maior que o livro. `book` é a caixa do livro (com a espiral) dentro
 * do arquivo, em px do arquivo, medida pelo alfa ≥ 200. É ela que tem a altura
 * do Figma (645px) nas duas edições — a paridade vale para o livro, não para o
 * arquivo — e a sombra transborda por fora, como no design.
 */
type Cover = {
  src: string;
  alt: string;
  img: { w: number; h: number };
  book: { x: number; y: number; w: number; h: number };
};

const COVERS: Record<"color" | "classica", Cover> = {
  color: {
    src: capaColor,
    alt: "Capa da Edição Color",
    img: { w: 514, h: 634 },
    book: { x: 9, y: 11, w: 358, h: 463 },
  },
  classica: {
    src: capaClassica,
    alt: "Capa da Edição Clássica",
    img: { w: 472, h: 600 },
    book: { x: 21, y: 16, w: 345, h: 464 },
  },
};

/**
 * Altura do livro, nas duas edições. O Figma (949:830) tem 645px, mas com a
 * agenda tão grande ela encosta nas abas e na citação. O site do ano passado
 * mostrava o livro com ~475px; 470px devolve esse respiro dentro da área de
 * 607px reservada para a capa e as páginas internas.
 */
const COVER_HEIGHT = 470;


/**
 * Altura do livro em telas estreitas: os 645px, ou a altura em que o livro
 * MAIS ALTO em proporção ainda cabe na largura do painel (cqw do `@container`
 * do painel). As duas edições usam o mesmo valor, então a paridade vale em
 * qualquer largura.
 */
const COVER_HEIGHT_PER_WIDTH = Math.max(
  ...Object.values(COVERS).map((c) => c.book.h / c.book.w),
);
const COVER_VIEW_HEIGHT = `min(${COVER_HEIGHT}px, ${(COVER_HEIGHT_PER_WIDTH * 100).toFixed(3)}cqw)`;

/**
 * Agenda aberta de cada aba (a primeira aba é sempre a capa). Mesmo esquema
 * das capas: `book` é a caixa do livro dentro do arquivo, em px do arquivo,
 * medida pelo alfa ≥ 200; a sombra assada no PNG transborda por fora. As
 * quatro imagens foram exportadas em escalas diferentes (o passo da espiral
 * varia de 32 a 34px), mas a ALTURA do livro dividida pelo passo é a mesma,
 * 17,2: a altura é a medida que carrega a escala real (a largura muda, a
 * agenda diária é mais estreita). Por isso todas, e a capa, usam a mesma
 * altura de livro e trocar de aba não muda o tamanho da agenda; só a sombra de
 * cada arquivo varia, e ela transborda por fora.
 */
/** Ponto de interesse; `x` e `y` em % da caixa do livro. */
type Hotspot = { x: number; y: number; title: string; text: string };

/** `leftH`: altura da página esquerda (a capa de trás) no arquivo, em px, com alfa ≥ 240. */
type Spread = Cover & { leftH: number; hotspots: Hotspot[] };

const SPREADS: (Spread | null)[] = [
  null,
  {
    src: "/img/agenda-propositos-mes.webp",
    alt: "Agenda aberta: propósito do mês e calendário",
    img: { w: 1216, h: 861 },
    book: { x: 115, y: 27, w: 764, h: 545 },
    leftH: 525,
    hotspots: [
      {
        x: 14.7,
        y: 26.2,
        title: "Tema do Mês",
        text: "Cada mês começa com um tema que inspira a viver a rotina com mais profundidade. É um convite a refletir e a fortalecer a vida interior, ajudando a direcionar atitudes e metas com mais consciência.",
      },
      {
        x: 20.6,
        y: 72.5,
        title: "Propósito do Mês",
        text: "Este espaço permite registrar as intenções e metas que você deseja trabalhar ao longo do mês. Anotar seus propósitos traz clareza, reforça o compromisso pessoal e ajuda a manter o foco no que realmente precisa ser cultivado.",
      },
      {
        x: 87.7,
        y: 17.8,
        title: "Calendário Mensal",
        text: "O calendário mensal oferece uma visão completa do período, facilitando o planejamento dos compromissos e a organização das prioridades. Ele ajuda a transformar os propósitos definidos em ações concretas ao longo dos dias.",
      },
    ],
  },
  {
    src: "/img/agenda-planos-metas.webp",
    alt: "Agenda aberta: planos e metas",
    img: { w: 1178, h: 930 },
    book: { x: 50, y: 29, w: 819, h: 584 },
    leftH: 562,
    hotspots: [
      {
        x: 14.7,
        y: 26.2,
        title: "Plano de Vida",
        text: "Um espaço para refletir sobre o que realmente importa e esclarecer a direção que você deseja seguir ao longo do ano. É o ponto de partida para organizar sua rotina com sentido e propósito.",
      },
      {
        x: 20.6,
        y: 72.5,
        title: "Metas Anuais",
        text: "Registro das metas principais que você quer alcançar. Aqui você define objetivos claros que fortalecem sua caminhada e orientam suas escolhas ao longo dos meses.",
      },
      {
        x: 80.6,
        y: 36.1,
        title: "Metas de Curto e Médio Prazo",
        text: "Metas que podem ser realizadas em etapas menores e que mantêm o ritmo do seu progresso. São pequenos passos que ajudam a consolidar mudanças reais no dia a dia.",
      },
      {
        x: 80.6,
        y: 59.9,
        title: "Metas de Longo Prazo",
        text: "Objetivos maiores, que pedem constância e visão de futuro. Este espaço ajuda a manter vivo o compromisso com aquilo que você deseja construir com paciência e perseverança.",
      },
    ],
  },
  {
    src: "/img/agenda-planejamento-financeiro.webp",
    alt: "Agenda aberta: planejamento financeiro",
    img: { w: 1145, h: 927 },
    book: { x: 38, y: 29, w: 822, h: 587 },
    leftH: 565,
    hotspots: [
      {
        x: 20.4,
        y: 26.4,
        title: "Planejamento Financeiro",
        text: "Este espaço permite organizar com tranquilidade as metas e compromissos financeiros do ano. A estrutura em quadros facilita o registro de gastos, planos de economia e outras anotações importantes. É uma forma prática de acompanhar decisões do dia a dia com mais responsabilidade e ordem.",
      },
      {
        x: 80.6,
        y: 48.8,
        title: "Calendário Anual",
        text: "O calendário anual oferece uma visão completa de todos os meses, ajudando no planejamento antecipado de projetos, viagens e períodos mais intensos. Ele serve como referência para organizar o ritmo do ano e alinhar compromissos pessoais, profissionais e espirituais de forma equilibrada.",
      },
    ],
  },
  {
    src: "/img/agenda-diaria.webp",
    alt: "Agenda aberta: agenda diária",
    img: { w: 1045, h: 845 },
    book: { x: 55, y: 26, w: 716, h: 562 },
    leftH: 550,
    hotspots: [
      {
        x: 13.2,
        y: 26.2,
        title: "Tarefas Importantes",
        text: "Um espaço reservado para definir o que precisa ser priorizado. Registrar essas tarefas traz clareza e permite conduzir o dia com mais ordem e propósito.",
      },
      {
        x: 13.2,
        y: 72.5,
        title: "Estrutura de Horários",
        text: "A estrutura com horários facilita o planejamento das atividades. Essa organização ajuda a distribuir melhor o tempo e criar um ritmo diário equilibrado entre trabalho, descanso e vida interior.",
      },
      {
        x: 82.8,
        y: 14.9,
        title: "Tema do Mês",
        text: "Cada dia começa acompanhado pelo tema espiritual do mês. Esse lembrete fortalece a intenção diária e ajuda a manter o foco nas virtudes que você deseja trabalhar ao longo do período.",
      },
      {
        x: 84.9,
        y: 39.5,
        title: "Datas Importantes",
        text: "As páginas trazem lembretes de celebrações litúrgicas e datas importantes da Obra. Esses marcos enriquecem a vivência espiritual e conectam o cotidiano com o calendário da Igreja.",
      },
      {
        x: 83.4,
        y: 71,
        title: "Datas Importantes",
        text: "As páginas trazem lembretes de celebrações litúrgicas e datas importantes da Obra. Esses marcos enriquecem a vivência espiritual e conectam o cotidiano com o calendário da Igreja.",
      },
    ],
  },
];

/**
 * Altura da página esquerda de todas as agendas: a mesma da capa; em telas
 * estreitas, a que deixa a mais larga caber no painel. A altura do livro de
 * cada foto (`book.h`) sai daqui na proporção `book.h / leftH`.
 */
const SPREAD_HEIGHT = `min(${COVER_HEIGHT}px, ${(100 / Math.max(...SPREADS.flatMap((p) => (p ? [p.book.w / p.leftH] : [])))).toFixed(3)}cqw)`;

/**
 * Pontos de interesse sobre o livro. Percentuais medidos no Figma (949:830),
 * onde o livro ocupa 519×645: os três marcadores de 28px têm o centro em
 * (124,3 / 205), (313,6 / 425) e (358,1 / 349) px dentro dele. Como são
 * porcentagens, acompanham o livro em qualquer altura.
 */
const HOTSPOTS = [
  {
    x: 23.95,
    y: 31.78,
    title: "Espiral metálica",
    text: "Abre 360°, para escrever com a agenda dobrada sobre a mesa.",
  },
  {
    x: 60.42,
    y: 65.89,
    title: "Patos à água",
    text: "O tema do ano: lançar-se à água com confiança, um dia de cada vez.",
  },
  {
    x: 69.06,
    y: 54.11,
    title: "Hotstamp",
    text: "O ano em película metalizada, aplicada a quente sobre a capa dura.",
  },
];

type HotspotsProps = {
  items: Hotspot[];
  open: number | null;
  onOpen: (index: number | null) => void;
};

/** Marcadores "+" sobre o livro e o balão do que está aberto, em % da caixa do livro. */
function Hotspots({ items, open, onOpen }: HotspotsProps) {
  const spot = open === null ? null : items[open];

  return (
    <>
      {items.map((s, i) => (
        <div
          key={s.title}
          className="absolute size-[26px] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          {/* anel que pulsa atrás do marcador, como no site antigo */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-[10.4px] rounded-pill border-2 border-on-action opacity-0 motion-safe:animate-pin-pulse"
          />
          {/* 26px desenhados; o ::before leva a área de toque a 44px */}
          <button
            type="button"
            aria-expanded={open === i}
            aria-label={s.title}
            onClick={() => onOpen(open === i ? null : i)}
            className="relative flex size-[26px] cursor-pointer items-center justify-center rounded-pill border-2 border-on-action/80 bg-action p-0 text-on-action shadow-hotspot transition-colors [transition-duration:var(--duration-fast)] before:absolute before:-inset-2.5 hover:bg-action-hover"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="pointer-events-none block size-[13px] shrink-0 fill-none stroke-current stroke-2 [stroke-linecap:round]"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      ))}
      {spot && (
        <div
          key={spot.title}
          role="dialog"
          aria-label={spot.title}
          style={
            {
              "--spot-x": `${spot.x}%`,
              "--spot-y": `${spot.y}%`,
            } as React.CSSProperties
          }
          className={cn(
            "absolute inset-x-3 bottom-3 z-20 rounded-[8px] border border-border bg-surface p-4 shadow-float motion-safe:animate-pin-card",
            /* a partir de md: ao lado do marcador, para o lado em que há
               espaço (o balão do site antigo tem 280px) */
            "md:w-[280px]",
            spot.x > 50
              ? "md:left-auto md:right-[calc(100%_-_var(--spot-x)_+_28px)]"
              : "md:right-auto md:left-[calc(var(--spot-x)_+_28px)]",
            spot.y > 50
              ? "md:top-auto md:bottom-[calc(100%_-_var(--spot-y)_-_13px)]"
              : "md:bottom-auto md:top-[calc(var(--spot-y)_-_13px)]",
          )}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => onOpen(null)}
            className="absolute right-2 top-2 grid size-6 cursor-pointer place-items-center rounded-[4px] text-text opacity-60 transition-opacity [transition-duration:var(--duration-fast)] hover:opacity-100"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-4 fill-none stroke-current stroke-2 [stroke-linecap:round]"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <p className="pr-6 text-[16px] font-semibold leading-[1.2] tracking-[-0.01em] text-text">
            {spot.title}
          </p>
          <p className="mt-2 text-[14px] font-medium leading-[1.4] tracking-[-0.01em] text-text opacity-80">
            {spot.text}
          </p>
          <Button
            href={CART_URL}
            className="mt-3 h-auto! rounded-[6px]! px-4! py-2 text-[14px] leading-[1.3] tracking-[-0.01em]"
          >
            Garantir minha Agenda
          </Button>
        </div>
      )}
    </>
  );
}

/**
 * Medidas extraídas do DOM do wireframe (viewport 1440):
 * seção 1440×1288, padding 120/60/100; título 60/60 ls -3; apoio 20/24 a 389px;
 * seletor a 297px do topo; painel 1160×819, raio 18, padding lateral 60;
 * abas 36px de altura, raio 10, padding 10, texto 16/16 ls -0,64;
 * livro de 645px de altura centralizado (Figma novo); citação de 582px no pé do painel.
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
  const page = SPREADS[tab];

  return (
    <section
      id="explore"
      className="bg-surface px-4 pb-16 pt-16 md:px-10 md:pb-[100px] md:pt-[120px] xl:px-[60px]"
    >
      <Reveal variant="up" className="text-center">
        <h2 className="text-h2 font-bold text-text-lead">
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
                "shadow-[inset_0_0_0_1px_var(--color-action)]",
                "[transition-duration:var(--duration-fast)]",
                i === tab
                  ? "bg-action font-bold text-on-action"
                  : "font-medium text-action hover:bg-action-track",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="mt-6 flex min-h-(--cover-h) items-center justify-center md:mt-[16px] md:min-h-[607px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative max-w-full">
            {page ? (
              <div
                key={page.src}
                className="relative animate-reveal-pop"
                style={{
                  height: `calc(${SPREAD_HEIGHT} * ${(page.book.h / page.leftH).toFixed(4)})`,
                  aspectRatio: `${page.book.w} / ${page.book.h}`,
                }}
              >
                <img
                  src={page.src}
                  alt={page.alt}
                  width={page.img.w}
                  height={page.img.h}
                  className="pointer-events-none absolute max-w-none"
                  style={{
                    left: `${(-page.book.x / page.book.w) * 100}%`,
                    top: `${(-page.book.y / page.book.h) * 100}%`,
                    width: `${(page.img.w / page.book.w) * 100}%`,
                    height: `${(page.img.h / page.book.h) * 100}%`,
                  }}
                />
                <Hotspots
                  items={page.hotspots}
                  open={openSpot}
                  onOpen={setOpenSpot}
                />
              </div>
            ) : (
              <>
                {/* Caixa do livro: altura do Figma (ou a que cabe no painel) e a
                    proporção do livro; a imagem, com a sombra assada, é posicionada
                    em % para o livro cair exatamente na caixa. */}
                <div
                  className="relative h-(--cover-h)"
                  style={{ aspectRatio: `${cover.book.w} / ${cover.book.h}` }}
                >
                  <img
                    src={cover.src}
                    alt={cover.alt}
                    width={cover.img.w}
                    height={cover.img.h}
                    className="pointer-events-none absolute max-w-none"
                    style={{
                      left: `${(-cover.book.x / cover.book.w) * 100}%`,
                      top: `${(-cover.book.y / cover.book.h) * 100}%`,
                      width: `${(cover.img.w / cover.book.w) * 100}%`,
                      height: `${(cover.img.h / cover.book.h) * 100}%`,
                    }}
                  />
                  <Hotspots
                    items={HOTSPOTS}
                    open={openSpot}
                    onOpen={setOpenSpot}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <figure className="mx-auto mt-[28px] w-[582px] md:mt-[20px] max-w-full text-center">
          <blockquote className="text-base text-text">
            “{QUOTE.text}”
          </blockquote>
          <figcaption className="mt-[20px] text-[24px] font-bold leading-[30px] text-text-strong md:text-[30px] md:leading-[36px]">
            {QUOTE.author}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
