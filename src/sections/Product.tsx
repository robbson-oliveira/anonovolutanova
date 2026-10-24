import { Heading, Reveal, Text } from "@ds/index";
import { OFFER } from "@content/offer";
import { PurchasePanel } from "@/features/purchase/PurchasePanel";
import type { ProductOffer } from "@/lib/commerce/offer-types";
import { BenefitList } from "./BenefitList";

/**
 * Product section of the home (#oferta): the visitor picks the edition and
 * quantity right here and the button goes straight to checkout. Every buy
 * button on the page scrolls to it.
 *
 * Figma 949:278: a petrol band with gold rules and a faint watercolor texture,
 * holding one big white watercolor card. The heading, the PurchasePanel card
 * and the feature list all live inside that big card.
 */
export function Product({ offer }: { offer: ProductOffer }) {
  return (
    <section
      id="oferta"
      className="relative isolate scroll-mt-24 overflow-hidden border-y-4 border-gold-start bg-action px-4 py-12 sm:px-6 lg:py-24"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/offer/section-texture.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover opacity-[0.09]"
      />

      <div className="relative mx-auto w-full max-w-[1316px] overflow-hidden rounded-[32px] bg-surface-plain px-4 py-12 sm:px-8 lg:rounded-[90px] lg:px-16 lg:py-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/offer/card-watercolor.webp"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.24]"
        />

        <div className="relative">
          <Reveal variant="up">
            <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5 text-center">
              <Heading as="h2" level="section" className="max-md:text-[26px] max-md:leading-[1.12]">
                {OFFER.title}
              </Heading>
              {/* One step down from the section title, and only on mobile:
                  the desktop paragraph keeps the body size. */}
              <Text className="leading-snug text-text-strong max-md:text-sm max-md:leading-snug">{OFFER.paragraph}</Text>
            </div>
          </Reveal>

          {/* Mobile only: less space after the paragraph, more padding above
              the cover and below the wholesale line. Desktop padding stays. */}
          <div className="mx-auto mt-10 w-full max-w-[1188px] max-md:mt-6 lg:mt-[75px]">
            <div className="rounded-[26px] bg-surface-plain p-5 shadow-float max-md:pt-8 max-md:pb-10 sm:p-8 lg:px-12 lg:py-14">
              <PurchasePanel offer={offer} headingAs="h3" />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-[760px] lg:mt-20">
            <Text size="sm" className="text-center font-bold text-gold-start">
              {OFFER.listTitle}
            </Text>
            {/* A fixed measure keeps the group narrower than the card so it
                can sit in the center. Rows stay left-aligned, including
                the ones that wrap to two lines. */}
            <BenefitList lines={OFFER.list} />
          </div>
        </div>
      </div>
    </section>
  );
}
