/**
 * Copy of the Black Friday notices. Visual only: nothing here changes the
 * cart, the shipping rule or what is sent in the package.
 */
export const BLACK_FRIDAY = {
  /** Fixed label on the left of the Black Friday top bar. */
  barTitle: "Black Friday Ano Novo, Luta Nova",
  /** Phone row: the frame only fits the campaign name beside the timer. */
  barTitleMobile: "Black Friday",
  barShipping: "Frete Grátis a partir de 4 agendas",
  barStarts: "Começa em",
  barEnds: "Termina em",
  heroEyebrow: "Oferta por tempo limitado",
  heroTitle: "Black Friday",
  heroTitleLine: "Ano Novo, Luta Nova",
  heroSubtitle: "Menos cálculo. Mais confiança. Patos à água!",
  heroPillLead: "Na compra da Agenda 2027, ",
  heroPillStrong: "ganhe 1 Planner Diário.",
  heroParagraph:
    "Aproveite a Black Friday e garanta a sua Agenda Ano Novo, Luta Nova 2027 com um brinde especial: o Planner Diário e semanal, para te ajudar a colocar os planos em prática todos os dias.",
  heroCta: "Garantir Hoje Agenda + Planner",
  heroCardTitle: "Agenda 2027",
  heroCardExtra: "+ planner diário",
  heroCardCta: "Comprar Agora",
  sealTitle: "BRINDE",
  sealLine: "PLANNER",
  sealFoot: "POR AGENDA",
  kicker: "Black Friday · hoje, 27/11 · até 23h59",
  home:
    "Na compra de 1 Agenda 2027, você ganha 1 Planner Diário grátis, enviado automaticamente no pacote (2 agendas = 2 planners). A partir de 4 agendas, o frete é grátis.",
  cart:
    "Cada Agenda 2027 já acompanha 1 Planner Diário grátis, enviado automaticamente no pacote. Não é preciso adicionar o planner ao carrinho. Com 4 agendas ou mais, o frete é grátis.",
  plannerSection: {
    pill: "Brinde Black Friday",
    title: ["Planner Diário.", "Um dia de cada vez,", "com o que importa."],
    subtitle: "São 20 folhas A4 para organizar a tarefa mais importante.",
    giftLine: "Na compra da Agenda 2027, você ganha",
    giftStrong: "1 Planner Diário por agenda.",
    giftNote: [
      "Comprou 2 agendas? Leva 2 planners, assim por diante.",
      "Os brindes são enviados automaticamente no pedido.",
    ],
    extraLead: "Quer levar mais planners? Você também pode adicionar unidades extras no carrinho por ",
    extraTail: " cada.",
    cta: "Quero minha Agenda com Brinde",
  },
  plannerLead: "Black Friday de hoje.",
  planner:
    "Comprando a Agenda, você já ganha 1 Planner Diário grátis por agenda, enviado automaticamente. Adicione este avulso só se quiser unidades extras.",
  /**
   * Shown first on `/home-2` only. The public FAQ stays `src/content/faq.tsx`.
   * The accordion adds the number; these titles do not.
   */
  faq: [
    {
      question: "Se eu comprar mais de uma Agenda 2027, ganho um Planner Diário para cada uma?",
      answer:
        "Sim! O brinde é proporcional à quantidade de agendas do pedido: comprou 1 Agenda 2027, ganha 1 Planner Diário; comprou 2 agendas, leva 2 planners; comprou 4 agendas, leva 4 planners e ainda garante frete grátis.",
    },
    {
      question: "Preciso adicionar o Planner Diário no carrinho para ganhar o brinde?",
      answer:
        "Não precisa. Em todo pedido com Agenda 2027 feito hoje, 27/11, o Planner Diário grátis já vai incluído automaticamente no seu pacote. Só adicione o Planner avulso ao carrinho se quiser levar unidades extras. A oferta também vale junto com o frete grátis a partir de 4 agendas e com cupons de desconto.",
    },
    {
      question: "Tenho um cupom de 10% de desconto de uma afiliada. Posso usar na Black Friday?",
      answer:
        "Sim! Você pode aplicar o seu cupom normalmente no carrinho. Ele funciona junto com o brinde do Planner Diário (1 por agenda comprada) e também com o frete grátis a partir de 4 agendas.",
    },
  ],
} as const;
