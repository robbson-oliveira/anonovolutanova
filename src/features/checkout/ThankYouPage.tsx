"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Card, Heading, IconCheck, Text } from "@ds/index";
import { INSTAGRAM_URL, WHATSAPP_URL } from "@content/product";
import { getPaymentInstructions, type PaymentInstructions } from "@/lib/commerce/bridge-api";
import { errorMessage } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { trackPurchaseOnce } from "@/lib/tracking/events";

/** De quanto em quanto tempo perguntar se o Pix caiu, e por quanto tempo. */
const POLL_MS = 5000;
const POLL_FOR_MS = 30 * 60 * 1000;

/**
 * Página de obrigado. Lê o pedido pela chave (`?pedido=&chave=`, a mesma que o
 * WooCommerce usa na página dele) e pergunta ao anln-storefront-bridge o
 * status e, para Pix, o QR e o copia-e-cola. Enquanto o Pix está aberto,
 * repete a pergunta até o pagamento cair.
 */
export function ThankYouPage() {
  const params = useSearchParams();
  const orderId = Number(params.get("pedido"));
  const orderKey = params.get("chave") ?? "";

  const [data, setData] = useState<PaymentInstructions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !orderKey) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const started = Date.now();

    const poll = async () => {
      try {
        const next = await getPaymentInstructions(orderId, orderKey);
        if (stopped) return;
        setData(next);
        setError(null);
        if (next.payment_status !== "pending" || Date.now() - started > POLL_FOR_MS) return;
      } catch (err) {
        if (stopped) return;
        setError(errorMessage(err, "Não conseguimos consultar o pedido agora."));
      }
      timer = setTimeout(poll, POLL_MS);
    };
    void poll();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [orderId, orderKey]);

  // purchase: quando o pagamento é confirmado, uma vez por pedido.
  const paidNow = data?.payment_status === "paid";
  useEffect(() => {
    if (paidNow) trackPurchaseOnce(orderId);
  }, [paidNow, orderId]);

  if (!orderId || !orderKey) {
    return (
      <div className="flex flex-col items-center gap-4 py-section-sm text-center">
        <Heading as="h1" level="subsection">
          Pedido não encontrado
        </Heading>
        <Text tone="muted">Se você acabou de comprar, confira o e-mail de confirmação.</Text>
      </div>
    );
  }

  const paid = data?.payment_status === "paid";
  const failed = data?.payment_status === "failed";
  const pix = data?.instructions?.type === "pix" ? data.instructions.pix : null;

  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-8 py-section-sm">
      <div className="flex flex-col gap-3 text-center">
        {paid ? (
          <span className="mx-auto grid size-14 place-items-center rounded-pill bg-action text-2xl text-on-action">
            <IconCheck />
          </span>
        ) : null}
        <Heading as="h1" level="subsection">
          {paid ? "Pedido confirmado!" : failed ? "O pagamento não foi concluído" : `Pedido nº ${orderId} recebido`}
        </Heading>
        <Text className="leading-snug">
          {paid
            ? "Sua Agenda Ano Novo, Luta Nova 2027 já está reservada. Enviamos a confirmação por e-mail e avisamos quando o pedido sair para entrega."
            : failed
              ? "O pedido foi registrado, mas o pagamento não foi aprovado. Fale com a gente pelo WhatsApp que ajudamos a concluir."
              : pix
                ? "Falta só o pagamento: use o QR Code ou o código abaixo. A confirmação aparece aqui sozinha."
                : "Estamos confirmando o pagamento. Esta página se atualiza sozinha."}
        </Text>
      </div>

      {!paid && !failed && pix ? <PixPanel pix={pix} total={data?.total ?? 0} /> : null}

      {!data && !error ? (
        <Text tone="muted" className="text-center">
          Consultando o pedido…
        </Text>
      ) : null}
      {error ? (
        <Text size="sm" tone="accent" role="alert" className="text-center">
          {error}
        </Text>
      ) : null}

      {/* Convite depois da compra: fechar com participação, como pede a voz da marca. */}
      <Card surface="warm" padding="md" className="flex flex-col items-center gap-4 text-center">
        <Text className="leading-snug">
          A santidade se constrói nas pequenas coisas, um dia de cada vez. Acompanhe a
          comunidade da Agenda Ano Novo, Luta Nova no Instagram.
        </Text>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href={INSTAGRAM_URL} target="_blank" rel="noopener" size="md" shape="block">
            Seguir no Instagram
          </Button>
          <Button href={WHATSAPP_URL} target="_blank" rel="noopener" size="md" shape="block" variant="secondary">
            Falar no WhatsApp
          </Button>
        </div>
      </Card>
    </div>
  );
}

function PixPanel({ pix, total }: { pix: { qr_code_base64: string; qr_code: string; expires_at: string }; total: number }) {
  const [copied, setCopied] = useState(false);
  const expires = pix.expires_at ? new Date(pix.expires_at.replace(" ", "T")) : null;

  return (
    <Card surface="plain" elevation="raised" padding="md" className="flex flex-col items-center gap-5 text-center">
      {total > 0 ? <span className="text-stat text-text-strong">{formatBRL(total)}</span> : null}
      {pix.qr_code_base64 ? (
        // QR em base64 vindo do gateway: não passa pelo otimizador de imagens.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/png;base64,${pix.qr_code_base64}`}
          alt="QR Code do Pix"
          width={220}
          height={220}
          className="rounded-card border border-border"
        />
      ) : null}
      <div className="flex w-full flex-col gap-2">
        <label htmlFor="pix-code" className="text-xs font-bold text-text-strong">
          Pix copia e cola
        </label>
        <textarea
          id="pix-code"
          readOnly
          value={pix.qr_code}
          rows={3}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full resize-none rounded-card border border-border bg-surface px-3 py-2 font-mono text-xs break-all text-text"
        />
        <Button
          type="button"
          size="md"
          shape="block"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(pix.qr_code);
              setCopied(true);
              setTimeout(() => setCopied(false), 3000);
            } catch {
              // Sem permissão de área de transferência: o texto está selecionável acima.
            }
          }}
        >
          {copied ? "Código copiado" : "Copiar código Pix"}
        </Button>
      </div>
      {expires && !Number.isNaN(expires.getTime()) ? (
        <Text size="xs" tone="muted">
          Válido até {expires.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}.
        </Text>
      ) : null}
    </Card>
  );
}
