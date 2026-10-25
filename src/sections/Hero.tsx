import {
  Badge,
  IconSparkle,
  Button,
  Counter,
  Heading,
  Reveal,
  Text,
} from "@ds/index";
import { HERO, STATS } from "@content/home";
import { OFFER_ANCHOR } from "@content/product";
import { BookStage } from "./BookStage";

/**
 * First fold. Vertical rhythm measured on the wireframe
 * (public/wireframe/wireframe-v2.html) at viewport 1440, section top at y=42:
 *   text column   x=62 (= (1440-1316)/2); badge 57px and title 96px below
 *                 the header (padding-top 29, section height 859)
 *   badge         36px tall
 *   title         two 80px lines, 3px below the badge
 *   subtitle      30px, 19px below the title
 *   paragraph     540px wide, 19px below the subtitle
 *   button        425 × 68, radius 10, 29px below the paragraph
 *   seals         36px, 10px below the button
 *   stats         29px below the seals, center-aligned as a group
 *   stage         740 × 740; color cover at x=653.5 / y=4 of the section
 *
 * Below 1200px this is the tuned stage from d99bf83: 24px padding, then
 * 32px, a 388px stage pulled 4px left on the phone, and the tablet column
 * filling whatever width is left. From 1200px the stage keeps that same
 * pixel width (min(viewport, 1380px) - 640px) but its right edge stops on
 * the page frame (1376px, 48px padding) instead of bleeding to the screen.
 *
 *   < 768    one column, centered: badge, title, subtitle, paragraph,
 *            button, seals, then the three stats in a single row, then the
 *            books. The stage is inset (not edge to edge) so the rotated
 *            back cover stays inside the viewport.
 *   768–1199 two columns. The text takes 47% and the stage fills the rest,
 *            with room on the right for the 25° cover. Stats stay in one
 *            row (the fixed 122/107/182 widths only fit from 1200px).
 *
 * Tablet-only utilities are `md:max-[1199px]:`. A plain `md:` rule is
 * emitted after `min-[1200px]:` in this Tailwind build, so it would
 * override the desktop column width.
 */
