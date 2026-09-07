import { Reveal } from "@ds/index";
import { QUOTE } from "@content/home";

/**
 * Bloco de citação — medido no wireframe (viewport 1440):
 * caixa de 582px centralizada, texto 20/24 e atribuição 30/36 em terracota,
 * separadas por 20px. No wireframe ele vive no pé do painel do "Explore";
 * aqui fica isolado para poder ser reutilizado.
 */
export function Quote({ inset = true }: { inset?: boolean }) {
  return (
    <section className={inset ? "bg-surface px-[60px] pb-[100px]" : ""}>
      <Reveal variant="up">
        <figure className="mx-auto w-[582px] max-w-full text-center">
          <blockquote className="text-[20px] leading-[24px] text-text">
            “{QUOTE.text}”
          </blockquote>
          <figcaption className="mt-[20px] text-[30px] font-bold leading-[36px] text-accent-hover">
            — {QUOTE.author}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
