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
import { CHECKOUT_URL } from "@content/product";

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
 */
export function Liturgical() {
  return (
    <section className="relative overflow-hidden bg-surface px-[60px] py-[100px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/img/textura-liturgica.png')] bg-cover bg-center opacity-[0.19]"
      />

      <div className="relative mx-auto w-[1018px] max-w-full">
        <Reveal variant="up">
          <h2 className="text-center text-[60px] font-bold leading-[60px] tracking-[-0.05em] text-text-strong">
            {LITURGICAL.title}
          </h2>
        </Reveal>

        <div className="mt-[13px] flex justify-between px-[55px]">
          <p className="w-[270px] text-[20px] leading-[24px] text-text">
            {LITURGICAL.subtitle}
          </p>
          <p className="w-[372px] text-[20px] leading-[24px] text-accent-hover">
            {LITURGICAL.paragraph}
          </p>
        </div>

        <ul className="mt-[39px] grid grid-cols-2 gap-[20px]">
          {LITURGICAL.dates.map((date, i) => (
            <li
              key={date.title}
              className="h-[270px] rounded-[12px] bg-surface-plain px-[32px] py-[42px]"
            >
              <DateIcon icon={ICONS[i % ICONS.length]} />
              <p className="mt-[20px] text-[24px] font-bold leading-[24px] tracking-[-0.04em] text-text-strong">
                {date.title}
              </p>
              <p className="mt-[10px] text-[20px] leading-[24px] text-text">
                {date.description}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-[39px] text-center text-[20px] leading-[24px] text-text">
          {LITURGICAL.closing}
        </p>

        <a
          href={CHECKOUT_URL}
          className="mx-auto mt-[39px] flex h-[68px] w-[600px] max-w-full items-center justify-center rounded-[10px] bg-action text-[16px] font-bold leading-[16px] tracking-[-0.04em] text-on-action transition-colors [transition-duration:var(--duration-fast)] hover:bg-action-hover"
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
    <span className="grid size-[60px] place-items-center rounded-[12px] bg-surface-warm text-accent-hover">
      <Icon className="size-full" />
    </span>
  );
}
