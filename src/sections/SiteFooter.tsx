import Image from "next/image";
import { Reveal, RevealGroup } from "@ds/index";
import { FOOTER } from "@content/home";
import { PRODUCT_NAME } from "@content/product";
import { ConsentLink } from "@/features/shell/ConsentLink";

const logo = "/img/logo.png";
const textura = "/img/textura-rodape.png";

/**
 * Os links do conteudo ainda sao as ancoras do wireframe (#privacidade...).
 * Aqui eles vao para as paginas reais. "Afiliados" nao tem pagina propria: cai
 * no contato. "Sobre" leva o "/" para funcionar tambem fora da home.
 */
const HREFS: Record<string, string> = {
  "#sobre": "/#sobre",
  "#contato": "/contato",
  "#afiliados": "/contato",
  "#privacidade": "/politica-de-privacidade",
  "#termos": "/termos-e-condicoes",
};

const linkClass =
  "inline-flex min-h-11 items-center px-1 text-xs font-bold leading-[22px] text-text-strong no-underline underline-offset-4 hover:underline min-[1440px]:min-h-0 min-[1440px]:px-0";

/**
 * Rodape — medido no wireframe (viewport 1440): faixa de 1440x654 que continua
 * a mesma textura do fechamento (deslocada -885px), logo 106x141 centralizado,
 * texto de apoio 391px em y=172, linha de links 16/22 com gap 36 em y=321,
 * copyright 391px em y=420 e nota social 354px em y=492.
 *
 * A partir de 1440px esses valores valem ao pixel: o conteudo corre em fluxo e
 * as alturas minimas dos blocos de texto seguram cada linha no seu y. O botao
 * "Preferências de cookies" (exigido pelo aviso de cookies) entra no fim da
 * linha de links, com o mesmo estilo deles.
 *
 * Abaixo de 1440px: largura fluida com respiro lateral, textura em `cover`
 * (ancorada embaixo, onde estao os vitrais), links quebrando em linhas
 * centralizadas com alvo de toque de 44px, e a nota social sobe de 12 para 13px.
 */
export function SiteFooter() {
  return (
    <footer
      className="relative mx-auto w-full max-w-[1440px] bg-cover bg-bottom bg-no-repeat px-4 pb-12 sm:px-6 min-[1440px]:h-[654px] min-[1440px]:bg-[length:1440px_1539px] min-[1440px]:bg-[position:0_-885px] min-[1440px]:px-0 min-[1440px]:pb-0"
      style={{ backgroundImage: `url(${textura})` }}
    >
      <RevealGroup className="flex flex-col items-center text-center">
        <Reveal variant="up">
          <Image
            src={logo}
            alt={PRODUCT_NAME}
            width={1086}
            height={1448}
            sizes="106px"
            className="block h-[141px] w-[106px] object-contain"
          />
        </Reveal>

        {/* min-h no desktop: 172 + 149 = 321, onde o wireframe poe os links */}
        <Reveal variant="up" delay={80} className="mt-[31px] min-[1440px]:min-h-[149px]">
          <p className="max-w-[391px] text-base text-text">{FOOTER.tagline}</p>
        </Reveal>

        <Reveal variant="up" delay={140} className="mt-8 w-full min-[1440px]:mt-0">
          <nav
            aria-label="Rodapé"
            className="flex flex-wrap items-center justify-center gap-x-5 min-[1440px]:gap-x-9"
          >
            {FOOTER.links.map((link) => (
              <a key={link.label} href={HREFS[link.href] ?? link.href} className={linkClass}>
                {link.label}
              </a>
            ))}
            <ConsentLink className={linkClass} />
          </nav>
        </Reveal>

        {/* min-h no desktop: 420 + 72 = 492, onde entra a nota social */}
        <Reveal
          variant="up"
          delay={200}
          className="mt-8 min-[1440px]:mt-[77px] min-[1440px]:min-h-[72px]"
        >
          <p className="max-w-[391px] text-base text-text">{FOOTER.copyright}</p>
        </Reveal>

        <Reveal variant="up" delay={260} className="mt-4 min-[1440px]:mt-0">
          <p className="max-w-[354px] text-fine text-text min-[1440px]:text-[12px] min-[1440px]:leading-[14.4px]">
            {FOOTER.socialNote}
          </p>
        </Reveal>
      </RevealGroup>
    </footer>
  );
}
