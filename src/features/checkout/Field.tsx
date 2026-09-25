import { cn } from "@ds/index";

const inputClass = (error?: string, withIcon?: boolean) =>
  cn(
    "h-12 w-full rounded-card border bg-surface-plain px-4 text-field text-text-strong",
    "placeholder:text-text-muted focus:outline-none",
    "transition-colors [transition-duration:var(--duration-fast)]",
    error ? "border-accent" : "border-border focus:border-action",
    withIcon && "pr-11",
  );

function Label({ htmlFor, label, required }: { htmlFor?: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-label text-text-strong">
      {label}
      {required ? <span className="text-accent"> *</span> : null}
    </label>
  );
}

function Message({ id, error, hint }: { id?: string; error?: string; hint?: React.ReactNode }) {
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

type FieldProps = Omit<React.ComponentPropsWithoutRef<"input">, "className"> & {
  label: string;
  error?: string;
  hint?: React.ReactNode;
  /** Ícone à direita, dentro do campo (e-mail, data…). */
  icon?: React.ReactNode;
  className?: string;
};

/**
 * Campo do checkout, no padrão da referência: rótulo em cima (asterisco nos
 * obrigatórios), campo de 48px, ícone opcional à direita, erro embaixo ligado
 * por aria-describedby. O erro usa o tom de acento (terracota): o DS não tem
 * token de erro próprio.
 */
export function Field({ label, error, hint, icon, id, className, required, ...input }: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} label={label} required={required} />
      <div className="relative">
        <input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={inputClass(error, Boolean(icon))}
          {...input}
        />
        {icon ? (
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
            {icon}
          </span>
        ) : null}
      </div>
      <Message id={id} error={error} hint={hint} />
    </div>
  );
}

type SelectProps = Omit<React.ComponentPropsWithoutRef<"select">, "className"> & {
  label: string;
  error?: string;
  className?: string;
};

export function SelectField({ label, error, id, className, children, required, ...select }: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} label={label} required={required} />
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputClass(error), "cursor-pointer px-3")}
        {...select}
      >
        {children}
      </select>
      <Message id={id} error={error} />
    </div>
  );
}
