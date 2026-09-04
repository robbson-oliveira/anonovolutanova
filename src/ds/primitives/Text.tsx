import { cn } from "@ds/utils/cn";

/* -----------------------------------------------------------------------------
   Tipografia. Os componentes escolhem PAPEL (display, título de seção, olho,
   corpo), nunca tamanho. O tamanho vive no token.
   -------------------------------------------------------------------------- */

type HeadingProps = React.ComponentPropsWithoutRef<"h2"> & {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  level?: "display" | "hero" | "section" | "subsection" | "card";
  tone?: "display" | "strong" | "accent" | "inverse" | "muted";
};

const levelClass = {
  display: "text-display",
  hero: "text-h2-hero",
  section: "text-h2",
  subsection: "text-h3",
  card: "text-h4",
} as const;

const toneClass = {
  display: "text-text-display",
  strong: "text-text-strong",
  accent: "text-accent",
  inverse: "text-text-on-inverse",
  muted: "text-text-muted",
} as const;

export function Heading({
  as: Tag = "h2",
  level = "section",
  tone = "strong",
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(levelClass[level], toneClass[tone], className)}
      {...props}
    />
  );
}

type TextProps = React.ComponentPropsWithoutRef<"p"> & {
  as?: "p" | "span" | "div" | "li";
  size?: "lead" | "base" | "sm" | "xs";
  tone?: "default" | "strong" | "muted" | "accent" | "inverse";
};

const textSizeClass = {
  lead: "text-lead",
  base: "text-base",
  sm: "text-sm",
  xs: "text-xs",
} as const;

const textToneClass = {
  default: "text-text",
  strong: "text-text-strong",
  muted: "text-text-muted",
  accent: "text-accent",
  inverse: "text-text-on-inverse",
} as const;

export function Text({
  as = "p",
  size = "base",
  tone = "default",
  className,
  ...props
}: TextProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn(textSizeClass[size], textToneClass[tone], className)}
      {...props}
    />
  );
}

/** Olho / kicker acima do título de seção. */
export function Eyebrow({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-sm font-semibold text-accent",
        className,
      )}
      {...props}
    />
  );
}
