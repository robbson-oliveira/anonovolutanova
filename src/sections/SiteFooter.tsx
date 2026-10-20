import Image from "next/image";
import { Reveal, RevealGroup } from "@ds/index";
import { FOOTER } from "@content/home";
import { PRODUCT_NAME } from "@content/product";
import { ConsentLink } from "@/features/shell/ConsentLink";

/**
 * The content links are still the wireframe anchors (#privacidade...); here they
 * point to the real pages. "Afiliados" has no page of its own and falls back to
 * the contact page. "Sobre" keeps the leading "/" so it also works outside the
 * home page.
 */
const HREFS: Record<string, string> = {
  "#sobre": "/#sobre",
  "#contato": "/contato",
  "#afiliados": "/contato",
  "#privacidade": "/politica-de-privacidade",
  "#termos": "/termos-e-condicoes",
};

const linkClass =
  "inline-flex min-h-11 items-center px-1 text-base font-bold leading-4 tracking-[-0.04em] text-text-strong no-underline underline-offset-4 hover:underline min-[1440px]:min-h-0 min-[1440px]:px-0";

/** Figma splits the copyright in two lines and drops the period after "Nova". */
const [copyrightLine1, copyrightLine2] = FOOTER.copyright.split(". ");

/**
 * Footer — Figma "Agenda Campanha 2026-2027", node 960:2 (1920x1173 frame).
 *
 * No background of its own: the watercolor is the backdrop shared with the FAQ
 * and the closing card, painted by the home page (Figma "BG inferior", 949:15).
 * The content sits in a 1440px column.
 *
 * Content (Figma measurements, 1440px column, y relative to the logo): 106x143
 * logo at 0, 391px tagline at 172 (20/24), 16px bold links at 324, copyright
 * 20/24 at 420 and the ADEC note 12/14.4 at 491. From 1440px up these values
 * hold to the pixel; the margins below add up to those distances.
 *
 * Below 1440px: fluid side padding, shorter vertical gaps, tagline and
 * copyright at 18px, links wrapping into centered rows with 44px touch
 * targets, and the ADEC note at 13px (12px is too small on a phone).
 */
export function SiteFooter() {
  return (
    <footer className="relative w-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-20 sm:px-6 md:pb-32 md:pt-28 min-[1440px]:px-0 min-[1440px]:pb-[231px] min-[1440px]:pt-[120px]">
        <RevealGroup className="flex flex-col items-center text-center">
          <Reveal variant="up">
            <Image
              src="/img/footer/logo-footer.svg"
              alt={PRODUCT_NAME}
              width={106}
              height={143}
              unoptimized
              className="block h-[143px] w-[106px]"
            />
          </Reveal>

          <Reveal variant="up" delay={80} className="mt-7 min-[1440px]:mt-[29px]">
            <p className="max-w-[391px] text-lg leading-6 text-text min-[768px]:text-xl">
              {FOOTER.tagline}
            </p>
          </Reveal>

          <Reveal variant="up" delay={140} className="mt-10 w-full min-[1440px]:mt-20">
            <nav
              aria-label="Rodapé"
              className="flex flex-wrap items-center justify-center gap-x-5 min-[1440px]:gap-x-10"
            >
              {FOOTER.links.map((link) => (
                <a key={link.label} href={HREFS[link.href] ?? link.href} className={linkClass}>
                  {link.label}
                </a>
              ))}
              <ConsentLink className={linkClass} />
            </nav>
          </Reveal>

          <Reveal variant="up" delay={200} className="mt-10 min-[1440px]:mt-20">
            <p className="max-w-[391px] text-lg leading-6 text-text min-[768px]:text-xl">
              <span className="block">{copyrightLine1}</span>
              <span className="block">{copyrightLine2}</span>
            </p>
          </Reveal>

          <Reveal variant="up" delay={260} className="mt-6 min-[1440px]:mt-[23px]">
            <p className="max-w-[354px] text-fine text-text min-[1440px]:text-[12px] min-[1440px]:leading-[14.4px]">
              {FOOTER.socialNote}
            </p>
          </Reveal>
        </RevealGroup>
      </div>
    </footer>
  );
}
