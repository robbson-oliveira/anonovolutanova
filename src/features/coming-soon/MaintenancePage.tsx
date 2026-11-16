import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";
import { PRODUCT_NAME } from "@content/product";
import { WhatsAppChat } from "./WhatsAppChat";

/*
 * Same faces as the "Em breve" page, declared here so the landing page does
 * not download them. `font-display: block` so no fallback is painted.
 */
const FONTS = [
  { family: "Cormorant Garamond", weight: "500 700", file: "cormorant-garamond-latin-variable.woff2", preload: true },
  { family: "Jost", weight: "400", file: "jost-latin-400-normal.woff2", preload: true },
  { family: "Inter", weight: "400 500", file: "inter-latin-variable.woff2", preload: false },
] as const;

const fontCss = FONTS.map(
  (f) =>
    `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};` +
    `font-display:block;src:url("/fonts/${f.file}") format("woff2")}`,
).join("");

/**
 * Temporary maintenance screen. Reuses the "Em breve" watercolor, logo,
 * type and WhatsApp badge. The only copy is the title and the one line
 * under it.
 */
export function MaintenancePage() {
  for (const f of FONTS) {
    if (f.preload) preload(`/fonts/${f.file}`, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }

  const common = { alt: "", sizes: "100vw" };
  const {
    props: { srcSet: phoneSrcSet },
  } = getImageProps({ ...common, src: "/img/em-breve/fundo-celular.jpg", width: 941, height: 1672 });
  const {
    props: { srcSet: wideSrcSet, ...background },
  } = getImageProps({ ...common, src: "/img/em-breve/fundo.png", width: 1515, height: 1082, fetchPriority: "high", loading: "eager" });

  return (
    <>
      <style href="anln-maintenance-fonts" precedence="default">
        {fontCss}
      </style>

      <main className="relative isolate flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-surface pt-40 md:pt-[111px] min-[75rem]:pb-24">
        <picture>
          <source media="(max-width: 767.98px)" srcSet={phoneSrcSet} />
          <source media="(min-width: 768px)" srcSet={wideSrcSet} />
          {/* Decorative watercolor, same treatment as the "Em breve" page. */}
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

        <div className="flex w-full max-w-[390px] flex-col items-center px-6 text-center md:max-w-[640px]">
          <Image
            src="/img/footer/pato.png"
            alt=""
            width={96}
            height={68}
            className="mb-6 h-auto w-[88px] animate-maintenance-bob motion-reduce:animate-none"
          />
          <h1 className="font-serif text-[32px] leading-[1.15] font-medium tracking-[-0.03em] text-soon-ink md:text-[52px]">
            Estamos temporariamente em manutenção
          </h1>
          <p className="mt-4 font-jost text-[16px] leading-[1.4] text-soon-ink md:text-[18px]">
            Voltamos em alguns minutos.
          </p>
        </div>
      </main>

      <WhatsAppChat />
    </>
  );
}
