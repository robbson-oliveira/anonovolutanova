import { IconBase, type IconProps } from "./Icon";

/* -----------------------------------------------------------------------------
   Ícones de interface, todos no grid 16x16.

   Sparkle e seta vêm do design aprovado — viviam em background-image do
   wireframe, em versão branca para fundo escuro; o fill virou currentColor
   para servirem nos dois fundos. Os outros quatro não existiam: o protótipo
   usava os caracteres +, ‹, › e ✓ como texto, e foram desenhados neste mesmo
   grid para casar com o peso dos extraídos.
   -------------------------------------------------------------------------- */

const UI_BOX = "0 0 16 16";

/** Selo de destaque: "Edição Limitada", "Envio Imediato!". Do design aprovado. */
export function IconSparkle(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path fill="currentColor" d="M10.23 7.46A1.9 1.9 0 0 1 8.68 5.9L8 2.3l-.68 3.6a1.9 1.9 0 0 1-1.55 1.56l-3.61.68 3.6.68a1.95 1.95 0 0 1 1.56 1.55l.68 3.6.68-3.6a1.9 1.9 0 0 1 1.55-1.55l3.61-.68Zm-6.77 5.87a.65.65 0 1 0-1.3 0 .65.65 0 0 0 1.3 0m9.08-9.09V3.6h-.65a.65.65 0 1 1 0-1.3h.65v-.65a.65.65 0 1 1 1.3 0v.65h.65a.65.65 0 1 1 0 1.3h-.65v.65a.65.65 0 0 1-1.3 0m-7.78 9.09a1.95 1.95 0 1 1-3.9 0 1.95 1.95 0 0 1 3.9 0m10.38-5.2a1.3 1.3 0 0 1-1.06 1.28l-3.6.69a.7.7 0 0 0-.52.51l-.69 3.6a1.3 1.3 0 0 1-2.54.01l-.69-3.6a.7.7 0 0 0-.51-.52L1.92 9.4a1.3 1.3 0 0 1 0-2.55l3.6-.68a.7.7 0 0 0 .52-.52l.68-3.6A1.3 1.3 0 0 1 8 1a1.3 1.3 0 0 1 1.28 1.06l.68 3.6a.6.6 0 0 0 .42.5l.1.02 3.6.68a1.3 1.3 0 0 1 1.06 1.28"/>
    </IconBase>
  );
}

/** Seta do CTA do cabeçalho. Do design aprovado. */
export function IconArrowRight(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path fill="currentColor" d="m14.03 8.53-4.5 4.5a.76.76 0 0 1-1.06 0 .75.75 0 0 1 0-1.06l3.22-3.22H2.5A.75.75 0 0 1 1.75 8a.75.75 0 0 1 .75-.75h9.19L8.47 4.03a.75.75 0 1 1 1.06-1.06l4.5 4.5a.7.7 0 0 1 .16.82q-.05.13-.16.24"/>
    </IconBase>
  );
}

/** Confirmado */
export function IconCheck(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M3.2 8.4 6.3 11.6 12.8 4.8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconBase>
  );
}

/** Abrir */
export function IconPlus(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M8 3.4v9.2M3.4 8h9.2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconBase>
  );
}

/** Anterior */
export function IconChevronLeft(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M9.9 3.6 5.5 8l4.4 4.4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconBase>
  );
}

/** Próximo */
export function IconChevronRight(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path d="M6.1 3.6 10.5 8l-4.4 4.4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconBase>
  );
}

/** Avaliação */
export function IconStar(props: IconProps) {
  return (
    <IconBase viewBox={UI_BOX} fill="none" {...props}>
      <path fill="currentColor" d="M8 .8l1.68 4.89 5.17.09-4.14 3.1 1.52 4.94L8 10.85l-4.23 2.97 1.52-4.94-4.14-3.1 5.17-.09z" />
    </IconBase>
  );
}
