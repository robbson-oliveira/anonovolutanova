import { Container, Heading, IconCheck, Reveal, Text } from "@ds/index";
import { PERSONA } from "@content/home";

export function Persona() {
  return (
    <section className="bg-surface px-6 py-24 md:px-16">
      <Container>
        <Reveal
          variant="up"
          className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]"
        >
          <Heading as="h2" className="max-w-[620px]">
            {PERSONA.title}
          </Heading>
          <Text className="lg:pt-3">{PERSONA.paragraph}</Text>
        </Reveal>

        {/* Um painel único com a grade dentro — no design aprovado os itens
            não são cards separados. */}
        <Reveal variant="up" delay={90}>
          <ul className="mt-14 grid gap-x-10 gap-y-12 rounded-lg bg-surface-muted p-14 md:grid-cols-2 lg:grid-cols-3">
            {PERSONA.items.map((item) => (
              <li key={item}>
                <span
                  aria-hidden
                  className="grid size-14 place-items-center rounded-card bg-surface-inverse text-lg text-text-on-inverse"
                >
                  <IconCheck className="text-2xl" />
                </span>
                <p className="mt-5 max-w-[230px] text-base font-medium text-action">{item}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
