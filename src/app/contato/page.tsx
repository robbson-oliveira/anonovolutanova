import type { Metadata } from "next";
import { Card, Container, Heading, IconArrowRight, Text } from "@ds/index";
import { CONTACT, INSTAGRAM_URL, WHATSAPP_URL } from "@content/product";
import { PageShell } from "@/features/shell/PageShell";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe da Agenda Ano Novo, Luta Nova pelo WhatsApp, e-mail ou Instagram.",
  alternates: { canonical: "/contato" },
};

/*
 * O formulário da página antiga era do Elementor e dependia do WordPress no ar
 * no domínio principal. Aqui ficam os canais diretos, que é por onde o
 * atendimento de fato acontece.
 */
const CHANNELS = [
  { label: "WhatsApp", value: CONTACT.whatsappLabel, href: WHATSAPP_URL, external: true },
  { label: "E-mail", value: CONTACT.email, href: `mailto:${CONTACT.email}`, external: false },
  { label: "Instagram", value: "@anonovolutanova", href: INSTAGRAM_URL, external: true },
] as const;

export default function ContatoPage() {
  return (
    <PageShell>
      <Container width="prose" className="py-section-sm">
        <Heading as="h1" level="section">
          Fale com a gente
        </Heading>
        <Text className="mt-4 leading-snug">
          Dúvidas sobre a agenda, o seu pedido ou revenda? Escolha o canal que
          preferir. Respondemos em horário comercial.
        </Text>

        <ul className="mt-10 flex flex-col gap-4">
          {CHANNELS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
                className="group block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
              >
                <Card
                  elevation="flat"
                  padding="sm"
                  className="flex items-center justify-between gap-4 transition-colors [transition-duration:var(--duration-fast)] group-hover:border-action"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-muted">{c.label}</span>
                    <span className="text-base font-semibold text-text-strong">{c.value}</span>
                  </span>
                  <IconArrowRight className="text-action" />
                </Card>
              </a>
            </li>
          ))}
        </ul>

        <Text size="sm" tone="muted" className="mt-8">
          Horário de atendimento: {CONTACT.hours} Sábados, domingos e feriados, fechado.
        </Text>
      </Container>
    </PageShell>
  );
}
