import { Accordion, Container, Heading, Reveal, Text } from "@ds/index";
import { FAQ } from "@content/faq";

/**
 * Duas colunas (título | acordeão) a partir de `lg`; abaixo disso, empilha.
 *
 * Telas menores: a seção não soma padding próprio ao do <Container> abaixo
 * de `md` (ficariam 48px de cada lado num celular de 375px). E corta o eixo X
 * com `overflow-x-clip`: os <Reveal> left/right nascem deslocados 56px até
 * entrarem na tela, e esse deslocamento empurrava a largura da página.
 * `clip` (e não `hidden`) para não criar contêiner de rolagem.
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="overflow-x-clip bg-surface py-16 md:px-16 md:py-24"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12">
          <Reveal variant="left">
            <Heading as="h2">Perguntas Frequentes</Heading>
            <Text tone="muted" className="mt-3">
              Respostas para as perguntas mais comuns
            </Text>
          </Reveal>

          <Reveal variant="right" delay={90} className="min-w-0">
            <Accordion items={FAQ} variant="cards" numbered defaultOpen={0} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
