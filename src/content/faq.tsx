import type { AccordionItem } from "@ds/index";
import { INSTAGRAM_URL, WHATSAPP_URL } from "@content/product";

/**
 * `.tsx` porque duas respostas têm link no meio do texto. É o único conteúdo
 * que precisa de marcação; o resto é dado puro em `.ts`.
 */
export const FAQ: AccordionItem[] = [
  {
    question: "A agenda é entregue na minha cidade?",
    answer: (
      <p>
        Sim! Enviamos para todo o Brasil 🇧🇷 Na hora do pedido, você informa o
        endereço e nós cuidamos do envio com todo carinho.
      </p>
    ),
  },
  {
    question: "Qual é o tamanho e o acabamento da agenda?",
    answer: (
      <p>
        A Agenda 2027 tem formato 15x21cm, capa dura com laminação fosca e
        Hotstamp localizado (película metalizada). O miolo é impresso em papel de
        alta qualidade, com planejamento financeiro, calendário mensal e agenda
        diária com espaço para anotações — tudo pensado para unir praticidade e
        espiritualidade.
      </p>
    ),
  },
  {
    question: "Como posso pagar?",
    answer: (
      <p>
        Aceitamos cartão de crédito e PIX. Para pedidos em quantidade,
        combinamos as condições de pagamento diretamente com você.{" "}
        <a href={WHATSAPP_URL} className="font-semibold text-accent underline">
          Fale conosco no WhatsApp
        </a>
        .
      </p>
    ),
  },
  {
    question: "Há desconto para compras em quantidade?",
    answer: (
      <>
        <p>
          Sim! Acima de 4 agendas, o frete é grátis para todo o Brasil! 🚚 E tem
          mais: oferecemos condições especiais a partir de 50 unidades, ideais
          para revenda e livrarias.
        </p>
        <p className="mt-3">
          👉{" "}
          <a href={WHATSAPP_URL} className="font-semibold text-accent underline">
            Fale conosco
          </a>{" "}
          para receber os valores e condições de revenda.
        </p>
      </>
    ),
  },
  {
    question: "É possível enviar a agenda como presente?",
    answer: (
      <p>
        Claro! 🎁 A agenda é um presente significativo, especialmente para quem
        aprecia São Josemaria e o espírito do Opus Dei. Podemos enviar
        diretamente ao destinatário com um cartão personalizado (não temos papel
        de presente — mas isso é o que menos importa, não é?).
      </p>
    ),
  },
  {
    question: "Como posso acompanhar as novidades?",
    answer: (
      <p>
        Siga o perfil oficial{" "}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-accent underline"
        >
          @anonovolutanova
        </a>{" "}
        no Instagram 📲 Lá você encontra inspirações diárias, bastidores da
        produção, depoimentos de quem já usa a agenda e novidades sobre próximas
        edições.
      </p>
    ),
  },
];
