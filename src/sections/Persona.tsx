import { IconCheck, Reveal, RevealGroup } from "@ds/index";
import { PERSONA } from "@content/home";

/* -----------------------------------------------------------------------------
   PERSONA — medido no wireframe (viewport 1440), section 1440x902.
   padding 100/60 · gap 60 · painel 1320x522 r18 pad 80/60 gap 50 · grade 3 col
   ícone 60x60 · gap ícone→texto 24 · texto 239px 20/24 500 -0.4px
   -------------------------------------------------------------------------- */

export function Persona() {
  return (
    <section
      id="persona"
      style={{
        width: 1440,
        padding: "100px 60px",
        display: "flex",
        flexDirection: "column",
        gap: 60,
        background: "var(--color-surface)",
      }}
    >
      <RevealGroup>
        <div style={{ display: "flex", width: 1320, alignItems: "flex-start", justifyContent: "space-between" }}>
          <Reveal variant="up">
            <h2
              style={{
                width: 648,
                margin: 0,
                fontSize: 60,
                lineHeight: "60px",
                fontWeight: 700,
                letterSpacing: "-3px",
                color: "var(--color-text-strong)",
              }}
            >
              {PERSONA.title}
            </h2>
          </Reveal>
          <Reveal variant="up" delay={90}>
            <p
              style={{
                width: 458,
                margin: 0,
                paddingTop: 24,
                fontSize: 20,
                lineHeight: "24px",
                fontWeight: 400,
                color: "var(--color-text)",
              }}
            >
              {PERSONA.paragraph}
            </p>
          </Reveal>
        </div>

        <div style={{ marginTop: 60 }}>
        <Reveal variant="up" delay={180}>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 366.7px)",
              gap: 50,
              width: 1320,
              margin: 0,
              padding: "80px 60px",
              listStyle: "none",
              borderRadius: 18,
              backgroundImage:
                "linear-gradient(99deg, rgb(231, 221, 194) 0%, rgb(240, 233, 214) 100%)",
            }}
          >
            {PERSONA.items.map((item) => (
              <li key={item} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <span
                  aria-hidden
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    color: "var(--color-text-on-inverse)",
                    fontSize: 26,
                    backgroundImage:
                      "linear-gradient(225deg, rgb(52, 76, 36) 0%, rgb(26, 37, 16) 100%)",
                  }}
                >
                  <IconCheck />
                </span>
                <p
                  style={{
                    width: 239,
                    margin: 0,
                    fontSize: 20,
                    lineHeight: "24px",
                    fontWeight: 500,
                    letterSpacing: "-0.4px",
                    color: "rgb(52, 76, 36)",
                  }}
                >
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
        </div>
      </RevealGroup>
    </section>
  );
}
