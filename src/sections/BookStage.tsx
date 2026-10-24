import { cn } from "@ds/index";
import { OFFER_ANCHOR, CYCLE_YEAR, priceLabel } from "@content/product";
const capaColor = "/img/capa-color.png";
const capaClassica = "/img/capa-classica.webp";
const capaSolo = "/img/capa-solo.png";

/** Um asset trocado no lab chega como blob: URL, sem dimensões conhecidas. */
export type CoverSrc = string;

/**
 * Medida do palco no protótipo aprovado. Todas as porcentagens internas das
 * agendas são relativas a ela, então mudar este número reescala a composição
 * inteira.
 */
export const STAGE_SIZE = 740;

type BookStageProps = {
  colorSrc?: CoverSrc;
  classicaSrc?: CoverSrc;
  thumbSrc?: CoverSrc;
  /**
   * Palco fluido: ocupa a largura de quem o contém (até STAGE_SIZE) em vez
   * dos 740px fixos. As agendas já são porcentagens do palco, então reescalam
   * sozinhas; o card de preço troca de forma quando o palco fica estreito
   * (ver PriceCard). O padrão continua fixo porque o lab e o catálogo medem
   * o palco a 740px.
   */
  fluid?: boolean;
};

/**
 * As duas agendas entram em leque: a Clássica assenta primeiro, a Color pousa
 * sobre ela, encosta e desliza girando ao redor da própria âncora até a
 * posição final. Ângulos, porcentagens e o `transform-origin` são o resultado
 * aprovado no protótipo — não são valores arbitrários e não devem ser
 * "arredondados".
 *
 * O componente é só o palco 740×740; onde ele fica na página é decisão de
 * quem o usa (o Hero o posiciona sangrando para fora do container). Para
 * ajustar a animação isoladamente, ver app/lab/hero-animation.
 *
 * On smaller screens the Hero passes `fluid`: the stage fills its column
 * (up to STAGE_SIZE) and the covers, which are percentages of the stage,
 * scale with it. The price card stays a real-pixel badge (see PriceCard) —
 * scaling the whole 740px stage would shrink that label to a few pixels.
 * At 740px (lab, catalog and desktop) the card is the wireframe one.
 *
 * Só as capas são decorativas (aria-hidden); o card de compra fica acessível,
 * porque um link focável dentro de aria-hidden some para o leitor de tela mas
 * continua recebendo o foco do teclado.
 */
export function BookStage({
  colorSrc = capaColor,
  classicaSrc = capaClassica,
  thumbSrc = capaSolo,
  fluid = false,
}: BookStageProps) {
  return (
    <div
      className={cn(
        "@container/stage pointer-events-none relative aspect-square",
        fluid ? "w-full max-w-[740px]" : "w-[740px]",
      )}
    >
      {/* Clássica — assenta primeiro, fica atrás */}
      <div
        aria-hidden
        className="absolute left-[28.7%] top-[14.6%] z-[2] w-[68.82%] [transform-origin:41%_41.33%] animate-book-back-in motion-reduce:[animation-duration:1ms]"
      >
        <Cover
          src={classicaSrc}
          alt="Agenda Ano Novo, Luta Nova — Edição Clássica"
          priority
        />
      </div>

      {/* Color — pousa sobre a outra, encosta e desliza girando na âncora */}
      <div
        aria-hidden
        className="absolute left-[2.36%] top-[7.07%] z-[5] w-[69.46%] [transform-origin:50.58%_69.07%] animate-book-fan-out motion-reduce:[animation-duration:1ms]"
      >
        <Cover
          src={colorSrc}
          alt="Agenda Ano Novo, Luta Nova — Edição Color"
          priority
        />
      </div>

      <PriceCard thumbSrc={thumbSrc} />
    </div>
  );
}

function Cover({
  src,
  alt,
  priority,
}: {
  src: CoverSrc;
  alt: string;
  priority?: boolean;
}) {
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className="h-auto w-full" />;
}

/**
 * Card flutuante de compra. Todos os valores abaixo foram medidos nos estilos
 * computados de public/wireframe/wireframe-v2.html, que é a fonte da verdade:
 * card 191px, padding 10, raio 10, sombra curta, coluna centralizada com gap 3;
 * nome do produto em PRETO e negrito e preço em cinza (não o contrário);
 * botão 146×34 com raio 5 e rótulo 15px/700.
 *
 * O botão não usa a primitiva <Button> de propósito: nenhum tamanho dela bate
 * com 34px de altura e raio 5, e mexer na primitiva mudaria o site inteiro —
 * fora do escopo deste componente. A área de toque passa de 44px por um
 * ::before invisível, sem mudar os 34px desenhados.
 *
 * Below 1200px the card follows the Framer old-home badge. Tablet is the
 * content-sized column (padding 12×14, gap 9, title 15px, button 32×full
 * at 15px). On mobile the same column is a little smaller (140×93) and its
 * center sits on the middle of the two covers: the opaque art (shadow
 * excluded) is centered on the stage, so left is calc(50% - half the card).
 * The top is 189px, 32px below the 157px mark, so more of the back cover
 * stays visible. Colors stay the 2027 tokens.
 * Unprefixed values are the desktop card and must not change.
 *
 * The mobile button height is explicit: "Comprar Agora" wraps inside a
 * narrow card when the height is left to the line box.
 */
