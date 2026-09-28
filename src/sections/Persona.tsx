import { IconCheck, Reveal, RevealGroup } from "@ds/index";
import { PERSONA } from "@content/home";

/* -----------------------------------------------------------------------------
   PERSONA — medido no wireframe (viewport 1440), section 1440x902.
   padding 100/60 · gap 60 · painel 1320x522 r18 pad 80/60 gap 50 · grade 3 col
   ícone 60x60 · gap ícone→texto 24 · texto 239px 20/24 500 -0.4px

   Telas menores (mobile first; as medidas acima valem a partir de xl/1280):
   - o conteúdo é fluido até 1320px e centralizado — acima de 1440 não estica;
   - título e parágrafo empilham até xl, quando voltam lado a lado (648 + 458);
   - a grade do painel vai de 1 coluna (celular) a 2 (sm) e 3 (lg); no celular
     o ícone fica ao lado do texto, e não em cima, para a lista não ficar alta
     demais; padding e gaps do painel encolhem junto.
   -------------------------------------------------------------------------- */

export function Persona() {
  return (
    <section
      id="persona"
      className="bg-surface px-4 py-16 sm:px-6 md:px-10 md:py-20 xl:px-[60px] xl:py-[100px]"
    >
      <RevealGroup className="mx-auto w-full max-w-[1320px]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between xl:gap-0">
          <Reveal variant="up">
            {/* text-h2 = clamp(34px, 4.2vw, 60px), lh 1, ls -0.05em (= -3px a 60px) */}
            <h2 className="m-0 max-w-[648px] text-h2 text-text-strong xl:w-[648px]">
              {PERSONA.title}
            </h2>
          </Reveal>
          <Reveal variant="up" delay={90}>
            <p className="m-0 max-w-[640px] text-base font-normal text-text xl:mt-6 xl:w-[458px]">
              {PERSONA.paragraph}
            </p>
          </Reveal>
        </div>

        <div className="mt-10 xl:mt-[60px]">
          <Reveal variant="up" delay={180}>
            <ul
              className={
                "m-0 grid list-none grid-cols-1 gap-6 rounded-[18px] px-5 py-8 " +
                "sm:grid-cols-2 sm:gap-10 sm:px-10 sm:py-12 " +
                "lg:grid-cols-3 xl:gap-[50px] xl:px-[60px] xl:py-20"
              }
              style={{
                backgroundImage:
                  "linear-gradient(99deg, rgb(231, 221, 194) 0%, rgb(240, 233, 214) 100%)",
              }}
            >
              {PERSONA.items.map((item) => (
                <li
                  key={item}
                  className="flex min-w-0 flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-6"
                >
                  <span
                    aria-hidden
                    className={
                      "grid size-12 shrink-0 place-items-center rounded-[14px] text-[22px] " +
                      "text-text-on-inverse sm:size-[60px] sm:text-[26px] " +
                      "bg-[linear-gradient(225deg,var(--color-action)_0%,var(--color-text-strong)_100%)]"
                    }
                  >
                    <IconCheck />
                  </span>
                  <p className="m-0 text-[18px] font-medium leading-[1.25] tracking-[-0.02em] text-kicker sm:max-w-[239px] sm:text-base sm:tracking-[-0.4px]">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </RevealGroup>
    </section>
  );
}
