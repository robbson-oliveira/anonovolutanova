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
  // Fallback is the home layout: the 36px bar plus the 80px header row.
  const [panelTop, setPanelTop] = useState(116);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // The panel is portalled to <body>, so it does not inherit the header's
  // place in the page. Measure both bars and start the panel under the lower
  // one, or the fixed announcement would be covered and the header would jump.
  const syncPanelTop = useCallback(() => {
    const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
    const bar = document.querySelector("[data-anln-topbar]");
    const barBottom = bar?.getBoundingClientRect().bottom ?? 0;
    setPanelTop(Math.max(headerBottom, barBottom));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onResize = () => syncPanelTop();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, syncPanelTop]);

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
      <header ref={headerRef} className="relative z-40 bg-surface">
        <div className="mx-auto flex h-20 w-full max-w-[1316px] items-center justify-between gap-6 px-6 lg:px-0">
          {/* ── Mobile: hamburger left ── */}
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => {
              if (!open) syncPanelTop();
              setOpen((v) => !v);
            }}
            className="grid size-11 cursor-pointer place-items-center text-xl text-text-strong lg:hidden"
          >
            {open ? <IconClose /> : <IconMenu />}
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

      {/* Mobile menu. Portalled to <body> so it escapes the `isolate`
          stacking context around the header. It starts below the announcement
          bar and the header row, which stay where they are when the menu is
          closed. Desktop (lg) never shows this panel. */}
      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            inert={open ? undefined : true}
            style={{ top: panelTop }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex flex-col bg-surface-inverse transition-opacity duration-300 ease-out lg:hidden",
              open
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0",
            )}
          >
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
