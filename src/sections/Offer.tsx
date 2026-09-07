import { Badge, Button, Container, Heading, IconCheck, IconSparkle, Reveal, Text } from "@ds/index";
import { OFFER } from "@content/offer";
import { CHECKOUT_URL, installmentLabel, priceLabel } from "@content/product";
const capaSolo = "/img/capa-solo.png";
const internaOferta = "/img/interna-oferta.png";

const PAYMENT_METHODS = ["Mastercard", "Visa", "Elo", "Pix"];

export function Offer() {
  return (
    <section
      id="oferta"
      className="relative overflow-hidden bg-surface-sage px-6 py-24 md:px-16"
    >
      <Container>
        <Reveal variant="up" className="mx-auto max-w-[720px] text-center">
          <Heading as="h2">{OFFER.title}</Heading>
          <Text className="mx-auto mt-5 max-w-[560px]">{OFFER.paragraph}</Text>
        </Reveal>

        <div className="relative mt-16">
          {/* As duas imagens flanqueiam o card e ficam parcialmente atrás dele.
              É a composição aprovada: o card não fica "ao lado", ele cobre. */}
          <img
            src={capaSolo}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-[-8%] top-16 hidden w-[46%] max-w-none lg:block"
          />
          <img
            src={internaOferta}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-[-6%] top-8 hidden w-[42%] max-w-none lg:block"
          />

          <Reveal
            variant="pop"
            className="relative z-10 mx-auto w-full max-w-[535px]"
          >
            <div className="rounded-lg bg-surface-inverse-soft p-8 shadow-float">
              <div className="rounded-card bg-surface-inverse-soft/40 p-6 text-center ring-1 ring-border-inverse">
                <Badge tone="plainInverse" icon={<IconSparkle />}>
                  {OFFER.badge}
                </Badge>
                <p className="mt-3 text-display font-bold tracking-[-0.04em] text-text-on-inverse">
                  {priceLabel}
                </p>
                <p className="mt-1 text-base text-text-on-inverse/70">
                  {installmentLabel}
                </p>
              </div>

              <Button
                href={CHECKOUT_URL}
                size="lg"
                shape="block"
                variant="inverse"
                className="mt-5 w-full"
              >
                {OFFER.cta}
              </Button>

              <ul className="mt-5 flex items-center justify-center gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <li
                    key={method}
                    className="text-xs font-semibold text-text-on-inverse/60"
                  >
                    {method}
                  </li>
                ))}
              </ul>

              <p className="mt-9 font-bold text-text-on-inverse">
                {OFFER.listTitle}
              </p>
              <ul className="mt-4 space-y-3">
                {OFFER.list.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-text-on-inverse/85"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-pill bg-surface-inverse-soft text-text-on-inverse ring-1 ring-border-inverse"
                    >
                      <IconCheck className="text-[0.7rem]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
