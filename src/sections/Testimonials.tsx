"use client";

import { useRef } from "react";
import { IconStar, Reveal, RevealGroup } from "@ds/index";
import { TESTIMONIALS } from "@content/offer";

const AVATARS = ["/img/avatar-robson.jpeg", "/img/avatar-andrea.jpg", "/img/avatar-jeje.jpg"];

/* -----------------------------------------------------------------------------
   DEPOIMENTOS — medido no wireframe (viewport 1440), section 1440x936.
   padding 0 0 200 60 · título x201 y250 120/132 600 -6px
   cards 505x288 r12 branco, sombra 0 1px 2px rgba(0,0,0,.1), pad 42px 0
   conteúdo 421 · gap 30 · avatar 60x60 r12 · gap 12 · nome/cidade 24/24 700
   estrelas 124x21 · citação 20/24 400
   -------------------------------------------------------------------------- */

const CARD_STEP = 509.3 + 24;

export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);

  const slide = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * CARD_STEP, behavior: "smooth" });
  };

  return (
    <section
      id="depoimentos"
      style={{
        width: 1440,
        padding: "0 0 118px 60px",
        background: "var(--color-surface)",
        overflow: "hidden",
      }}
    >
      <RevealGroup>
        <div style={{ paddingTop: 250, paddingLeft: 141 }}>
          <Reveal variant="up">
            <h2
              style={{
                width: 800,
                margin: 0,
                fontSize: 120,
                lineHeight: "132px",
                fontWeight: 600,
                letterSpacing: "-6px",
                color: "var(--brand-ink-900, #000)",
              }}
            >
              Depoimentos
            </h2>
          </Reveal>

          <Reveal variant="up" delay={90}>
            <ul
              ref={trackRef}
              style={{
                display: "flex",
                gap: 24,
                margin: "58px 0 0",
                padding: "0 0 4px",
                listStyle: "none",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
              }}
            >
              {TESTIMONIALS.map((item, i) => (
                <li key={item.name} style={{ flex: "0 0 505px", scrollSnapAlign: "start" }}>
                  <article
                    style={{
                      width: 505,
                      height: 288,
                      padding: "42px",
                      borderRadius: 12,
                      background: "var(--color-surface-plain)",
                      boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <img
                        src={AVATARS[i % AVATARS.length]}
                        alt=""
                        aria-hidden
                        style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover" }}
                      />
                      <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 10 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 24,
                            lineHeight: "24px",
                            fontWeight: 700,
                            letterSpacing: "-0.96px",
                            color: "var(--brand-ink-900, #000)",
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 24,
                            lineHeight: "24px",
                            fontWeight: 700,
                            letterSpacing: "-0.96px",
                            color: "rgb(134, 134, 134)",
                          }}
                        >
                          {item.city}
                        </p>
                      </div>
                    </div>

                    <p
                      aria-label="5 de 5 estrelas"
                      style={{
                        display: "flex",
                        gap: 5,
                        width: 124,
                        height: 21,
                        margin: "20px 0 0",
                        fontSize: 21,
                        lineHeight: "21px",
                        color: "var(--brand-ink-900, #000)",
                      }}
                    >
                      {Array.from({ length: 5 }, (_, s) => (
                        <IconStar key={s} aria-hidden />
                      ))}
                    </p>

                    <blockquote
                      style={{
                        width: 421,
                        margin: "30px 0 0",
                        fontSize: 20,
                        lineHeight: "24px",
                        color: "var(--color-text)",
                      }}
                    >
                      {item.quote}
                    </blockquote>
                  </article>
                </li>
              ))}
            </ul>
          </Reveal>

          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => slide(dir)}
                aria-label={dir === -1 ? "Depoimento anterior" : "Próximo depoimento"}
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 58,
                  height: 58,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-on-inverse)",
                  backgroundImage:
                    "linear-gradient(225deg, rgb(52, 76, 36) 0%, rgb(26, 37, 16) 100%)",
                }}
              >
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden>
                  <path
                    d={dir === -1 ? "M8.5 1.5 2 8l6.5 6.5" : "M1.5 1.5 8 8l-6.5 6.5"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}
