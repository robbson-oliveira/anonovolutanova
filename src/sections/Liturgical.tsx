import {
  Button,
  Card,
  Container,
  Heading,
  type IconProps,
  IconAniversarios,
  IconNovenaImaculada,
  IconOitavario,
  IconOutrasDatas,
  IconSeteDomingosSaoJose,
  IconTrisagio,
  Reveal,
  Text,
} from "@ds/index";
import { LITURGICAL } from "@content/home";
import { CHECKOUT_URL } from "@content/product";

/**
 * Um ícone por data, na ordem de `LITURGICAL.dates`. O par é semântico — a
 * rosa é dos aniversários, a imagem de Nossa Senhora é da Novena —, então
 * reordenar as datas no conteúdo exige reordenar aqui junto.
 */
const ICONS = [
  IconOitavario,             // Oitavário pela Unidade dos Cristãos
  IconNovenaImaculada,       // Novena da Imaculada Conceição
  IconSeteDomingosSaoJose,   // 7 Domingos de São José
  IconAniversarios,          // Aniversários e datas comemorativas
  IconTrisagio,              // Triságio Angélico
  IconOutrasDatas,           // E muitas outras datas importantes!
];

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
                <DateIcon
                  icon={ICONS[i % ICONS.length]}
                />
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

/** O tile creme do design vive aqui, não dentro do SVG: o ícone é só o glifo. */
function DateIcon({ icon: Icon }: { icon: React.ComponentType<IconProps> }) {
  return (
    <span className="grid size-14 place-items-center rounded-card bg-surface-warm text-accent-hover">
      <Icon className="size-full" />
    </span>
  );
}
