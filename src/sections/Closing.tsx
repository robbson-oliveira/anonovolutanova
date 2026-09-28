import { Reveal, RevealGroup } from "@ds/index";
import { CLOSING } from "@content/home";
import { BUY_URL } from "@content/product";

const textura = "/img/textura-rodape.png";

/**
 * Bloco de fechamento — medido no wireframe (viewport 1440):
 * faixa de 1440x885 com a textura de fundo e um cartao verde de 1278x716
 * (raio 24) a partir de x=81, y=9. Dentro do cartao: selo em y=151, titulo
 * em y=197, paragrafo de 626px em y=247, botoes (361 + 15 + 225) em y=431 e
 * a nota final em y=549.
 *
 * A partir de 1440px esses valores valem ao pixel. O conteudo agora corre em
 * fluxo (nao mais em posicao absoluta): as distancias acima viraram margens, e
 * a altura minima do paragrafo segura os botoes em y=431.
 *
 * Abaixo de 1440px:
 * - a faixa ocupa a largura toda (max 1440) com respiro lateral de 16/24/40px,
 *   e o cartao fica fluido ate 1278px, com padding que encolhe no celular;
 * - a textura cobre a faixa (`cover`) em vez do tamanho fixo de 1440px;
 * - os botoes empilham na largura toda do cartao e so ficam lado a lado a
 *   partir de 768px, onde cabem os 601px da dupla.
 *
 * O selo esta centralizado em todas as larguras. No port absoluto ele estava
 * em x=651.8 do cartao — ~88px a direita do centro, destoando de todo o resto.
 */
export function Closing() {
  return (
    <section
      id="fechamento-bloco"
      className="relative mx-auto w-full max-w-[1440px] bg-cover bg-top bg-no-repeat px-4 pb-16 pt-2 sm:px-6 md:pb-24 lg:px-10 min-[1440px]:h-[885px] min-[1440px]:bg-[length:1440px_1539px] min-[1440px]:bg-[position:0_0] min-[1440px]:px-[81px] min-[1440px]:pb-0 min-[1440px]:pt-[9px]"
      style={{ backgroundImage: `url(${textura})` }}
    >
      <RevealGroup>
        <Reveal variant="up">
          <div className="mx-auto flex w-full max-w-[1278px] flex-col items-center rounded-card bg-surface-inverse-soft px-5 py-12 text-center sm:px-10 md:rounded-lg md:py-20 min-[1440px]:h-[716px] min-[1440px]:pb-0 min-[1440px]:pt-[151px]">
            {/* selo */}
            <div className="flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="shrink-0">
                <path
                  d="M8 0l1.9 5.2L15 7l-5.1 1.8L8 14l-1.9-5.2L1 7l5.1-1.8z"
                  fill="rgb(230, 170, 60)"
                />
              </svg>
              <span
                className="whitespace-nowrap text-xs font-bold text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(225deg, var(--color-highlight) 0%, rgb(225,153,36) 38.5%, var(--color-highlight) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                {CLOSING.badge}
              </span>
            </div>

            <p className="mt-6 text-stat font-bold leading-[1.1] text-text-on-inverse min-[1440px]:mt-[30px] min-[1440px]:leading-none">
              {CLOSING.title}
            </p>

            {/* min-h no desktop: 247 + 184 = 431, onde o wireframe poe os botoes */}
            <p
              className="mt-5 max-w-[626px] text-base min-[1440px]:min-h-[184px]"
              style={{ color: "rgb(214, 214, 214)" }}
            >
              {CLOSING.paragraph}
            </p>

            <div className="mt-10 flex w-full flex-col items-stretch gap-[15px] md:w-auto md:flex-row md:items-center min-[1440px]:mt-0">
              <a
                href={BUY_URL}
                className="flex min-h-[68px] items-center justify-center rounded-[9px] px-5 py-3 text-base font-bold tracking-[-0.4px] text-text-on-inverse no-underline md:w-[361px]"
                style={{
                  background:
                    "linear-gradient(62deg, rgb(255,122,47) 0%, rgb(255,122,47) 42%, rgb(244,211,143) 100%)",
                  boxShadow: "rgba(0, 0, 0, 0.3) 0px 12px 24px 0px",
                }}
              >
                {CLOSING.primaryCta}
              </a>

              <a
                href="#sobre"
                className="flex min-h-[68px] items-center justify-center rounded-md border border-text-on-inverse/25 bg-surface-inverse-soft px-5 py-3 text-xs font-bold text-text-on-inverse no-underline md:w-[225px]"
              >
                {CLOSING.secondaryCta}
              </a>
            </div>

            <p className="mt-10 text-xs font-bold text-text-on-inverse min-[1440px]:mt-[50px]">
              {CLOSING.seal}
            </p>
          </div>
        </Reveal>
      </RevealGroup>
    </section>
  );
}
