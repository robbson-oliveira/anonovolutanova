import { cn } from "@ds/utils/cn";

type CardProps = React.ComponentPropsWithoutRef<"div"> & {
  elevation?: "flat" | "raised" | "float";
  surface?: "plain" | "warm" | "muted" | "inverse";
  padding?: "sm" | "md" | "lg" | "none";
};

const elevationClass = {
  flat: "border border-border",
  raised: "shadow-card",
  float: "shadow-float",
} as const;

const surfaceClass = {
  plain: "bg-surface",
  warm: "bg-surface-warm",
  muted: "bg-surface-muted",
  inverse: "bg-surface-inverse text-text-on-inverse",
} as const;

const paddingClass = {
  none: "",
  sm: "p-5",
  md: "p-7",
  lg: "p-9",
} as const;

export function Card({
  elevation = "flat",
  surface = "plain",
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card",
        surfaceClass[surface],
        elevationClass[elevation],
        paddingClass[padding],
        className,
      )}
      {...props}
    />
  );
}
