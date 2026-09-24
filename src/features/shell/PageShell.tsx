import Image from "next/image";
import { Button, Container, IconArrowRight, Text } from "@ds/index";
import { FOOTER } from "@content/home";
import { CHECKOUT_URL, PRODUCT_NAME } from "@content/product";

const logo = "/img/logo.png";

const FOOTER_LINKS = [
  { label: "Início", href: "/" },
  { label: "Comprar", href: CHECKOUT_URL },
  { label: "Contato", href: "/contato" },
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos e Condições", href: "/termos-e-condicoes" },
] as const;

type PageShellProps = {
  children: React.ReactNode;
  /** Esconde o botão "Comprar" do topo — na própria página de compra. */
  hideBuyButton?: boolean;
};

/**
 * Moldura das páginas em React (compra, institucionais) enquanto a home é o
 * wireframe aprovado. O header e o footer de `src/sections/` são peças da home
 * — âncoras de seção e rodapé com medidas fixas de 1440px — e não servem
 * fora dela.
 */
export function PageShell({ children, hideBuyButton = false }: PageShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="border-b border-border bg-surface">
        <Container className="flex h-20 items-center justify-between gap-6">
          {/* <a> e não <Link>: "/" é o route handler que serve o wireframe
              (HTML puro), não uma página React — navegação client-side falha. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="flex shrink-0 items-center" aria-label="Página inicial">
            <Image src={logo} alt={PRODUCT_NAME} width={1086} height={1448} sizes="42px" preload className="block h-14 w-auto" />
          </a>
          {hideBuyButton ? null : (
            <Button href={CHECKOUT_URL} size="md" shape="block">
              Comprar
              <IconArrowRight />
            </Button>
          )}
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-surface-inverse text-text-on-inverse">
        <Container className="flex flex-col items-center gap-6 py-section-sm text-center">
          <Image src={logo} alt="" aria-hidden width={1086} height={1448} sizes="54px" className="block h-[72px] w-auto" />
          <Text size="sm" tone="inverse" className="max-w-[420px] leading-snug">
            {FOOTER.tagline}
          </Text>
          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs font-semibold text-text-on-inverse underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Text size="xs" tone="inverse" className="max-w-[560px] leading-snug opacity-80">
            {FOOTER.socialNote}
          </Text>
          <Text size="xs" tone="inverse" className="opacity-60">
            {FOOTER.copyright}
          </Text>
        </Container>
      </footer>
    </div>
  );
}
