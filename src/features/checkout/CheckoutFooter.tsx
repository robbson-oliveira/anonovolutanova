import { CONTACT, CYCLE_YEAR, WHATSAPP_URL } from "@content/product";
import { ConsentLink } from "@/features/shell/ConsentLink";

const LINKS = [
  { label: "Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos", href: "/termos-e-condicoes" },
] as const;

const linkClass = "text-text-muted underline-offset-4 hover:text-text-strong hover:underline";

/**
 * Rodapé do checkout: só a identificação e o contato da empresa, em letra
 * miúda (uma linha no desktop). O rodapé completo do site fica de fora para não abrir
 * saídas no meio da compra.
 */
export function CheckoutFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-1.5 px-4 py-4 text-fine text-text-muted sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-5">
        <p>
          © {CYCLE_YEAR} Agenda Ano Novo, Luta Nova
          <span aria-hidden> · </span>
          <a href={`mailto:${CONTACT.email}`} className={linkClass}>
            {CONTACT.email}
          </a>
          <span aria-hidden> · </span>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener" className={linkClass}>
            WhatsApp {CONTACT.whatsappLabel}
          </a>
        </p>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-4 gap-y-1 lg:shrink-0">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
          <ConsentLink className="text-fine font-normal text-text-muted hover:text-text-strong" />
        </nav>
      </div>
    </footer>
  );
}
