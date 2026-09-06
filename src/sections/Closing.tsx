import { Badge, Button, Container, Heading, IconSparkle, Reveal, Text } from "@ds/index";
import { CLOSING } from "@content/home";
import { CHECKOUT_URL } from "@content/product";

export function Closing() {
  return (
    <section className="bg-surface px-6 pb-24 md:px-16">
      <Container>
        {/* No design aprovado este bloco é um cartão escuro arredondado dentro
            da página, não uma faixa sangrada de borda a borda. */}
        <Reveal variant="up">
          <div className="rounded-lg bg-surface-inverse-soft px-8 py-24 text-center">
            <Badge tone="plainInverse" icon={<IconSparkle />} className="opacity-60">
              {CLOSING.badge}
            </Badge>

            <Heading
              as="h2"
              level="subsection"
              tone="inverse"
              className="mx-auto mt-5 max-w-[720px]"
            >
              {CLOSING.title}
            </Heading>

            <Text
              tone="inverse"
              className="mx-auto mt-5 max-w-[640px] opacity-75"
            >
              {CLOSING.paragraph}
            </Text>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                href={CHECKOUT_URL}
                size="lg"
                shape="block"
                variant="inverse"
                className="min-w-[360px]"
              >
                {CLOSING.primaryCta}
              </Button>
              <Button
                href="#sobre"
                size="lg"
                shape="block"
                variant="ghost"
                className="min-w-[220px] text-text-on-inverse ring-1 ring-border-inverse"
              >
                {CLOSING.secondaryCta}
              </Button>
            </div>

            <Badge tone="plainInverse" icon={<IconSparkle />} className="mt-8">
              {CLOSING.seal}
            </Badge>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
