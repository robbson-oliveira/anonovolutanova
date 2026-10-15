import Image from "next/image";
import { Reveal, RevealGroup } from "@ds/index";
import { FOOTER } from "@content/home";
import { PRODUCT_NAME } from "@content/product";
import { ConsentLink } from "@/features/shell/ConsentLink";

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
  "inline-flex min-h-11 items-center px-1 text-base font-bold leading-4 tracking-[-0.04em] text-text-strong no-underline underline-offset-4 hover:underline min-[1440px]:min-h-0 min-[1440px]:px-0";

/** O Figma quebra o copyright em duas linhas e tira o ponto depois de "Nova". */
const [copyrightLinha1, copyrightLinha2] = FOOTER.copyright.split(". ");

/**
 * Rodape — Figma "Agenda Campanha 2026-2027", no 960:2 (frame de 1920x1173).
 *
 * Fundo: aquarela (`bg-aquarela.png`) sobre o bege #eae5d9, com a mesma mascara
 * do Figma — um degrade que vai de ~1% a ~37% de opacidade, de cima para baixo.
 * O fundo sangra a largura toda; o conteudo fica numa coluna de 1440px.
 * A aquarela e `cover` ancorada em 80% da altura, que e onde o Figma a corta
 * (as ondas do rodape, nao o ceu vazio da parte de cima da imagem).
 *
 * Conteudo (medidas do Figma, coluna de 1440px, y relativo ao logo): logo 106x143
 * em 0, frase de 391px em 172 (20/24), links 16px bold em 324, copyright 20/24
 * em 420 e nota da ADEC 12/14,4 em 491. Dos 1440px para cima os valores valem ao
 * pixel — as margens abaixo somam essas distancias.
 *
 * Abaixo de 1440px: respiro lateral fluido, distancias verticais menores, frase
 * e copyright em 18px, links quebrando em linhas centralizadas com alvo de
 * toque de 44px e a nota da ADEC em 13px (12px e pequeno demais no celular).
 */
export function SiteFooter() {
  return (
    <footer className="relative isolate w-full overflow-hidden bg-surface-footer">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[url(/img/footer/bg-aquarela.png)] bg-cover bg-[position:center_80%] bg-no-repeat [mask-image:var(--mask-footer-aquarela)]"
      />

      {/* No Figma o fechamento e o rodape dividem o mesmo fundo; aqui o fechamento
          tem o proprio (creme com vitral), entao a aquarela nasce do creme. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-surface to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-20 sm:px-6 md:pb-32 md:pt-28 min-[1440px]:px-0 min-[1440px]:pb-[231px] min-[1440px]:pt-[120px]">
        <RevealGroup className="flex flex-col items-center text-center">
          <Reveal variant="up">
            <Image
              src="/img/footer/logo-footer.svg"
              alt={PRODUCT_NAME}
              width={106}
              height={143}
              unoptimized
              className="block h-[143px] w-[106px]"
            />
          </Reveal>

          {/* min-h no desktop: 172 + 72 = 244, e os links ficam 80px abaixo */}
          <Reveal variant="up" delay={80} className="mt-7 min-[1440px]:mt-[29px]">
            <p className="max-w-[391px] text-lg leading-6 text-text min-[768px]:text-xl">
              {FOOTER.tagline}
            </p>
          </Reveal>

          <Reveal variant="up" delay={140} className="mt-10 w-full min-[1440px]:mt-20">
            <nav
              aria-label="Rodapé"
              className="flex flex-wrap items-center justify-center gap-x-5 min-[1440px]:gap-x-10"
            >
              {FOOTER.links.map((link) => (
                <a key={link.label} href={HREFS[link.href] ?? link.href} className={linkClass}>
                  {link.label}
                </a>
              ))}
              <ConsentLink className={linkClass} />
            </nav>
          </Reveal>

          <Reveal variant="up" delay={200} className="mt-10 min-[1440px]:mt-20">
            <p className="max-w-[391px] text-lg leading-6 text-text min-[768px]:text-xl">
              <span className="block">{copyrightLinha1}</span>
              <span className="block">{copyrightLinha2}</span>
            </p>
          </Reveal>

          <Reveal variant="up" delay={260} className="mt-6 min-[1440px]:mt-[23px]">
            <p className="max-w-[354px] text-fine text-text min-[1440px]:text-[12px] min-[1440px]:leading-[14.4px]">
              {FOOTER.socialNote}
            </p>
          </Reveal>
        </RevealGroup>
      </div>
    </footer>
  );
}
