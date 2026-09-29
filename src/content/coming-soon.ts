/**
 * Copy of the "Em breve" page (ANLN_HOME_COMMING_SOON), exactly as the Framer
 * teaser live at anonovolutanova.com.br writes it.
 */
export const COMING_SOON = {
  eyebrow: "Em breve",
  /**
   * One entry per line of the headline. The trailing space of the first line
   * is on purpose: the Framer text keeps it (an empty word follows it), and it
   * shifts the centered line half a space to the left.
   */
  headline: ["Algo novo ", "está chegando"],
  paragraph: "Uma nova jornada está sendo preparada para inspirar o seu próximo ano.",
  cta: "ENTRAR NO GRUPO VIP",
  note: "15% OFF exclusivo para membros do Grupo VIP",
  /** Invite link of the VIP group on WhatsApp. */
  vipGroupUrl: "https://chat.whatsapp.com/Kn1btAz7w6xDRdpRengSiO",
  description:
    "A Agenda Ano Novo, Luta Nova combina organização diária com propósito " +
    "espiritual e foco em crescimento pessoal. Descubra uma agenda prática, " +
    "inspiradora e feita para transformar o seu novo ano.",
} as const;

/** The chat widget in the corner of the page. */
export const COMING_SOON_CHAT = {
  title: "Estamos no WhatsApp!",
  agent: "Nazha",
  greeting: "Está com alguma dúvida? Eu posso ajudar! 🙋‍♀️",
  placeholder: "Escreva sua mensagem...",
} as const;

/** Emoji picker of the chat input, one tab per group (the tab shows its first emoji). */
export const CHAT_EMOJIS = [
  {
    label: "Carinhas",
    emojis: ["😀", "😃", "😄", "😁", "😊", "🙂", "😉", "😍", "🥰", "😘", "😇", "🤗", "🤩", "😅", "😂", "🤔", "😌", "😮", "😢", "🙏"],
  },
  {
    label: "Gestos",
    emojis: ["🙋‍♀️", "🙋‍♂️", "👋", "👍", "👏", "🙌", "🤝", "👌", "✌️", "🤞", "💪", "☝️", "👉", "✍️"],
  },
  {
    label: "Corações",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤍", "💖", "💕", "💞", "💗", "❣️"],
  },
  {
    label: "Fé e agenda",
    emojis: ["✝️", "🙏", "📿", "⛪", "🕊️", "🕯️", "📖", "📅", "📒", "✏️", "🦆", "🌿", "🌸", "☀️", "✨", "🎁", "📦", "🚚"],
  },
] as const;
