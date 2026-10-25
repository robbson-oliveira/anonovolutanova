"use client";

import { useEffect } from "react";

/** Lenis-like ease. Lower is slower. */
const LERP = 0.1;

/**
 * Slows wheel and same-page anchor scrolling. Touch stays native: taking
 * over the finger fights Safari's compositor and shakes the sticky header.
 * The animation writes `window.scrollTo`, so `scrollY` (and the header
 * shadow) still update. A drawer that sets `body { overflow: hidden }`
 * stops the loop and leaves that drawer's own scroll alone.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    // The html class `scroll-smooth` would ease on top of this loop.
    root.style.scrollBehavior = "auto";
    if (reduce) {
      return () => {
        root.style.scrollBehavior = previous;
      };
    }

    let target = window.scrollY;
    let running = false;
    let frame = 0;

    const locked = () => document.body.style.overflow === "hidden";
    const limit = () => Math.max(0, root.scrollHeight - window.innerHeight);

    const tick = () => {
      if (locked()) {
        running = false;
        target = window.scrollY;
        return;
      }
      const current = window.scrollY;
      const delta = target - current;
      if (Math.abs(delta) < 0.6) {
        window.scrollTo(0, target);
        running = false;
        return;
      }
      window.scrollTo(0, current + delta * LERP);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || locked()) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const canScrollInside = (node: Element | null, dy: number) => {
      let el = node;
      while (el && el !== root) {
        const style = getComputedStyle(el);
        const oy = style.overflowY;
        if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) {
          const atTop = el.scrollTop <= 0;
          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
          if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const onWheel = (event: WheelEvent) => {
      if (locked() || event.ctrlKey || event.deltaY === 0) return;
      const node = event.target instanceof Element ? event.target : null;
      if (canScrollInside(node, event.deltaY)) return;
      event.preventDefault();
      const base = running ? target : window.scrollY;
      target = Math.min(limit(), Math.max(0, base + event.deltaY));
      start();
    };

    const goTo = (el: HTMLElement, hash: string) => {
      const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      const top = el.getBoundingClientRect().top + window.scrollY - margin;
      target = Math.min(limit(), Math.max(0, top));
      if (location.hash !== hash) history.pushState(null, "", hash);
      // The phone menu clears its scroll lock on the next commit. Wait it
      // out, but don't loop if a drawer stays open on purpose.
      let waits = 0;
      const wait = () => {
        if (locked() && waits < 45) {
          waits += 1;
          frame = requestAnimationFrame(wait);
          return;
        }
        if (!locked()) start();
      };
      wait();
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      event.preventDefault();
      goTo(el, url.hash);
    };

    // A finger grab cancels an in-flight ease so it cannot fight the touch.
    const onTouch = () => {
      running = false;
      cancelAnimationFrame(frame);
      target = window.scrollY;
    };

    const onScroll = () => {
      if (!running) target = window.scrollY;
    };

    // Wheel only where a wheel exists. Phones scroll with the finger.
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) window.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      if (fine) window.removeEventListener("wheel", onWheel);
      document.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("scroll", onScroll);
      root.style.scrollBehavior = previous;
    };
  }, []);

  return null;
}
