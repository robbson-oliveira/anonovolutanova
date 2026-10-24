"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  IconAccount,
  IconArrowRight,
  IconBasket,
  IconInstagram,
  cn,
} from "@ds/index";
import { NAV_LINKS } from "@content/home";
import {
  CART_URL,
  CYCLE_YEAR,
  INSTAGRAM_URL,
  OFFER_ANCHOR,
  PRODUCT_NAME,
} from "@content/product";
import { CartButton } from "@/features/cart/CartButton";
import { useOptionalCart } from "@/features/cart/CartProvider";
const logo = "/img/logo-header.svg";

/**
 * Hamburger icon — three horizontal lines. The close mark uses the same
 * 16px box and stroke so it occupies the same button at the same size.
 */
function IconMenu({ close = false }: { close?: boolean }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width={close ? "1.15em" : "1em"}
      height={close ? "1.15em" : "1em"}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d={close ? "M2 3.5 14 12.5M14 3.5 2 12.5" : "M2 4h12M2 8h12M2 12h12"}
      />
    </svg>
  );
}

const logoMobile = "/img/logo-2027-mobile.png";
/** White lockup, same pixel size as the mobile logo, for the dark open menu. */
const logoMenu = "/img/logo-menu-modal.png";

/** Página de acesso à conta. Link provisório: trocar quando o Robson indicar a página. */
const ACCOUNT_URL = "#";

/**
 * Basket in the phone header, immediately left of the account icon.
 * Same 44px target and icon size as the account mark. No tile behind it.
 * The badge is the real cart quantity and stays hidden while the cart is empty.
 */
