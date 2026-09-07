import { Card, Carousel, Container, Heading, IconStar, Reveal, Text } from "@ds/index";
import { TESTIMONIALS } from "@content/offer";
const avatarRobson = "/img/avatar-robson.jpeg";
const avatarAndrea = "/img/avatar-andrea.jpg";
const avatarJeje = "/img/avatar-jeje.jpg";

const AVATARS = [avatarRobson, avatarAndrea, avatarJeje];

export function Testimonials() {
  return (
    <section id="depoimentos" className="bg-surface px-6 py-24 md:px-16">
      <Container>
        <Reveal variant="up">
          <Heading as="h2" level="hero">
            Depoimentos
          </Heading>
        </Reveal>

        <Reveal variant="up" delay={90} className="mt-10">
          <Carousel label="Depoimentos de leitoras">
            {TESTIMONIALS.map((item, i) => (
              <li
                key={item.name}
                className="w-[calc(100%-1rem)] shrink-0 snap-start sm:w-[420px]"
              >
                <Card
                  surface="plain"
                  elevation="subtle"
                  padding="lg"
                  className="h-full"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={AVATARS[i % AVATARS.length]}
                      alt=""
                      aria-hidden
                      className="size-14 rounded-card object-cover"
                    />
                    <div>
                      <p className="text-lead font-bold text-text-card">{item.name}</p>
                      <Text as="span" size="lead" tone="muted" className="font-bold">
                        {item.city}
                      </Text>
                    </div>
                  </div>

                  <p aria-label="5 de 5 estrelas" className="mt-5 text-accent">
                    <span aria-hidden className="inline-flex gap-0.5">
                      {Array.from({ length: 5 }, (_, s) => (
                        <IconStar key={s} />
                      ))}
                    </span>
                  </p>

                  <blockquote className="mt-4 text-base text-text">
                    {item.quote}
                  </blockquote>
                </Card>
              </li>
            ))}
          </Carousel>
        </Reveal>
      </Container>
    </section>
  );
}
