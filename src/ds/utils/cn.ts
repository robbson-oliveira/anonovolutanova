/**
 * Concatenação de classes. Sem dependência externa: o projeto não usa
 * variantes conflitantes de Tailwind a ponto de justificar tailwind-merge.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
