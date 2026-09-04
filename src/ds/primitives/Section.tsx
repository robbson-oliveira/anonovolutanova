import { cn } from "@ds/utils/cn";
import { Container } from "@ds/primitives/Container";

type SectionProps = React.ComponentPropsWithoutRef<"section"> & {
  surface?: "warm" | "plain" | "muted" | "inverse";
  spacing?: "default" | "tight" | "none";
  bleed?: boolean;
};

const surfaceClass = {
  warm: "bg-surface-warm",
  plain: "bg-surface",
  muted: "bg-surface-muted",
  inverse: "bg-surface-inverse text-text-on-inverse",
} as const;

const spacingClass = {
  default: "py-section",
  tight: "py-section-sm",
  none: "",
} as const;

/**
 * Faixa de seção. Cuida de superfície e ritmo vertical — as duas coisas que
 * mais escapam para estilo solto quando não existe um componente para elas.
 */
export function Section({
  surface = "warm",
  spacing = "default",
  bleed = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(surfaceClass[surface], spacingClass[spacing], className)}
      {...props}
    >
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
