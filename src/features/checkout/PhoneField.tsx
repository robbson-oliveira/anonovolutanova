"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import "intl-tel-input/styles";
import { pt } from "intl-tel-input/i18n";
import { IconPhone, cn } from "@ds/index";
import "./PhoneField.css";

type PhoneFieldProps = {
  id: string;
  label: string;
  /** Número em E.164 (+5527999998888), ou vazio. */
  value: string;
  onChange: (e164: string, valid: boolean) => void;
  error?: string;
  required?: boolean;
  className?: string;
};

/**
 * Telefone internacional: bandeira + DDI (Brasil por padrão) e o número no
 * formato do país. Mesmo componente do storefront da Camila (`intl-tel-input`),
 * com a moldura do design system. Devolve sempre E.164 e se o número é válido
 * para o país escolhido — a validação é a da biblioteca (libphonenumber), não
 * uma contagem de dígitos.
 */
export function PhoneField({ id, label, value, onChange, error, required, className }: PhoneFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<ReturnType<typeof intlTelInput> | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  });

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const iti = intlTelInput(el, {
      initialCountry: "br",
      countryOrder: ["br", "pt", "us"],
      separateDialCode: true,
      formatOnDisplay: true,
      nationalMode: true,
      i18n: pt,
      countryNameLocale: "pt-BR",
    });
    itiRef.current = iti;
    if (valueRef.current) iti.setNumber(valueRef.current);

    const emit = () => {
      const raw = el.value.trim();
      const number = raw ? iti.getNumber() || raw : "";
      onChangeRef.current(number, raw ? iti.isValidNumber() === true : false);
    };
    el.addEventListener("input", emit);
    el.addEventListener("countrychange", emit);

    return () => {
      el.removeEventListener("input", emit);
      el.removeEventListener("countrychange", emit);
      iti.destroy();
      itiRef.current = null;
    };
  }, []);

  // Valor trocado por fora (formulário restaurado ou copiado do comprador).
  useEffect(() => {
    const iti = itiRef.current;
    if (!iti || !inputRef.current) return;
    if (value && value !== iti.getNumber()) iti.setNumber(value);
    if (!value && inputRef.current.value) inputRef.current.value = "";
  }, [value]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-label text-text-strong">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      <div className={cn("anln-phone relative", error && "anln-phone--error")}>
        <input
          ref={inputRef}
          id={id}
          type="tel"
          autoComplete="tel"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
          <IconPhone />
        </span>
      </div>
      {error ? (
        <span id={`${id}-error`} className="text-label text-accent">
          {error}
        </span>
      ) : null}
    </div>
  );
}
