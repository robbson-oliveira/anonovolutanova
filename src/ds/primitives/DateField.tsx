"use client";

import { useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker, type ClassNames } from "react-day-picker";
import { ptBR } from "react-day-picker/locale/pt-BR";
import { IconCalendar } from "@ds/icons";
import { cn } from "@ds/utils/cn";
import { FieldLabel, FieldMessage, fieldControlClass, fieldDescribedBy } from "./FormField";

/** "dd/mm/aaaa" de uma data real → Date (meia-noite local), senão null. */
function parseBrDate(value: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null;
}

const pad = (n: number) => String(n).padStart(2, "0");
const formatBrDate = (date: Date) => `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

/** "Janeiro", não "janeiro": o nome do mês abre a legenda. */
const monthName = (date: Date) => {
  const name = date.toLocaleDateString("pt-BR", { month: "long" });
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * O calendário inteiro estilizado por classes de token — sem a folha de estilo
 * da biblioteca, que seria CSS global em toda página que importa o DS. As
 * listas de mês e ano são <select> nativos transparentes por cima do rótulo
 * (o mesmo truque da folha original): teclado e leitor de tela do sistema.
 */
const CALENDAR_CLASSES: Partial<ClassNames> = {
  root: "text-label text-text-strong",
  months: "relative flex flex-col",
  month: "flex flex-col gap-2",
  month_caption: "flex h-10 items-center pr-20",
  dropdowns: "relative inline-flex items-center gap-2",
  dropdown_root: cn(
    "relative inline-flex h-9 items-center rounded-xs border border-border bg-surface-plain px-2.5",
    "font-semibold transition-colors [transition-duration:var(--duration-fast)] hover:border-action",
    "has-[select:focus-visible]:border-action has-[select:focus-visible]:outline-2",
    "has-[select:focus-visible]:outline-offset-2 has-[select:focus-visible]:outline-accent",
  ),
  dropdown: "absolute inset-0 z-10 w-full cursor-pointer appearance-none opacity-0",
  caption_label: "inline-flex items-center gap-1 whitespace-nowrap [&>svg]:text-text-muted",
  chevron: "size-4 fill-current",
  nav: "absolute top-0 right-0 flex h-10 items-center gap-1",
  button_previous: cn(
    "grid size-9 cursor-pointer place-items-center rounded-xs text-action hover:bg-surface-muted",
    "aria-disabled:cursor-default aria-disabled:opacity-35 aria-disabled:hover:bg-transparent",
  ),
  button_next: cn(
    "grid size-9 cursor-pointer place-items-center rounded-xs text-action hover:bg-surface-muted",
    "aria-disabled:cursor-default aria-disabled:opacity-35 aria-disabled:hover:bg-transparent",
  ),
  month_grid: "border-collapse",
  weekday: "h-8 w-10 text-center text-caption font-semibold uppercase text-text-muted",
  day: "size-10 p-0 text-center",
  day_button: cn(
    "mx-auto grid size-9.5 cursor-pointer place-items-center rounded-xs text-label",
    "transition-colors [transition-duration:var(--duration-fast)] hover:bg-surface-muted",
    "disabled:cursor-default disabled:hover:bg-transparent",
  ),
  today: "font-bold text-accent",
  selected: "font-bold [&>button]:bg-action [&>button]:text-on-action [&>button]:hover:bg-action",
  outside: "opacity-50",
  disabled: "opacity-35",
  hidden: "invisible",
};

type DateFieldProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "value" | "onChange" | "className" | "type" | "min" | "max" | "defaultValue"
> & {
  id: string;
  label: string;
  /** Texto do campo, "dd/mm/aaaa" (ou incompleto enquanto se digita). */
  value: string;
  /**
   * Recebe o texto digitado (cru — a máscara é de quem usa) ou, ao escolher
   * no calendário, a data já no formato "dd/mm/aaaa".
   */
  onChange: (value: string) => void;
  error?: string;
  hint?: React.ReactNode;
  /** Primeiro e último dia escolhíveis; limitam também os anos da lista. */
  min?: Date;
  max?: Date;
  /** Mês em que o calendário abre enquanto o campo está vazio (padrão: hoje). */
  defaultMonth?: Date;
  className?: string;
};

/**
 * Campo de data brasileiro: digita-se "dd/mm/aaaa" ou abre-se o calendário
 * pelo botão do ícone (Radix Popover + react-day-picker, em pt-BR, com listas
 * de mês e ano na legenda — datas de nascimento ficam décadas atrás).
 *
 * Acessibilidade: o botão diz o que faz e anuncia o diálogo; no calendário as
 * setas andam pelos dias, PageUp/PageDown pelos meses, Enter escolhe, Esc
 * fecha e devolve o foco. Escolhido o dia, o foco volta ao campo, que já
 * mostra a data.
 */
export function DateField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  min,
  max,
  defaultMonth,
  required,
  className,
  placeholder = "dd/mm/aaaa",
  ...input
}: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInputOnClose = useRef(false);
  const [open, setOpen] = useState(false);
  const selected = parseBrDate(value) ?? undefined;
  const [month, setMonth] = useState<Date>(() => startOfMonth(selected ?? defaultMonth ?? new Date()));

  const initialMonth = () => {
    let target = selected ?? defaultMonth ?? new Date();
    if (max && target > max) target = max;
    if (min && target < min) target = min;
    return startOfMonth(target);
  };

  const disabled = [...(min ? [{ before: min }] : []), ...(max ? [{ after: max }] : [])];

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          if (next) setMonth(initialMonth());
          setOpen(next);
        }}
      >
        <Popover.Anchor asChild>
          <div className="relative">
            <input
              ref={inputRef}
              id={id}
              type="text"
              required={required}
              placeholder={placeholder}
              aria-invalid={error ? true : undefined}
              aria-describedby={fieldDescribedBy(id, error, hint)}
              className={fieldControlClass(Boolean(error), true)}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              {...input}
            />
            <Popover.Trigger asChild>
              <button
                type="button"
                aria-label={selected ? `Abrir calendário, data escolhida ${value}` : "Abrir calendário"}
                className={cn(
                  "absolute inset-y-1 right-1 flex w-10 cursor-pointer items-center justify-center rounded-xs",
                  "text-text-muted transition-colors [transition-duration:var(--duration-fast)]",
                  "hover:bg-surface-muted hover:text-action data-[state=open]:text-action",
                )}
              >
                <IconCalendar />
              </button>
            </Popover.Trigger>
          </div>
        </Popover.Anchor>

        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={6}
            collisionPadding={16}
            aria-label={`Calendário: ${label}`}
            onCloseAutoFocus={(e) => {
              if (!focusInputOnClose.current) return;
              focusInputOnClose.current = false;
              e.preventDefault();
              inputRef.current?.focus();
            }}
            className="z-50 rounded-card border border-border bg-surface-plain p-3 shadow-float"
          >
            <DayPicker
              classNames={CALENDAR_CLASSES}
              formatters={{ formatMonthDropdown: monthName }}
              mode="single"
              required
              locale={ptBR}
              captionLayout="dropdown"
              autoFocus
              month={month}
              onMonthChange={setMonth}
              startMonth={min}
              endMonth={max}
              disabled={disabled}
              selected={selected}
              onSelect={(date) => {
                onChange(formatBrDate(date));
                focusInputOnClose.current = true;
                setOpen(false);
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
