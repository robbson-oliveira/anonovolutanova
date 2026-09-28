import { cn } from "@ds/index";
import { BUY_URL, CYCLE_YEAR, priceLabel } from "@content/product";
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
 * Em telas menores o Hero usa `fluid`: o palco encolhe junto com a coluna e
 * vira um container query (`@container/stage`). Abaixo de 520px de palco o
 * card de preço deixa de ser o cartão flutuante sobre a capa e vira uma barra
 * no pé do palco — com 191px fixos ele cobriria metade das agendas num
 * celular. A 740px (lab, catálogo e desktop) nada disso se aplica.
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
        className="absolute left-[42.9%] top-[14.6%] z-[2] w-[48%] origin-center animate-book-back-in motion-reduce:[animation-duration:1ms]"
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
        className="absolute left-[8.475%] top-[9.006%] z-[5] w-[45.64%] [transform-origin:70%_92%] animate-book-fan-out motion-reduce:[animation-duration:1ms]"
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
 * Palco estreito (< 520px, só com `fluid`): os valores medidos acima ficam
 * como estão e as classes `@max-[520px]/stage:` os sobrescrevem — o card vira
 * uma barra horizontal centralizada no pé do palco, sem a miniatura (as
 * agendas estão logo acima) e com o botão em 44px de altura. Ficou em
 * "max" de propósito: o valor sem prefixo continua sendo o do wireframe.
 */
function PriceCard({ thumbSrc }: { thumbSrc: CoverSrc }) {
  return (
    <div
      className={cn(
        "pointer-events-auto absolute left-[30%] top-[57%] z-10 flex h-[119px] w-[191px] flex-col items-center justify-start gap-[3px] rounded-md bg-surface p-2.5 animate-pop-in motion-reduce:animate-none shadow-pop",
        "@max-[520px]/stage:inset-x-0 @max-[520px]/stage:top-auto @max-[520px]/stage:bottom-[2%] @max-[520px]/stage:mx-auto @max-[520px]/stage:h-auto @max-[520px]/stage:w-fit @max-[520px]/stage:max-w-[94%] @max-[520px]/stage:flex-row @max-[520px]/stage:gap-4 @max-[520px]/stage:py-2 @max-[520px]/stage:pl-4 @max-[520px]/stage:pr-2",
      )}
    >
      <div className="flex items-center">
        {/* Slot de 45px: no wireframe a miniatura transborda um pouco a
            própria caixa, e o texto começa 45px depois do início do slot. */}
        <div className="relative h-[55px] w-[45px] shrink-0 @max-[520px]/stage:hidden">
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
        href={BUY_URL}
        className="relative flex h-[34px] w-[146px] shrink-0 items-center justify-center rounded-sm bg-action text-[15px] font-bold leading-[18px] text-on-action before:absolute before:inset-x-0 before:-inset-y-[5px] @max-[520px]/stage:h-11"
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
