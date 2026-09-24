import { cn } from "@ds/index";

type FieldProps = Omit<React.ComponentPropsWithoutRef<"input">, "className"> & {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

/**
 * Campo do checkout: rótulo em cima, erro embaixo, ligado por aria-describedby.
 * O erro usa o tom de acento (terracota): o DS não tem token de erro próprio.
 */
export function Field({ label, error, hint, id, className, ...input }: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-bold text-text-strong">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-12 w-full rounded-card border bg-surface-plain px-4 text-sm text-text-strong",
          "placeholder:text-text-muted focus:outline-none",
          error ? "border-accent" : "border-border focus:border-action",
        )}
        {...input}
      />
      {error ? (
        <span id={`${id}-error`} className="text-xs leading-snug text-accent">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="text-xs leading-snug text-text-muted">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

type SelectProps = Omit<React.ComponentPropsWithoutRef<"select">, "className"> & {
  label: string;
  error?: string;
  className?: string;
};

export function SelectField({ label, error, id, className, children, ...select }: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-bold text-text-strong">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-12 w-full cursor-pointer rounded-card border bg-surface-plain px-3 text-sm text-text-strong focus:outline-none",
          error ? "border-accent" : "border-border focus:border-action",
        )}
        {...select}
      >
        {children}
      </select>
      {error ? (
        <span id={`${id}-error`} className="text-xs leading-snug text-accent">
          {error}
        </span>
      ) : null}
    </div>
  );
}
