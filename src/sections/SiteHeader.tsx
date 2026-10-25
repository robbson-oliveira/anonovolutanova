"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  IconAccount,
  IconArrowRight,
  IconInstagram,
  cn,
  pageFrameClass,
} from "@ds/index";
import { NAV_LINKS } from "@content/home";
import {
  CART_URL,
  INSTAGRAM_URL,
  OFFER_ANCHOR,
  PRODUCT_NAME,
} from "@content/product";
import { BasketMark, CartButton } from "@/features/cart/CartButton";
import { useOptionalCart } from "@/features/cart/CartProvider";
const logo = "/img/logo-header.svg";
/** Lockup for the desktop compact bar. Served as this file, not the seal SVG. */
const logoCompact = "/img/logo-barra-compacta.png";

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

/** Buyer and affiliate logins live on the admin host. */
const BUYER_LOGIN_URL = "https://admin.anonovolutanova.com.br/my-account/";
const AFFILIATE_LOGIN_URL = "https://admin.anonovolutanova.com.br/area-afiliado/";

/**
 * Basket in the phone header, immediately left of the account icon.
 * Same 44px target and icon size as the account mark. No tile behind it.
 * The badge is the real cart quantity and stays hidden while the cart is empty.
 */
function HeaderCart({
  light = false,
  onBeforeOpen,
}: {
  light?: boolean;
  /** Closes the phone nav before the drawer, so the cart is not behind it. */
  onBeforeOpen?: () => void;
}) {
  const cart = useOptionalCart();
  const count = cart?.count ?? 0;
  const label = count > 0
    ? `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`
    : "Abrir carrinho";
  const className = cn(
    "relative grid size-11 cursor-pointer place-items-center text-[26px] lg:hidden",
    light ? "text-text-on-inverse" : "text-text-strong",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
  );
  const body = (
    <>
      <BasketMark count={count} light={light} />
    </>
  );
  if (!cart) {
    return (
      <a href={CART_URL} aria-label={label} className={className} onClick={onBeforeOpen}>
        {body}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        onBeforeOpen?.();
        cart.openDrawer();
      }}
      aria-label={label}
      className={className}
    >
      {body}
    </button>
  );
}

/**
 * Phone account control. A small menu drops under the icon, in the header
 * and while the navigation panel is open (the icon stays in the header row,
 * which remains above that panel). Closes on an outside tap or Escape.
 */
