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

const logoMobile = "/img/logo-2027-mobile.png";
const logoModal = "/img/logo-menu-modal.png";

/** Página de acesso à conta. Link provisório: trocar quando o Robson indicar a página. */
const ACCOUNT_URL = "#";

/** Ícone de conta: leva direto à página de acesso, sem menu de Comprador/Afiliado. */
function AccountDropdown() {
  return (
    <a
      href={ACCOUNT_URL}
      aria-label="Conta"
      className="grid size-11 cursor-pointer place-items-center text-2xl text-text-strong lg:hidden"
    >
      <IconAccount />
    </a>
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
            {/* Mobile: full 2027 branding logo */}
            <img
              src={logoMobile}
              alt={PRODUCT_NAME}
              loading="eager"
              className="h-[44px] w-auto lg:hidden"
            />
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
            {/* Top bar: × left, branding logo center — mirrors the header */}
            <div className="flex h-20 items-center justify-between px-6">
              <button
                type="button"
                onClick={close}
                aria-label="Fechar menu"
                className="grid size-14 cursor-pointer place-items-center text-3xl text-text-on-inverse"
              >
                <IconClose />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2">
                <img
                  src={logoModal}
                  alt={PRODUCT_NAME}
                  className="h-[44px] w-auto"
                />
              </span>
              {/* Account icon — mirrors the header right side */}
              <a
                href={ACCOUNT_URL}
                aria-label="Conta"
                className="grid size-14 cursor-pointer place-items-center text-2xl text-text-on-inverse"
              >
                <IconAccount />
              </a>
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
