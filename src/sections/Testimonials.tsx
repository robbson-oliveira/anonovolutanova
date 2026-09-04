import Image from "next/image";
import { Card, Carousel, Container, Heading, Reveal, Text } from "@ds/index";
import { TESTIMONIALS } from "@content/offer";
import avatarRobson from "@/public/img/avatar-robson.jpeg";
import avatarAndrea from "@/public/img/avatar-andrea.jpg";
import avatarJeje from "@/public/img/avatar-jeje.jpg";

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
                  elevation="raised"
                  padding="lg"
                  className="h-full"
                >
                  <div className="flex items-center gap-4">
                    <Image
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
                    <span aria-hidden>★★★★★</span>
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
