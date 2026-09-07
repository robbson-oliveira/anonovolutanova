import { TopBar } from "@sections/TopBar";
import { SiteHeader } from "@sections/SiteHeader";
import { Hero } from "@sections/Hero";
import { About } from "@sections/About";
import { Explore } from "@sections/Explore";
import { Quote } from "@sections/Quote";
import { Liturgical } from "@sections/Liturgical";
import { Persona } from "@sections/Persona";
import { Testimonials } from "@sections/Testimonials";
import { Offer } from "@sections/Offer";
import { Faq } from "@sections/Faq";
import { Closing } from "@sections/Closing";
import { SiteFooter } from "@sections/SiteFooter";

export default function HomePage() {
  return (
    <>
      <TopBar />
      {/* pt-9 = os 36px da barra fixa. Ela sai do fluxo; sem esta reserva o
          header sobe por baixo dela. */}
      <div className="pt-9">
        <SiteHeader />
        <main>
          <Hero />
          <About />
          <Explore />
          <Quote />
          <Liturgical />
          <Persona />
          <Testimonials />
          <Offer />
          <Faq />
          <Closing />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
