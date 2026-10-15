"use client";

import * as RadixRadio from "@radix-ui/react-radio-group";
import { cn } from "@ds/utils/cn";
import { FieldLabel, FieldMessage } from "./FormField";

export type RadioOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type RadioGroupProps = {
  id: string;
  /** Rótulo do grupo, em cima ("Comprando como"). */
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly RadioOption[];
  /** "horizontal" (padrão): opções lado a lado, quebrando linha se faltar espaço. */
  orientation?: "horizontal" | "vertical";
  required?: boolean;
  error?: string;
  name?: string;
  className?: string;
};

/**
 * Grupo de opções exclusivas (Radix RadioGroup): rótulo em cima e as opções
 * em linha, cada uma com seu rótulo clicável. Setas movem e escolhem, Tab
 * entra e sai do grupo — o padrão de radio do WAI-ARIA, que o Radix cuida.
 */
export function RadioGroup({
  id,
  label,
  value,
  onValueChange,
  options,
  orientation = "horizontal",
  required,
  error,
  name,
  className,
}: RadioGroupProps) {
  const labelId = `${id}-label`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FieldLabel id={labelId} label={label} required={required} />
      <RadixRadio.Root
        id={id}
        value={value}
        onValueChange={onValueChange}
        orientation={orientation}
        required={required}
        name={name}
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn("flex gap-x-6 gap-y-3", orientation === "horizontal" ? "flex-wrap items-center" : "flex-col")}
      >
        {options.map((option) => {
          const itemId = `${id}-${option.value}`;
          return (
            <div key={option.value} className="flex items-center gap-2.5">
              <RadixRadio.Item
                id={itemId}
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  "grid size-5 shrink-0 cursor-pointer place-items-center rounded-pill border bg-surface-plain",
                  "transition-colors [transition-duration:var(--duration-fast)]",
                  "data-[state=checked]:border-action disabled:cursor-not-allowed disabled:opacity-40",
                  error ? "border-accent" : "border-border hover:border-action/60",
                )}
              >
                <RadixRadio.Indicator className="block size-2.5 rounded-pill bg-action" />
              </RadixRadio.Item>
              <label htmlFor={itemId} className="cursor-pointer text-field text-text-strong">
                {option.label}
              </label>
            </div>
          );
        })}
      </RadixRadio.Root>
      <FieldMessage id={id} error={error} />
    </div>
  );
}
