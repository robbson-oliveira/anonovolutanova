"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { IconCheck, IconChevronDown, IconChevronUp } from "@ds/icons";
import { cn } from "@ds/utils/cn";
import { FieldLabel, FieldMessage, fieldControlClass, fieldDescribedBy } from "./FormField";

export type SelectOption = {
  /** Nunca vazio: o valor vazio é o "nada escolhido" (mostra o placeholder). */
  value: string;
  label: string;
  /** Texto da busca por digitação, se diferente do rótulo. */
  textValue?: string;
  disabled?: boolean;
};

type SelectProps = {
  id: string;
  label: string;
  /** Valor escolhido, ou "" para nenhum. Controlado: mudar por fora atualiza a lista. */
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Para o formulário nativo e o preenchimento automático do navegador. */
  name?: string;
  autoComplete?: string;
  className?: string;
};

/**
 * Lista de opções (Radix Select) com a moldura dos campos do checkout:
 * gatilho de 48px, lista com rolagem, busca por digitação, marca na opção
 * escolhida e estado de erro ligado por aria-describedby. Teclado e leitor de
 * tela vêm do Radix (setas, Home/End, Enter, Esc, digitar para pular).
 */
export function Select({
  id,
  label,
  value,
  onValueChange,
  options,
  placeholder = "Selecione",
  error,
  hint,
  required,
  disabled,
  name,
  autoComplete,
  className,
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <RadixSelect.Root
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
        name={name}
        autoComplete={autoComplete}
      >
        <RadixSelect.Trigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={fieldDescribedBy(id, error, hint)}
          className={cn(
            fieldControlClass(Boolean(error)),
            "flex cursor-pointer items-center justify-between gap-3 text-left",
            "data-[placeholder]:text-text-muted data-[state=open]:border-action",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <span className="min-w-0 truncate">
            <RadixSelect.Value placeholder={placeholder} />
          </span>
          <RadixSelect.Icon className="shrink-0 text-text-muted">
            <IconChevronDown />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={6}
            collisionPadding={16}
            className={cn(
              "z-50 overflow-hidden rounded-card border border-border bg-surface-plain shadow-float",
              "w-(--radix-select-trigger-width) max-h-[min(20rem,var(--radix-select-content-available-height))]",
            )}
          >
            <RadixSelect.ScrollUpButton className="flex h-7 shrink-0 cursor-default items-center justify-center text-text-muted">
              <IconChevronUp />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  textValue={option.textValue}
                  disabled={option.disabled}
                  className={cn(
                    "relative flex min-h-10 cursor-pointer select-none items-center rounded-xs py-2 pr-9 pl-3",
                    "text-field text-text-strong outline-none",
                    "data-[highlighted]:bg-surface-muted data-[state=checked]:font-semibold",
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
                  )}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-3 inline-flex items-center text-action">
                    <IconCheck />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className="flex h-7 shrink-0 cursor-default items-center justify-center text-text-muted">
              <IconChevronDown />
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
