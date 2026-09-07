import { CHECKOUT_URL, CYCLE_YEAR, priceLabel } from "@content/product";
const capaColor = "/img/capa-color.png";
const capaClassica = "/img/capa-classica.png";
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
 */
export function BookStage({
  colorSrc = capaColor,
  classicaSrc = capaClassica,
  thumbSrc = capaSolo,
}: BookStageProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative aspect-square w-[740px]"
    >
      {/* Clássica — assenta primeiro, fica atrás */}
      <div
        data-motion="hero-book"
        style={{ left: "42.9%", top: "14.6%" }}
        className="absolute z-[2] w-[48%] origin-center [animation:ds-book-back-in_0.9s_var(--ease-out-soft)_both]"
      >
        <Cover
          src={classicaSrc}
          alt="Agenda Ano Novo, Luta Nova — Edição Clássica"
          priority
        />
      </div>

      {/* Color — pousa sobre a outra, encosta e desliza girando na âncora */}
      <div
        data-motion="hero-book"
        style={{ left: "8.475%", top: "9.006%" }}
        className="absolute z-[5] w-[45.64%] [transform-origin:70%_92%] [animation:ds-book-fan-out_var(--duration-book)_var(--ease-out-soft)_both]"
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
 * fora do escopo deste componente.
 */
function PriceCard({ thumbSrc }: { thumbSrc: CoverSrc }) {
  return (
    <div
      data-motion="hero-card"
      className="pointer-events-auto absolute left-[30%] top-[61%] z-10 flex h-[119px] w-[191px] flex-col items-center justify-start gap-[3px] rounded-md bg-surface p-2.5 [animation:ds-pop-in_0.6s_var(--ease-overshoot)_2.1s_both] [box-shadow:0_4px_4px_rgb(0_0_0/0.1)]"
    >
      <div className="flex items-center">
        {/* Slot de 45px: no wireframe a miniatura transborda um pouco a
            própria caixa, e o texto começa 45px depois do início do slot. */}
        <div className="relative h-[55px] w-[45px] shrink-0">
          <Thumb src={thumbSrc} />
        </div>

        <div>
          <p className="text-[16px] font-bold leading-4 tracking-[-0.64px] text-text-card">
            Agenda {CYCLE_YEAR}
          </p>
          <p className="mt-1 text-[16px] font-bold leading-4 tracking-[-0.64px] text-text-muted">
            {priceLabel}
          </p>
        </div>
      </div>

      <a
        href={CHECKOUT_URL}
        className="flex h-[34px] w-[146px] items-center justify-center rounded-sm bg-action text-[15px] font-bold leading-[18px] text-on-action"
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
    "absolute left-[-6.3px] top-[-2px] h-[54px] w-[49px] max-w-none rounded-card object-contain";

  return <img src={src} alt="" className={className} />;
}
