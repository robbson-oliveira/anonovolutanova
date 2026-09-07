import { Container, Eyebrow, Heading, Reveal, Text, cn } from "@ds/index";
import { TopBar } from "@sections/TopBar";
import { SiteHeader } from "@sections/SiteHeader";
import { SiteFooter } from "@sections/SiteFooter";

/* -----------------------------------------------------------------------------
   Levantamento das peças que existem na home (wireframe + seções) e ainda não
   têm ficha no catálogo do design system. Esta página é só o inventário: não
   altera token, componente nem wireframe. Conforme cada item ganhar ficha em
   /design-system, remova-o daqui.
   -------------------------------------------------------------------------- */

type Prioridade = "alta" | "media" | "baixa";

type Lacuna = {
  nome: string;
  onde: string;
  falta: string;
  prioridade: Prioridade;
};

type Grupo = {
  id: string;
  n: string;
  titulo: string;
  descricao: string;
  itens: Lacuna[];
};

const GRUPOS: Grupo[] = [
  {
    id: "estrutura",
    n: "01",
    titulo: "Estrutura de página",
    descricao:
      "As peças fixas que envolvem todo o site. Aparecem em toda página e nenhuma tem ficha própria no catálogo.",
    itens: [
      {
        nome: "Barra fixa do topo (TopBar)",
        onde: "Topo de todas as páginas",
        falta:
          "Faixa escura de 36px com esteira de avisos, ícones alternados (caixa e asterisco) e botão de fechar. O catálogo mostra só a esteira isolada, sem o comportamento fixo, sem o dispensar e sem a altura reservada no shell.",
        prioridade: "alta",
      },
      {
        nome: "Cabeçalho do site (SiteHeader)",
        onde: "Abaixo da barra do topo",
        falta:
          "Marca, navegação, botão de conta e CTA. Sem ficha, sem estado mobile e sem regra de comportamento no scroll.",
        prioridade: "alta",
      },
      {
        nome: "Rodapé (SiteFooter)",
        onde: "Fim de todas as páginas",
        falta:
          "Textura de fundo, ornamento e blocos de links. Nenhuma documentação de anatomia nem de superfícies usadas.",
        prioridade: "media",
      },
      {
        nome: "Container, Section",
        onde: "Estrutura de toda seção",
        falta:
          "Primitivos exportados pelo design system e nunca exibidos: larguras, respiro vertical e quando usar cada um.",
        prioridade: "media",
      },
    ],
  },
  {
    id: "componentes",
    n: "02",
    titulo: "Componentes",
    descricao:
      "Componentes que o design system já exporta, mas que o catálogo não demonstra.",
    itens: [
      {
        nome: "Carousel",
        onde: "Depoimentos",
        falta:
          "Exportado e usado na home, ausente do catálogo. Faltam controles, navegação por teclado e comportamento em telas pequenas.",
        prioridade: "alta",
      },
      {
        nome: "BookCover",
        onde: "Hero e seleção de edição",
        falta:
          "Peça central do produto: proporções, sombra, variação por edição e uso das imagens de capa.",
        prioridade: "alta",
      },
      {
        nome: "BookStage e card de preço flutuante",
        onde: "Hero",
        falta:
          "Composição animada das duas agendas em leque mais o card de preço sobreposto. Nenhuma ficha, apesar de ser a peça mais complexa do site.",
        prioridade: "alta",
      },
      {
        nome: "Heading, Text, Eyebrow",
        onde: "Todas as seções",
        falta:
          "A escala tipográfica está documentada em tokens, mas os componentes que a aplicam não: níveis, tons, tamanhos e quando cada um é o correto.",
        prioridade: "media",
      },
    ],
  },
  {
    id: "blocos",
    n: "03",
    titulo: "Blocos de conteúdo",
    descricao:
      "Composições recorrentes da home. São reutilizáveis, mas hoje só existem dentro das seções.",
    itens: [
      {
        nome: "Bloco de FAQ",
        onde: "Seção de perguntas",
        falta:
          "O acordeão aparece cru no catálogo. Falta a variação real: em cards, numerada e com o primeiro item aberto.",
        prioridade: "alta",
      },
      {
        nome: "Bloco de estatísticas",
        onde: "Hero",
        falta:
          "Números grandes com contagem animada e legenda. O contador está documentado sozinho, o bloco não.",
        prioridade: "media",
      },
      {
        nome: "Bloco de citação",
        onde: "Entre Sobre e Explore",
        falta:
          "Citação em tipografia manuscrita com atribuição. Não há ficha da composição nem da regra de atribuição.",
        prioridade: "media",
      },
      {
        nome: "Bloco de persona / checklist",
        onde: "Para quem é a agenda",
        falta: "Lista de itens com ícone de check, espaçamento e ritmo próprios.",
        prioridade: "baixa",
      },
      {
        nome: "Bloco de oferta",
        onde: "Seção de oferta",
        falta:
          "Superfície sage, selos, preço, parcelamento e lista de benefícios. É o bloco de conversão e não tem anatomia documentada.",
        prioridade: "alta",
      },
      {
        nome: "Bloco de fechamento",
        onde: "Antes do rodapé",
        falta: "Superfície escura com selos e CTA final; sem ficha.",
        prioridade: "baixa",
      },
    ],
  },
  {
    id: "variacoes",
    n: "04",
    titulo: "Estados e variações",
    descricao:
      "Peças que existem no catálogo, mas só em amostra genérica — sem as variações que o site realmente usa.",
    itens: [
      {
        nome: "Cards em suas variações reais",
        onde: "Datas litúrgicas, depoimentos, Sobre, preço",
        falta:
          "Hoje há apenas uma amostra de elevação. Faltam: card de data litúrgica com ícone, card de depoimento com avatar e estrelas, card de conteúdo terracota da seção Sobre e card de preço.",
        prioridade: "alta",
      },
      {
        nome: "Selos em contexto",
        onde: "Hero, oferta, fechamento",
        falta:
          "Os tons estão listados, mas não há exemplo de uso real: selo sobre foto e selo sobre fundo escuro.",
        prioridade: "media",
      },
    ],
  },
  {
    id: "divergencias",
    n: "05",
    titulo: "Documentado errado (não bate com o site)",
    descricao:
      "Peças que já aparecem no catálogo, mas em versão diferente da que a home realmente usa — quem consulta o catálogo vê algo que não existe no site.",
    itens: [
      {
        nome: "Perguntas frequentes (FAQ)",
        onde: "Seção de perguntas",
        falta:
          "No site cada pergunta é um cartão branco separado, com sombra e numeração. No catálogo aparece como lista contínua com fio de divisão, sem fundo branco e sem número — é a versão errada da peça.",
        prioridade: "alta",
      },
      {
        nome: "Cartões",
        onde: "Datas litúrgicas, depoimentos, Sobre, preço",
        falta:
          "O catálogo mostra só a versão em fundo creme. Os cartões do site são brancos (datas, depoimentos) e terracota (Sobre) — nenhuma dessas superfícies aparece.",
        prioridade: "alta",
      },
      {
        nome: "Abas (Explore)",
        onde: "Explore a Agenda",
        falta:
          "No catálogo os painéis têm texto de exemplo. No site cada aba mostra uma página interna da agenda com legenda manuscrita — a anatomia real não está representada.",
        prioridade: "media",
      },
      {
        nome: "Selos",
        onde: "Hero, oferta, fechamento",
        falta:
          "O rótulo diz 6 tons, mas só 5 aparecem; falta o tom usado sobre fundo escuro no fechamento e na oferta.",
        prioridade: "media",
      },
      {
        nome: "Botões",
        onde: "Hero, oferta, cabeçalho",
        falta:
          "O rótulo diz 4 variantes, mas uma das amostras é apenas o tamanho grande. Faltam separar variante de tamanho e mostrar os estados (repouso, hover, desabilitado).",
        prioridade: "media",
      },
    ],
  },
];


