import { Accordion, Container, Heading, Reveal, Text } from "@ds/index";
import { FAQ } from "@content/faq";

export function Faq() {
  return (
    <section id="faq" className="bg-surface px-6 py-24 md:px-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <Reveal variant="left">
            <Heading as="h2">Perguntas Frequentes</Heading>
            <Text tone="muted" className="mt-3">
              Respostas para as perguntas mais comuns
            </Text>
          </Reveal>

          <Reveal variant="right" delay={90}>
            <Accordion items={FAQ} variant="cards" numbered defaultOpen={0} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