function PriceCard({ thumbSrc }: { thumbSrc: CoverSrc }) {
  return (
    <div
      className={cn(
        "pointer-events-auto absolute left-[30%] top-[57%] z-10 flex h-[119px] w-[191px] flex-col items-center justify-start gap-[3px] rounded-md border border-gold-end bg-surface-card p-2.5 animate-pop-in motion-reduce:animate-none shadow-pop",
        "max-md:left-[calc(50%-70px)] max-md:right-auto max-md:top-[189px] max-md:h-[93px] max-md:w-[140px] max-md:gap-2 max-md:px-3 max-md:py-[9px]",
        "md:max-[1199px]:left-[12%] md:max-[1199px]:top-[46%] md:max-[1199px]:right-auto md:max-[1199px]:h-auto md:max-[1199px]:w-max md:max-[1199px]:gap-[9px] md:max-[1199px]:px-[14px] md:max-[1199px]:py-3",
      )}
    >
      <div className="flex items-center">
        {/* 45×55 slot on desktop; the Framer badge uses 40×44 below 1200. */}
        <div className="relative h-[55px] w-[45px] shrink-0 max-md:h-10 max-md:w-9 md:max-[1199px]:h-11 md:max-[1199px]:w-10">
          <Thumb src={thumbSrc} />
        </div>

        <div className="max-[1199px]:flex max-[1199px]:flex-col max-[1199px]:gap-[5px]">
          <p className="text-[16px] font-bold leading-4 tracking-[-0.64px] whitespace-nowrap text-text-card max-md:text-[13px] max-md:leading-[13px] max-md:tracking-[-0.52px] md:max-[1199px]:text-[15px] md:max-[1199px]:leading-[15px] md:max-[1199px]:tracking-[-0.6px]">
            Agenda {CYCLE_YEAR}
          </p>
          <p className="mt-1 text-[16px] font-bold leading-4 tracking-[-0.64px] whitespace-nowrap text-text-muted max-[1199px]:mt-0 max-md:text-[13px] max-md:leading-[13px] max-md:tracking-[-0.52px] md:max-[1199px]:text-[15px] md:max-[1199px]:leading-[15px] md:max-[1199px]:tracking-[-0.6px]">
            {priceLabel}
          </p>
        </div>
      </div>

      <a
        href={OFFER_ANCHOR}
        className="relative flex h-[34px] w-[146px] shrink-0 items-center justify-center rounded-sm bg-linear-90 from-gold-start to-gold-end text-[15px] whitespace-nowrap transition-[transform,box-shadow] [transition-duration:var(--duration-fast)] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-6px] hover:shadow-gold-start/60 motion-reduce:hover:translate-y-0 font-bold leading-[18px] text-on-action before:absolute before:inset-x-0 before:-inset-y-[5px] max-md:h-[25px] max-md:w-full max-md:px-3 max-md:py-[5px] max-md:text-[12px] max-md:leading-[14px] md:max-[1199px]:h-[32px] md:max-[1199px]:w-full md:max-[1199px]:px-4 md:max-[1199px]:py-[7px] md:max-[1199px]:text-[15px] md:max-[1199px]:leading-[18px]"
      >
        Comprar Agora
      </a>
    </div>
  );
}

function Thumb({ src }: { src: CoverSrc }) {
  // No wireframe a miniatura tem 48,6×54 e transborda o slot para a esquerda
  // e para cima (offsets medidos). `max-w-none` é obrigatório: o reset global
  // aplica max-width:100%, que a espremeria para os 45px do slot.
  const className =
    "absolute left-[-6.3px] top-[-2px] h-[54px] w-[49px] max-w-none rounded-card object-contain max-md:left-[-5px] max-md:top-[-2px] max-md:h-[45px] max-md:w-[41px] md:max-[1199px]:left-[-6px] md:max-[1199px]:top-[-3px] md:max-[1199px]:h-[50px] md:max-[1199px]:w-[45px]";

  return <img src={src} alt="" className={className} />;
}