const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  alta: "Prioridade alta",
  media: "Prioridade média",
  baixa: "Prioridade baixa",
};

const PRIORIDADE_CLASS: Record<Prioridade, string> = {
  alta: "border-accent text-accent",
  media: "border-border text-text-muted",
  baixa: "border-border text-text-muted opacity-70",
};

const TOTAL = GRUPOS.reduce((acc, g) => acc + g.itens.length, 0);
const ALTAS = GRUPOS.reduce(
  (acc, g) => acc + g.itens.filter((i) => i.prioridade === "alta").length,
  0,
);

export default function DesignSystemLacunasPage() {
  return (
    <>
      <TopBar sticky={false} />
      <div>
        <SiteHeader />
        <main>
          <section className="bg-surface px-6 py-24 md:px-16">
            <Container>
              <Reveal variant="up" className="mx-auto max-w-[760px] text-center">
                <Eyebrow className="justify-center">
                  Auditoria · Design System
                </Eyebrow>
                <Heading as="h1" className="mt-5">
                  O que ainda falta documentar
                </Heading>
                <Text className="mt-6">
                  Levantamento das peças que já existem na home e nas seções do
                  site, mas que não têm ficha no catálogo. São{" "}
                  <strong>{TOTAL} itens</strong> pendentes, sendo{" "}
                  <strong>{ALTAS} de prioridade alta</strong>.
                </Text>
                <Text size="sm" tone="muted" className="mt-4">
                  Esta página é só o inventário: nada aqui altera tokens,
                  componentes ou o wireframe.
                </Text>
                <a
                  href="/design-system"
                  className="mt-8 inline-block text-sm font-semibold text-accent underline underline-offset-4"
                >
                  Voltar ao catálogo
                </a>
              </Reveal>

              <div className="mt-16 space-y-16">
                {GRUPOS.map((grupo) => (
                  <section key={grupo.id} id={grupo.id} className="scroll-mt-24">
                    <div className="border-b border-border pb-4">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                        {grupo.n} · {grupo.itens.length} itens
                      </span>
                      <Heading as="h2" className="mt-2">
                        {grupo.titulo}
                      </Heading>
                      <Text size="sm" tone="muted" className="mt-2 max-w-prose">
                        {grupo.descricao}
                      </Text>
                    </div>

                    <ul>
                      {grupo.itens.map((item) => (
                        <li
                          key={item.nome}
                          className="grid gap-3 border-b border-border py-6 md:grid-cols-[240px_1fr] md:gap-8"
                        >
                          <div>
                            <p className="text-base font-semibold text-text-strong">
                              {item.nome}
                            </p>
                            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-text-muted">
                              {item.onde}
                            </p>
                          </div>
                          <div>
                            <Text size="sm">{item.falta}</Text>
                            <span
                              className={cn(
                                "mt-3 inline-block rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest",
                                PRIORIDADE_CLASS[item.prioridade],
                              )}
                            >
                              {PRIORIDADE_LABEL[item.prioridade]}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </Container>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
