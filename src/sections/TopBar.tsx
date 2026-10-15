"use client";

import { useState } from "react";
import { cn, IconAsterisk, IconClose, IconGiftBox, Marquee } from "@ds/index";
import { SHIPPING_NOTICE } from "@content/product";

type TopBarProps = {
  /**
   * `true` (padrão) é o site: barra fixa de 36px, com o `pt-9` do shell
   * reservando o espaço dela. `false` é a página do design system: a barra
   * rola com a página como qualquer outro bloco — ela não deve competir pelo
   * topo fixo com a navegação dos eixos, que assume esse posto ao ser
   * alcançada pelo scroll.
   */
  sticky?: boolean;
};

/**
 * A esteira do design aprovado intercala dois ícones entre as repetições do
 * aviso — caixa, depois asterisco — não um só. Extraídos do wireframe numa
 * auditoria de header/topbar (ver ui.tsx para a procedência de cada um).
 */
const TICKER_ICONS = [IconGiftBox, IconAsterisk];

export function TopBar({ sticky = true }: TopBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const items = Array.from({ length: 6 }, (_, i) => {
    const Icon = TICKER_ICONS[i % TICKER_ICONS.length];
    return (
      <span key={i} className="flex items-center gap-2">
        {/* 16px/15px medidos no wireframe — não batem com nenhum degrau da
            escala (--text-xs é 16px mas nossa base já mudou desde a medição
            original; o valor exato importa mais aqui que reusar token,
            porque a esteira é uma faixa utilitária, não corpo de texto). */}
        <Icon className="text-[16px] text-text-on-inverse" />
        <span className="text-[15px] font-medium text-text-on-inverse">
          {SHIPPING_NOTICE}
        </span>
      </span>
    );
  });

  return (
    <div
      className={cn(
        "flex h-9 items-center bg-surface-inverse",
        sticky ? "fixed inset-x-0 top-0 z-50" : "relative",
      )}
    >
      <div className="relative flex flex-1 justify-center overflow-hidden">
        <Marquee
          items={items}
          gap={28}
          duration={45}
          fade
          className="max-w-2xl"
        />
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Fechar aviso de frete grátis"
        className="grid shrink-0 place-items-center px-3 text-text-on-inverse/80 transition-colors [transition-duration:var(--duration-fast)] hover:text-text-on-inverse"
      >
        <IconClose className="text-base" />
      </button>
    </div>
  );
}