function AccountMenu({
  light = false,
  onBeforeOpen,
}: {
  light?: boolean;
  /** Closes the phone nav so the dropdown is not covered by that panel. */
  onBeforeOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const place = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setBox({ top: rect.bottom + 6, right: Math.max(8, window.innerWidth - rect.right) });
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeMenu();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    const first = menuRef.current?.querySelector<HTMLElement>("[role='menuitem']");
    first?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place, closeMenu]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label="Conta"
        onClick={() => {
          if (open) setOpen(false);
          else {
            onBeforeOpen?.();
            place();
            setOpen(true);
          }
        }}
        className={cn(
          "grid size-11 cursor-pointer place-items-center text-2xl lg:hidden",
          light ? "text-text-on-inverse" : "text-text-strong",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
        )}
      >
        <IconAccount />
      </button>
      {open && box
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-label="Entrar"
              data-account-menu-open=""
              style={{ top: box.top, right: box.right }}
              className="fixed z-[70] w-max min-w-[220px] origin-top-right rounded-card bg-surface p-1.5 shadow-float motion-safe:animate-menu-drop"
            >
              <a
                role="menuitem"
                href={BUYER_LOGIN_URL}
                className="block rounded-[8px] px-3 py-2.5 text-sm font-semibold text-text-strong hover:bg-action-track focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
              >
                Entrar como comprador
              </a>
              <a
                role="menuitem"
                href={AFFILIATE_LOGIN_URL}
                className="block rounded-[8px] px-3 py-2.5 text-sm font-semibold text-text-strong hover:bg-action-track focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
              >
                Entrar como afiliado
              </a>
            </div>,
            document.body,
          )
        : null}
    </>
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
  const [compactDesktop, setCompactDesktop] = useState(false);
  // Fallback is the home layout: the 36px bar plus the 80px header row.
  const [panelTop, setPanelTop] = useState(116);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // The panel is portalled to <body>, so it does not inherit the header's
  // place in the page. Start it a few pixels into the header so the cream
  // page cannot show as a line between the two dark surfaces.
  const syncPanelTop = useCallback(() => {
    const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
    // Overlap the header by a few pixels. A measured seam of even 1px shows
    // the cream page (and the hero type) between two dark surfaces.
    setPanelTop(headerBottom > 0 ? Math.max(0, Math.floor(headerBottom) - 8) : 108);
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
      // The account menu handles Escape first and removes itself.
      if (e.key === "Escape" && !document.querySelector("[data-account-menu-open]")) close();
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

  // The shipping bar can be dismissed. Only that node's size matters: a
  // subtree observer on <body> refires while the persona stack writes
  // styles, and a scroll listener that changes height is what jittered
  // the phone header in Safari.
  useEffect(() => {
    if (!smartMenu) return;
    const read = () => {
      const bar = document.querySelector<HTMLElement>("[data-anln-topbar]");
      const next = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
      setBarH((prev) => (prev === next ? prev : next));
    };
    read();
    const bar = document.querySelector<HTMLElement>("[data-anln-topbar]");
    const ro = new ResizeObserver(read);
    if (bar) ro.observe(bar);
    const parent = bar?.parentElement;
    const mo = parent ? new MutationObserver(read) : null;
    mo?.observe(parent!, { childList: true });
    // No window resize listener: iOS fires resize while the address bar
    // shows and hides, and reading layout there shakes the sticky row.
    return () => {
      ro.disconnect();
      mo?.disconnect();
    };
  }, [smartMenu]);

  useEffect(() => {
    if (!smartMenu) return;
    const header = headerRef.current;
    if (!header) return;
    // Shadow only, and only after the page has actually left the top.
    // The attribute is not React state: a setState on every crossing
    // re-rendered the sticky row while Safari's toolbar resized.
    // Hysteresis keeps a rubber-band around the threshold from flashing it.
    let frame = 0;
    let shown = false;
    const apply = (next: boolean) => {
      if (next === shown) return;
      shown = next;
      header.dataset.headerShadow = next ? "1" : "0";
    };
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      apply(shown ? y > 4 : y > 12);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", read);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", read);
    };
  }, [smartMenu]);

  useEffect(() => {
    const header = headerRef.current;
    if (!smartMenu || !header) return;
    // The compact bar is desktop only. On a phone the row is sticky, so it
    // never leaves the viewport; observing it there flickers as the address
    // bar resizes and re-renders the header on every scroll frame.
    const desktop = window.matchMedia("(min-width: 1024px)");
    let observer: IntersectionObserver | null = null;
    const connect = () => {
      observer?.disconnect();
      observer = null;
      if (!desktop.matches) {
        setCompactDesktop(false);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setCompactDesktop(!entry.isIntersecting),
        { threshold: 0, rootMargin: `-${barH}px 0px 0px 0px` },
      );
      observer.observe(header);
    };
    connect();
    desktop.addEventListener("change", connect);
    return () => {
      desktop.removeEventListener("change", connect);
      observer?.disconnect();
    };
  }, [smartMenu, barH]);

  const headerTop = barH > 0 ? `${barH}px` : "env(safe-area-inset-top, 0px)";

  return (
    <>
      {/* The phone row is not sticky on its own. The home wraps this header
          and the shipping bar in one sticky layer, so neither height nor
          `top` changes while scrolling. Desktop stays in flow. */}
      <header
        ref={headerRef}
        data-anln-header=""
        className={cn(
          "relative z-40 bg-surface transition-shadow duration-300 motion-reduce:transition-none",
          smartMenu && !open && "max-lg:data-[header-shadow=1]:shadow-card",
          // Open menu only, and only below the desktop nav: the row joins
          // the announcement bar and the panel as one dark surface.
          // The strip below covers the seam where the page would show through.
          open && "max-lg:bg-surface-inverse",
        )}
      >
        {open ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-full z-10 h-3 bg-surface-inverse lg:hidden"
          />
        ) : null}
        {/* Gutters stay on from the phone up. Zeroing them at lg made the
            logo and Comprar sit on the viewport edge between 1024 and 1316. */}
        <div className={cn(pageFrameClass, "flex h-20 items-center justify-between gap-3 xl:gap-6")}>
          {/* Logo is the first item in the shared frame, so its left edge is
              the same x as the hero heading. Centering it on the phone put
              that edge on a different x from the text below. */}
          <a
            href="#inicio"
            className="flex shrink-0 items-center"
          >
            {/* Mobile: full 2027 branding logo */}
            <img
              src={open ? logoMenu : logoMobile}
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
            <ul className="flex items-center gap-6 xl:gap-8">
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

          {/* Phone: menu, basket, account. The menu sits on this side so the
              logo can keep the frame's left edge. */}
          <div className="flex items-center lg:hidden">
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
                "grid size-11 cursor-pointer place-items-center text-xl",
                open ? "text-text-on-inverse" : "text-text-strong",
              )}
            >
              <IconMenu close={open} />
            </button>
            <HeaderCart light={open} onBeforeOpen={() => setOpen(false)} />
            <AccountMenu light={open} onBeforeOpen={() => setOpen(false)} />
          </div>

          {/* ── Right side: cart + CTA (desktop only) ── */}
          <div className="hidden shrink-0 items-center gap-2 xl:gap-3 lg:flex">
            <CartButton />
            <Button href={OFFER_ANCHOR} size="md" shape="block" className="px-5! xl:px-8!">
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
            "fixed inset-x-0 z-40 hidden h-14 bg-surface shadow-card transition-opacity duration-300 motion-reduce:transition-none lg:flex",
            compactDesktop
              ? "lg:pointer-events-auto lg:opacity-100"
              : "lg:pointer-events-none lg:opacity-0",
          )}
        >
          <div className={cn(pageFrameClass, "flex h-full items-center gap-3")}>
            <a href="#inicio" className="flex shrink-0 items-center" aria-label={PRODUCT_NAME}>
              {/* 391×171 lockup. At 40px tall the file is still above 2×. */}
              <img src={logoCompact} alt="" width={391} height={171} className="h-10 w-auto" />
            </a>
            <nav aria-label="Principal" className="min-w-0 flex-1">
              <ul className="flex flex-nowrap items-center justify-center gap-x-3 xl:gap-x-5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[11px] font-bold whitespace-nowrap text-text-strong transition-colors [transition-duration:var(--duration-fast)] hover:text-action xl:text-xs"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex shrink-0 items-center gap-1.5">
              <CartButton />
              <Button href={OFFER_ANCHOR} size="md" shape="block" className="h-10! px-6! text-[13px]!">
                Comprar
                <IconArrowRight />
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

            {/* Bottom: "Siga-nos" opens the Instagram profile. */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 pb-10 text-sm font-semibold text-text-on-inverse transition-colors [transition-duration:var(--duration-fast)] hover:text-action"
            >
              <span>Siga-nos</span>
              <IconInstagram className="text-xl" />
            </a>
          </div>,
          document.body,
        )}
    </>
  );
}
