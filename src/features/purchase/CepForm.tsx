"use client";

import { useId, useState } from "react";
import { cn } from "@ds/index";
import { maskCep, onlyDigits } from "@/lib/commerce/br";

/** Busca de CEP dos Correios, aberta em nova aba (mais simples que um buscador próprio). */
const CEP_FINDER_URL = "https://buscacepinter.correios.com.br/app/endereco/index.php";

const INVALID_CEP = "CEP inválido. Confira o número e tente de novo.";

type CepFormProps = {
  /** Rótulo do campo. Visível quando `showLabel`; senão só para leitor de tela. */
  label: string;
  showLabel?: boolean;
  initialCep?: string;
  pending: boolean;
  /** Erro vindo da consulta (CEP recusado pela loja, falha de rede). */
  error: string | null;
  /** Resolve `true` quando o CEP foi cotado. */
  onSubmit: (digits: string) => Promise<boolean>;
  autoFocus?: boolean;
  /** Mostra "Cancelar" ao lado do "Não sei meu CEP" (troca de CEP no modal). */
  onCancel?: () => void;
};

/**
 * Campo de CEP com máscara 00000-000 e botão "Calcular". Usado no estado vazio
 * do card de frete e na troca de CEP do modal de formas de entrega.
 */
export function CepForm({
  label,
  showLabel = false,
  initialCep = "",
  pending,
  error,
  onSubmit,
  autoFocus,
  onCancel,
}: CepFormProps) {
  const id = useId();
  const [value, setValue] = useState(() => maskCep(initialCep));
  const [localError, setLocalError] = useState<string | null>(null);
  const shownError = localError ?? error;

  return (
    <form
      noValidate
      className="flex flex-col gap-2"
      onSubmit={async (ev) => {
        ev.preventDefault();
        const digits = onlyDigits(value);
        if (digits.length !== 8) {
          setLocalError(INVALID_CEP);
          return;
        }
        setLocalError(null);
        await onSubmit(digits);
      }}
    >
      <label htmlFor={`${id}-cep`} className={showLabel ? "text-label font-semibold text-text-strong" : "sr-only"}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-cep`}
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          maxLength={9}
          value={value}
          // Só quando a pessoa pediu para trocar o CEP no modal.
          autoFocus={autoFocus}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={shownError ? `${id}-error` : undefined}
          onChange={(ev) => {
            setValue(maskCep(ev.target.value));
            if (localError) setLocalError(null);
          }}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-card border bg-surface-plain px-4 text-field text-text-strong",
            "placeholder:text-text-muted focus:outline-none",
            "transition-colors [transition-duration:var(--duration-fast)]",
            shownError ? "border-accent" : "border-border focus:border-action",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending || undefined}
          className={cn(
            "inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-card bg-action px-5 text-label font-semibold text-on-action",
            "transition-colors [transition-duration:var(--duration-fast)] hover:bg-action-hover",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {pending ? <Spinner /> : null}
          {pending ? "Calculando" : "Calcular"}
        </button>
      </div>

      {shownError ? (
        <p id={`${id}-error`} role="alert" className="text-label text-accent">
          {shownError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <a
          href={CEP_FINDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-label text-text-muted underline underline-offset-4 hover:text-text-strong"
        >
          Não sei meu CEP<span className="sr-only"> (abre a busca dos Correios em nova aba)</span>
        </a>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer text-label text-text-muted underline underline-offset-4 hover:text-text-strong"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}

/** Indicador de carregamento em traço, na cor do texto ao redor. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-4 shrink-0 animate-spin rounded-pill border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}
