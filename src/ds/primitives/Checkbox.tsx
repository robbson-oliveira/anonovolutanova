"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { IconCheck } from "@ds/icons";
import { cn } from "@ds/utils/cn";
import { FieldMessage } from "./FormField";

type CheckboxProps = {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Rótulo à direita da caixa. Pode ter links (termos, política). */
  children: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  name?: string;
  className?: string;
};

/**
 * Caixa de seleção (Radix Checkbox) no tom de ação do DS: caixa de 20px com
 * borda de campo, verde com a marca quando marcada, erro embaixo ligado por
 * aria-describedby. Espaço marca e desmarca; o rótulo também.
 */
export function Checkbox({
  id,
  checked,
  onCheckedChange,
  children,
  required,
  disabled,
  error,
  name,
  className,
}: CheckboxProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-start gap-3">
        <RadixCheckbox.Root
          id={id}
          checked={checked}
          onCheckedChange={(state) => onCheckedChange(state === true)}
          required={required}
          disabled={disabled}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "mt-0.5 grid size-5 shrink-0 cursor-pointer place-items-center rounded-sm border bg-surface-plain",
            "transition-colors [transition-duration:var(--duration-fast)]",
            "data-[state=checked]:border-action data-[state=checked]:bg-action data-[state=checked]:text-on-action",
            "disabled:cursor-not-allowed disabled:opacity-40",
            error ? "border-accent" : "border-border hover:border-action/60",
          )}
        >
          <RadixCheckbox.Indicator className="grid place-items-center">
            <IconCheck className="size-4" />
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
        <label htmlFor={id} className="cursor-pointer text-label text-text-strong">
          {children}
        </label>
      </div>
      <FieldMessage id={id} error={error} />
    </div>
  );
}
