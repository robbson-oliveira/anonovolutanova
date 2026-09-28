import {
  type IconProps,
  IconAniversarios,
  IconNovenaImaculada,
  IconOitavario,
  IconOutrasDatas,
  IconSeteDomingosSaoJose,
  IconTrisagio,
  Reveal,
} from "@ds/index";
import { LITURGICAL } from "@content/home";
import { BUY_URL } from "@content/product";

/**
 * Um ícone por data, na ordem de `LITURGICAL.dates`.
 */
const ICONS = [
  IconOitavario,
  IconNovenaImaculada,
  IconSeteDomingosSaoJose,
  IconAniversarios,
  IconTrisagio,
  IconOutrasDatas,
];

/**
 * Medidas extraídas do DOM do wireframe em viewport 1440:
 * seção 1440×1488, padding 100/60; coluna útil 1018px;
 * textura de fundo em opacidade 0.19; cards 499×270 brancos, raio 12,
 * padding 42/32, ícone 60 e 20px até o título (24/24, ls -0.96);
 * grade 2 colunas com gap 20; CTA 600×68, raio 10.
 * Só o título anima (fade + 28px, ~700ms) — os cards entram estáticos.
 *
 * Telas menores (mobile first; o desenho medido vale inteiro a partir de `xl`):
 * - a coluna de 1018px vira fluida (w-full + max-w) e o padding da seção
 *   encolhe para 16px nas laterais;
 * - o título usa o token `text-h2` (34px → 60px, já em 60 no 1440);
 * - subtítulo e parágrafo, lado a lado no desktop, empilham centralizados
 *   abaixo de `md`;
 * - a grade vira uma coluna abaixo de `md`, e cada card deita (ícone de 48px
 *   à esquerda, texto à direita) para não esticar a seção; a altura de 270px
 *   vira mínima para o texto nunca vazar do card quando a coluna estreita.
 */
export function Liturgical() {
  return (
    <section className="relative overflow-hidden bg-surface px-4 py-16 sm:px-6 md:px-10 md:py-20 xl:px-[60px] xl:py-[100px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/img/textura-liturgica.png')] bg-cover bg-center opacity-[0.19]"
      />

      <div className="relative mx-auto w-full max-w-[1018px]">
        <Reveal variant="up">
          <h2 className="text-center text-h2 font-bold text-text-strong">
            {LITURGICAL.title}
          </h2>
        </Reveal>

        <div className="mt-4 flex flex-col gap-3 text-center md:mt-[13px] md:flex-row md:justify-between md:gap-10 md:text-left lg:px-[55px]">
          <p className="text-base text-text md:w-[270px]">
            {LITURGICAL.subtitle}
          </p>
          <p className="text-base text-accent-hover md:w-[372px]">
            {LITURGICAL.paragraph}
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-3 md:mt-[39px] md:grid-cols-2 md:gap-[20px]">
          {LITURGICAL.dates.map((date, i) => (
            <li
              key={date.title}
              className="flex items-start gap-4 rounded-card bg-surface-plain px-5 py-6 md:block md:min-h-[270px] md:px-[32px] md:py-[42px]"
            >
              <DateIcon icon={ICONS[i % ICONS.length]} />
              <div className="min-w-0">
                <p className="text-[20px] font-bold leading-[24px] tracking-[-0.04em] text-text-strong md:mt-[20px] md:text-[24px]">
                  {date.title}
                </p>
                <p className="mt-2 text-[18px] leading-[22px] text-text md:mt-[10px] md:text-base">
                  {date.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-base text-text md:mt-[39px]">
          {LITURGICAL.closing}
        </p>

        <a
          href={BUY_URL}
          className="mx-auto mt-8 flex h-[68px] w-full max-w-[600px] items-center justify-center rounded-md bg-action px-6 text-center text-[16px] font-bold leading-[16px] tracking-[-0.04em] text-on-action transition-colors [transition-duration:var(--duration-fast)] hover:bg-action-hover md:mt-[39px]"
        >
          {LITURGICAL.cta}
        </a>
      </div>
    </section>
  );
}

/** O tile creme vive aqui, não dentro do SVG: o ícone é só o glifo. */
function DateIcon({ icon: Icon }: { icon: React.ComponentType<IconProps> }) {
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-card bg-surface-warm text-accent-hover md:size-[60px]">
      <Icon className="size-full" />
    </span>
  );
}