/** Measured widths of 365, 12 and 100% — desktop only; they wrap the row below 1200px. */
const STAT_WIDTHS = [
  "min-[1200px]:w-[122px]",
  "min-[1200px]:w-[107px]",
  "min-[1200px]:w-[182px]",
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-x-clip bg-surface pb-16 pt-[29px] md:pb-24 lg:pb-[158px]"
    >
      {/* Below 1200 the padding is the tuned stage container (24px, then 32px).
          From 1200 it is the page frame: 1376px, 48px padding, centered. */}
      <div className="mx-auto w-full max-w-[1380px] px-6 md:max-[1199px]:px-8 min-[1200px]:max-w-[1376px] min-[1200px]:px-12">
        {/* isolate: o palco fica atrás do texto (-z-10) sem cair para trás
            do fundo da seção. */}
        <div className="relative isolate md:max-[1199px]:flex md:max-[1199px]:items-center md:max-[1199px]:gap-4">
          <div className="flex flex-col max-md:items-center max-md:text-center md:max-[1199px]:w-[47%] md:max-[1199px]:max-w-none md:max-[1199px]:min-w-0 md:max-[1199px]:shrink-0 min-[1200px]:max-w-[min(647.5px,54%)]">
            <Reveal variant="up">
              <Badge
                tone="plain"
                icon={<IconSparkle />}
                className="h-9 gap-2.5 font-bold! text-text"
              >
                {HERO.badge}
              </Badge>
            </Reveal>

            <Reveal variant="up" delay={60}>
              <Heading
                as="h1"
                level="display"
                tone="display"
                className="mt-[3px]"
              >
                {HERO.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </Heading>
            </Reveal>

            <Reveal variant="up" delay={120}>
              <p className="mt-[19px] text-balance text-h3 text-subtitle max-md:text-[18px] max-md:leading-snug">{HERO.subtitle}</p>
            </Reveal>

            <Reveal variant="up" delay={180}>
              <Text className="mt-[19px] max-w-[540px] text-balance text-lead max-md:text-[16px] max-md:leading-normal">
                {HERO.paragraph}
              </Text>
            </Reveal>

            <Reveal variant="up" delay={240}>
              <Button
                href={OFFER_ANCHOR}
                size="lg"
                shape="block"
                className="mt-[29px] h-[68px] w-full max-w-[425px] max-md:w-[329px] max-md:max-w-[329px] md:max-[1199px]:max-w-[312px] rounded-[10px]! border border-gold-end bg-linear-90 from-gold-start to-gold-end text-[16px]! leading-[16px]! font-bold! tracking-[-0.64px]! transition-[transform,box-shadow] [transition-duration:var(--duration-fast)] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-6px] hover:shadow-gold-start/60 motion-reduce:hover:translate-y-0"
              >
                {HERO.cta}
              </Button>
            </Reveal>

            {/* Stretch this wrapper. The column centers its children, and a
                size container inside a shrink-wrapped flex item collapses
                to 0. Full width gives the row a real measure to size against. */}
            <Reveal variant="up" delay={280} className="w-full min-w-0 self-stretch">
              {/* One line at every width, including a larger Android text
                  scale. At 16px the pair is about 339px, so it wraps in a
                  phone gutter and in the tablet column. The size tracks
                  this row and caps at the current 16px / 10px / 12px once
                  the row can hold that pair under a 1.3× text scale. */}
              <div className="@container mt-[10px] flex w-full min-w-0 flex-nowrap items-center gap-[clamp(4px,2.7cqw,12px)] max-md:justify-center">
                {HERO.seals.map((seal) => (
                  <Badge
                    key={seal}
                    tone="plain"
                    icon={<IconSparkle />}
                    className="h-9 shrink-0 gap-[clamp(4px,2.25cqw,10px)] whitespace-nowrap rounded-[10px]! px-[clamp(4px,2.25cqw,10px)] text-[clamp(10px,3.6cqw,16px)]! font-bold! text-text-strong"
                  >
                    {seal}
                  </Badge>
                ))}
              </div>
            </Reveal>

            <Reveal variant="up" delay={320}>
              <dl className="mt-[29px] flex w-full items-start justify-between gap-x-2 min-[1200px]:w-auto min-[1200px]:items-center min-[1200px]:justify-start min-[1200px]:gap-x-[20px]">
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`min-w-0 max-[1199px]:max-w-[34%] min-[1200px]:max-w-none ${STAT_WIDTHS[i]}`}
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block whitespace-nowrap text-stat text-text-strong">
                        <Counter value={stat.value} suffix={stat.suffix} />
                      </span>
                      <span className="mt-[4px] block text-sm text-text">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* 388px of stage on a 390px screen, pulled 4px left of the
              padding so the cover art sits a little right of center and
              the painted edge stays inside the viewport. From 1200 the
              width stays min(viewport, 1380px) - 640px and the right edge
              stops on the page frame. */}
          <div className="relative mx-auto mt-6 w-[min(388px,100vw)] max-md:-ml-[4px] md:max-[1199px]:mx-0 md:max-[1199px]:mt-0 md:max-[1199px]:ml-0 md:max-[1199px]:w-auto md:max-[1199px]:min-w-0 md:max-[1199px]:flex-1 min-[1200px]:absolute min-[1200px]:right-0 min-[1200px]:left-auto min-[1200px]:top-0 min-[1200px]:-z-10 min-[1200px]:mx-0 min-[1200px]:mt-0 min-[1200px]:w-[calc(min(100vw,1380px)-640px)] min-[1200px]:max-w-none min-[1200px]:translate-y-[calc(10px-9.1216%)]">
            <BookStage fluid />
          </div>
        </div>
      </div>
    </section>
  );
}

