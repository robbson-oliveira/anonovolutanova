import { Container, Heading, Text } from "@ds/index";
import { CONTACT, WHATSAPP_URL } from "@content/product";
import { getWpPage } from "@/lib/wordpress/pages";
import { PageShell } from "./PageShell";

/**
 * Página institucional cujo texto vive no WordPress (termos, privacidade).
 * O HTML chega limpo de `getWpPage` — só estrutura de texto — e é estilizado
 * aqui com os tokens do DS.
 */
export async function InstitutionalPage({
  slug,
  fallbackTitle,
}: {
  slug: string;
  fallbackTitle: string;
}) {
  const page = await getWpPage(slug);

  return (
    <PageShell>
      <Container width="prose" className="py-section-sm">
        <Heading as="h1" level="section">
          {page?.title ?? fallbackTitle}
        </Heading>

        {page ? (
          <div
            className={
              "mt-8 text-sm leading-relaxed text-text " +
              "[&_h2]:mt-10 [&_h2]:text-h4 [&_h2]:text-text-strong " +
              "[&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-text-strong " +
              "[&_h4]:mt-6 [&_h4]:font-bold [&_h4]:text-text-strong " +
              "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 " +
              "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-2 " +
              "[&_strong]:font-bold [&_strong]:text-text-strong " +
              "[&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4"
            }
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
        ) : (
          <Text className="mt-8">
            Não conseguimos carregar este conteúdo agora. Tente de novo em alguns
            minutos ou fale com a gente pelo{" "}
            <a href={WHATSAPP_URL} className="font-semibold text-accent underline underline-offset-4">
              WhatsApp
            </a>{" "}
            ou pelo e-mail{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-semibold text-accent underline underline-offset-4">
              {CONTACT.email}
            </a>
            .
          </Text>
        )}
      </Container>
    </PageShell>
  );
}
