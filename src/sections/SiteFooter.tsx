import { Reveal, RevealGroup } from "@ds/index";
import { FOOTER } from "@content/home";
import { PRODUCT_NAME } from "@content/product";

const logo = "/img/logo.png";
const textura = "/img/textura-rodape.png";

/**
 * Rodape — medido no wireframe (viewport 1440): faixa de 1440x654 que continua
 * a mesma textura do fechamento (deslocada -885px), logo 106x141 centralizado,
 * texto de apoio 391px, linha de links 16/16 e nota social 354px.
 */
export function SiteFooter() {
  return (
    <footer
      style={{
        position: "relative",
        width: 1440,
        height: 654,
        margin: "0 auto",
        backgroundImage: `url(${textura})`,
        backgroundSize: "1440px 1539px",
        backgroundPosition: "0 -885px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <RevealGroup>
        <Reveal variant="up">
          <img
            src={logo}
            alt={PRODUCT_NAME}
            style={{
              position: "absolute",
              left: 667,
              top: 0,
              width: 106,
              height: 141,
              objectFit: "contain",
            }}
          />
        </Reveal>

        <Reveal variant="up" delay={80}>
          <p
            style={{
              position: "absolute",
              left: 524.5,
              top: 172,
              width: 391,
              margin: 0,
              fontSize: 20,
              lineHeight: "24px",
              color: "rgb(94, 92, 88)",
              textAlign: "center",
            }}
          >
            {FOOTER.tagline}
          </p>
        </Reveal>

        <Reveal variant="up" delay={140}>
          <nav
            aria-label="Rodapé"
            style={{
              position: "absolute",
              left: 0,
              top: 321,
              width: 1440,
              display: "flex",
              justifyContent: "center",
              gap: 36,
            }}
          >
            {FOOTER.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 16,
                  lineHeight: "22px",
                  fontWeight: 700,
                  letterSpacing: "-0.64px",
                  color: "rgb(26, 37, 16)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <p
            style={{
              position: "absolute",
              left: 524.5,
              top: 420,
              width: 391,
              margin: 0,
              fontSize: 20,
              lineHeight: "24px",
              color: "rgb(94, 92, 88)",
              textAlign: "center",
            }}
          >
            {FOOTER.copyright}
          </p>
        </Reveal>

        <Reveal variant="up" delay={260}>
          <p
            style={{
              position: "absolute",
              left: 543,
              top: 492,
              width: 354,
              margin: 0,
              fontSize: 12,
              lineHeight: "14.4px",
              color: "rgb(94, 92, 88)",
              textAlign: "center",
            }}
          >
            {FOOTER.socialNote}
          </p>
        </Reveal>
      </RevealGroup>
    </footer>
  );
}
