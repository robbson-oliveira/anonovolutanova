import Image from "next/image";
import { Badge, Heading, IconLock, IconSparkle, Text, cn } from "@ds/index";
import { OFFER } from "@content/offer";
import { PRODUCT_NAME } from "@content/product";

const STEPS = ["Carrinho", "Dados e entrega", "Pagamento"] as const;

/**
 * Header of the cart page: the logo and, below it, the offer block of the
 * landing page (seal, title and paragraph), with the purchase steps on the
 * side — the cart is the first of them. No menu, like the checkout: the page
 * leads to one place.
 */
export function PrecheckoutHeader() {
  return (
    <header className="border-b border-border bg-surface-plain">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 pt-5 sm:px-6">
        {/* <a>, not <Link>: the proxy decides what "/" serves. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" aria-label="Voltar ao site" className="w-fit">
          <Image src="/img/logo.png" alt={PRODUCT_NAME} width={1086} height={1448} sizes="42px" preload className="block h-14 w-auto" />
        </a>
        <p className="flex items-center gap-2 text-label text-text-muted">
          <IconLock className="text-action" />
          Compra segura
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pt-6 pb-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:pt-8 lg:pb-10">
        <div className="flex max-w-[640px] flex-col gap-3">
          <Badge tone="plain" icon={<IconSparkle />}>
            {OFFER.badge}
          </Badge>
          <Heading as="h1" level="subsection">
            {OFFER.title}
          </Heading>
          <Text size="xs" className="leading-snug">
            {OFFER.paragraph}
          </Text>
        </div>

        <ol aria-label="Etapas da compra" className="flex shrink-0 items-center gap-2 sm:gap-3">
          {STEPS.map((label, i) => {
            const current = i === 0;
            return (
              <li key={label} aria-current={current ? "step" : undefined} className="flex items-center gap-2 sm:gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "grid size-7 place-items-center rounded-pill text-label font-semibold",
                    current ? "bg-action text-on-action" : "border border-border text-text-muted",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "text-label font-semibold",
                    current ? "text-text-strong" : "text-text-muted",
                    // Phones only have room for the current step's name.
                    !current && "max-sm:sr-only",
                  )}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 ? <span aria-hidden className="h-px w-6 border-t border-dashed border-border sm:w-10" /> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
