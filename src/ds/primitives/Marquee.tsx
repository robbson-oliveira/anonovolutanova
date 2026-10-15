import { cn } from "@ds/utils/cn";

type MarqueeProps = {
  items: React.ReactNode[];
  /** Espaço entre itens, em px. Vira margem do item, não `gap`. */
  gap?: number;
  className?: string;
  /** Duração da volta completa, em segundos. Sobrescreve o token padrão. */
  duration?: number;
  /**
   * Renderiza máscaras de fade nas laterais, na cor da superfície escura (a
   * da barra do topo). Útil para esteiras curtas.
   */
  fade?: boolean;
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
export function Marquee({
  items,
  gap = 28,
  className,
  duration,
  fade = false,
}: MarqueeProps) {
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

  const animationStyle = duration
    ? { animationDuration: `${duration}s` }
    : undefined;

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
    >
      <ul
        className={cn(
          "flex w-max items-center",
          "animate-ticker motion-reduce:animate-none",
          "group-hover:[animation-play-state:paused]",
        )}
        style={animationStyle}
      >
        {renderRun(false)}
        {renderRun(true)}
      </ul>

      {fade && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-90/srgb from-surface-inverse to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-270/srgb from-surface-inverse to-transparent"
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}

