import { cn } from "@ds/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "md" | "lg";
/**
 * O design aprovado usa duas formas: pílula nos botões de navegação e
 * retângulo arredondado nos CTAs de bloco. Não é inconsistência — é hierarquia.
 */
type Shape = "pill" | "block";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold " +
  "transition-colors [transition-duration:var(--duration-fast)] cursor-pointer whitespace-nowrap " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-action text-on-action hover:bg-action-hover",
  secondary:
    "bg-surface-plain text-text-strong border border-border hover:border-action hover:text-action",
  ghost: "text-text-on-inverse hover:opacity-80",
  inverse: "bg-surface-plain text-text-strong hover:bg-surface-muted",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const shapes: Record<Shape, string> = {
  pill: "rounded-pill",
  block: "rounded-card",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<React.ComponentPropsWithoutRef<"a">, "href" | "className">)
  | ({ href?: undefined } & Omit<React.ComponentPropsWithoutRef<"button">, "className">)
);

export function Button({
  variant = "primary",
  size = "md",
  shape = "pill",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    shapes[shape],
    className,
  );

  if (props.href !== undefined) {
    const { href, ...rest } = props;
    return <a href={href} className={classes} {...rest} />;
  }

  const { href, ...rest } = props;
  void href;
  return <button className={classes} {...rest} />;
}
