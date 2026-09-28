import { Heading, IconCheck, Reveal, Text } from "@ds/index";
import { OFFER } from "@content/offer";
import { PurchasePanel } from "@/features/purchase/PurchasePanel";
import type { ProductOffer } from "@/lib/commerce/offer-types";

/**
 * Seção de produto da home (#oferta), no lugar da antiga página /comprar:
 * a pessoa escolhe a edição e a quantidade aqui mesmo, e o botão leva direto
 * ao checkout. Todos os botões de compra da página rolam até ela.
 *
 * Mantém o painel verde-sálvia e o texto da oferta do wireframe; o cartão
 * branco dentro dele é o PurchasePanel (edição, quantidade, preço, CTA).
 */
export function Product({ offer }: { offer: ProductOffer }) {
  return (
    <section id="oferta" className="scroll-mt-24 bg-surface px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-[1316px] rounded-[32px] bg-surface-sage px-4 py-12 sm:px-8 lg:rounded-[90px] lg:px-16 lg:py-24">
        <Reveal variant="up">
          <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5 text-center">
            <Heading as="h2" level="section">
              {OFFER.title}
            </Heading>
            <Text className="leading-snug text-text-strong">{OFFER.paragraph}</Text>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 w-full max-w-content lg:mt-14">
          <div className="rounded-card bg-surface-plain p-5 shadow-float sm:p-8 lg:p-12">
            <PurchasePanel offer={offer} headingAs="h3" />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[760px] lg:mt-12">
          <Text size="sm" className="text-center font-bold text-text-strong">
            {OFFER.listTitle}
          </Text>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {OFFER.list.map((line) => (
              <li key={line} className="flex items-start gap-3 text-text">
                <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-pill bg-action text-on-action">
                  <IconCheck />
                </span>
                <Text as="span" size="xs" className="leading-snug">
                  {line}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
