import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";
import { COMING_SOON } from "@content/coming-soon";
import { PRODUCT_NAME } from "@content/product";
import { WhatsAppChat } from "./WhatsAppChat";

/*
 * Page-only fonts, declared here and not in the root layout so the landing
 * page does not download them. Same recipe as the layout: local files and
 * `font-display: block`, so no fallback font is ever painted.
 */
const FONTS = [
  { family: "Cormorant Garamond", weight: "500 700", file: "cormorant-garamond-latin-variable.woff2", preload: true },
  { family: "Jost", weight: "400", file: "jost-latin-400-normal.woff2", preload: true },
  // Only the chat panel uses Inter; it loads when the panel first opens.
  { family: "Inter", weight: "400 500", file: "inter-latin-variable.woff2", preload: false },
] as const;

const fontCss = FONTS.map(
  (f) =>
    `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};` +
    `font-display:block;src:url("/fonts/${f.file}") format("woff2")}`,
).join("");

/** Rises into place on load, like the Framer appear effect of each block. */
const rise = "animate-soon-rise motion-reduce:animate-none";

/**
 * The "Em breve" page (ANLN_HOME_COMMING_SOON), a faithful copy of the Framer
 * teaser that anonovolutanova.com.br shows today. Every measurement comes from
 * the live page at its three breakpoints: phone (< 768px, the base classes
 * here), tablet (`md:`, up to 1199px) and desktop (`min-[75rem]:`, 1200px — in rem so Tailwind sorts it after `md:`).
 */
export function ComingSoonPage() {
  for (const f of FONTS) {
    if (f.preload) preload(`/fonts/${f.file}`, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }

  // Art direction: a portrait watercolor on the phone, a landscape one above.
  const common = { alt: "", sizes: "100vw" };
  const {
    props: { srcSet: phoneSrcSet },
  } = getImageProps({ ...common, src: "/img/em-breve/fundo-celular.jpg", width: 941, height: 1672 });
  const {
    props: { srcSet: wideSrcSet, ...background },
  } = getImageProps({ ...common, src: "/img/em-breve/fundo.png", width: 1515, height: 1082, fetchPriority: "high", loading: "eager" });

  let wordIndex = 0;

  return (
    <>
      <style href="anln-coming-soon-fonts" precedence="default">
        {fontCss}
      </style>

      <main className="relative isolate flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-surface">
        <picture>
          <source media="(max-width: 767.98px)" srcSet={phoneSrcSet} />
          <source media="(min-width: 768px)" srcSet={wideSrcSet} />
          {/* The props come from getImageProps; alt is empty on purpose (decorative). */}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img {...background} className="absolute inset-0 -z-10 size-full object-cover object-center" />
        </picture>

        <div className="absolute inset-x-0 top-0 z-10 flex h-40 items-center justify-center pt-3 md:h-[111px]">
          <Image
            src="/img/em-breve/logo.svg"
            alt={PRODUCT_NAME}
            width={605}
            height={1169}
            unoptimized
            className="h-auto w-[57px] md:w-[42px]"
          />
        </div>

        <div className="flex w-full max-w-[390px] flex-col items-center justify-center md:max-w-[770px] min-[75rem]:max-w-[1440px]">
          <div className="flex w-full max-w-[1472px] items-center justify-center px-6 pb-10 md:px-10 md:pb-2.5 min-[75rem]:px-[62px] min-[75rem]:pb-0">
            <div className="flex w-full max-w-[648px] flex-col px-1.5 pb-2.5 md:pr-2.5 md:pl-0 min-[75rem]:pr-0">
              <div className="flex w-full flex-col items-center gap-6 text-center md:gap-[17px] min-[75rem]:gap-[19px]">
                <p
                  className={`w-4/5 font-jost text-[26px] leading-[1.1] tracking-[-0.04em] text-soon-gold uppercase md:w-[96%] md:text-[30px] min-[75rem]:w-full min-[75rem]:leading-none ${rise}`}
                >
                  {COMING_SOON.eyebrow}
                </p>

                <div className={`relative h-[7px] w-36 ${rise}`}>
                  <Image
                    src="/img/em-breve/divisor.svg"
                    alt=""
                    width={945}
                    height={46}
                    unoptimized
                    className="absolute top-0 left-1/2 h-auto w-[123px] -translate-x-1/2 md:inset-0 md:h-[7px] md:w-36 md:translate-x-0"
                  />
                </div>

                <h1 className="w-full font-serif text-[40px] leading-[1.4] font-medium tracking-[-0.04em] text-soon-ink uppercase md:text-[80px] md:leading-none">
                  {COMING_SOON.headline.map((line) => (
                    <span key={line} className="block">
                      {line.split(" ").map((word, i) => {
                        // An empty word (trailing space) keeps its space, as in Framer.
                        if (!word) return <span key={i}> <span className="inline-block" /></span>;
                        // Words come in one by one after 0.4s, 75ms apart.
                        const delay = 0.4 + 0.075 * wordIndex++;
                        return (
                          <span key={i}>
                            {i > 0 ? " " : null}
                            <span
                              className="inline-block animate-soon-word motion-reduce:animate-none"
                              style={{ animationDelay: `${delay}s` }}
                            >
                              {word}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  ))}
                </h1>

                <p
                  className={`w-full max-w-[250px] font-sans text-[16px] leading-[1.4] text-soon-ink md:w-[96%] md:max-w-[400px] md:text-[17px] min-[75rem]:w-full min-[75rem]:text-[20px] ${rise}`}
                >
                  {COMING_SOON.paragraph}
                </p>

                <div className={`flex w-full flex-col items-center gap-1.5 pl-px ${rise}`}>
                  <a
                    href={COMING_SOON.vipGroupUrl}
                    target="_blank"
                    rel="noopener"
                    className="flex h-[68px] w-full items-center justify-center rounded-pill bg-soon-action px-2.5 text-center font-sans text-[16px] leading-none font-bold text-on-soon-action transition-transform duration-[450ms] ease-overshoot hover:scale-110 md:w-[81%] min-[75rem]:w-[425px]"
                  >
                    {COMING_SOON.cta}
                  </a>
                  <p
                    className={`w-full max-w-[250px] font-serif text-[16px] leading-[1.4] font-bold text-soon-gold [text-shadow:0_1px_48px_var(--color-soon-glow)] md:w-[96%] md:max-w-[400px] md:text-[17px] min-[75rem]:w-full min-[75rem]:text-[20px] ${rise}`}
                  >
                    {COMING_SOON.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WhatsAppChat />
    </>
  );
}
