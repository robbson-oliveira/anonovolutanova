"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  IconAccount,
  IconArrowRight,
  IconClose,
  IconInstagram,
  cn,
} from "@ds/index";
import { NAV_LINKS } from "@content/home";
import {
  CYCLE_YEAR,
  INSTAGRAM_URL,
  OFFER_ANCHOR,
  PRODUCT_NAME,
} from "@content/product";
import { CartButton } from "@/features/cart/CartButton";
const logo = "/img/logo-header.svg";

/**
 * Hamburger icon — three horizontal lines.
 */
function IconMenu() {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M2 4h12M2 8h12M2 12h12"
      />
    </svg>
  );
}

/** Stacked year logo for the mobile header (e.g. "20" / "27"). */
function YearLogo() {
  const str = String(CYCLE_YEAR);
  return (
    <span
      aria-label={`Agenda ${CYCLE_YEAR}`}
      className="select-none text-center text-[22px] font-bold leading-[0.95] tracking-[-0.5px] text-text-strong"
    >
      <span className="block">{str.slice(0, 2)}</span>
      <span className="block">{str.slice(2)}</span>
    </span>
  );
}

/** Account icon with dropdown for "Entrar como Comprador / Afiliado". */
function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Conta"
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 cursor-pointer place-items-center text-2xl text-text-strong"
      >
        <IconAccount />
      </button>
      <div
        className={cn(
          "absolute right-0 top-full z-50 mt-1 min-w-[210px] overflow-hidden rounded-lg bg-surface-plain shadow-lg ring-1 ring-border transition-[opacity,transform] duration-200 ease-out",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <a
          href="#"
          className="block px-4 py-3 text-sm font-medium text-text-strong transition-colors [transition-duration:var(--duration-fast)] hover:bg-surface-muted"
        >
          Entrar como Comprador
        </a>
        <a
          href="#"
          className="block px-4 py-3 text-sm font-medium text-text-strong transition-colors [transition-duration:var(--duration-fast)] hover:bg-surface-muted"
        >
          Entrar como Afiliado
        </a>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  // Trap focus inside the open panel
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length) focusable[0].focus();
  }, [open]);

  // Prevent body scroll while the menu panel is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ─── Top bar: non-sticky, same max-w as the Hero text block ─── */}
      <header className="relative z-40">
        <div className="mx-auto flex h-20 w-full max-w-[1316px] items-center justify-between gap-6 px-6 lg:px-0">
          {/* ── Mobile: hamburger left ── */}
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 cursor-pointer place-items-center text-xl text-text-strong lg:hidden"
          >
            <IconMenu />
          </button>

          {/* ── Logo: stacked year on mobile, ornate logo on desktop ── */}
          <a
            href="#inicio"
            className="flex shrink-0 items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
          >
            {/* Mobile: stacked year */}
            <span className="lg:hidden">
              <YearLogo />
            </span>
            {/* Desktop: ornate logo */}
            <img
              src={logo}
              alt={PRODUCT_NAME}
              loading="eager"
              className="hidden h-[72px] w-auto lg:block"
            />
          </a>

          {/* ── Desktop nav ── */}
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs font-bold text-text-strong transition-colors [transition-duration:var(--duration-fast)] hover:text-action"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Mobile: account dropdown ── */}
          <AccountDropdown />

          {/* ── Right side: cart + CTA (desktop only) ── */}
          <div className="hidden items-center gap-3 lg:flex">
            <CartButton />
            <Button href={OFFER_ANCHOR} size="md" shape="block">
              Comprar
              <IconArrowRight />
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Mobile menu: full-screen overlay (matches Framer wireframe).
           Portalled to <body> so it escapes the `isolate` stacking context
           that the page wrapper creates around the header + sections. ─── */}
      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className={cn(
              "fixed inset-0 z-50 flex flex-col bg-surface-inverse transition-opacity duration-300 ease-out lg:hidden",
              open
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0",
            )}
          >
            {/* Top bar: × left, year logo center — mirrors the header */}
            <div className="flex h-20 items-center justify-between px-6">
              <button
                type="button"
                onClick={close}
                aria-label="Fechar menu"
                className="grid size-11 cursor-pointer place-items-center text-xl text-text-on-inverse"
              >
                <IconClose />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2">
                <span
                  aria-hidden
                  className="select-none text-center text-[22px] font-bold leading-[0.95] tracking-[-0.5px] text-text-on-inverse"
                >
                  <span className="block">{String(CYCLE_YEAR).slice(0, 2)}</span>
                  <span className="block">{String(CYCLE_YEAR).slice(2)}</span>
                </span>
              </span>
              {/* Spacer to balance the close button */}
              <div className="size-11" />
            </div>

            {/* Nav links — centered vertically in the remaining space */}
            <nav aria-label="Menu principal" className="flex flex-1 flex-col items-center justify-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="text-lg font-semibold text-text-on-inverse transition-colors [transition-duration:var(--duration-fast)] hover:text-action"
                >
                  {link.label}
                </a>
              ))}

              {/* CTA button */}
              <a
                href={OFFER_ANCHOR}
                onClick={close}
                className="mt-4 flex h-11 items-center justify-center gap-2 rounded-pill border border-border-inverse px-8 text-sm font-bold text-text-on-inverse transition-colors [transition-duration:var(--duration-fast)] hover:bg-text-on-inverse/10"
              >
                Comprar
                <IconArrowRight />
              </a>
            </nav>

            {/* Bottom: "Siga-nos" + Instagram */}
            <div className="flex items-center justify-center gap-2 pb-10 text-sm font-semibold text-text-on-inverse">
              <span>Siga-nos</span>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-xl transition-colors [transition-duration:var(--duration-fast)] hover:text-action"
              >
                <IconInstagram />
              </a>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
