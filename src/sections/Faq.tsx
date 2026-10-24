import { Accordion, Container, Heading, Reveal, Text } from "@ds/index";
import { FAQ } from "@content/faq";

/**
 * FAQ — Figma "Agenda Campanha 2026-2027", node 949:163 (1440x953).
 *
 * The section has no background of its own: the watercolor behind it is the
 * shared backdrop painted by the home page (Figma "BG inferior", 949:15), which
 * is also what the closing card and the footer sit on. 120px of air on top and
 * bottom, title column 480px wide and the accordion column 588px, flush right
 * inside a 1200px container.
 *
 * Below `lg` the columns stack. The section does not add its own side padding
 * below `md` to the <Container>'s (it would be 48px per side on a 375px phone),
 * and clips the X axis with `overflow-x-clip`: the left/right <Reveal>s start
 * 56px off place, and that offset widened the page. `clip` (not `hidden`)
 * so no scroll container is created.
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="overflow-x-clip py-16 md:px-10 md:py-24 min-[1440px]:py-[120px]"
    >
      <Container className="md:px-0">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,480px)_minmax(0,588px)] lg:justify-between lg:gap-12">
          <Reveal variant="left">
            <Heading
              as="h2"
              className="text-[32px]! leading-[1.05] tracking-[-0.05em]! text-text-faq-title! md:text-[60px]! md:leading-[60px]!"
            >
              Perguntas Frequentes
            </Heading>
            <Text className="mt-3 text-[15px] font-medium leading-snug tracking-[-0.01em] opacity-70 md:text-xl">
              Respostas para as perguntas mais comuns
            </Text>
          </Reveal>

          <Reveal variant="right" delay={90} className="min-w-0">
            <Accordion items={FAQ} variant="cards" numbered defaultOpen={0} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
