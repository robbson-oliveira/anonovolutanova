import { cn } from "@ds/utils/cn";

type ContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  /** `prose` estreita para leitura corrida (~640px). */
  width?: "content" | "prose";
};

/**
 * Largura máxima do conteúdo. O design aprovado usa 1200px com respiro
 * lateral; nada no site deve definir largura por conta própria.
 */
export function Container({
  width = "content",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 md:px-10",
        width === "content" ? "max-w-content" : "max-w-prose",
        className,
      )}
      {...props}
    />
  );
}
