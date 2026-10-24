import { Reveal, RevealGroup } from "@ds/index";
import { CLOSING } from "@content/home";
import { CYCLE_YEAR, OFFER_ANCHOR } from "@content/product";

/**
 * Closing card — Figma "Agenda Campanha 2026-2027", node 949:18 (Seção 9).
 *
 * 1278px card (radius 24, 4px gold border, petrol fill) with the marble
 * texture at 12% opacity. The section has no background: the watercolor behind
 * it is the shared backdrop painted by the home page (Figma "BG inferior"),
 * the same one the FAQ and the footer sit on.
 *
 * Vertical rhythm at 1440px, measured from the card's outer top: 141px to the
 * badge (36px tall), title at +56, paragraph (120px, five lines) at +106, the
 * buttons (68px) at +266 and the seal (36px) at +374; the card is 692px tall.
 * The card is centered, as in the wireframe: Figma has it 40px off to the
 * right (x=122, with side margins 122/42), which looks like a slip.
 *
 * Below 1440px the card goes fluid with a smaller padding and the buttons stack
 * at full width, side by side from `md`.
 */
export function Closing() {
  return (
    <section
      id="fechamento-bloco"
      className="relative mx-auto w-full max-w-[1440px] px-4 pb-8 pt-2 sm:px-6 md:pb-12 lg:px-10 min-[1440px]:px-[81px] min-[1440px]:pb-[49px] min-[1440px]:pt-0"
    >
      <RevealGroup>
        <Reveal variant="up">
          <div className="relative mx-auto flex w-full max-w-[1278px] flex-col items-center overflow-hidden rounded-lg border-4 border-gold-start bg-surface-inverse-soft px-7 py-12 text-center sm:px-10 md:py-20 min-[1440px]:h-[692px] min-[1440px]:px-0 min-[1440px]:pb-0 min-[1440px]:pt-[137px]">
            <div
              aria-hidden
              className="absolute -inset-1 bg-[url(/img/closing-textura.webp)] bg-[length:100%_173.81%] bg-[position:0_83%] bg-no-repeat opacity-12"
            />

            <div className="relative flex h-9 items-center gap-2.5 px-2.5">
              <svg width="16" height="16" viewBox="0 0 14.279 14.278" aria-hidden className="shrink-0 text-text-on-inverse-badge">
                <path
                  d="M9.372 6.457C8.988 6.384 8.634 6.197 8.358 5.92C8.081 5.643 7.894 5.29 7.822 4.905L7.139 1.299L6.457 4.905C6.385 5.29 6.197 5.643 5.92 5.92C5.643 6.197 5.29 6.384 4.906 6.457L1.299 7.139L4.906 7.821C5.29 7.894 5.644 8.081 5.92 8.357C6.197 8.634 6.385 8.988 6.457 9.372L7.139 12.979L7.822 9.372C7.894 8.988 8.081 8.634 8.358 8.357C8.634 8.081 8.988 7.894 9.372 7.821L12.979 7.139L9.372 6.457ZM2.597 12.33C2.597 11.972 2.307 11.682 1.949 11.682C1.59 11.682 1.299 11.972 1.299 12.33C1.299 12.688 1.59 12.979 1.949 12.979C2.307 12.979 2.597 12.688 2.597 12.33ZM11.682 3.245V2.598H11.033C10.674 2.598 10.383 2.307 10.383 1.948C10.383 1.59 10.674 1.3 11.033 1.3H11.682V0.65C11.682 0.292 11.972 0.00100005 12.33 0.00100005C12.689 0.00100005 12.98 0.292 12.98 0.65V1.3H13.628C13.987 1.3 14.277 1.59 14.277 1.948C14.277 2.307 13.987 2.598 13.628 2.598H12.98V3.245C12.98 3.603 12.689 3.895 12.33 3.895C11.972 3.894 11.682 3.603 11.682 3.245ZM3.895 12.33C3.895 13.405 3.024 14.277 1.949 14.277C0.873 14.277 0.000999987 13.405 0.000999987 12.33C0.00199999 11.255 0.874 10.384 1.949 10.384C3.023 10.384 3.895 11.255 3.895 12.33ZM14.279 7.139C14.279 7.442 14.172 7.735 13.979 7.968C13.785 8.201 13.517 8.359 13.219 8.415L13.218 8.414L9.614 9.097C9.486 9.121 9.368 9.183 9.276 9.275C9.183 9.368 9.121 9.485 9.097 9.613L8.414 13.218C8.359 13.515 8.201 13.785 7.968 13.979C7.735 14.172 7.442 14.278 7.139 14.278C6.836 14.278 6.543 14.172 6.31 13.979C6.077 13.785 5.919 13.517 5.864 13.22L5.182 9.613C5.158 9.485 5.095 9.368 5.003 9.275C4.911 9.183 4.793 9.121 4.664 9.097L1.059 8.414C0.761 8.358 0.493 8.201 0.299 7.968C0.106 7.735 0 7.441 0 7.139C0 6.836 0.106 6.543 0.299 6.31C0.492 6.077 0.761 5.919 1.058 5.863L4.664 5.182C4.793 5.157 4.911 5.095 5.003 5.003C5.096 4.911 5.158 4.792 5.182 4.664L5.864 1.058C5.919 0.76 6.077 0.492 6.31 0.299C6.543 0.105 6.836 0 7.139 0C7.442 0 7.735 0.105 7.968 0.299C8.201 0.492 8.36 0.761 8.415 1.059H8.414L9.097 4.664C9.121 4.792 9.183 4.911 9.276 5.003C9.345 5.072 9.428 5.124 9.52 5.156L9.614 5.182L13.22 5.863H13.219C13.517 5.919 13.785 6.077 13.979 6.31C14.172 6.543 14.279 6.836 14.279 7.139Z"
                  fill="currentColor"
                />
              </svg>
              <span className="whitespace-nowrap text-base font-bold tracking-[-0.04em] text-text-on-inverse-badge">
                {CLOSING.badge}
              </span>
            </div>

            <p className="relative mt-5 text-2xl font-bold leading-[1.15] tracking-[-0.04em] text-text-on-inverse md:text-stat md:leading-[30px]">
              <span className="md:hidden">
                Com a confiança
                <br />
                de quem se
                <br />
                lança à água
              </span>
              <span className="hidden md:inline">{CLOSING.title}</span>
            </p>

            {/* min-h on desktop: five lines of 24px, which holds the buttons at +266.
                On a phone the copy is a step smaller and broken on phrases so
                the lines do not run into the card edge. */}
            <p className="relative mt-5 max-w-[626px] text-[15px] leading-[1.45] text-text-on-inverse-muted md:text-xl md:leading-6 min-[1440px]:min-h-[120px]">
              <span className="md:hidden">
                São Josemaria Escrivá ensinava:
                <br />
                lança-te à água como os patos.
                <br />
                A vida espiritual cresce quando
                <br />
                trocamos o excesso de cálculo
                <br />
                pela confiança e damos o
                <br />
                primeiro passo, mesmo sem
                <br />
                garantias. A Agenda {CYCLE_YEAR} foi
                <br />
                feita para acompanhar cada passo
                <br />
                da sua luta diária — unindo
                <br />
                oração, trabalho e alegria.
              </span>
              <span className="hidden md:inline">{CLOSING.paragraph}</span>
            </p>

            <div className="relative mt-10 flex w-full flex-col items-stretch gap-[15px] md:w-auto md:flex-row md:items-center">
              <a
                href={OFFER_ANCHOR}
                className="flex h-[68px] items-center justify-center rounded-[9px] border border-gold-end bg-linear-to-r from-gold-start to-gold-end px-5 text-xl font-bold tracking-[-0.02em] text-text-on-inverse no-underline shadow-cta-gold md:w-[361px]"
              >
                {CLOSING.primaryCta}
              </a>

              <a
                href="#sobre"
                className="flex h-[68px] items-center justify-center rounded-md border border-gold-end bg-gold-end px-5 text-base font-bold tracking-[-0.04em] text-text-on-inverse no-underline md:w-[225px]"
              >
                {CLOSING.secondaryCta}
              </a>
            </div>

            <div className="relative mt-10 flex h-9 items-center gap-2.5 px-2.5 text-text-on-inverse">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="shrink-0">
                <path
                  d="M6.25 9.25C6.25 9.44891 6.17098 9.63968 6.03033 9.78033C5.88968 9.92098 5.69891 10 5.5 10H4C3.80109 10 3.61032 9.92098 3.46967 9.78033C3.32902 9.63968 3.25 9.44891 3.25 9.25C3.25 9.05109 3.32902 8.86032 3.46967 8.71967C3.61032 8.57902 3.80109 8.5 4 8.5H5.5C5.69891 8.5 5.88968 8.57902 6.03033 8.71967C6.17098 8.86032 6.25 9.05109 6.25 9.25ZM15.25 7.25V11C15.25 11.3315 15.1183 11.6495 14.8839 11.8839C14.6495 12.1183 14.3315 12.25 14 12.25H8.75V14C8.75 14.1989 8.67098 14.3897 8.53033 14.5303C8.38968 14.671 8.19891 14.75 8 14.75C7.80109 14.75 7.61032 14.671 7.46967 14.5303C7.32902 14.3897 7.25 14.1989 7.25 14V12.25H2C1.66848 12.25 1.35054 12.1183 1.11612 11.8839C0.881696 11.6495 0.75 11.3315 0.75 11V7.25C0.751158 6.18949 1.17296 5.17275 1.92285 4.42285C2.67275 3.67296 3.68949 3.25116 4.75 3.25H9.75V1.5C9.75 1.30109 9.82902 1.11032 9.96967 0.96967C10.1103 0.829018 10.3011 0.75 10.5 0.75H12.5C12.6989 0.75 12.8897 0.829018 13.0303 0.96967C13.171 1.11032 13.25 1.30109 13.25 1.5C13.25 1.69891 13.171 1.88968 13.0303 2.03033C12.8897 2.17098 12.6989 2.25 12.5 2.25H11.25V3.25C12.3105 3.25116 13.3273 3.67296 14.0771 4.42285C14.827 5.17275 15.2488 6.18949 15.25 7.25ZM7.25 10.75V7.25C7.25 6.58696 6.98661 5.95107 6.51777 5.48223C6.04893 5.01339 5.41304 4.75 4.75 4.75C4.08696 4.75 3.45107 5.01339 2.98223 5.48223C2.51339 5.95107 2.25 6.58696 2.25 7.25V10.75H7.25ZM13.75 7.25C13.75 6.58696 13.4866 5.95107 13.0178 5.48223C12.5489 5.01339 11.913 4.75 11.25 4.75V9C11.25 9.19891 11.171 9.38968 11.0303 9.53033C10.8897 9.67098 10.6989 9.75 10.5 9.75C10.3011 9.75 10.1103 9.67098 9.96967 9.53033C9.82902 9.38968 9.75 9.19891 9.75 9V4.75H7.87063C8.44064 5.45846 8.75097 6.3407 8.75 7.25V10.75H13.75V7.25Z"
                  fill="currentColor"
                />
              </svg>
              <span className="whitespace-nowrap text-base font-bold tracking-[-0.04em]">
                {CLOSING.seal}
              </span>
            </div>
          </div>
        </Reveal>
      </RevealGroup>
    </section>
  );
}
