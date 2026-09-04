import { Container, Reveal } from "@ds/index";
import { QUOTE } from "@content/home";

export function Quote() {
  return (
    <section className="bg-surface px-6 pb-24 md:px-16">
      <Container>
        <Reveal variant="up">
          {/* Centralizada na largura da página — foi um ajuste explícito do
              design aprovado, não o alinhamento herdado da coluna de texto. */}
          <figure className="mx-auto max-w-[620px] text-center">
            <blockquote className="text-lead leading-relaxed text-text">
              “{QUOTE.text}”
            </blockquote>
            <figcaption className="mt-6 text-h3 font-bold tracking-[-0.03em] text-text-muted">
              — {QUOTE.author}
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
