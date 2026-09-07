import { cn } from "@ds/utils/cn";

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, "children"> & {
  /** Rótulo acessível. Sem ele o ícone é decorativo e sai da árvore. */
  title?: string;
};

/**
 * Base de todo ícone do DS.
 *
 * O contrato é o do texto, não o da imagem: `1em` e `currentColor`. Um ícone
 * herda tamanho e cor de quem o contém, então `text-xl text-accent` no pai
 * resolve os dois — foi assim que os emojis provisórios se comportavam, e
 * manter a semântica torna a troca um drop-in.
 *
 * É também o que destrava a mudança de paleta: nenhum ícone carrega cor
 * própria, logo trocar os tokens repinta o conjunto inteiro sem tocar em SVG.
 */
export function IconBase({
  title,
  className,
  children,
  ...props
}: IconProps & { children?: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 60 60"
      width="1em"
      height="1em"
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
