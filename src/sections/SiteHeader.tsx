"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  IconArrowRight,
  IconClose,
  IconInstagram,
  cn,
} from "@ds/index";
import { NAV_LINKS } from "@content/home";
import { INSTAGRAM_URL, OFFER_ANCHOR, PRODUCT_NAME } from "@content/product";
import { CartButton } from "@/features/cart/CartButton";
const logo = "/img/logo-header.svg";

/**
 * Hamburger icon — three horizontal lines. Separate component so we can swap
 * it for the × (IconClose) when the panel is open without layout shifts.
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
            className="grid size-11 cursor-pointer place-items-center rounded-pill border border-border text-xl text-text-strong lg:hidden"
          >
            <IconMenu />
          </button>

          {/* ── Logo: centered on mobile, left-aligned on desktop ── */}
          <a
            href="#inicio"
            className="flex shrink-0 items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
          >
            <img
              src={logo}
              alt={PRODUCT_NAME}
              loading="eager"
              className="h-[72px] w-auto"
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

      {/* ─── Mobile menu: dark side panel ─── */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-surface-inverse/50 transition-opacity duration-300 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={close}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[75vw] flex-col bg-surface-inverse p-6 transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          aria-label="Fechar menu"
          className="mb-8 grid size-11 cursor-pointer place-items-center self-start rounded-pill border border-border-inverse text-xl text-text-on-inverse"
        >
          <IconClose />
        </button>

        {/* Nav links */}
        <nav aria-label="Menu principal">
          <ul className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={close}
                  className="text-lg font-medium text-text-on-inverse transition-colors [transition-duration:var(--duration-fast)] hover:text-action"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA button */}
        <a
          href={OFFER_ANCHOR}
          onClick={close}
          className="mt-8 flex h-11 items-center justify-center gap-2 rounded-pill border border-border-inverse px-6 text-sm font-bold text-text-on-inverse transition-colors [transition-duration:var(--duration-fast)] hover:bg-text-on-inverse/10"
        >
          Comprar
          <IconArrowRight />
        </a>

        {/* Bottom: "Siga-nos" + Instagram */}
        <div className="mt-auto pt-8">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-on-inverse/70 transition-colors [transition-duration:var(--duration-fast)] hover:text-text-on-inverse"
          >
            <IconInstagram className="text-lg" />
            Siga-nos
          </a>
        </div>
      </div>
    </>
  );
}
