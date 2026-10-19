import { IconCheck, Reveal, RevealGroup } from "@ds/index";
import { PERSONA } from "@content/home";

/* -----------------------------------------------------------------------------
   PERSONA — Figma "Seção 5" (949:544), frame de 1440 de largura.
   padding 100/60 · gap 60 · título 648 + parágrafo 458 (gap 114) ·
   grade 1305 de 3 colunas, gap 48/36 · card 403x231 r20, borda 2px dourada,
   fundo petróleo · ícone 60x60 · gap ícone→texto 24 · texto 239px 20/24 500 -0.4px

   Telas menores (mobile first; as medidas acima valem a partir de xl/1280):
   - o conteúdo é fluido até 1305px e centralizado — acima de 1440 não estica;
   - título e parágrafo empilham até xl, quando voltam lado a lado;
   - a grade vai de 1 coluna (celular) a 2 (sm) e 3 (lg); no celular o card
     perde a altura mínima e o ícone fica ao lado do texto, para a lista não
     ficar alta demais.
   -------------------------------------------------------------------------- */

export function Persona() {
  return (
    <section
      id="persona"
      className="bg-surface px-4 py-16 sm:px-6 md:px-10 md:py-20 xl:px-[60px] xl:py-[100px]"
    >
      <RevealGroup className="mx-auto w-full max-w-[1305px]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-[114px]">
          <Reveal variant="up">
            {/* text-h2 = clamp(34px, 4.2vw, 60px), lh 1, ls -0.05em (= -3px a 60px) */}
            <h2 className="m-0 max-w-[648px] text-h2 text-text-lead xl:w-[648px]">
              {PERSONA.title}
            </h2>
          </Reveal>
          <Reveal variant="up" delay={90}>
            <p className="m-0 max-w-[640px] text-base font-normal text-text xl:w-[458px] xl:text-[20px] xl:leading-6">
              {PERSONA.paragraph}
            </p>
          </Reveal>
        </div>

        <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:mt-[60px] xl:gap-x-12 xl:gap-y-9">
          {PERSONA.items.map((item, i) => (
            <Reveal key={item} as="li" variant="up" delay={120 + (i % 3) * 80}>
              <div
                className={
                  "flex h-full flex-row items-center gap-4 rounded-[20px] border-2 border-solid " +
                  "border-gold-start bg-surface-warm-card px-5 py-6 " +
                  "sm:flex-col sm:items-start sm:justify-center sm:gap-6 sm:px-[18px] sm:py-[18px] " +
                  "lg:min-h-[231px]"
                }
              >
                <span
                  aria-hidden
                  className="grid size-12 shrink-0 place-items-center text-[22px] text-text-on-inverse sm:size-[60px]"
                >
                  <IconCheck />
                </span>
                <p className="m-0 text-[18px] font-medium leading-6 tracking-[-0.02em] text-text-on-warm sm:max-w-[239px] sm:text-[20px] sm:tracking-[-0.4px]">
                  {item}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </RevealGroup>
    </section>
  );
}
