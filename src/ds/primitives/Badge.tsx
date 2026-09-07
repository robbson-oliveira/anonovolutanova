import { cn } from "@ds/utils/cn";

type BadgeProps = React.ComponentPropsWithoutRef<"span"> & {
  /**
   * `plain` é o selo do hero: só ícone + texto, sem fundo. No design aprovado
   * "Edição Limitada" e "Envio Imediato!" não são pílulas.
   */
  tone?: "accent" | "soft" | "support" | "outline" | "plain" | "plainInverse";
  icon?: React.ReactNode;
};

const toneClass = {
  accent: "bg-action text-on-action px-3.5 py-1.5 rounded-pill",
  soft: "bg-surface-accent-soft text-text-strong px-3.5 py-1.5 rounded-pill",
  support: "bg-surface-inverse-soft text-text-on-inverse px-3.5 py-1.5 rounded-pill",
  outline: "border border-border text-text-strong px-3.5 py-1.5 rounded-pill",
  plain: "text-text-strong",
  plainInverse: "text-text-on-inverse",
} as const;

/** Selo curto: "Edição Limitada", "Nova Edição 2027", "Envio Imediato!". */
export function Badge({
  tone = "soft",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden
          className={tone === "plainInverse" ? "opacity-60" : "text-accent"}
        >
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
