import { FieldLabel, FieldMessage, cn, fieldControlClass, fieldDescribedBy } from "@ds/index";

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
 * por aria-describedby. A moldura é a do DS (FormField), a mesma da lista de
 * opções e do campo de data.
 */
export function Field({ label, error, hint, icon, id, className, required, ...input }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        <input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={fieldDescribedBy(id, error, hint)}
          className={fieldControlClass(Boolean(error), Boolean(icon))}
          {...input}
        />
        {icon ? (
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
            {icon}
          </span>
        ) : null}
      </div>
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
