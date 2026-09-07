import { Reveal, RevealGroup } from "@ds/index";
import { OFFER } from "@content/offer";
import { CHECKOUT_URL, installmentLabel, priceLabel } from "@content/product";

/* -----------------------------------------------------------------------------
   OFERTA — medido no wireframe (viewport 1440), section 1440x1266.
   painel r90 bg rgb(208,209,177) · título 60/60 -3px · apoio 20/28 -0.2px
   capa girada -2deg · página interna girada 3deg (sombra 11px -3px 10.2px)
   cartão escuro 537x774 em x451.5 y492, r24 topo, bg rgb(55,78,36)
   painel de preço 394x180 r12 · botão 394x72 · pagamentos 128x21 · checklist
   -------------------------------------------------------------------------- */

const CAPA = "/img/capa-solo.png";
const INTERNA = "/img/interna-oferta.png";

function Pagamentos() {
  return (
    <svg width="128.3" height="21" viewBox="0 0 128 21" fill="none" aria-hidden>
      <g fill="rgba(255,255,255,0.85)">
        <circle cx="8" cy="10.5" r="7" opacity="0.9" />
        <circle cx="17" cy="10.5" r="7" opacity="0.6" />
        <text x="34" y="15" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="700">
          VISA
        </text>
        <path d="M74 4l6.5 6.5L74 17l-6.5-6.5z" />
        <rect x="90" y="4" width="2" height="13" />
        <rect x="94" y="4" width="1" height="13" />
        <rect x="97" y="4" width="3" height="13" />
        <rect x="102" y="4" width="1.5" height="13" />
        <rect x="106" y="4" width="2" height="13" />
      </g>
    </svg>
  );
}

export function Offer() {
  return (
    <section id="oferta" style={{ width: 1440 }}>
      <div
        style={{
          position: "relative",
          width: 1440,
          height: 1266,
          borderRadius: 90,
          overflow: "hidden",
          background: "var(--color-surface-sage)",
        }}
      >
        <RevealGroup>
          {/* título + apoio */}
          <div style={{ position: "absolute", left: 340, top: 208, width: 760 }}>
            <Reveal variant="up">
              <h2
                style={{
                  margin: 0,
                  fontSize: 60,
                  lineHeight: "60px",
                  fontWeight: 700,
                  letterSpacing: "-3px",
                  textAlign: "center",
                  color: "var(--color-text-strong)",
                }}
              >
                {OFFER.title}
              </h2>
            </Reveal>
            <Reveal variant="up" delay={90}>
              <p
                style={{
                  margin: "21px 0 0",
                  fontSize: 20,
                  lineHeight: "28px",
                  letterSpacing: "-0.2px",
                  textAlign: "center",
                  color: "rgb(52, 76, 36)",
                }}
              >
                {OFFER.paragraph}
              </p>
            </Reveal>
          </div>

          {/* capa girada -2deg */}
          <div style={{ position: "absolute", left: -275.5, top: 586.1, width: 1414, height: 879 }}>
            <Reveal variant="left">
              <img
                src={CAPA}
                alt=""
                aria-hidden
                style={{ width: 1414, height: 879, transform: "rotate(-2deg)", objectFit: "contain" }}
              />
            </Reveal>
          </div>

          {/* página interna girada 3deg */}
          <div style={{ position: "absolute", left: 557.3, top: 555, width: 711, height: 879 }}>
            <Reveal variant="right" delay={90}>
              <img
                src={INTERNA}
                alt=""
                aria-hidden
                style={{
                  width: 711,
                  height: 879,
                  borderRadius: 2,
                  transform: "rotate(3deg)",
                  boxShadow: "rgba(0, 0, 0, 0.2) 11px -3px 10.2px 0px",
                  objectFit: "cover",
                }}
              />
            </Reveal>
          </div>

          {/* cartão escuro */}
          <div style={{ position: "absolute", left: 451.5, top: 492, width: 537, height: 774 }}>
            <Reveal variant="pop" delay={180}>
              <div
                style={{
                  position: "relative",
                  width: 537,
                  height: 774,
                  borderRadius: "24px 24px 0 0",
                  background: "rgb(55, 78, 36)",
                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 22px 15.1px 0px",
                }}
              >
                {/* preço */}
                <div
                  style={{
                    position: "absolute",
                    left: 71.5,
                    top: 54,
                    width: 394,
                    height: 180,
                    padding: 20,
                    borderRadius: 12,
                    background: "rgba(129, 136, 77, 0.3)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      height: 36,
                      padding: "10px 0",
                      borderRadius: 10,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M8 0.5l1.6 4.4 4.4 1.6-4.4 1.6L8 12.5 6.4 8.1 2 6.5l4.4-1.6z"
                        fill="#fff"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: 16,
                        lineHeight: "16px",
                        fontWeight: 700,
                        letterSpacing: "-0.64px",
                        color: "#fff",
                      }}
                    >
                      {OFFER.badge}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "20px 0 0",
                      fontSize: 54,
                      lineHeight: "54px",
                      fontWeight: 700,
                      letterSpacing: "-2.7px",
                      color: "#fff",
                    }}
                  >
                    {priceLabel}
                  </p>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 18,
                      lineHeight: "normal",
                      fontWeight: 500,
                      letterSpacing: "-0.36px",
                      color: "rgba(255, 255, 255, 0.75)",
                    }}
                  >
                    {installmentLabel}
                  </p>
                </div>

                {/* botão */}
                <a
                  href={CHECKOUT_URL}
                  style={{
                    position: "absolute",
                    left: 71.5,
                    top: 250,
                    display: "grid",
                    placeItems: "center",
                    width: 394,
                    height: 72,
                    borderRadius: 12,
                    textDecoration: "none",
                    fontSize: 20,
                    lineHeight: "24px",
                    fontWeight: 700,
                    letterSpacing: "-0.4px",
                    color: "#fff",
                    backgroundImage:
                      "linear-gradient(62deg, rgb(255, 122, 47) 0%, rgb(241, 89, 41) 100%)",
                    boxShadow: "rgba(0, 0, 0, 0.3) 0px 12px 24px 0px",
                  }}
                >
                  {OFFER.cta}
                </a>

                {/* formas de pagamento */}
                <div style={{ position: "absolute", left: 204.4, top: 348 }}>
                  <Pagamentos />
                </div>

                {/* checklist */}
                <div
                  style={{
                    position: "absolute",
                    left: 91.5,
                    top: 435,
                    width: 354,
                    display: "flex",
                    flexDirection: "column",
                    gap: 21,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 20.76,
                      lineHeight: "24.912px",
                      fontWeight: 600,
                      letterSpacing: "-0.8304px",
                      color: "#fff",
                    }}
                  >
                    {OFFER.listTitle}
                  </p>
                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 20.7644,
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                    }}
                  >
                    {OFFER.list.map((item) => (
                      <li key={item} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <span
                          aria-hidden
                          style={{
                            display: "grid",
                            placeItems: "center",
                            flex: "0 0 32px",
                            width: 32,
                            height: 32,
                            borderRadius: 100,
                            backgroundImage:
                              "linear-gradient(225deg, rgb(129, 136, 77) 0%, rgb(52, 76, 36) 100%)",
                          }}
                        >
                          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                            <path
                              d="M1 4.6 4.2 7.8 11 1"
                              stroke="#fff"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <p
                          style={{
                            width: 306,
                            margin: 0,
                            fontSize: 18.17,
                            lineHeight: "21.804px",
                            letterSpacing: "-0.7268px",
                            color: "#fff",
                          }}
                        >
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
