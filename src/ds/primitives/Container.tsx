import { cn } from "@ds/utils/cn";

type ContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  /** `prose` estreita para leitura corrida (~640px). */
  width?: "content" | "prose";
};

/**
 * Centered page column with a gutter on every viewport. 1376px is 1280px of
 * content plus 48px of padding on each side (padding sits inside the max
 * width). Below that cap the padding is the whole gutter: 20px, 32px from
 * `md`, 48px from `lg`. Safe-area insets win when they are larger, so a
 * notched phone in landscape does not cover the logo or the buy button.
 * The shipping bar stays full-bleed and does not use this frame.
 */
export const pageFrameClass =
  "mx-auto w-full max-w-[1376px] " +
  "pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] " +
  "md:pl-[max(2rem,env(safe-area-inset-left,0px))] md:pr-[max(2rem,env(safe-area-inset-right,0px))] " +
  "lg:pl-[max(3rem,env(safe-area-inset-left,0px))] lg:pr-[max(3rem,env(safe-area-inset-right,0px))]";

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
