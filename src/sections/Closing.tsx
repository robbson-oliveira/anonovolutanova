import { Reveal, RevealGroup } from "@ds/index";
import { CLOSING } from "@content/home";
import { CHECKOUT_URL } from "@content/product";

const textura = "/img/textura-rodape.png";

/**
 * Bloco de fechamento — medido no wireframe (viewport 1440):
 * faixa de 1440x885 com a textura de fundo e um cartao verde de 1278x716
 * (raio 24, padding 141px 0) centralizado a partir de x=81, y=9.
 */
export function Closing() {
  return (
    <section
      id="fechamento"
      style={{
        position: "relative",
        width: 1440,
        height: 885,
        margin: "0 auto",
        backgroundImage: `url(${textura})`,
        backgroundSize: "1440px 1539px",
        backgroundPosition: "0 0",
        backgroundRepeat: "no-repeat",
      }}
    >
      <RevealGroup>
        <Reveal variant="up">
          <div
            style={{
              position: "absolute",
              left: 81,
              top: 9,
              width: 1278,
              height: 716,
              borderRadius: 24,
              background: "rgb(52, 76, 36)",
            }}
          >
            {/* selo */}
            <div
              style={{
                position: "absolute",
                left: 651.8,
                top: 151,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path
                  d="M8 0l1.9 5.2L15 7l-5.1 1.8L8 14l-1.9-5.2L1 7l5.1-1.8z"
                  fill="rgb(230, 170, 60)"
                />
              </svg>
              <span
                style={{
                  fontSize: 16,
                  lineHeight: "16px",
                  fontWeight: 700,
                  letterSpacing: "-0.64px",
                  backgroundImage:
                    "linear-gradient(225deg, rgb(239,200,134) 0%, rgb(225,153,36) 38.5%, rgb(239,200,134) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {CLOSING.badge}
              </span>
            </div>

            <p
              style={{
                position: "absolute",
                left: 40,
                top: 197,
                width: 1198,
                margin: 0,
                fontSize: 30,
                lineHeight: "30px",
                fontWeight: 700,
                letterSpacing: "-1.2px",
                color: "rgb(255, 255, 255)",
                textAlign: "center",
              }}
            >
              {CLOSING.title}
            </p>

            <p
              style={{
                position: "absolute",
                left: 326,
                top: 247,
                width: 626,
                margin: 0,
                fontSize: 20,
                lineHeight: "24px",
                fontWeight: 400,
                color: "rgb(214, 214, 214)",
                textAlign: "center",
              }}
            >
              {CLOSING.paragraph}
            </p>

            <a
              href={CHECKOUT_URL}
              style={{
                position: "absolute",
                left: 338.5,
                top: 431,
                width: 361,
                height: 68,
                display: "grid",
                placeItems: "center",
                borderRadius: 9,
                background:
                  "linear-gradient(62deg, rgb(255,122,47) 0%, rgb(255,122,47) 42%, rgb(244,211,143) 100%)",
                boxShadow: "rgba(0, 0, 0, 0.3) 0px 12px 24px 0px",
                color: "rgb(255, 255, 255)",
                fontSize: 20,
                lineHeight: "24px",
                fontWeight: 700,
                letterSpacing: "-0.4px",
                textDecoration: "none",
              }}
            >
              {CLOSING.primaryCta}
            </a>

            <a
              href="#sobre"
              style={{
                position: "absolute",
                left: 714.5,
                top: 431,
                width: 225,
                height: 68,
                display: "grid",
                placeItems: "center",
                borderRadius: 10,
                background: "rgb(52, 76, 36)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "rgb(255, 255, 255)",
                fontSize: 16,
                lineHeight: "16px",
                fontWeight: 700,
                letterSpacing: "-0.64px",
                textDecoration: "none",
              }}
            >
              {CLOSING.secondaryCta}
            </a>

            <p
              style={{
                position: "absolute",
                left: 40,
                top: 549,
                width: 1198,
                margin: 0,
                fontSize: 16,
                lineHeight: "16px",
                fontWeight: 700,
                letterSpacing: "-0.64px",
                color: "rgb(255, 255, 255)",
                textAlign: "center",
              }}
            >
              {CLOSING.seal}
            </p>
          </div>
        </Reveal>
      </RevealGroup>
    </section>
  );
}
