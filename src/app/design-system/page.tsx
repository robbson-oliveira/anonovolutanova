import type { Metadata } from "next";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Container,
  Counter,
  Eyebrow,
  Heading,
  Marquee,
  Reveal,
  Tabs,
  Text,
} from "@ds/index";
import { EditionSelectorDemo } from "./EditionSelectorDemo";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Os 6 eixos do design system da Agenda Ano Novo, Luta Nova, renderizados a partir dos tokens reais.",
};

/* -----------------------------------------------------------------------------
   Esta página lê os MESMOS tokens que o site. Não é documentação escrita à mão:
   se um token mudar, a página muda junto. É por isso que ela substitui um
   Storybook nesta fase — é revisável numa URL, no mesmo deploy.
   -------------------------------------------------------------------------- */

const SEMANTIC_COLORS = [
  { name: "--color-surface", role: "Superfície padrão" },
  { name: "--color-surface-muted", role: "Superfície neutra" },
  { name: "--color-surface-warm", role: "Superfície creme (fundo do site)" },
  { name: "--color-surface-inverse", role: "Superfície escura" },
  { name: "--color-surface-accent-soft", role: "Superfície de acento suave" },
  { name: "--color-text", role: "Texto corrido" },
  { name: "--color-text-strong", role: "Títulos" },
  { name: "--color-text-muted", role: "Texto secundário" },
  { name: "--color-text-display", role: "Display do hero" },
  { name: "--color-accent", role: "Acento, CTA, item ativo" },
  { name: "--color-accent-hover", role: "Acento em hover" },
  { name: "--color-support", role: "Apoio" },
  { name: "--color-highlight", role: "Destaque dourado" },
  { name: "--color-border", role: "Traço / divisor" },
];

const TYPE_SCALE = [
  { token: "--text-display", label: "Display", sample: "Ano Novo, Luta Nova" },
  { token: "--text-h2", label: "Título de seção", sample: "Explore a Agenda" },
  { token: "--text-h3", label: "Subtítulo", sample: "O ritmo do seu ano" },
  { token: "--text-lead", label: "Lead", sample: "Santificar o cotidiano" },
  { token: "--text-base", label: "Corpo", sample: "A santidade se constrói nas pequenas coisas." },
  { token: "--text-sm", label: "Apoio", sample: "Frete grátis a partir de 4 unidades" },
  { token: "--text-xs", label: "Legenda", sample: "Edição Limitada" },
];

const RADII = ["--radius-sm", "--radius-md", "--radius-card", "--radius-lg", "--radius-pill"];

const MOTION = [
  { token: "--duration-reveal", role: "Entrada de blocos e títulos" },
  { token: "--duration-count", role: "Contagem dos números" },
  { token: "--duration-book", role: "Leque das agendas no hero" },
  { token: "--duration-edition", role: "Ciclo do seletor de edição" },
  { token: "--duration-ticker", role: "Volta completa da esteira" },
  { token: "--ease-enter", role: "Easing das entradas" },
  { token: "--ease-out-soft", role: "Easing do movimento das capas" },
  { token: "--ease-overshoot", role: "Easing do card de preço" },
];

