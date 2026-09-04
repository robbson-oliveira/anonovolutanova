import { Button, Card, Container, Heading, Reveal, Text } from "@ds/index";
import { LITURGICAL } from "@content/home";
import { CHECKOUT_URL } from "@content/product";

/** Ícone de cada data. Placeholder tipográfico até o eixo de ícones do DS. */
const ICONS = ["🕊", "✧", "☩", "✦", "△", "🗓"];

export function Liturgical() {
  return (
    <section className="relative overflow-hidden bg-surface px-6 py-24 md:px-16">
      {/* Textura de fundo da seção, bem apagada — vem do design aprovado. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/img/textura-liturgica.png')] bg-cover bg-center opacity-[0.07]"
      />

      <Container className="relative">
        <Reveal variant="up">
          <Heading as="h2" className="mx-auto max-w-[980px] text-center">
            {LITURGICAL.title}
          </Heading>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <p className="text-lead text-text-muted">{LITURGICAL.subtitle}</p>
            <Text className="text-accent-hover">{LITURGICAL.paragraph}</Text>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-6 lg:grid-cols-2">
          {LITURGICAL.dates.map((date, i) => (
            <Reveal
              as="li"
              key={date.title}
              variant={i % 2 === 0 ? "left" : "right"}
              delay={(i % 2) * 90}
            >
              <Card surface="plain" elevation="raised" padding="lg" className="h-full">
                <span
                  aria-hidden
                  className="grid size-14 place-items-center rounded-card bg-surface-muted text-xl"
                >
                  {ICONS[i % ICONS.length]}
                </span>
                <p className="mt-6 text-lead font-bold text-text-card">
                  {date.title}
                </p>
                <Text className="mt-2">{date.description}</Text>
              </Card>
            </Reveal>
          ))}
        </ul>

        <Reveal variant="up" className="mt-12 text-center">
          <Text tone="muted">{LITURGICAL.closing}</Text>
          <Button
            href={CHECKOUT_URL}
            size="lg"
            shape="block"
            className="mt-6 w-full max-w-[600px]"
          >
            {LITURGICAL.cta}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