function HeaderCart({ light = false }: { light?: boolean }) {
  const cart = useOptionalCart();
  const count = cart?.count ?? 0;
  const label = count > 0
    ? `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`
    : "Abrir carrinho";
  const className = cn(
    "relative grid size-11 cursor-pointer place-items-center text-2xl lg:hidden",
    light ? "text-text-on-inverse" : "text-text-strong",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
  );
  const body = (
    <>
      <IconBasket />
      {count > 0 ? (
        <span className="absolute top-1 right-0.5 grid h-4 min-w-4 place-items-center rounded-pill bg-action px-1 text-[10px] leading-none font-bold text-on-action">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </>
  );
  if (!cart) {
    return (
      <a href={CART_URL} aria-label={label} className={className}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" onClick={cart.openDrawer} aria-label={label} className={className}>
      {body}
    </button>
  );
}

/**
 * Cart control for the desktop compact bar. Always visible, even at zero.
 * The white square is desktop-only; the badge is the real quantity.
 */
function CompactCart() {
  const cart = useOptionalCart();
  const count = cart?.count ?? 0;
  const label = count > 0
    ? `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`
    : "Abrir carrinho";
  const className = cn(
    "relative grid size-11 cursor-pointer place-items-center text-xl text-text-strong",
    "lg:rounded-[10px] lg:bg-surface-plain lg:shadow-card",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
  );
  const body = (
    <>
      <IconBasket />
      {count > 0 ? (
        <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-pill bg-action px-1 text-[11px] leading-none font-bold text-on-action">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </>
  );
  if (!cart) {
    return (
      <a href={CART_URL} aria-label={label} className={className}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" onClick={cart.openDrawer} aria-label={label} className={className}>
      {body}
    </button>
  );
}

/** Ícone de conta: leva direto à página de acesso, sem menu de Comprador/Afiliado. */
function AccountDropdown({ light = false }: { light?: boolean }) {
  return (
    <a
      href={ACCOUNT_URL}
      aria-label="Conta"
      className={cn(
        "grid size-11 cursor-pointer place-items-center text-2xl lg:hidden",
        light ? "text-text-on-inverse" : "text-text-strong",
      )}
    >
      <IconAccount />
    </a>
  );
}

type SiteHeaderProps = {
  /**
   * Home only. Below the desktop nav the original row sticks under the
   * shipping notice. From `lg` the row stays in flow and a compact bar fades
   * in once that row has scrolled away.
   */
  smartMenu?: boolean;
};

/** Home shell reserves `pt-9` (36px) for the fixed shipping bar. */
const SHELL_BAR = 36;

export function SiteHeader({ smartMenu = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [barH, setBarH] = useState(smartMenu ? SHELL_BAR : 0);
  const [shrunk, setShrunk] = useState(false);
  const [compactDesktop, setCompactDesktop] = useState(false);
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

  // A few pixels of scroll is enough to tuck the logo in and drop the shadow.
  // The row height stays 80px, so the page underneath does not jump.
  useEffect(() => {
    if (!smartMenu) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setShrunk(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [smartMenu]);

  // The shipping bar can be dismissed. Re-measure so the header sticks
  // directly under whatever is actually fixed, including a safe-area top.
  useEffect(() => {
    if (!smartMenu) return;
    const read = () => {
      const bar = document.querySelector("[data-anln-topbar]");
      const fixed = !!bar && getComputedStyle(bar).position === "fixed";
      const next = fixed ? Math.round(bar!.getBoundingClientRect().height) : 0;
      setBarH((prev) => (prev === next ? prev : next));
    };
    read();
    window.addEventListener("resize", read);
    const observer = new MutationObserver(read);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("resize", read);
      observer.disconnect();
    };
  }, [smartMenu]);

  useEffect(() => {
    const header = headerRef.current;
    if (!smartMenu || !header) return;
    let observer: IntersectionObserver | null = null;
    observer = new IntersectionObserver(
      ([entry]) => setCompactDesktop(!entry.isIntersecting),
      { threshold: 0, rootMargin: `-${barH}px 0px 0px 0px` },
    );
    observer.observe(header);
    return () => observer?.disconnect();
  }, [smartMenu, barH]);

  const headerTop = barH > 0 ? `${barH}px` : "env(safe-area-inset-top, 0px)";

  return (
    <>
      {/* ─── Top bar: non-sticky, same max-w as the Hero text block ─── */}
      <header
        ref={headerRef}
        data-anln-header=""
        style={
          smartMenu
            ? ({ "--anln-header-top": headerTop } as React.CSSProperties)
            : undefined
        }
        className={cn(
          "relative z-40 bg-surface",
          // Below the desktop nav the row sticks under the shipping notice.
          // `top` is only applied there: on desktop a relative `top` would
          // shift the in-flow header.
          smartMenu && "max-lg:sticky max-lg:top-[var(--anln-header-top)]",
          smartMenu && shrunk && !open && "max-lg:shadow-card",
          "transition-shadow duration-300 motion-reduce:transition-none",
          // Open menu only, and only below the desktop nav: the row joins
          // the announcement bar and the panel as one dark surface.
          open && "max-lg:bg-surface-inverse",
        )}
      >
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
            className={cn(
              "grid size-11 cursor-pointer place-items-center text-xl lg:hidden",
              open ? "text-text-on-inverse" : "text-text-strong",
            )}
          >
            <IconMenu close={open} />
          </button>

          {/* ── Logo: stacked year on mobile, ornate logo on desktop ── */}
          <a
            href="#inicio"
            className="flex shrink-0 items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
          >
            {/* Mobile: full 2027 branding logo */}
            <img
              src={open ? logoMenu : logoMobile}
              alt={PRODUCT_NAME}
              loading="eager"
              className={cn(
                "h-[44px] w-auto transition-[height] duration-300 motion-reduce:transition-none lg:hidden",
                shrunk && !open && "max-lg:h-9",
              )}
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

          {/* Mobile: basket, then account. Desktop keeps its own cluster. */}
          <div className="flex items-center lg:hidden">
            <HeaderCart light={open} />
            <AccountDropdown light={open} />
          </div>

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

      {smartMenu ? (
        <div
          data-anln-compact=""
          inert={compactDesktop ? undefined : true}
          style={{ top: headerTop }}
          className={cn(
            "fixed inset-x-0 z-40 hidden h-14 bg-surface shadow-float transition-opacity duration-300 motion-reduce:transition-none lg:flex",
            "pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))]",
            compactDesktop
              ? "lg:pointer-events-auto lg:opacity-100"
              : "lg:pointer-events-none lg:opacity-0",
          )}
        >
          <div className="mx-auto flex h-full w-full max-w-[1316px] items-center justify-between gap-2">
            <a href="#inicio" className="flex shrink-0 items-center">
              <img src={logo} alt={PRODUCT_NAME} className="h-10 w-auto" />
            </a>
            <div className="flex items-center gap-2">
              <CompactCart />
              <Button href={OFFER_ANCHOR} size="md" shape="block" className="px-4! lg:px-5!">
                Comprar
              </Button>
            </div>
          </div>
        </div>
      ) : null}

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