export default function DesignSystemPage() {
  return (
    <div className="bg-surface-warm py-16">
      <Container>
        <header className="max-w-[760px]">
          <Eyebrow>Fonte de verdade</Eyebrow>
          <Heading as="h1" level="display" tone="display" className="mt-4">
            Design System
          </Heading>
          <Text className="mt-6">
            Agenda Ano Novo, Luta Nova 2027. Os seis eixos abaixo são renderizados
            a partir dos tokens reais em{" "}
            <code className="rounded-sm bg-surface px-1.5 py-0.5 text-sm">
              src/ds/styles/tokens.css
            </code>
            . Trocar a paleta é editar aquele arquivo — nada aqui repete valor.
          </Text>
        </header>

        {/* ---------- 1. Tipografia ---------- */}
        <Axis number={1} title="Tipografia">
          <Text className="mb-8 max-w-prose">
            Manrope em todo o site. Os componentes escolhem papel, nunca tamanho:
            o tamanho vive no token e é fluido entre as três medidas do design
            aprovado (50px → 54px → 80px no display).
          </Text>
          <div className="space-y-8">
            {TYPE_SCALE.map((item) => (
              <div
                key={item.token}
                className="border-t border-border pt-6"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-sm font-semibold text-text-strong">
                    {item.label}
                  </span>
                  <code className="text-xs text-text-muted">{item.token}</code>
                </div>
                <p
                  className="mt-3 font-bold tracking-[-0.04em] text-text-strong"
                  style={{ fontSize: `var(${item.token})`, lineHeight: 1.15 }}
                >
                  {item.sample}
                </p>
              </div>
            ))}
          </div>
        </Axis>

        {/* ---------- 2. Cores & Superfícies ---------- */}
        <Axis number={2} title="Cores & Superfícies">
          <Text className="mb-8 max-w-prose">
            Duas camadas: primitivas (os valores da marca) e semânticas (o papel
            que cada valor cumpre). Componente só consome semântica — um lint
            bloqueia cor literal em componente, então isto é regra, não convenção.
          </Text>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SEMANTIC_COLORS.map((color) => (
              <li key={color.name}>
                <Card padding="none" className="overflow-hidden">
                  <div
                    className="h-20 w-full border-b border-border"
                    style={{ background: `var(${color.name})` }}
                  />
                  <div className="p-4">
                    <code className="text-xs text-text-strong">
                      {color.name}
                    </code>
                    <Text size="xs" tone="muted" className="mt-1">
                      {color.role}
                    </Text>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Axis>

        {/* ---------- 3. Componentes de UI ---------- */}
        <Axis number={3} title="Componentes de UI">
          <Specimen label="Button">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="ghost">Ghost</Button>
              <Button size="lg">Grande</Button>
            </div>
          </Specimen>

          <Specimen label="Badge">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Edição Limitada</Badge>
              <Badge tone="accent">Nova Edição 2027</Badge>
              <Badge tone="support">Envio Imediato!</Badge>
              <Badge tone="outline">Frete Grátis</Badge>
            </div>
          </Specimen>

          <Specimen label="Card">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>Flat</Card>
              <Card elevation="raised">Raised</Card>
              <Card elevation="float">Float</Card>
            </div>
          </Specimen>

          <Specimen label="Tabs">
            <Tabs
              items={[
                { label: "Capa", content: <Text>Painel da capa.</Text> },
                { label: "Planos e Metas", content: <Text>Painel de metas.</Text> },
                { label: "Agenda Diária", content: <Text>Painel diário.</Text> },
              ]}
            />
          </Specimen>

          <Specimen label="Accordion">
            <Accordion
              defaultOpen={0}
              items={[
                {
                  question: "A agenda é entregue na minha cidade?",
                  answer: <p>Sim, enviamos para todo o Brasil.</p>,
                },
                {
                  question: "Como posso pagar?",
                  answer: <p>Cartão de crédito e PIX.</p>,
                },
              ]}
            />
          </Specimen>

          <Specimen label="EditionSelector">
            <EditionSelectorDemo />
          </Specimen>
        </Axis>

        {/* ---------- 4. Layout & Espaçamento ---------- */}
        <Axis number={4} title="Layout & Espaçamento">
          <Text className="mb-8 max-w-prose">
            O conteúdo vive em 1200px, com uma medida estreita para leitura
            corrida. Nenhuma seção define largura por conta própria.
          </Text>
          <div className="space-y-4">
            <Measure token="--container-content" label="Largura de conteúdo" />
            <Measure token="--container-prose" label="Medida de leitura" />
            <Measure token="--spacing-section" label="Ritmo vertical de seção" />
            <Measure token="--spacing-section-sm" label="Ritmo vertical curto" />
          </div>

          <p className="mt-10 mb-4 text-sm font-semibold text-text-strong">
            Raios
          </p>
          <div className="flex flex-wrap gap-4">
            {RADII.map((token) => (
              <div key={token} className="text-center">
                <div
                  className="size-24 border border-border bg-surface"
                  style={{ borderRadius: `var(${token})` }}
                />
                <code className="mt-2 block text-xs text-text-muted">
                  {token.replace("--radius-", "")}
                </code>
              </div>
            ))}
          </div>
        </Axis>

        {/* ---------- 5. Movimento & Interação ---------- */}
        <Axis number={5} title="Movimento & Interação">
          <Text className="mb-8 max-w-prose">
            Duração e easing são token, não número solto no componente. Todo o
            movimento respeita <code>prefers-reduced-motion</code> garantindo o
            estado final visível — remover a animação sem isso deixaria blocos
            invisíveis, que foi um problema real do protótipo.
          </Text>

          <ul className="mb-10 grid gap-3 sm:grid-cols-2">
            {MOTION.map((item) => (
              <li
                key={item.token}
                className="flex items-baseline justify-between gap-4 border-b border-border pb-3"
              >
                <code className="text-xs text-text-strong">{item.token}</code>
                <Text as="span" size="xs" tone="muted" className="text-right">
                  {item.role}
                </Text>
              </li>
            ))}
          </ul>

          <Specimen label="Reveal">
            <div className="grid gap-4 sm:grid-cols-4">
              {(["up", "left", "right", "pop"] as const).map((variant) => (
                <Reveal key={variant} variant={variant}>
                  <Card surface="warm" className="text-center">
                    <code className="text-xs">{variant}</code>
                  </Card>
                </Reveal>
              ))}
            </div>
          </Specimen>

          <Specimen label="Counter">
            <div className="flex flex-wrap gap-12">
              <div>
                <span className="text-h2 font-bold text-text-display">
                  <Counter value={365} />
                </span>
                <Text size="sm" tone="muted">
                  Dias de Inspiração
                </Text>
              </div>
              <div>
                <span className="text-h2 font-bold text-text-display">
                  <Counter value={100} suffix="%" />
                </span>
                <Text size="sm" tone="muted">
                  Prático e Formativo
                </Text>
              </div>
            </div>
          </Specimen>

          <Specimen label="Marquee">
            <div className="rounded-card bg-surface-inverse py-2">
              <Marquee
                items={Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="text-xs text-text-on-inverse">
                    Frete Grátis a partir de 4 unidades
                  </span>
                ))}
              />
            </div>
          </Specimen>
        </Axis>

        {/* ---------- 6. Ícones ---------- */}
        <Axis number={6} title="Ícones">
          <Text className="max-w-prose">
            Eixo ainda não migrado. O protótipo usava ornamentos SVG do export do
            Framer, que foram removidos do design aprovado; o conjunto definitivo
            entra quando a nova paleta for definida, junto com a arte da capa 2027.
          </Text>
        </Axis>
      </Container>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Axis({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20 border-t border-border pt-12">
      <div className="mb-8 flex items-baseline gap-4">
        <span className="text-sm font-bold text-accent">
          {String(number).padStart(2, "0")}
        </span>
        <Heading as="h2">{title}</Heading>
      </div>
      {children}
    </section>
  );
}

function Specimen({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <p className="mb-4 text-sm font-semibold text-text-strong">{label}</p>
      <Card surface="plain" padding="lg">
        {children}
      </Card>
    </div>
  );
}

function Measure({ token, label }: { token: string; label: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-text-strong">{label}</span>
        <code className="text-xs text-text-muted">{token}</code>
      </div>
      <div
        className="mt-2 h-3 rounded-pill bg-accent"
        style={{ width: `min(100%, var(${token}))` }}
      />
    </div>
  );
}
