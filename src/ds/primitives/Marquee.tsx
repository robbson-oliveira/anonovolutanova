import { cn } from "@ds/utils/cn";

type MarqueeProps = {
  items: React.ReactNode[];
  /** Espaço entre itens, em px. Vira margem do item, não `gap`. */
  gap?: number;
  className?: string;
};

/**
 * Esteira horizontal contínua.
 *
 * Duas decisões que vêm de um bug real do protótipo:
 *  1. O conteúdo é duplicado e a translação final é exatamente -50%, então o
 *     loop cai sobre a cópia e não existe salto.
 *  2. O espaçamento é margem no item, não `gap` no contêiner — com `gap`, o
 *     -50% não coincide com o limite da cópia e o salto reaparece.
 *
 * A duplicata é `aria-hidden`: o leitor de tela ouve a frase uma vez.
 */
export function Marquee({ items, gap = 28, className }: MarqueeProps) {
  const renderRun = (hidden: boolean) =>
    items.map((item, i) => (
      <li
        key={`${hidden ? "b" : "a"}-${i}`}
        aria-hidden={hidden || undefined}
        style={{ marginRight: `${gap}px` }}
        className="shrink-0"
      >
        {item}
      </li>
    ));

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      data-motion="marquee"
    >
      <ul
        className={cn(
          "flex w-max items-center",
          "[animation:ds-ticker_var(--duration-ticker)_linear_infinite]",
          "group-hover:[animation-play-state:paused]",
        )}
      >
        {renderRun(false)}
        {renderRun(true)}
      </ul>
    </div>
  );
}
