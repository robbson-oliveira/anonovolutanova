import { CYCLE_YEAR } from "@content/product";

export const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "O que tem dentro", href: "#explore" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Afiliados", href: "#afiliados" },
  { label: "FAQ", href: "#faq" },
] as const;

export const HERO = {
  badge: "Edição Limitada",
  title: ["Ano Novo,", "Luta Nova"],
  subtitle: "Menos cálculo. Mais confiança. Patos à água!",
  paragraph:
    `Chegou a hora de garantir a sua Agenda Ano Novo, Luta Nova ${CYCLE_YEAR}. ` +
    "Inspirada por São Josemaria Escrivá, ela é o convite para lançar-se à água " +
    "como os patos: menos cálculo, mais confiança, um dia de cada vez.",
  cta: `Garantir minha Agenda ${CYCLE_YEAR}`,
  seals: [`Nova Edição ${CYCLE_YEAR}`, "Envio Imediato!"],
} as const;

export const STATS = [
  { value: 365, suffix: "", label: "Dias de Inspiração" },
  { value: 12, suffix: "", label: "Temas Mensais" },
  { value: 100, suffix: "%", label: "Prático e Formativo" },
] as const;

export const ABOUT = {
  eyebrow: "O que a torna especial?",
  title: "Mais que uma agenda. Um impulso para transformar propósito em ação.",
  paragraph:
    `A Agenda ${CYCLE_YEAR} une organização e vida espiritual, ajudando você a ` +
    "dar passos concretos naquilo que realmente importa.",
  cta: `Garantir minha Agenda ${CYCLE_YEAR}`,
  features: [
    {
      title: "Espaço para o plano de vida e suas metas anuais",
      items: [
        "Oração Mental",
        "Ângelus + Evangelho",
        "Santo Terço após o almoço",
        "Contemplar o Rosário às 16h",
        "Santa Missa às 18h",
        "Exame de Consciência",
      ],
    },
    {
      title: "Todo dia uma frase de São Josemaria para inspirar",
      items: [
        "Meta 1: Reformar a Sala",
        "Meta 2: Concluir o Curso",
        "Meta 3: Fazer o Retiro Anual",
      ],
    },
    {
      title: "Todo mês um tema para viver a santidade no cotidiano",
      items: [],
    },
    {
      title:
        "Datas especiais do calendário litúrgico e datas importantes da Obra",
      items: [],
    },
  ],
} as const;

export const EXPLORE = {
  eyebrow: "Explore a Agenda",
  title: "Por dentro: um convite à ação, mês a mês e dia após dia.",
  tabs: [
    "Capa",
    "Propósitos do Mês e Calendário",
    "Planos e Metas",
    "Planejamento Financeiro",
    "Agenda Diária",
  ],
} as const;

export const QUOTE = {
  text:
    "Quando tiveres ordem, multiplicar-se-á o teu tempo e, assim, poderás dar " +
    "mais glória a Deus, trabalhando no Seu serviço.",
  author: "São Josemaria Escrivá",
} as const;

export const LITURGICAL = {
  title:
    "Datas importantes para quem vive os ensinamentos de São Josemaria",
  subtitle: "O ritmo do seu ano espiritual.",
  paragraph:
    "Acompanhe o ritmo do ano litúrgico e dos marcos importantes da história de " +
    "São Josemaria e do legado espiritual que brotou da sua vida e ensinamentos.",
  closing:
    "Viva cada momento do ano litúrgico com profundidade e significado",
  cta: `Garantir minha Agenda ${CYCLE_YEAR}`,
  dates: [
    {
      title: "Oitavário pela Unidade dos Cristãos",
      description: "Semana de oração pela unidade dos cristãos.",
    },
    {
      title: "Novena da Imaculada Conceição",
      description: "Preparação para a festa da Imaculada.",
    },
    {
      title: "7 Domingos de São José",
      description:
        "Preparação especial para a festa de São José, inspirada na tradição " +
        "cristã e no carinho que tantos santos lhe dedicaram.",
    },
    {
      title: "Aniversários e datas comemorativas",
      description:
        "Datas fundacionais, aniversários e festas ligadas à trajetória de São " +
        "Josemaria e às pessoas que o acompanham.",
    },
    {
      title: "Triságio Angélico",
      description: "Oração como preparação para a festa da Santíssima Trindade.",
    },
    {
      title: "E muitas outras datas importantes!",
      description: "Descubra todas as celebrações do ano.",
    },
  ],
} as const;

export const PERSONA = {
  title: "Feita para quem quer viver com propósito",
  paragraph:
    "A Agenda Ano Novo, Luta Nova é para quem busca unir fé e vida prática, " +
    "para quem acredita que organizar o tempo é também cuidar da alma.",
  items: [
    "Quer viver a fé no dia a dia com naturalidade",
    "Busca organização com propósito",
    "Acompanha os ensinamentos de São Josemaria",
    "Gosta de unir vida espiritual com modernidade",
    "Admira a espiritualidade da Obra e quer vivê-la de modo prático",
    "Tem uma rotina intensa, mas não quer perder a presença de Deus",
  ],
} as const;

export const CLOSING = {
  badge: "Edição Limitada",
  title: "Com a confiança de quem se lança à água",
  paragraph:
    "São Josemaria Escrivá ensinava: lança-te à água como os patos. A vida " +
    "espiritual cresce quando trocamos o excesso de cálculo pela confiança e " +
    `damos o primeiro passo, mesmo sem garantias. A Agenda ${CYCLE_YEAR} foi ` +
    "feita para acompanhar cada passo da sua luta diária — unindo oração, " +
    "trabalho e alegria.",
  primaryCta: `Garantir minha Agenda ${CYCLE_YEAR}`,
  secondaryCta: "Saiba Mais",
  seal: "Envio Imediato!",
} as const;

export const FOOTER = {
  tagline:
    `A Agenda Ano Novo, Luta Nova ${CYCLE_YEAR} é um projeto com alma, pensado ` +
    "para apoiar a vivência da santidade no meio do mundo.",
  links: [
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
    { label: "Afiliados", href: "#afiliados" },
    { label: "Política de Privacidade", href: "#privacidade" },
    { label: "Termos de Uso", href: "#termos" },
  ],
  copyright: `© ${CYCLE_YEAR} Agenda Ano Novo, Luta Nova. Todos os direitos reservados.`,
  socialNote:
    "Parte da receita gerada com a venda da agenda será destinada à ADEC " +
    "(Associação de Desenvolvimento Educativo Cultural), fortalecendo o impacto " +
    "social de nossas iniciativas e contribuindo para a capacitação de mulheres.",
} as const;
