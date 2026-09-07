import { Container, Text } from "@ds/index";
import { FOOTER } from "@content/home";
import { PRODUCT_NAME } from "@content/product";
const logo = "/img/logo.png";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-surface px-6 py-24 md:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/img/textura-rodape.png')] bg-cover bg-center opacity-[0.05]"
      />

      <Container className="relative text-center">
        <img
          src={logo}
          alt={PRODUCT_NAME}
          style={{ height: "120px", width: "auto" }}
          className="mx-auto w-auto"
        />

        <Text className="mx-auto mt-8 max-w-[420px]">{FOOTER.tagline}</Text>

        <nav aria-label="Rodapé" className="mt-12">
          <ul className="flex flex-wrap justify-center gap-x-9 gap-y-3">
            {FOOTER.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-semibold text-text-strong transition-colors [transition-duration:var(--duration-fast)] hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Text tone="muted" className="mx-auto mt-14 max-w-[420px]">
          {FOOTER.copyright}
        </Text>

        <Text size="xs" tone="muted" className="mx-auto mt-5 max-w-[420px]">
          {FOOTER.socialNote}
        </Text>
      </Container>
    </footer>
  );
}
