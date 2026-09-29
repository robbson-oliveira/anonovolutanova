import { cn } from "@ds/utils/cn";

/**
 * Peças comuns dos campos de formulário do DS (checkout): a moldura de 48px,
 * o rótulo em cima com asterisco nos obrigatórios e a mensagem embaixo, ligada
 * ao controle por aria-describedby. O erro usa o tom de acento (terracota): o
 * DS não tem token de erro próprio.
 */

/** Classe do controle: input, gatilho de lista, campo de data. */
export const fieldControlClass = (invalid?: boolean, withIcon?: boolean) =>
  cn(
    "h-12 w-full rounded-card border bg-surface-plain px-4 text-field text-text-strong",
    "placeholder:text-text-muted focus:outline-none",
    "transition-colors [transition-duration:var(--duration-fast)]",
    invalid ? "border-accent" : "border-border focus:border-action",
    withIcon && "pr-11",
  );

/** Id que o controle aponta em aria-describedby: o erro, senão a dica. */
export const fieldDescribedBy = (id: string | undefined, error?: string, hint?: React.ReactNode) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export function FieldLabel({
  htmlFor,
  id,
  label,
  required,
}: {
  htmlFor?: string;
  id?: string;
  label: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} id={id} className="text-label text-text-strong">
      {label}
      {required ? <span className="text-accent"> *</span> : null}
    </label>
  );
}

export function FieldMessage({ id, error, hint }: { id?: string; error?: string; hint?: React.ReactNode }) {
  if (error) {
    return (
      <span id={`${id}-error`} className="text-label text-accent">
        {error}
      </span>
    );
  }
  return hint ? (
    <span id={`${id}-hint`} className="text-label text-text-muted">
      {hint}
    </span>
  ) : null;
}
